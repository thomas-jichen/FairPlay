import { chatCompletion, MODELS } from './groqClient'
import { geminiGenerate } from './geminiClient'
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

export async function summarizeJudgeContext({ abstractText, posterBase64, posterMimeType }) {
  if (!abstractText && !posterBase64) return null

  const parts = []

  if (posterBase64 && posterMimeType) {
    parts.push({ inlineData: { mimeType: posterMimeType, data: posterBase64 } })
  }

  if (abstractText) {
    parts.push({ text: `ABSTRACT:\n${abstractText}` })
  }

  if (!posterBase64 && abstractText) {
    parts.push({ text: 'No poster image was provided. Summarize based on the abstract only.' })
  }

  const { content } = await geminiGenerate({
    contents: [{ parts }],
    systemInstruction: {
      parts: [{ text: 'You are a scientific research analyst preparing a briefing for an ISEF judge. Analyze the poster image visually and the abstract text. Produce a concise structured summary (at most 500 words) covering: research question, hypothesis, methodology, key results/data points, conclusions, and claimed contributions. Preserve all specific numbers, statistics, and technical details. Do not add interpretation or commentary.' }],
    },
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.2,
    },
  })

  return content.trim()
}

export async function analyzeForInterruption({ systemPrompt, conversationHistory, fullPitchTranscript, recentPortion, crueltyLevel }) {
  const thresholdPrompt = CRUELTY_INTERRUPTION_PROMPTS[crueltyLevel] || CRUELTY_INTERRUPTION_PROMPTS[3]

  // Truncate runaway transcripts — keep the most recent content
  const MAX_TRANSCRIPT_CHARS = 20000
  let safeTranscript = fullPitchTranscript
  if (safeTranscript.length > MAX_TRANSCRIPT_CHARS) {
    safeTranscript = '...[earlier portion truncated]...\n' + safeTranscript.slice(-MAX_TRANSCRIPT_CHARS)
  }

  // Extract previous judge questions to prevent repetition
  const previousQuestions = conversationHistory
    .filter((msg) => msg.role === 'judge' && msg.phase === 'pitching')
    .map((msg) => msg.text)

  let previousQuestionsBlock = ''
  if (previousQuestions.length > 0) {
    const listed = previousQuestions.map((q, i) => `${i + 1}. "${q}"`).join('\n')
    previousQuestionsBlock = `\nYou have already asked these questions during this pitch (DO NOT ask about the same topics again):\n${listed}\n`
  }

  const userContent = `You are an experienced ISEF judge listening to a student present their research project. You are standing next to their poster while they speak.

Judges do NOT interrupt often. When they do, it is usually because something important just happened in the explanation.

Here is the full pitch so far:

"""
${safeTranscript}
"""

The most recent portion (what the student just said) is:

"""
${recentPortion}
"""
${previousQuestionsBlock}
Interruption guidelines: ${thresholdPrompt}

Before deciding, ask yourself: Would a real ISEF judge naturally interrupt the student at this exact moment?

If the answer is "probably not", then do NOT interrupt.
If the answer is "yes, most judges would stop them here", then interrupt.

Judges usually interrupt when:
• The student makes a strong claim without explaining how they proved it
• A specific number, result, or statistic appears without explanation
• A methodology step is mentioned but not explained
• The student jumps past something critical too quickly
• A technical term is used without definition
• Something contradicts what the student said earlier
• A claim of novelty or improvement is made without comparison

Do NOT interrupt for:
• Introductions, greetings, or pleasantries
• Topics from the poster/abstract that the student hasn't mentioned yet in the pitch above
• Partial words, filler phrases, or speech disfluencies
• Minor lack of detail — the student may elaborate shortly
• Anything already discussed in the pitch or conversation history

CRITICAL RULE: You may ONLY interrupt about topics, claims, methods, or results that the student has ACTUALLY SAID in the pitch transcript above. Do NOT use your knowledge of their abstract or poster to ask about things they haven't mentioned yet. You are reacting to what you HEAR, not what you READ beforehand.

Imagine you are standing next to the poster while the student is speaking. Would you actually stop them right now? If you would simply wait and let them continue, do not interrupt.

If you interrupt:
• Ask ONE short question (maximum 15 words)
• Sound like a quick interjection, not a prepared question
• Do NOT explain your reasoning

Respond ONLY with JSON:
{"interrupt": true/false, "question": "short question if interrupting"}`

  const messages = buildMessages(systemPrompt, conversationHistory, userContent)

  const { content } = await chatCompletion({
    model: MODELS.KIMI_K2,
    messages,
    temperature: 0.5,
    maxTokens: 128,
  })

  const parsed = parseJSON(content)
  if (parsed && typeof parsed.interrupt === 'boolean') {
    return { interrupt: parsed.interrupt, question: parsed.question || '' }
  }

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
    maxTokens: 256,
  })

  return content.trim().replace(/^["']|["']$/g, '')
}

export async function generateQAQuestion({ systemPrompt, conversationHistory, pitchTranscript }) {
  const hasStudentAnswer = conversationHistory.length > 0 &&
    conversationHistory[conversationHistory.length - 1].role === 'student'

  // Build a transcript block so the model knows what was actually said
  let transcriptBlock = ''
  if (pitchTranscript && pitchTranscript.length > 0) {
    const pitchText = pitchTranscript
      .filter((s) => s.phase === 'pitching')
      .map((s) => s.text)
      .join(' ')
    if (pitchText) {
      transcriptBlock = `\nHere is what the student actually said during their pitch (this is the ONLY content you may base your questions on):\n\n"""\n${pitchText.slice(0, 12000)}\n"""\n`
    }
  }

  let userContent
  if (hasStudentAnswer) {
    userContent = `The student just answered your previous question. Based on their answer, decide:
- If their answer was vague, incomplete, or raised new questions, follow up on the SAME topic to probe deeper.
- If their answer was satisfactory, move to a NEW topic you haven't covered yet.
${transcriptBlock}
CRITICAL RULE: You may ONLY ask about topics, claims, methods, or results that the student has ACTUALLY MENTIONED in their pitch or in their answers above. Do NOT ask about anything from the abstract or poster that the student has not yet brought up themselves. If the student hasn't mentioned it, you don't know about it yet.

Respond with JSON only:
{"acknowledgment": "brief 3-8 word acknowledgment of their answer", "question": "your next question"}`
  } else {
    userContent = `Ask your first substantive question about the student's project. Base your question ONLY on what the student actually said during their pitch.
${transcriptBlock}
CRITICAL RULE: You may ONLY ask about topics, claims, methods, or results that the student has ACTUALLY MENTIONED in their pitch. Do NOT ask about anything from the abstract or poster that the student has not yet brought up themselves. If the student hasn't mentioned it, you don't know about it yet.

Respond with JSON only:
{"acknowledgment": "", "question": "your question"}`
  }

  const messages = buildMessages(systemPrompt, conversationHistory, userContent)

  const { content } = await chatCompletion({
    model: MODELS.KIMI_K2,
    messages,
    temperature: 0.7,
    maxTokens: 512,
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
    maxTokens: 128,
  })

  return content.trim().replace(/^["']|["']$/g, '')
}

export async function generateEvaluation({ systemPrompt, userMessage }) {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ]

  const { content } = await chatCompletion({
    model: MODELS.QWEN3_32B,
    messages,
    temperature: 0.2,
    maxTokens: 4096,
  })

  const parsed = parseJSON(content)
  if (!parsed) {
    throw new Error('Failed to parse evaluation response as JSON')
  }

  // Validate structure
  if (!Array.isArray(parsed.rubricScores) || parsed.rubricScores.length !== 5) {
    throw new Error('Invalid rubric scores: expected 5 sections')
  }
  if (typeof parsed.overallScore !== 'number') {
    throw new Error('Invalid overall score')
  }
  if (!parsed.feedback || !parsed.judgeImpression) {
    throw new Error('Missing feedback or judge impression')
  }

  return parsed
}
