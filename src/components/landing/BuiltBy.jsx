import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FOUNDERS, FOUNDERS_QUOTE } from '../../constants/founders'
import { fadeInUp, staggerContainer } from './animations'

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

export default function BuiltBy() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-4 px-6 w-full">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-4xl mx-auto"
      >
        {/* Section header */}
        <motion.div variants={fadeInUp} className="text-center mb-8">
          <h2 className="type-title text-3xl md:text-4xl text-text-primary">
            Built by ISEF Grand Award Winners
          </h2>
        </motion.div>

        {/* Founder cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {FOUNDERS.map((f) => (
            <FounderCard key={f.name} founder={f} />
          ))}
        </div>

        {/* Shared quote — light, airy typographic treatment */}
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
