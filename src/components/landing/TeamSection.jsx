import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ISEF_WINNERS } from '../../constants/winners'
import { FOUNDERS, FOUNDERS_QUOTE } from '../../constants/founders'
import { fadeInUp, staggerContainer } from './animations'

function WinnerCard({ winner }) {
  return (
    <div className="glass-panel rounded-2xl px-7 py-5 flex items-center gap-5 shrink-0 min-w-[300px]">
      {/* Avatar placeholder */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-surface-secondary to-surface-tertiary border border-white/60 shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary truncate" style={{ letterSpacing: '-0.01em' }}>{winner.name}</p>
        <p className="text-xs font-normal text-text-secondary mt-0.5 truncate" style={{ letterSpacing: '0.005em' }}>{winner.award}</p>
        <p className="type-caption text-text-muted mt-0.5">{winner.university} &middot; {winner.year}</p>
      </div>
    </div>
  )
}

function FounderCard({ founder }) {
  return (
    <motion.div variants={fadeInUp} className="glass-panel rounded-3xl p-8 text-center">
      <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-2 border-white shadow-lg">
        <img
          src={founder.image}
          alt={founder.name}
          width={192}
          height={192}
          className="w-full h-full object-cover"
          style={{ imageRendering: 'auto' }}
        />
      </div>

      <h3 className="type-title text-xl mt-6 text-text-primary">
        {founder.name}
      </h3>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        <span className="glass-pill px-5 py-1.5 text-sm font-medium text-text-secondary" style={{ letterSpacing: '-0.01em' }}>
          {founder.award}
        </span>
      </div>

      <p className="type-caption text-text-muted mt-3">
        {founder.university}
      </p>
    </motion.div>
  )
}

export default function TeamSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="pt-4 pb-2 overflow-hidden w-full flex flex-col items-center justify-center h-full">
      {/* Winners Marquee Section */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="text-center mb-8 px-6 w-full"
      >
        <motion.h2
          variants={fadeInUp}
          className="type-title text-3xl md:text-4xl text-text-primary"
        >
          From ISEF winners, to ISEF winners.
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="type-body text-lg text-text-secondary mt-4"
        >
          Tested and tuned by winners who've been there, and done that.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full mb-18"
      >
        <div className="marquee-strip gap-5">
          {ISEF_WINNERS.map((w, i) => <WinnerCard key={`a-${i}`} winner={w} />)}
          {ISEF_WINNERS.map((w, i) => <WinnerCard key={`b-${i}`} winner={w} />)}
        </div>
      </motion.div>

      {/* Built By Section - Now fully merged in the same component */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-4xl mx-auto w-full px-6"
      >
        <motion.div variants={fadeInUp} className="text-center mb-8">
          <h2 className="type-title text-3xl md:text-4xl text-text-primary">
            Built by ISEF Grand Award Winners
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {FOUNDERS.map((f) => (
            <FounderCard key={f.name} founder={f} />
          ))}
        </div>

        <motion.blockquote
          variants={fadeInUp}
          className="type-quote text-lg text-text-secondary max-w-2xl mx-auto mt-8 text-center"
        >
          "{FOUNDERS_QUOTE}"
        </motion.blockquote>
      </motion.div>
    </section>
  )
}
