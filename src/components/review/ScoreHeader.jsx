import { ISEF_CATEGORIES } from '../../constants/categories'
import { CRUELTY_CONFIG } from '../../constants/crueltyConfig'

function ScoreCircle({ score }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444'

  return (
    <svg width="128" height="128" viewBox="0 0 128 128" className="shrink-0">
      <circle cx="64" cy="64" r={radius} fill="none"
              stroke="var(--color-surface-tertiary, #333)" strokeWidth="8" />
      <circle cx="64" cy="64" r={radius} fill="none"
              stroke={color} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              transform="rotate(-90 64 64)"
              className="transition-all duration-1000 ease-out" />
      <text x="64" y="58" textAnchor="middle"
            fill="currentColor" fontSize="28" fontWeight="bold" className="text-text-primary">{score}</text>
      <text x="64" y="78" textAnchor="middle"
            fill="currentColor" fontSize="14" className="text-text-muted">/ 100</text>
    </svg>
  )
}

export default function ScoreHeader({ overallScore, trackType, category, crueltyLevel }) {
  const categoryLabel = ISEF_CATEGORIES.find((c) => c.value === category)?.label || category
  const judgeLabel = CRUELTY_CONFIG[crueltyLevel]?.label || 'Standard'

  return (
    <div className="border-b border-border-default bg-surface-secondary py-8">
      <div className="mx-auto max-w-7xl px-6 flex items-center gap-8">
        <ScoreCircle score={overallScore} />
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Session Review</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent/15 px-3 py-1 text-sm font-medium text-accent">
              {categoryLabel}
            </span>
            <span className="rounded-full bg-surface-tertiary px-3 py-1 text-sm text-text-secondary">
              {trackType === 'science' ? 'Science' : 'Engineering'} Track
            </span>
            <span className="rounded-full bg-surface-tertiary px-3 py-1 text-sm text-text-secondary">
              {judgeLabel} Judge
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
