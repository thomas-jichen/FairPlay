import { useState } from 'react'

function FeedbackCard({ title, children, defaultExpanded = false, icon }) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className={`glass-panel rounded-xl border transition-all duration-300 overflow-hidden ${expanded ? 'bg-black/40 border-white/20' : 'bg-black/20 border-white/5 hover:bg-black/30 hover:border-white/10'}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left group"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-surface-tertiary/50 border border-white/5`}>
              {icon}
            </div>
          )}
          <span className="text-base font-semibold text-white tracking-wide group-hover:text-accent transition-colors">{title}</span>
        </div>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 transition-transform duration-300 ${expanded ? 'rotate-180 bg-white/10' : ''}`}>
          <svg className="h-4 w-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-2 border-t border-white/10">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FeedbackCards({ feedback }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-1">
        <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(14,187,187,0.5)]" />
        <h2 className="text-xl font-bold text-white tracking-wide">Detailed Insights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FeedbackCard
          title="Key Strengths"
          defaultExpanded={true}
          icon={<div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
        >
          <ul className="space-y-3">
            {feedback.keyStrengths.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500/50" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </FeedbackCard>

        <FeedbackCard
          title="Areas for Improvement"
          defaultExpanded={true}
          icon={<div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />}
        >
          <ul className="space-y-3">
            {feedback.areasForImprovement.map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-amber-500/50" />
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </FeedbackCard>
      </div>

      <div className="space-y-4">
        <FeedbackCard title="Pitch Content" defaultExpanded={false}>
          <p className="text-sm text-text-secondary leading-relaxed bg-black/20 rounded-lg p-4 border border-white/5">{feedback.pitchContent}</p>
        </FeedbackCard>

        <FeedbackCard title="Q&A Performance" defaultExpanded={false}>
          <p className="text-sm text-text-secondary leading-relaxed bg-black/20 rounded-lg p-4 border border-white/5">{feedback.qaPerformance}</p>
        </FeedbackCard>

        <FeedbackCard title="Presentation Skills" defaultExpanded={false}>
          <p className="text-sm text-text-secondary leading-relaxed bg-black/20 rounded-lg p-4 border border-white/5">{feedback.presentationSkills}</p>
        </FeedbackCard>

        <FeedbackCard title="Suggested Practice Focus" defaultExpanded={false}>
          <p className="text-sm text-text-secondary leading-relaxed bg-black/20 rounded-lg p-4 border border-white/5">{feedback.suggestedPracticeFocus}</p>
        </FeedbackCard>
      </div>
    </div>
  )
}
