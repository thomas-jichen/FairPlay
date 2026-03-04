function getPaceCategory(wpm) {
  if (wpm === 0) return 'idle'
  if (wpm > 180) return 'fast'
  if (wpm > 160) return 'slightFast'
  if (wpm >= 130) return 'good'
  if (wpm >= 100) return 'slightSlow'
  return 'slow'
}

const PACE_LABELS = {
  idle: '—',
  slow: 'Slow',
  slightSlow: 'Slow',
  good: 'Good',
  slightFast: 'Fast',
  fast: 'Fast',
}

// Maps WPM to a 0–1 position on the slider
// 80 WPM = 0, 130–160 = center sweet spot, 220 WPM = 1
function wpmToPosition(wpm) {
  if (wpm === 0) return 0.5
  return Math.max(0, Math.min(1, (wpm - 80) / 140))
}

// Color for the thumb/indicator based on pace category
function getThumbColor(category) {
  switch (category) {
    case 'good': return '#34D399'
    case 'slightFast':
    case 'slightSlow': return '#FBBF24'
    case 'fast':
    case 'slow': return '#F87171'
    default: return 'rgba(255, 255, 255, 0.35)'
  }
}

export default function PaceIndicator({ wpm }) {
  const category = getPaceCategory(wpm)
  const position = wpmToPosition(wpm)
  const thumbColor = getThumbColor(category)
  const isIdle = category === 'idle'
  const label = PACE_LABELS[category]

  return (
    <div className="flex flex-col items-center gap-1 w-full">
      {/* Labels row */}
      <div className="flex justify-between w-full px-0.5">
        <span className="text-[9px] font-medium text-white/30 uppercase tracking-wider">Slow</span>
        <span
          className="text-[10px] font-bold uppercase tracking-wider transition-colors duration-500"
          style={{ color: isIdle ? 'rgba(255,255,255,0.30)' : thumbColor }}
        >
          {isIdle ? '— wpm' : `${wpm} wpm · ${label}`}
        </span>
        <span className="text-[9px] font-medium text-white/30 uppercase tracking-wider">Fast</span>
      </div>

      {/* Track */}
      <div className="relative w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        {/* Sweet spot zone */}
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            left: `${((130 - 80) / 140) * 100}%`,
            width: `${((160 - 130) / 140) * 100}%`,
            background: 'rgba(52, 211, 153, 0.12)',
          }}
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
          style={{
            left: `${position * 100}%`,
            transform: `translateX(-50%) translateY(-50%)`,
          }}
        >
          <div
            className="w-3 h-3 rounded-full transition-all duration-700"
            style={{
              backgroundColor: thumbColor,
              boxShadow: isIdle ? 'none' : `0 0 10px ${thumbColor}80, 0 0 4px ${thumbColor}60`,
              border: '2px solid rgba(255,255,255,0.25)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
