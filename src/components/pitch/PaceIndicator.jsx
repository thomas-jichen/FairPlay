const PACE_CONFIG = {
  fast: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400', shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]' },
  slightFast: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-400', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]' },
  good: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]' },
  slightSlow: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-400', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]' },
  slow: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400', shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]' },
}

function getPaceCategory(wpm) {
  if (wpm === 0) return null
  if (wpm > 180) return 'fast'
  if (wpm > 160) return 'slightFast'
  if (wpm >= 130) return 'good'
  if (wpm >= 100) return 'slightSlow'
  return 'slow'
}

export default function PaceIndicator({ wpm }) {
  const category = getPaceCategory(wpm)
  if (!category) return null

  const style = PACE_CONFIG[category]

  return (
    <div className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-wider transition-all duration-700 ease-out ${style.bg} ${style.border} ${style.shadow}`}>
      <span className={`transition-colors duration-700 font-mono ${style.text}`}>
        {wpm}
      </span>
      <span className={`text-[10px] text-text-muted transition-colors duration-700`}>WPM</span>
    </div>
  )
}
