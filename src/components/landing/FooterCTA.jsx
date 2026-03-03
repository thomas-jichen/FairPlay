import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router'
import { fadeInUp, staggerContainer } from './animations'

export default function FooterCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <footer>
      {/* CTA section */}
      <motion.section
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="py-6 px-6 text-center"
      >
        <motion.h2
          variants={fadeInUp}
          className="type-display text-2xl md:text-3xl text-text-primary"
        >
          Ready to practice?
        </motion.h2>
        <motion.div variants={fadeInUp} className="mt-4">
          <Link
            to="/app"
            className="type-cta inline-flex items-center gap-3 rounded-full glass-cta px-8 py-3 text-sm text-white"
          >
            Try FairPlay
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>
      </motion.section>

      {/* Footer bar */}
      <div className="glass-footer py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="type-wordmark text-sm text-text-primary">FairPlay</span>
          <span className="text-xs font-light text-text-muted" style={{ letterSpacing: '0.04em' }}>&copy; {new Date().getFullYear()} FairPlay.</span>
        </div>
      </div>
    </footer>
  )
}
