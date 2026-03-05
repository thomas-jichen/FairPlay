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
        <p className="text-sm font-medium text-text-primary truncate" style={{ letterSpacing: '-0.01em' }}>{winner.name}</p>
        <p className="text-xs font-normal text-text-secondary mt-0.5 truncate" style={{ letterSpacing: '0.005em' }}>{winner.award}</p>
        <p className="type-caption text-text-muted mt-0.5">{winner.university} &middot; {winner.year}</p>
      </div>
    </div>
  )
}

export default function WinnersMarquee() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="w-full flex flex-col items-center justify-center">
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
        className="w-full"
      >
        <div className="marquee-strip gap-5">
          {ISEF_WINNERS.map((w, i) => <WinnerCard key={`a-${i}`} winner={w} />)}
          {ISEF_WINNERS.map((w, i) => <WinnerCard key={`b-${i}`} winner={w} />)}
        </div>
      </motion.div>
    </div>
  )
}
