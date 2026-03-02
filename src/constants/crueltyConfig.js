export const CRUELTY_CONFIG = {
  1: { qaDurationMinutes: 2, interruptionMode: 'none', label: 'Gentle' },
  2: { qaDurationMinutes: 3, interruptionMode: 'rare', label: 'Moderate' },
  3: { qaDurationMinutes: 4, interruptionMode: 'moderate', label: 'Challenging' },
  4: { qaDurationMinutes: 5, interruptionMode: 'frequent', label: 'Tough' },
  5: { qaDurationMinutes: 7, interruptionMode: 'aggressive', label: 'Ruthless' },
}

export const INTERRUPTION_BUFFER_CONFIG = {
  none:       { segmentsBeforeCheck: Infinity, minSecondsBetween: Infinity },
  rare:       { segmentsBeforeCheck: 5, minSecondsBetween: 45 },
  moderate:   { segmentsBeforeCheck: 3, minSecondsBetween: 25 },
  frequent:   { segmentsBeforeCheck: 2, minSecondsBetween: 15 },
  aggressive: { segmentsBeforeCheck: 1, minSecondsBetween: 8 },
}

export const CRUELTY_INTERRUPTION_PROMPTS = {
  2: 'Only interrupt for extraordinary claims or major factual errors that cannot wait.',
  3: 'Interrupt when you hear a strong claim without evidence, a topic change that skipped important detail, or methodology that needs clarification.',
  4: 'Interrupt whenever you have a genuine question. Do not let unclear points slide. Ask targeted follow-ups.',
  5: 'Interrupt freely. Challenge mid-sentence if something seems wrong or unsupported. Ask about things they are glossing over. Press on weak points relentlessly.',
}
