import { ISEF_CATEGORIES } from '../../constants/categories'
import { CRUELTY_CONFIG } from '../../constants/crueltyConfig'
import { useEffect, useState } from 'react'

function ScoreCircle({ score }) {
  const radius = 64
  const circumference = 2 * Math.PI * radius

  // Animate from 0 to score
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    let startTime
    const duration = 1500 // 1.5s

    const animate = (time) => {
      if (!startTime) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      setDisplayScore(Math.floor(easeOutQuart * score))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [score])

  const progressoffset = circumference - ((displayScore / 100) * circumference)
  const colorClass = displayScore >= 80 ? 'text-emerald-400' : displayScore >= 60 ? 'text-amber-400' : 'text-red-400'
  const glowColor = displayScore >= 80 ? 'rgba(52,211,153,0.5)' : displayScore >= 60 ? 'rgba(251,191,36,0.5)' : 'rgba(248,113,113,0.5)'

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer ambient glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl transition-all duration-700 opacity-40 scale-110"
        style={{ backgroundColor: glowColor }}
      />

      {/* Background glass circle */}
      <div className="absolute inset-2 rounded-full border border-white/5 bg-black/40 backdrop-blur-md shadow-inner" />

      <svg width="160" height="160" viewBox="0 0 160 160" className="relative z-10 shrink-0 transform -rotate-90">
        {/* Track */}
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="6"
        />
        {/* Progress */}
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progressoffset}
          className={`transition-all duration-200 ease-out ${colorClass}`}
          style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className={`text-4xl font-bold tracking-tighter tabular-nums ${colorClass} drop-shadow-md`}>
          {displayScore}
        </span>
        <span className="text-xs font-semibold text-text-muted mt-1 uppercase tracking-widest">
          Score
        </span>
      </div>
    </div>
  )
}

export default function ScoreHeader({ overallScore, trackType, category, crueltyLevel }) {
  const categoryLabel = ISEF_CATEGORIES.find((c) => c.value === category)?.label || category
  const judgeLabel = CRUELTY_CONFIG[crueltyLevel]?.label || 'Standard'

  return (
    <div className="border-b border-white/5 bg-black/20 backdrop-blur-3xl py-12 relative overflow-hidden">
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10">
        <div className="shrink-0 animate-[scale-in_0.8s_ease-out_both]">
          <ScoreCircle score={overallScore} />
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-sm mb-4">
            Session Review
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-4 py-1.5 text-sm font-semibold tracking-wide text-accent shadow-[0_0_15px_rgba(14,187,187,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {categoryLabel}
            </span>
            <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-sm font-medium tracking-wide text-text-secondary">
              {trackType === 'science' ? 'Science' : 'Engineering'} Track
            </span>
            <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-sm font-medium tracking-wide text-text-secondary">
              {judgeLabel} Judge
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
