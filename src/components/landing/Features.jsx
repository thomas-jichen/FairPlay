import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, scaleIn, staggerContainer } from './animations'

function FeatureCard({ index, title, description, children, reverse }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div
      ref={ref}
      className={`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
        reverse ? 'lg:direction-rtl' : ''
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
          className="text-sm font-semibold text-text-muted tracking-widest"
        >
          {String(index).padStart(2, '0')}
        </motion.span>
        <motion.h3
          variants={fadeInUp}
          className="text-3xl md:text-4xl font-semibold tracking-tight mt-4 text-text-primary"
        >
          {title}
        </motion.h3>
        <motion.p
          variants={fadeInUp}
          className="text-lg text-text-secondary leading-relaxed mt-6 max-w-lg"
        >
          {description}
        </motion.p>
      </motion.div>

      {/* Visual mock side */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={`${reverse ? 'lg:order-1 lg:direction-ltr' : 'lg:direction-ltr'}`}
      >
        {children}
      </motion.div>
    </div>
  )
}

/* ── Visual Mock: AI Judge Questioning ── */
function JudgeMock() {
  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
      {/* Webcam placeholder */}
      <div className="rounded-2xl bg-black/90 aspect-video relative overflow-hidden mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20" />
        </div>
        {/* Simulated feedback pills */}
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
            CONF
          </span>
          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
            ENG
          </span>
        </div>
      </div>

      {/* Simulated question bar */}
      <div className="rounded-2xl bg-white/60 border border-white/80 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/5 border border-black/10">
            <svg className="h-3.5 w-3.5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <span className="text-xs font-semibold tracking-wide text-text-secondary uppercase">AI Judge</span>
        </div>
        <p className="text-base font-semibold text-text-primary leading-relaxed tracking-tight">
          "How did you control for temperature variation in your experimental trials?"
        </p>
      </div>
    </div>
  )
}

/* ── Visual Mock: Multimodal Context ── */
function ContextMock() {
  return (
    <div className="relative h-[360px] md:h-[400px]">
      {/* Card 1: Abstract */}
      <div className="glass-panel rounded-2xl p-5 shadow-lg absolute top-0 left-0 w-[75%] z-10 -rotate-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-black/5 flex items-center justify-center">
            <svg className="w-3 h-3 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-text-muted">Abstract</span>
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-black/[0.06] rounded-full w-full" />
          <div className="h-2 bg-black/[0.06] rounded-full w-[90%]" />
          <div className="h-2 bg-black/[0.06] rounded-full w-[75%]" />
          <div className="h-2 bg-black/[0.06] rounded-full w-[85%]" />
        </div>
      </div>

      {/* Card 2: Poster */}
      <div className="glass-panel rounded-2xl p-5 shadow-lg absolute top-20 right-0 w-[70%] z-20 rotate-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-black/5 flex items-center justify-center">
            <svg className="w-3 h-3 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-text-muted">Poster</span>
        </div>
        <div className="rounded-lg bg-surface-tertiary/60 aspect-[3/2] flex items-center justify-center">
          <div className="w-8 h-8 rounded bg-black/[0.06]" />
        </div>
      </div>

      {/* Card 3: Posture & Speaking */}
      <div className="glass-panel rounded-2xl p-5 shadow-lg absolute bottom-0 left-[10%] w-[72%] z-30 rotate-[0.5deg]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-black/5 flex items-center justify-center">
            <svg className="w-3 h-3 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
            </svg>
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-text-muted">Real-time Analysis</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Posture</span>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">Good</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Pace</span>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">142 WPM</span>
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
    <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
      {/* Score circle */}
      <div className="flex items-center gap-8 mb-8">
        <div className="relative shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="5" />
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - 0.84)}
              className="text-emerald-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold tracking-tighter text-emerald-500">84</span>
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold text-text-primary tracking-tight">Overall Score</p>
          <p className="text-sm text-text-secondary mt-1">Based on ISEF rubric criteria</p>
        </div>
      </div>

      {/* Rubric bars */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-text-primary">{cat.label}</span>
              <span className="text-sm font-semibold text-text-secondary tabular-nums">{cat.score}</span>
            </div>
            <div className="h-2 bg-black/[0.04] rounded-full overflow-hidden">
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
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' })

  return (
    <section className="py-32 px-6">
      {/* Section header */}
      <motion.div
        ref={sectionRef}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-3xl mx-auto text-center mb-28"
      >
        <motion.span
          variants={fadeInUp}
          className="text-sm font-semibold tracking-widest uppercase text-text-muted"
        >
          How It Works
        </motion.span>
        <motion.h2
          variants={fadeInUp}
          className="text-4xl md:text-5xl font-semibold tracking-tight mt-5 text-text-primary"
        >
          Practice like the real thing.
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="text-lg text-text-secondary mt-6 leading-relaxed max-w-xl mx-auto"
        >
          Every detail of the ISEF judging experience, powered by AI that sees, hears, and challenges you.
        </motion.p>
      </motion.div>

      {/* Feature cards */}
      <div className="space-y-32 md:space-y-40">
        <FeatureCard
          index={1}
          title="Real-time AI Judge Questioning"
          description="An adaptive AI judge reads your abstract, analyzes your poster, and asks probing questions in real time — just like a panel of ISEF judges would during your presentation."
        >
          <JudgeMock />
        </FeatureCard>

        <FeatureCard
          index={2}
          title="Full Multimodal Context"
          description="Your abstract, poster text, body language, speaking pace, and mannerisms are all analyzed simultaneously. The AI judge considers everything a real judge would — and more."
          reverse
        >
          <ContextMock />
        </FeatureCard>

        <FeatureCard
          index={3}
          title="ISEF Rubric-Calibrated Feedback"
          description="After your session, receive detailed scoring aligned to official ISEF judging criteria — with specific, actionable feedback on every dimension of your pitch."
        >
          <RubricMock />
        </FeatureCard>
      </div>
    </section>
  )
}
