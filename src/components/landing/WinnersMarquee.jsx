import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ISEF_WINNERS } from '../../constants/winners'
import { fadeInUp, staggerContainer } from './animations'

function WinnerCard({ winner }) {
  return (
    <div className="glass-panel no-shimmer rounded-2xl px-6 py-4 flex items-center gap-5 shrink-0"
      style={{ width: '300px', height: '128px' }}>
      {/* Headshot */}
      <img
        src={winner.image}
        alt={winner.name}
        className="w-14 h-14 rounded-full object-cover border border-white/60 shrink-0"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
      />
      <div className="min-w-0 flex flex-col justify-center gap-[3px]">
        <p className="text-[0.9rem] font-semibold text-text-primary truncate" style={{ letterSpacing: '-0.01em' }}>
          {winner.name}
        </p>
        <p className="text-xs font-normal text-text-secondary truncate" style={{ letterSpacing: '0.005em' }}>
          {winner.award}
        </p>
        <p className="text-xs font-normal text-text-secondary truncate" style={{ letterSpacing: '0.005em' }}>
          {winner.category}
        </p>
        <p className="type-caption text-text-muted mt-[3px] truncate">
          {winner.details}
        </p>
        <p className="type-caption text-text-muted mt-[1px] truncate">
          {winner.year}
        </p>
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
          From past ISEF winners, to future ISEF winners.
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
          {[...Array(6)].map((_, setIdx) =>
            ISEF_WINNERS.map((w, i) => <WinnerCard key={`${setIdx}-${i}`} winner={w} />)
          )}
        </div>
      </motion.div>
    </div>
  )
}
