export const CRUELTY_CONFIG = {
  1: { qaDurationMinutes: 2, label: 'Gentle' },
  2: { qaDurationMinutes: 3, label: 'Moderate' },
  3: { qaDurationMinutes: 4, label: 'Challenging' },
  4: { qaDurationMinutes: 5, label: 'Tough' },
  5: { qaDurationMinutes: 7, label: 'Ruthless' },
}

export const INTERRUPTION_COOLDOWNS = {
  1: 30000,
  2: 30000,
  3: 20000,
  4: 15000,
  5: 10000,
}

export const INTERRUPTION_RATE_CAPS = {
  1: 0.5,
  2: 0.7,
  3: 1,
  4: 2,
  5: 3,
}

export const CRUELTY_INTERRUPTION_PROMPTS = {
  1: 'Almost never interrupt. Only if the student makes a factual error so significant it would undermine understanding. Aim for roughly 1 interruption per 2 minutes at most. Let the student present with minimal disruption.',
  2: 'Interrupt sparingly. Only for extraordinary claims or major factual errors that cannot wait. Aim for roughly 1 interruption every 1.5 minutes at most.',
  3: 'Interrupt when you hear a strong claim without evidence, a topic change that skipped important detail, or methodology that needs clarification. Aim for roughly 1 interruption per minute.',
  4: 'Interrupt whenever you have a genuine question. Do not let unclear points slide. Ask targeted follow-ups. Aim for roughly 2 interruptions per minute.',
  5: 'Interrupt freely and aggressively. Challenge mid-sentence if something seems wrong or unsupported. Press on weak points relentlessly. Aim for roughly 3 interruptions per minute.',
}
