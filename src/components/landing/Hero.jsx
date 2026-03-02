import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { fadeInUp, staggerContainer } from './animations'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle warm radial glow behind hero */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[90%] h-[70%] bg-gradient-radial from-amber-100/25 via-orange-50/10 to-transparent blur-[100px] pointer-events-none" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative max-w-4xl mx-auto text-center pt-44 pb-36 px-6"
      >
        {/* Badge */}
        <motion.div variants={fadeInUp} className="flex justify-center mb-8">
          <span className="glass-pill px-5 py-2 text-xs font-semibold tracking-widest uppercase text-text-secondary">
            AI-Powered Pitch Coaching
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeInUp}
          className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] text-text-primary"
        >
          Science Fair
          <br />
          Playground
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={fadeInUp}
          className="text-xl md:text-2xl text-text-secondary font-medium leading-relaxed max-w-2xl mx-auto mt-8"
        >
          Democratizing science fair winning strategies with real-time multimodal AI coaches tuned by Regeneron ISEF grand award winners.
        </motion.p>

        {/* Supporting paragraph */}
        <motion.p
          variants={fadeInUp}
          className="text-lg text-text-muted leading-relaxed max-w-xl mx-auto mt-6"
        >
          Realistic simulations that prepare you to be an ISEF winner — without the fees of science fair coaches or years of competition experience.
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeInUp} className="mt-14">
          <Link
            to="/app"
            className="inline-flex items-center gap-3 rounded-full bg-black px-10 py-4 text-base font-semibold text-white shadow-lg hover:bg-black/85 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Try FairPlay
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <p className="text-sm text-text-muted mt-4">No sign-up required</p>
        </motion.div>
      </motion.div>
    </section>
  )
}
