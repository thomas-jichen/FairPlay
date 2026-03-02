const PACE_CONFIG = {
  fast:        { className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  slightFast:  { className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  good:        { className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  slightSlow:  { className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  slow:        { className: 'bg-red-500/20 text-red-400 border-red-500/30' },
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

  const config = PACE_CONFIG[category]

  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium
                  transition-colors ${config.className}`}
    >
      {wpm} WPM
    </span>
  )
}
