import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router'
import { fadeInUp, staggerContainer } from './animations'

export default function FooterCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <footer>
      {/* CTA section */}
      <motion.section
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="py-32 px-6 text-center"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-4xl md:text-5xl font-semibold tracking-tight text-text-primary"
        >
          Ready to practice?
        </motion.h2>
        <motion.div variants={fadeInUp} className="mt-10">
          <Link
            to="/app"
            className="inline-flex items-center gap-3 rounded-full glass-cta px-10 py-4 text-base font-semibold text-white"
          >
            Try FairPlay
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>
      </motion.section>

      {/* Footer bar */}
      <div className="glass-footer py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold tracking-tight text-text-primary">FairPlay</span>
          <span className="text-xs text-text-muted">&copy; {new Date().getFullYear()} FairPlay.</span>
        </div>
      </div>
    </footer>
  )
}
