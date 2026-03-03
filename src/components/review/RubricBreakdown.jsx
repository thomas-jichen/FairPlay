import { useState } from 'react'

function SectionRow({ section }) {
  const [expanded, setExpanded] = useState(false)
  const pct = (section.score / section.maxScore) * 100

  const colorStyles =
    pct >= 80 ? { bg: 'bg-emerald-500', text: 'text-emerald-600' } :
      pct >= 60 ? { bg: 'bg-amber-500', text: 'text-amber-600' } :
        { bg: 'bg-red-500', text: 'text-red-600' }

  return (
    <div className={`bg-white/40 rounded-2xl p-5 border transition-all duration-300 ${expanded ? 'shadow-md border-white/60 bg-white/60' : 'border-white/40 hover:bg-white/50'}`}>
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-secondary border border-black/5 text-xs font-bold text-text-secondary tracking-widest uppercase">
            {section.section}
          </div>
          <div>
            <span className="text-base font-semibold text-text-primary tracking-tight transition-colors">{section.title}</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Score:</span>
              <span className={`text-sm font-bold tabular-nums tracking-tight ${colorStyles.text}`}>
                {section.score} <span className="text-text-muted font-medium text-xs">/ {section.maxScore}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block w-32 h-1.5 bg-black/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${colorStyles.bg}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/50 border border-white/60 shadow-sm transition-transform duration-300 ${expanded ? 'rotate-180 bg-white' : ''}`}>
            <svg className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
        <div className="overflow-hidden">
          <div className="pt-6 border-t border-black/5">
            <h4 className="text-[10px] font-bold tracking-widest text-text-muted uppercase mb-3">Justification</h4>
            <p className="type-body text-sm text-text-secondary leading-relaxed bg-white/40 rounded-2xl p-5 border border-white/50 shadow-sm">
              {section.justification}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RubricBreakdown({ rubricScores }) {
  return (
    <div className="glass-panel rounded-3xl p-8 space-y-6">
      <div className="border-b border-black/[0.05] pb-4">
        <h2 className="text-lg font-medium tracking-tight text-text-primary">Category Breakdown</h2>
      </div>
      <div className="space-y-3">
        {rubricScores.map((section) => (
          <SectionRow key={section.section} section={section} />
        ))}
      </div>
    </div>
  )
}
