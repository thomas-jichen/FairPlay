import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, scaleIn, staggerContainer } from './animations'

function FeatureCard({ index, title, description, children, reverse }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div
      ref={ref}
      className={`max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6 items-center ${reverse ? 'lg:direction-rtl' : ''
        }`}
    >
      {/* Text side */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={`${reverse ? 'lg:order-2 lg:direction-ltr' : 'lg:direction-ltr'}`}
      >
        <motion.span
          variants={fadeInUp}
          className="type-numeral text-sm text-text-muted"
        >
          {String(index).padStart(2, '0')}
        </motion.span>
        <motion.h3
          variants={fadeInUp}
          className="type-title text-xl md:text-2xl mt-1.5 text-text-primary"
        >
          {title}
        </motion.h3>
        <motion.p
          variants={fadeInUp}
          className="type-body text-sm text-text-secondary mt-1.5 max-w-md leading-relaxed"
        >
          {description}
        </motion.p>
      </motion.div>

      {/* Visual mock side — scaled down proportionally */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={`origin-center scale-[0.85] ${reverse ? 'lg:order-1 lg:direction-ltr' : 'lg:direction-ltr'}`}
      >
        {children}
      </motion.div>
    </div>
  )
}

/* ── Visual Mock: AI Judge Questioning ── */
function JudgeMock() {
  return (
    <div className="glass-panel rounded-2xl p-3 shadow-xl relative overflow-hidden">
      {/* Webcam placeholder */}
      <div className="rounded-xl bg-black/90 h-[80px] relative overflow-hidden mb-2.5">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20" />
        </div>
        {/* Simulated feedback pills */}
        <div className="absolute top-2 right-2 flex gap-1.5">
          <span className="type-caption rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[11px] text-emerald-400">
            CONF
          </span>
          <span className="type-caption rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[11px] text-emerald-400">
            ENG
          </span>
        </div>
      </div>

      {/* Simulated question bar */}
      <div className="rounded-lg glass-panel-inner p-2.5">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black/5 border border-black/10">
            <svg className="h-2 w-2 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <span className="type-caption text-[11px] text-text-secondary">AI Judge</span>
        </div>
        <p className="text-xs font-medium text-text-primary leading-relaxed" style={{ letterSpacing: '-0.01em' }}>
          "How did you control for temperature variation in your experimental trials?"
        </p>
      </div>
    </div>
  )
}

/* ── Visual Mock: Multimodal Context ── */
function ContextMock() {
  return (
    <div className="relative h-[150px]">
      {/* Card 1: Abstract */}
      <div className="glass-panel rounded-lg p-2.5 shadow-lg absolute top-0 left-0 w-[75%] z-10 -rotate-2">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-3.5 h-3.5 rounded bg-black/5 flex items-center justify-center">
            <svg className="w-2 h-2 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <span className="type-caption text-[11px] text-text-muted">Abstract</span>
        </div>
        <div className="space-y-1">
          <div className="h-1 bg-black/[0.06] rounded-full w-full" />
          <div className="h-1 bg-black/[0.06] rounded-full w-[90%]" />
          <div className="h-1 bg-black/[0.06] rounded-full w-[75%]" />
        </div>
      </div>

      {/* Card 2: Poster */}
      <div className="glass-panel rounded-lg p-2.5 shadow-lg absolute top-8 right-0 w-[55%] z-20 rotate-1">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-3.5 h-3.5 rounded bg-black/5 flex items-center justify-center">
            <svg className="w-2 h-2 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
          <span className="type-caption text-[11px] text-text-muted">Poster</span>
        </div>
        <div className="rounded bg-surface-tertiary/60 aspect-[2/1] flex items-center justify-center">
          <div className="w-4 h-4 rounded bg-black/[0.06]" />
        </div>
      </div>

      {/* Card 3: Posture & Speaking */}
      <div className="glass-panel rounded-lg p-2.5 shadow-lg absolute bottom-0 left-[10%] w-[72%] z-30 rotate-[0.5deg]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-3.5 h-3.5 rounded bg-black/5 flex items-center justify-center">
            <svg className="w-2 h-2 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
            </svg>
          </div>
          <span className="type-caption text-[11px] text-text-muted">Real-time Analysis</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-text-muted">Posture</span>
            <span className="type-caption rounded-full bg-emerald-50 border border-emerald-200 px-1.5 py-px text-[10px] text-emerald-600">Good</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-text-muted">Pace</span>
            <span className="type-caption rounded-full bg-emerald-50 border border-emerald-200 px-1.5 py-px text-[10px] text-emerald-600">142 WPM</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Visual Mock: Rubric Feedback ── */
function RubricMock() {
  const categories = [
    { label: 'Research Question', score: 87 },
    { label: 'Methodology', score: 72 },
    { label: 'Data Analysis', score: 91 },
    { label: 'Presentation', score: 84 },
  ]

  return (
    <div className="glass-panel rounded-2xl p-3 shadow-xl relative overflow-hidden">
      {/* Score circle */}
      <div className="flex items-center gap-4 mb-3">
        <div className="relative shrink-0">
          <svg width="52" height="52" viewBox="0 0 52 52" className="-rotate-90">
            <circle cx="26" cy="26" r="21" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="3.5" />
            <circle
              cx="26" cy="26" r="21"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 21}
              strokeDashoffset={2 * Math.PI * 21 * (1 - 0.84)}
              className="text-emerald-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-light tracking-tighter text-emerald-500" style={{ fontVariantNumeric: 'tabular-nums' }}>84</span>
          </div>
        </div>
        <div>
          <p className="type-title text-xs text-text-primary">Overall Score</p>
          <p className="type-body text-[11px] text-text-secondary mt-0.5">Based on ISEF rubric</p>
        </div>
      </div>

      {/* Rubric bars */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.label}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs font-medium text-text-primary" style={{ letterSpacing: '-0.01em' }}>{cat.label}</span>
              <span className="text-xs font-light text-text-secondary tabular-nums" style={{ letterSpacing: '0.02em' }}>{cat.score}</span>
            </div>
            <div className="h-1 bg-black/[0.04] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${cat.score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${cat.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Decorative gradient */}
      <div className="absolute top-[-30%] right-[-15%] w-[50%] h-[120%] bg-gradient-to-bl from-white/30 to-transparent blur-2xl pointer-events-none" />
    </div>
  )
}

export default function Features() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-40px' })

  return (
    <section className="w-full h-full flex flex-col justify-center px-6">
      {/* Section header */}
      <motion.div
        ref={sectionRef}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-3xl mx-auto text-center mb-5"
      >
        <motion.span
          variants={fadeInUp}
          className="type-overline glass-pill px-4 py-1 text-sm text-text-muted inline-block"
        >
          How It Works
        </motion.span>
        <motion.h2
          variants={fadeInUp}
          className="type-title text-2xl md:text-3xl mt-2.5 text-text-primary"
        >
          Practice like the real thing.
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="type-body text-base text-text-secondary mt-2 max-w-xl mx-auto"
        >
          Every detail of the ISEF judging experience, powered by AI that sees, hears, and challenges you.
        </motion.p>
      </motion.div>

      {/* Feature cards */}
      <div className="space-y-4">
        <FeatureCard
          index={1}
          title="Real-time AI Judge Questioning"
          description="An adaptive AI judge reads your abstract, analyzes your poster, and asks probing questions in real time: just like a panel of ISEF judges would during your presentation."
        >
          <JudgeMock />
        </FeatureCard>

        <FeatureCard
          index={2}
          title="Full Multimodal Context"
          description="Your abstract, poster text, body language, speaking pace, and mannerisms are all analyzed simultaneously. The AI judge considers everything a real judge would."
          reverse
        >
          <ContextMock />
        </FeatureCard>

        <FeatureCard
          index={3}
          title="ISEF Rubric-Calibrated Feedback"
          description="After your session, receive detailed scoring aligned to official ISEF judging criteria with specific, actionable feedback on every dimension of your pitch."
        >
          <RubricMock />
        </FeatureCard>
      </div>
    </section>
  )
}
