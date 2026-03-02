import { useState } from 'react'

function SectionRow({ section }) {
  const [expanded, setExpanded] = useState(false)
  const pct = (section.score / section.maxScore) * 100
  const barColor = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="rounded-lg border border-border-default bg-surface-secondary p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-accent bg-accent/10 rounded px-1.5 py-0.5">
            {section.section}
          </span>
          <span className="text-sm font-medium text-text-primary">{section.title}</span>
        </div>
        <span className="text-sm font-semibold text-text-primary">
          {section.score} / {section.maxScore}
        </span>
      </div>

      <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
        <div className={`h-full rounded-full ${barColor} transition-all duration-700`}
             style={{ width: `${pct}%` }} />
      </div>

      <button onClick={() => setExpanded(!expanded)}
              className="mt-2 text-xs text-text-muted hover:text-text-secondary transition-colors">
        {expanded ? 'Hide details' : 'Show details'}
      </button>
      {expanded && (
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          {section.justification}
        </p>
      )}
    </div>
  )
}

export default function RubricBreakdown({ rubricScores }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-text-primary">Rubric Breakdown</h2>
      {rubricScores.map((section) => (
        <SectionRow key={section.section} section={section} />
      ))}
    </div>
  )
}
