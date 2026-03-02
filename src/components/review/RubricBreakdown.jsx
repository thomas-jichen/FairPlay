import { useState } from 'react'

function SectionRow({ section }) {
  const [expanded, setExpanded] = useState(false)
  const pct = (section.score / section.maxScore) * 100

  const colorStyles =
    pct >= 80 ? { bg: 'bg-emerald-400', glow: 'shadow-[0_0_10px_rgba(52,211,153,0.5)]', text: 'text-emerald-400' } :
      pct >= 60 ? { bg: 'bg-amber-400', glow: 'shadow-[0_0_10px_rgba(251,191,36,0.5)]', text: 'text-amber-400' } :
        { bg: 'bg-red-400', glow: 'shadow-[0_0_10px_rgba(248,113,113,0.5)]', text: 'text-red-400' }

  return (
    <div className={`glass-panel rounded-xl p-5 border transition-all duration-300 ${expanded ? 'bg-black/40 border-white/20' : 'bg-black/20 border-white/5 hover:bg-black/30 hover:border-white/10'}`}>
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-tertiary/50 border border-white/5 font-mono text-xs font-bold text-text-secondary tracking-widest">
            {section.section}
          </div>
          <div>
            <span className="text-base font-semibold text-white tracking-wide group-hover:text-accent transition-colors">{section.title}</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs font-medium text-text-muted">Score:</span>
              <span className={`text-sm font-bold font-mono ${colorStyles.text}`}>
                {section.score} <span className="text-text-muted font-normal text-xs">/ {section.maxScore}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${colorStyles.bg} ${colorStyles.glow}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 transition-transform duration-300 ${expanded ? 'rotate-180 bg-white/10' : ''}`}>
            <svg className="h-4 w-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
        <div className="overflow-hidden">
          <div className="pt-4 border-t border-white/10">
            <h4 className="text-xs font-semibold tracking-widest text-text-muted uppercase mb-2">Justification</h4>
            <p className="text-sm text-text-secondary leading-relaxed bg-black/20 rounded-lg p-4 border border-white/5">
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
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-1">
        <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(14,187,187,0.5)]" />
        <h2 className="text-xl font-bold text-white tracking-wide">Category Breakdown</h2>
      </div>
      <div className="space-y-3">
        {rubricScores.map((section) => (
          <SectionRow key={section.section} section={section} />
        ))}
      </div>
    </div>
  )
}
