import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ROTATE_MS = 5000
const RESUME_IDLE_MS = 10000

const RUBRIC = [
  { section: 'I', title: 'Research Question', score: 8, maxScore: 10 },
  { section: 'II', title: 'Design & Methodology', score: 14, maxScore: 15 },
  { section: 'III', title: 'Execution: Data Collection', score: 16, maxScore: 20 },
  { section: 'IV', title: 'Creativity', score: 18, maxScore: 20 },
  { section: 'V', title: 'Presentation', score: 26, maxScore: 35 },
]

const STRENGTHS = [
  'Excellent clarity explaining complex methodology to non-specialists',
  'Strong independent thinking and thoughtful engagement under critique',
  'Well-designed experiment with proper controls and replicates',
]

const IMPROVEMENTS = [
  'Expand statistical analysis beyond basic significance testing',
  'Better articulate the real-world applications of your findings',
  'Maintain consistent pacing when explaining complex derivations',
]

const OVERALL = RUBRIC.reduce((acc, r) => acc + r.score, 0)
const MAX = RUBRIC.reduce((acc, r) => acc + r.maxScore, 0)

function barColor(pct) {
  if (pct >= 80) return { bar: 'bg-emerald-500', text: 'text-emerald-600' }
  if (pct >= 60) return { bar: 'bg-amber-500', text: 'text-amber-600' }
  return { bar: 'bg-red-500', text: 'text-red-600' }
}

function ScoreRing({ score, max }) {
  const pct = score / max
  const radius = 28
  const circ = 2 * Math.PI * radius
  const colorClass = pct >= 0.8 ? 'text-emerald-500' : pct >= 0.6 ? 'text-amber-500' : 'text-red-500'
  const [dash, setDash] = useState(circ)
  useEffect(() => {
    const t = setTimeout(() => setDash(circ * (1 - pct)), 60)
    return () => clearTimeout(t)
  }, [circ, pct])
  return (
    <div className="relative shrink-0">
      <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="5" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          className={`${colorClass} transition-[stroke-dashoffset] duration-[1400ms] ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xl font-semibold tabular-nums ${colorClass}`}>{score}</span>
      </div>
    </div>
  )
}

function RubricPanel() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-4">
        <ScoreRing score={OVERALL} max={MAX} />
        <div>
          <p className="type-overline text-[10px] text-text-primary">Overall Score</p>
          <p className="type-title text-2xl text-text-primary tabular-nums mt-0.5">
            {OVERALL} <span className="text-text-muted text-base font-light">/ {MAX}</span>
          </p>
          <p className="type-body text-xs text-text-secondary mt-0.5">
            ISEF Biochemistry &middot; Science Track
          </p>
        </div>
      </div>
      <div className="space-y-2.5 flex-1">
        {RUBRIC.map((r, i) => {
          const pct = (r.score / r.maxScore) * 100
          const colors = barColor(pct)
          return (
            <RubricBar
              key={r.section}
              section={r.section}
              title={r.title}
              score={r.score}
              maxScore={r.maxScore}
              pct={pct}
              colors={colors}
              delay={i * 80}
            />
          )
        })}
      </div>
    </div>
  )
}

function RubricBar({ section, title, score, maxScore, pct, colors, delay }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 40 + delay)
    return () => clearTimeout(t)
  }, [pct, delay])
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="type-caption text-[9px] text-text-muted shrink-0">{section}</span>
          <span className="text-xs font-medium text-text-primary tracking-tight truncate">{title}</span>
        </div>
        <span className={`text-xs font-bold tabular-nums ${colors.text} shrink-0 ml-2`}>
          {score}<span className="text-text-muted font-light">/{maxScore}</span>
        </span>
      </div>
      <div className="h-1.5 bg-black/[0.05] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colors.bar} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

function BulletList({ items, tone }) {
  const dotClass =
    tone === 'emerald'
      ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30'
      : 'bg-amber-500 shadow-sm shadow-amber-500/30'
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 * i + 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start gap-2.5"
        >
          <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${dotClass}`} />
          <span className="type-body text-xs text-text-secondary leading-relaxed">{item}</span>
        </motion.li>
      ))}
    </ul>
  )
}

function InsightsPanel() {
  return (
    <div className="flex flex-col gap-3 h-full">
      <p className="type-overline text-[10px] text-text-primary">Detailed Insights</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
        <div className="bg-white/45 rounded-2xl p-4 border border-white/60 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/30" />
            <p className="type-caption text-[10px] text-text-primary">Key Strengths</p>
          </div>
          <BulletList items={STRENGTHS} tone="emerald" />
        </div>
        <div className="bg-white/45 rounded-2xl p-4 border border-white/60 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/30" />
            <p className="type-caption text-[10px] text-text-primary">Areas to Improve</p>
          </div>
          <BulletList items={IMPROVEMENTS} tone="amber" />
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { key: 'rubric', label: 'Rubric Breakdown' },
  { key: 'insights', label: 'Detailed Insights' },
]

export default function SessionReviewDemo() {
  const [active, setActive] = useState('rubric')
  const [autoRotate, setAutoRotate] = useState(true)
  const [progress, setProgress] = useState(0)
  const lastInteractionRef = useRef(0)

  // Rotation + progress tick
  useEffect(() => {
    if (!autoRotate) return
    setProgress(0)
    let start = Date.now()
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min((elapsed / ROTATE_MS) * 100, 100)
      setProgress(pct)
      if (elapsed >= ROTATE_MS) {
        setActive((cur) => (cur === 'rubric' ? 'insights' : 'rubric'))
        start = Date.now()
        setProgress(0)
      }
    }, 50)
    return () => clearInterval(progressTimer)
  }, [autoRotate, active])

  // Resume auto-rotate after idle
  useEffect(() => {
    if (autoRotate) return
    const t = setInterval(() => {
      if (Date.now() - lastInteractionRef.current >= RESUME_IDLE_MS) {
        setAutoRotate(true)
      }
    }, 500)
    return () => clearInterval(t)
  }, [autoRotate])

  const handleTab = (key) => {
    lastInteractionRef.current = Date.now()
    setAutoRotate(false)
    setActive(key)
    setProgress(0)
  }

  return (
    <div className="glass-panel rounded-[28px] p-5 md:p-6 shadow-2xl w-full max-w-[540px] h-[370px] flex flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 relative">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTab(tab.key)}
            className={`relative type-caption text-[10px] tracking-widest px-3.5 py-1.5 rounded-full transition-colors duration-300 ${active === tab.key
              ? 'bg-white/70 text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-secondary'
              }`}
          >
            {tab.label}
            {active === tab.key && autoRotate && (
              <span
                className="absolute left-3 right-3 bottom-1 h-[1.5px] rounded-full bg-text-primary/30 overflow-hidden"
              >
                <span
                  className="block h-full bg-text-primary/70 transition-[width] duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="flex-1 relative min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            {active === 'rubric' ? <RubricPanel /> : <InsightsPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
