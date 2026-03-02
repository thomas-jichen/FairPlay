import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ISEF_WINNERS } from '../../constants/winners'
import { fadeInUp, staggerContainer } from './animations'

function WinnerCard({ winner }) {
  return (
    <div className="glass-panel rounded-2xl px-7 py-5 flex items-center gap-5 shrink-0 min-w-[300px]">
      {/* Avatar placeholder */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-surface-secondary to-surface-tertiary border border-white/60 shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-primary tracking-tight truncate">{winner.name}</p>
        <p className="text-xs text-text-secondary mt-0.5 truncate">{winner.award}</p>
        <p className="text-xs text-text-muted mt-0.5">{winner.university} &middot; {winner.year}</p>
      </div>
    </div>
  )
}

export default function WinnersMarquee() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-28 overflow-hidden">
      {/* Section header */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="text-center mb-16 px-6"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary"
        >
          From ISEF winners, to ISEF winners.
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="text-lg text-text-secondary mt-4"
        >
          Tested and tuned by winners who've been there, and done that.
        </motion.p>
      </motion.div>

      {/* Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="marquee-strip gap-5">
          {/* First set */}
          {ISEF_WINNERS.map((w, i) => (
            <WinnerCard key={`a-${i}`} winner={w} />
          ))}
          {/* Duplicate for seamless loop */}
          {ISEF_WINNERS.map((w, i) => (
            <WinnerCard key={`b-${i}`} winner={w} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
