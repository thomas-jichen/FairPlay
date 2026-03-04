import { useState } from 'react'

export function FeedbackCard({ title, children, defaultExpanded = false, icon }) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className={`bg-white/40 rounded-2xl border transition-all duration-300 overflow-hidden ${expanded ? 'shadow-md border-white/60 bg-white/60' : 'border-white/40 hover:bg-white/50'}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 text-left group"
      >
        <div className="flex items-center gap-4">
          {icon && (
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 border border-white shadow-sm`}>
              {icon}
            </div>
          )}
          <span className="type-caption text-text-primary transition-colors">{title}</span>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/50 border border-white/60 shadow-sm transition-transform duration-300 ${expanded ? 'rotate-180 bg-white' : ''}`}>
          <svg className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-2 border-t border-black/5">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FeedbackCards({ feedback }) {
  return (
    <div className="glass-panel rounded-3xl p-8 space-y-6">
      <div className="border-b border-black/[0.05] pb-4">
        <h2 className="type-overline text-text-primary">Detailed Insights</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeedbackCard
          title="Key Strengths"
          defaultExpanded={true}
          icon={<div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/30" />}
        >
          <ul className="space-y-4">
            {feedback.keyStrengths.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-base text-text-secondary">
                <span className="shrink-0 mt-2 h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/20" />
                <span className="type-body leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </FeedbackCard>

        <FeedbackCard
          title="Areas for Improvement"
          defaultExpanded={true}
          icon={<div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/30" />}
        >
          <ul className="space-y-4">
            {feedback.areasForImprovement.map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-base text-text-secondary">
                <span className="shrink-0 mt-2 h-2 w-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/20" />
                <span className="type-body leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </FeedbackCard>
      </div>

      <div className="space-y-6">
        <FeedbackCard title="Pitch Content" defaultExpanded={false}>
          <p className="type-body text-base text-text-secondary leading-relaxed bg-white/40 rounded-2xl p-5 border border-white/50 shadow-sm">{feedback.pitchContent}</p>
        </FeedbackCard>

        <FeedbackCard title="Q&A Performance" defaultExpanded={false}>
          <p className="type-body text-base text-text-secondary leading-relaxed bg-white/40 rounded-2xl p-5 border border-white/50 shadow-sm">{feedback.qaPerformance}</p>
        </FeedbackCard>

        <FeedbackCard title="Presentation Skills" defaultExpanded={false}>
          <p className="type-body text-base text-text-secondary leading-relaxed bg-white/40 rounded-2xl p-5 border border-white/50 shadow-sm">{feedback.presentationSkills}</p>
        </FeedbackCard>

        <FeedbackCard title="Suggested Practice Focus" defaultExpanded={false}>
          <p className="type-body text-base text-text-secondary leading-relaxed bg-white/40 rounded-2xl p-5 border border-white/50 shadow-sm">{feedback.suggestedPracticeFocus}</p>
        </FeedbackCard>
      </div>
    </div>
  )
}
