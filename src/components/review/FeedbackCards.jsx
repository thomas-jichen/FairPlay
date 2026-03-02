import { useState } from 'react'

function FeedbackCard({ title, children, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className="rounded-lg border border-border-default bg-surface-secondary overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left
                   hover:bg-surface-tertiary/50 transition-colors"
      >
        <span className="text-sm font-semibold text-text-primary">{title}</span>
        <span className="text-text-muted text-xs">{expanded ? 'Hide' : 'Show'}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  )
}

export default function FeedbackCards({ feedback }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-text-primary">Detailed Feedback</h2>

      <FeedbackCard title="Key Strengths" defaultExpanded={true}>
        <ul className="space-y-2">
          {feedback.keyStrengths.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="shrink-0 mt-0.5 h-1.5 w-1.5 rounded-full bg-green-500" />
              {s}
            </li>
          ))}
        </ul>
      </FeedbackCard>

      <FeedbackCard title="Areas for Improvement" defaultExpanded={true}>
        <ul className="space-y-2">
          {feedback.areasForImprovement.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="shrink-0 mt-0.5 h-1.5 w-1.5 rounded-full bg-yellow-500" />
              {a}
            </li>
          ))}
        </ul>
      </FeedbackCard>

      <FeedbackCard title="Pitch Content">
        <p className="text-sm text-text-secondary leading-relaxed">{feedback.pitchContent}</p>
      </FeedbackCard>

      <FeedbackCard title="Q&A Performance">
        <p className="text-sm text-text-secondary leading-relaxed">{feedback.qaPerformance}</p>
      </FeedbackCard>

      <FeedbackCard title="Presentation Skills">
        <p className="text-sm text-text-secondary leading-relaxed">{feedback.presentationSkills}</p>
      </FeedbackCard>

      <FeedbackCard title="Suggested Practice Focus">
        <p className="text-sm text-text-secondary leading-relaxed">{feedback.suggestedPracticeFocus}</p>
      </FeedbackCard>
    </div>
  )
}
