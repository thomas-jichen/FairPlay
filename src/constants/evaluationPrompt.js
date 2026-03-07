import { ISEF_CATEGORIES } from './categories'
import { SCIENCE_RUBRIC, ENGINEERING_RUBRIC, getRubricType } from './rubrics'
import { CATEGORY_EXPERTISE, CRUELTY_BEHAVIOR } from './judgePrompt'
import { CRUELTY_CONFIG } from './crueltyConfig'

const JSON_SCHEMA = `{
  "rubricScores": [
    { "section": "I", "title": "section title", "score": <number>, "maxScore": <number>, "justification": "1-2 sentences referencing specific things the student said or didn't say" },
    { "section": "II", "title": "...", "score": <number>, "maxScore": <number>, "justification": "..." },
    { "section": "III", "title": "...", "score": <number>, "maxScore": <number>, "justification": "..." },
    { "section": "IV", "title": "...", "score": <number>, "maxScore": <number>, "justification": "..." },
    { "section": "V", "title": "Presentation", "score": <number>, "maxScore": 35, "justification": "..." }
  ],
  "overallScore": <number that equals the sum of all section scores>,
  "trackType": "science" or "engineering",
  "feedback": {
    "pitchContent": "2-4 sentences on what was strong, missing, or could be improved in the pitch content",
    "qaPerformance": "2-4 sentences on how well the student handled questions",
    "presentationSkills": "2-4 sentences on pace, confidence, engagement, approachability, posture",
    "keyStrengths": ["strength 1", "strength 2", "strength 3"],
    "areasForImprovement": ["area 1", "area 2", "area 3"],
    "suggestedPracticeFocus": "2-3 sentences of specific actionable advice for their next practice session"
  },
  "judgeImpression": "1-2 sentences — your overall impression of the student, written in your persona voice"
}`

export function buildEvaluationPrompt({ category, crueltyLevel, rubricType, abstractText, contextSummary }) {
  const categoryLabel = ISEF_CATEGORIES.find((c) => c.value === category)?.label || category
  const expertise = CATEGORY_EXPERTISE[category] || 'scientist'
  const rubric = rubricType === 'engineering' ? ENGINEERING_RUBRIC : SCIENCE_RUBRIC
  const behavior = CRUELTY_BEHAVIOR[crueltyLevel] || CRUELTY_BEHAVIOR[3]
  const judgeLabel = CRUELTY_CONFIG[crueltyLevel]?.label || 'Standard'

  let materialsSection = ''
  if (contextSummary) {
    materialsSection = `STUDENT PROJECT BRIEFING (summarized from abstract and poster):\n"""\n${contextSummary}\n"""`
  } else if (abstractText) {
    materialsSection = `STUDENT'S ABSTRACT:\n"""\n${abstractText}\n"""`
  } else {
    materialsSection = 'No abstract or poster materials were provided.'
  }

  const systemPrompt = `You are a PhD-level ${expertise}, serving as a judge at the International Science and Engineering Fair (ISEF). You just finished judging a student's project in the category: ${categoryLabel}.

YOUR JUDGING PERSONA (${judgeLabel}):
${behavior}

You will now write your evaluation. Stay in character — your feedback should reflect your judging persona.

EVALUATION RUBRIC (${rubricType === 'engineering' ? 'Engineering' : 'Science'} Project):
${rubric}

${materialsSection}

SCORING RULES:
- Section I: max 10 points
- Section II: max 15 points
- Section III: max 20 points
- Section IV: max 20 points
- Section V: max 35 points (poster + interview combined)
- overallScore MUST equal the sum of all section scores
- Each section score must not exceed its maxScore
- keyStrengths and areasForImprovement must each have exactly 3 items

Respond ONLY with valid JSON matching this exact schema:
${JSON_SCHEMA}`

  return systemPrompt
}

export function buildEvaluationUserMessage({
  transcript,
  conversationHistory,
  confidenceScore,
  engagementScore,
  approachabilityScore,
  rubricType,
}) {
  // Format transcript
  let transcriptText = 'No transcript recorded.'
  if (transcript.length > 0) {
    const segments = transcript.map((seg) => {
      const mins = Math.floor(seg.timestamp / 60)
      const secs = Math.floor(seg.timestamp % 60)
      return `[${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}] ${seg.text}`
    })
    transcriptText = segments.join('\n')
    if (transcriptText.length > 15000) {
      transcriptText = transcriptText.slice(0, 15000) + '\n[... transcript truncated]'
    }
  }

  // Format conversation
  let conversationText = 'No Q&A conversation recorded.'
  if (conversationHistory.length > 0) {
    const exchanges = conversationHistory.map((msg) => {
      const label = msg.role === 'judge' ? 'Judge' : 'Student'
      return `${label}: ${msg.text}`
    })
    conversationText = exchanges.join('\n\n')
    if (conversationText.length > 10000) {
      conversationText = conversationText.slice(0, 10000) + '\n[... conversation truncated]'
    }
  }

  return `Here is the complete session data for evaluation:

PITCH TRANSCRIPT:
${transcriptText}

Q&A CONVERSATION:
${conversationText}

REAL-TIME PRESENTATION METRICS (0.0 = poor, 1.0 = excellent):
- Confidence: ${confidenceScore.toFixed(2)}
- Engagement: ${engagementScore.toFixed(2)}
- Approachability: ${approachabilityScore.toFixed(2)}

Track type: ${rubricType}

Evaluate this student now. Respond with JSON only. /no_think`
}
