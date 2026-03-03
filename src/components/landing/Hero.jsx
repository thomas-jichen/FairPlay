import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { fadeInUp, staggerContainer } from './animations'
import ReportMock from './ReportMock'

export default function Hero() {
  return (
    <section className="relative overflow-hidden w-full">
      {/* Subtle warm radial glow behind hero */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[90%] h-[70%] bg-gradient-radial from-amber-100/25 via-orange-50/10 to-transparent blur-[100px] pointer-events-none" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative max-w-6xl mx-auto text-center pt-12 pb-4 px-6"
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
          Democratizing winning science fair strategies with real-time multimodal AI coaches tuned by ISEF Grand Award Winners.
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeInUp} className="mt-10">
          <a
            href="/app"
            target="_blank"
            rel="noopener noreferrer"
            className="type-cta rounded-full glossy-black-cta px-5 py-2.5 text-sm"
          >
            TRY FAIRPLAY
          </a>
        </motion.div>

        {/* Sub-CTA copy */}
        <motion.p
          variants={fadeInUp}
          className="type-body text-base text-text-muted max-w-2xl mx-auto mt-10"
        >
          Realistic judging simulations preparing you to be an ISEF winner, without the cost of coaching or years of competition experience.
        </motion.p>
      </motion.div>

      {/* Mock Report Screenshot */}
      <ReportMock />
    </section>
  )
}
