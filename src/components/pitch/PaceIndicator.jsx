const PACE_CONFIG = {
  fast: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500', shadow: 'shadow-sm' },
  slightFast: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-500', shadow: 'shadow-sm' },
  good: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-500', shadow: 'shadow-sm' },
  slightSlow: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-500', shadow: 'shadow-sm' },
  slow: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500', shadow: 'shadow-sm' },
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
    <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-wider transition-all duration-700 ease-out ${style.bg} ${style.border} ${style.shadow}`}>
      <span className={`transition-colors duration-700 tabular-nums ${style.text}`}>
        {wpm}
      </span>
      <span className={`text-[10px] text-text-muted transition-colors duration-700`}>WPM</span>
    </div>
  )
}
