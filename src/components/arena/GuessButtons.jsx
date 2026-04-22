import { motion } from 'framer-motion'

const BASE =
  'flex-1 py-3 px-3 rounded-full type-cta text-sm ' +
  'transition-all duration-300 ' +
  'disabled:opacity-40 disabled:pointer-events-none ' +
  'flex items-center justify-center'

const TIERS = {
  grand: {
    label: 'GRAND AWARD',
    base: 'glossy-gold-cta text-white',
    hover: '',
  },
  special: {
    label: 'SPECIAL AWARD',
    base: 'glossy-purple-cta text-white',
    hover: '',
  },
  none: {
    label: 'DID NOT PLACE',
    base: 'glossy-black-cta text-white',
    hover: '',
  },
}

export default function GuessButtons({ onGuess, disabled }) {
  return (
    <motion.div
      className="flex gap-2.5 sm:gap-3 mt-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      {['grand', 'special', 'none'].map(tier => (
        <motion.button
          key={tier}
          onClick={() => onGuess(tier)}
          disabled={disabled}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className={`${BASE} ${TIERS[tier].base} ${TIERS[tier].hover}`}
        >
          {TIERS[tier].label}
        </motion.button>
      ))}
    </motion.div>
  )
}
