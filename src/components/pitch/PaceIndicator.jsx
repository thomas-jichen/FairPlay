function getPaceCategory(score) {
  // If the user hasn't spoken yet or score is literally exactly -1 (initial state)
  if (score === -1) return 'idle'
  
  if (score > 0.42) return 'fast'
  if (score > 0.26) return 'slightFast'
  if (score >= -0.26) return 'good'
  if (score >= -0.5) return 'slightSlow'
  return 'slow'
}

const PACE_LABELS = {
  idle: '—',
  slow: 'Too Slow',
  slightSlow: 'Too Slow',
  good: 'Ideal',
  slightFast: 'Too Fast',
  fast: 'Too Fast',
}

// Maps score [-1, 1] to a 0–1 position on the slider
function scoreToPosition(score) {
  if (score === -1) return 0.5 // Idle sits at center
  return Math.max(0, Math.min(1, (score + 1) / 2))
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

export default function PaceIndicator({ wpm: score }) {
  const category = getPaceCategory(score)
  const position = scoreToPosition(score)
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
          {isIdle ? 'Pace: —' : `Pace: ${label}`}
        </span>
        <span className="text-[9px] font-medium text-white/30 uppercase tracking-wider">Fast</span>
      </div>

      {/* Track */}
      <div className="relative w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        {/* Sweet spot zone (-0.26 to 0.26 out of [-1, 1]) translates to (0.74/2 to 1.26/2) */}
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            left: `${((-0.26 + 1) / 2) * 100}%`,
            width: `${((0.26 - -0.26) / 2) * 100}%`,
            background: 'rgba(52, 211, 153, 0.12)',
          }}
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-[800ms] ease-out"
          style={{
            left: `${position * 100}%`,
            transform: `translateX(-50%) translateY(-50%)`,
          }}
        >
          <div
            className="w-3 h-3 rounded-full transition-all duration-[800ms]"
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
