import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { fadeInUp, staggerContainer } from './animations'

export default function Hero() {
  return (
    <section className="relative overflow-visible w-full">
      {/* Subtle warm radial glow behind hero */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[90%] h-[70%] bg-gradient-radial from-amber-100/25 via-orange-50/10 to-transparent blur-[100px] pointer-events-none" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative max-w-6xl mx-auto text-center pt-16 pb-4 px-6"
      >
        {/* Headline */}
        <motion.h1
          variants={fadeInUp}
          className="type-display text-4xl md:text-5xl lg:text-6xl text-text-primary whitespace-nowrap"
        >
          FAIRPLAY: Sci-Fair Playground
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={fadeInUp}
          className="type-body text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mt-8"
        >
          Personalized, realistic AI judging designed by ISEF winners.
          <br />
          Insights from competing at the biggest stage, democratized.
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeInUp} className="mt-10 flex items-center justify-center gap-3">
          <a
            href="/app"
            target="_blank"
            rel="noopener noreferrer"
            className="type-cta rounded-full glossy-black-cta px-5 py-2.5 text-sm"
          >
            TRY PITCHING
          </a>
          <Link
            to="/isefarena"
            target="_blank"
            rel="noopener noreferrer"
            className="type-cta rounded-full px-5 py-2.5 text-sm text-white no-underline hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            style={{
              background: 'linear-gradient(165deg, rgba(255,160,60,0.95) 0%, rgba(220,120,20,0.98) 40%, rgba(180,80,0,0.98) 100%)',
              border: '1px solid rgba(255,180,100,0.4)',
              boxShadow: '0 4px 16px rgba(200,100,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            TRY JUDGING
          </Link>
        </motion.div>

        {/* Sub-CTA copy */}
        <motion.p
          variants={fadeInUp}
          className="type-body text-base text-text-muted max-w-2xl mx-auto mt-10"
        >
          No coaching fees, insider access, or years of experience needed.
        </motion.p>
      </motion.div>
    </section>
  )
}
