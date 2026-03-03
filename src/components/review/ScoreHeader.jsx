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
  const colorClass = displayScore >= 80 ? 'text-emerald-500' : displayScore >= 60 ? 'text-amber-500' : 'text-red-500'

  return (
    <div className="relative flex items-center justify-center">
      {/* Background ring */}
      <div className="absolute inset-2 rounded-full border border-white bg-white/40 backdrop-blur-3xl shadow-lg" />

      <svg width="160" height="160" viewBox="0 0 160 160" className="relative z-10 shrink-0 transform -rotate-90">
        {/* Track */}
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.05)"
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
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className={`text-5xl font-semibold tracking-tighter ${colorClass}`}>
          {displayScore}
        </span>
      </div>
    </div>
  )
}

export default function ScoreHeader({ overallScore, trackType, category, crueltyLevel }) {
  const categoryLabel = ISEF_CATEGORIES.find((c) => c.value === category)?.label || category
  const judgeLabel = CRUELTY_CONFIG[crueltyLevel]?.label || 'Standard'

  return (
    <div className="glass-panel rounded-[32px] p-8 md:p-12 relative overflow-hidden shadow-lg mx-auto w-full">
      <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">
        <div className="shrink-0 animate-[scale-in_0.8s_ease-out_both] relative z-10">
          <ScoreCircle score={overallScore} />
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left relative z-10">
          <h1 className="type-display text-4xl md:text-5xl text-text-primary tracking-tight mb-5">
            SESSION REVIEW
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="glass-pill px-5 py-2 type-caption text-text-primary shadow-sm border-white bg-white/60">
              {categoryLabel}
            </span>
            <span className="glass-pill px-5 py-2 type-caption text-text-secondary border-white/40">
              {trackType === 'science' ? 'Science' : 'Engineering'} Track
            </span>
            <span className="glass-pill px-5 py-2 type-caption text-text-secondary border-white/40">
              {judgeLabel} Judge
            </span>
          </div>
        </div>

        {/* Decorative background accent inside the panel to show off the glass */}
        <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[150%] bg-gradient-to-bl from-white/40 to-transparent blur-2xl pointer-events-none -z-10 rotate-12" />
      </div>
    </div>
  )
}
