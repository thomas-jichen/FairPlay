import { chatCompletion, MODELS } from './groqClient'
import { CRUELTY_INTERRUPTION_PROMPTS } from '../constants/crueltyConfig'

function buildMessages(systemPrompt, conversationHistory, userContent) {
  const messages = [{ role: 'system', content: systemPrompt }]

  for (const msg of conversationHistory) {
    messages.push({
      role: msg.role === 'judge' ? 'assistant' : 'user',
      content: msg.text,
    })
  }

  messages.push({ role: 'user', content: userContent })
  return messages
}

function parseJSON(content) {
  // Try to extract JSON from the response, handling markdown code blocks
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || content.match(/(\{[\s\S]*\})/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1].trim())
    } catch { /* fall through */ }
  }
  try {
    return JSON.parse(content.trim())
  } catch {
    return null
  }
}

export async function summarizeJudgeContext({ abstractText, posterText }) {
  if (!abstractText && !posterText) return null

  const materials = []
  if (abstractText) {
    materials.push(`ABSTRACT:\n${abstractText}`)
  }
  if (posterText && !posterText.startsWith('[')) {
    materials.push(`POSTER TEXT:\n${posterText.slice(0, 8000)}`)
  } else if (posterText) {
    materials.push(posterText)
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a scientific writing assistant. Summarize the following student research materials into a concise briefing document (approximately 500 words). Preserve all key details: research question, hypothesis, methodology, key results/data points, conclusions, and claimed contributions. Do not add interpretation or commentary — just condense.',
    },
    {
      role: 'user',
      content: materials.join('\n\n'),
    },
  ]

  const { content } = await chatCompletion({
    model: MODELS.QWEN3_32B,
    messages,
    temperature: 0.3,
    maxTokens: 700,
  })

  return content.trim()
}

export async function analyzeForInterruption({ systemPrompt, conversationHistory, recentTranscript, crueltyLevel }) {
  const thresholdPrompt = CRUELTY_INTERRUPTION_PROMPTS[crueltyLevel] || CRUELTY_INTERRUPTION_PROMPTS[3]

  const userContent = `The student is currently giving their pitch. Here is what they just said:

"${recentTranscript}"

Based on your expertise and the student's materials, should you interrupt right now to ask a question?

Interruption guidelines: ${thresholdPrompt}

Consider these triggers:
- Bold claims or specific numbers without evidence
- Methodology being glossed over too quickly
- Novelty claims that need substantiation
- Something unclear that will affect your understanding of the rest of the pitch

IMPORTANT: Review the conversation history above. Do NOT interrupt about a topic you have already asked about or that the student has already addressed. Only interrupt if this is a genuinely new concern.

If you interrupt, your question should reference what the student JUST said — it should feel natural, like a real judge who was listening carefully.

Respond with JSON only, no other text:
{"interrupt": true/false, "question": "your question if interrupting"}`

  const messages = buildMessages(systemPrompt, conversationHistory, userContent)

  const { content } = await chatCompletion({
    model: MODELS.KIMI_K2,
    messages,
    temperature: 0.6,
    maxTokens: 256,
  })

  const parsed = parseJSON(content)
  if (parsed && typeof parsed.interrupt === 'boolean') {
    return { interrupt: parsed.interrupt, question: parsed.question || '' }
  }

  // Fallback: if model didn't return valid JSON, don't interrupt
  return { interrupt: false, question: '' }
}

export async function generateQAOpener({ systemPrompt, conversationHistory }) {
  const userContent = `The student has just finished their pitch presentation. Provide a brief transition acknowledgment (1-2 sentences) that references something specific from their pitch, then indicate you have questions. Example tone: "Thank you for that overview of your work on [topic]. I have a few questions about your methodology and results."

Respond with just the acknowledgment text, no JSON.`

  const messages = buildMessages(systemPrompt, conversationHistory, userContent)

  const { content } = await chatCompletion({
    model: MODELS.KIMI_K2,
    messages,
    temperature: 0.7,
    maxTokens: 128,
  })

  return content.trim().replace(/^["']|["']$/g, '')
}

export async function generateQAQuestion({ systemPrompt, conversationHistory }) {
  const hasStudentAnswer = conversationHistory.length > 0 &&
    conversationHistory[conversationHistory.length - 1].role === 'student'

  let userContent
  if (hasStudentAnswer) {
    userContent = `The student just answered your previous question. Based on their answer, decide:
- If their answer was vague, incomplete, or raised new questions, follow up on the SAME topic to probe deeper.
- If their answer was satisfactory, move to a NEW topic you haven't covered yet.

Respond with JSON only:
{"acknowledgment": "brief 3-8 word acknowledgment of their answer", "question": "your next question"}`
  } else {
    userContent = `Ask your first substantive question about the student's project. Pick the most important topic based on their pitch and materials.

Respond with JSON only:
{"acknowledgment": "", "question": "your question"}`
  }

  const messages = buildMessages(systemPrompt, conversationHistory, userContent)

  const { content } = await chatCompletion({
    model: MODELS.KIMI_K2,
    messages,
    temperature: 0.7,
    maxTokens: 256,
  })

  const parsed = parseJSON(content)
  if (parsed && parsed.question) {
    return { acknowledgment: parsed.acknowledgment || '', question: parsed.question }
  }

  // Fallback: use the raw content as a question
  return { acknowledgment: '', question: content.trim().replace(/^["']|["']$/g, '') }
}

export async function generateClosingRemark({ systemPrompt, conversationHistory }) {
  const userContent = `The Q&A session is ending. Give a brief, natural closing remark (1 sentence) thanking the student. Example: "Thank you, that was very informative. Best of luck with your continued research."

Respond with just the closing text, no JSON.`

  const messages = buildMessages(systemPrompt, conversationHistory, userContent)

  const { content } = await chatCompletion({
    model: MODELS.KIMI_K2,
    messages,
    temperature: 0.7,
    maxTokens: 64,
  })

  return content.trim().replace(/^["']|["']$/g, '')
}
