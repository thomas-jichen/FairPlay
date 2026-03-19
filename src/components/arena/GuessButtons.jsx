import { motion } from 'framer-motion'

export default function GuessButtons({ onGuess, disabled }) {
  return (
    <motion.div
      className="flex gap-3 mt-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25, delay: 0.15 }}
    >
      {/* Grand Award */}
      <motion.button
        onClick={() => onGuess('grand')}
        disabled={disabled}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="flex-1 py-4 px-3 sm:px-6 rounded-xl font-semibold text-xs sm:text-base
          bg-gradient-to-b from-[#f5c542]/20 to-[#f5c542]/5
          border border-[#f5c542]/20 text-[#f5c542]
          hover:border-[#f5c542]/40 hover:from-[#f5c542]/25 hover:to-[#f5c542]/10
          transition-colors duration-200
          disabled:opacity-40 disabled:pointer-events-none
          flex items-center justify-center gap-1.5 sm:gap-2"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        Grand Award
      </motion.button>

      {/* Special Award */}
      <motion.button
        onClick={() => onGuess('special')}
        disabled={disabled}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="flex-1 py-4 px-3 sm:px-6 rounded-xl font-semibold text-xs sm:text-base
          bg-gradient-to-b from-[#60a5fa]/15 to-[#60a5fa]/5
          border border-[#60a5fa]/20 text-[#60a5fa]
          hover:border-[#60a5fa]/40 hover:from-[#60a5fa]/20 hover:to-[#60a5fa]/8
          transition-colors duration-200
          disabled:opacity-40 disabled:pointer-events-none
          flex items-center justify-center gap-1.5 sm:gap-2"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
        </svg>
        Special Award
      </motion.button>

      {/* Did Not Place */}
      <motion.button
        onClick={() => onGuess('none')}
        disabled={disabled}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="flex-1 py-4 px-3 sm:px-6 rounded-xl font-semibold text-xs sm:text-base
          bg-white/[0.04] border border-white/[0.08] text-white/60
          hover:bg-white/[0.07] hover:border-white/[0.12] hover:text-white/80
          transition-colors duration-200
          disabled:opacity-40 disabled:pointer-events-none
          flex items-center justify-center gap-1.5 sm:gap-2"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Did Not Place
      </motion.button>
    </motion.div>
  )
}
