import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Hero from '../components/landing/Hero'
import WinnersMarquee from '../components/landing/WinnersMarquee'
import BuiltByFounders from '../components/landing/BuiltByFounders'
import FooterCTA from '../components/landing/FooterCTA'
import FeatureRow from '../components/landing/features/FeatureRow'
import LivePitchDemo from '../components/landing/features/LivePitchDemo'
import MultimodalDemo from '../components/landing/features/MultimodalDemo'
import SessionReviewDemo from '../components/landing/features/SessionReviewDemo'
import { fadeInUp, scaleIn, staggerContainer } from '../components/landing/animations'

function LivePitchFeature() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <div ref={ref} className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-10">
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="w-full flex justify-center"
      >
        <LivePitchDemo />
      </motion.div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-2xl text-center"
      >
        <motion.span variants={fadeInUp} className="type-numeral text-sm text-text-muted">
          01
        </motion.span>
        <motion.h3
          variants={fadeInUp}
          className="type-title text-2xl md:text-3xl mt-2 text-text-primary"
        >
          Real-time Expert Interview
        </motion.h3>
        <motion.p
          variants={fadeInUp}
          className="type-body text-base md:text-lg text-text-secondary mt-4 leading-relaxed"
        >
          An adaptive AI judge reads your abstract, analyzes your poster, and asks
          critical questions in real time: just like a panel of ISEF judges would
          during your presentation.
        </motion.p>
      </motion.div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden w-full">
      <section className="pt-28 pb-6 flex items-center justify-center">
        <Hero />
      </section>

      <section id="features" className="pt-8 pb-14 w-full scroll-mt-20">
        <LivePitchFeature />
      </section>

      <section className="py-14 w-full">
        <FeatureRow
          index={2}
          title="Full Multimodal Context"
          description="Your pitch, abstract, poster, body language, pace, mannerisms, and more are all analyzed simultaneously. The AI judge considers everything a real judge would."
        >
          <MultimodalDemo />
        </FeatureRow>
      </section>

      <section className="pt-14 pb-24 w-full">
        <FeatureRow
          index={3}
          title="ISEF Rubric Tailored Feedback"
          description="After your session, receive detailed scoring aligned to official ISEF judging criteria with specific, actionable feedback on every dimension of your pitch."
          reverse
        >
          <SessionReviewDemo />
        </FeatureRow>
      </section>

      <section id="team" className="py-14 w-full scroll-mt-8">
        <WinnersMarquee />
      </section>

      <section className="py-14 flex flex-col items-center justify-center w-full">
        <BuiltByFounders />
      </section>

      <FooterCTA />
    </main>
  )
}
