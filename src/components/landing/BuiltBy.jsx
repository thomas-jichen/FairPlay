import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FOUNDERS, FOUNDERS_QUOTE } from '../../constants/founders'
import { fadeInUp, staggerContainer } from './animations'

function FounderCard({ founder }) {
  return (
    <motion.div variants={fadeInUp} className="glass-panel rounded-3xl p-8 text-center">
      {/* Photo placeholder */}
      <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-surface-secondary to-surface-tertiary border-2 border-white shadow-lg" />

      <h3 className="text-xl font-semibold tracking-tight mt-6 text-text-primary">
        {founder.name}
      </h3>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        <span className="glass-pill px-4 py-1.5 text-xs font-semibold tracking-tight text-text-secondary">
          {founder.award}
        </span>
      </div>

      <p className="text-sm font-medium text-text-muted mt-3">
        {founder.university}
      </p>
    </motion.div>
  )
}

export default function BuiltBy() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-32 px-6">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-4xl mx-auto"
      >
        {/* Section header */}
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">
            Built by ISEF Grand Award Winners
          </h2>
        </motion.div>

        {/* Founder cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {FOUNDERS.map((f) => (
            <FounderCard key={f.name} founder={f} />
          ))}
        </div>

        {/* Shared quote */}
        <motion.blockquote
          variants={fadeInUp}
          className="text-lg text-text-secondary italic leading-relaxed max-w-2xl mx-auto mt-16 text-center"
        >
          <span className="text-text-muted text-2xl leading-none">&ldquo;</span>
          {FOUNDERS_QUOTE}
          <span className="text-text-muted text-2xl leading-none">&rdquo;</span>
        </motion.blockquote>
      </motion.div>
    </section>
  )
}
