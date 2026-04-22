import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, scaleIn, staggerContainer } from '../animations'

export default function FeatureRow({ index, title, description, children, reverse }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div
      ref={ref}
      className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center px-6"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={reverse ? 'lg:order-2' : ''}
      >
        <motion.span
          variants={fadeInUp}
          className="type-numeral text-sm text-text-muted"
        >
          {String(index).padStart(2, '0')}
        </motion.span>
        <motion.h3
          variants={fadeInUp}
          className="type-title text-2xl md:text-3xl mt-2 text-text-primary"
        >
          {title}
        </motion.h3>
        <motion.p
          variants={fadeInUp}
          className="type-body text-base md:text-lg text-text-secondary mt-4 max-w-md leading-relaxed"
        >
          {description}
        </motion.p>
      </motion.div>

      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={`flex justify-center ${reverse ? 'lg:order-1' : ''}`}
      >
        {children}
      </motion.div>
    </div>
  )
}
