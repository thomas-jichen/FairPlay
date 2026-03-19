import { motion } from 'framer-motion'

export default function ResultReveal({ project, userGuess, isCorrect, onNext }) {
  const hasAwards = project.awards.length > 0

  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      {/* Result card */}
      <motion.div
        className={`rounded-xl p-5 border ${
          isCorrect
            ? 'bg-[#22c55e]/[0.08] border-[#22c55e]/20'
            : 'bg-[#ef4444]/[0.08] border-[#ef4444]/20'
        }`}
        animate={
          isCorrect
            ? { boxShadow: ['0 0 0px rgba(34,197,94,0)', '0 0 20px rgba(34,197,94,0.15)', '0 0 0px rgba(34,197,94,0)'] }
            : { x: [0, -6, 6, -3, 3, 0] }
        }
        transition={
          isCorrect
            ? { duration: 1.2, repeat: 1 }
            : { duration: 0.4 }
        }
      >
        {/* Correct/Wrong indicator */}
        <div className="flex items-center gap-2 mb-3">
          {isCorrect ? (
            <>
              <svg className="w-5 h-5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="font-semibold text-[#22c55e]">Correct!</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="font-semibold text-[#ef4444]">Wrong!</span>
            </>
          )}
        </div>

        {/* Award info */}
        <div className="text-sm text-white/70">
          {project.placedGrandAward ? (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#f5c542] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>
                This project won a{' '}
                <span className="text-[#f5c542] font-semibold">
                  {project.awards.join(', ')}
                </span>
              </span>
            </div>
          ) : hasAwards ? (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>
                This project won a{' '}
                <span className="text-blue-400 font-semibold">
                  {project.awards.join(', ')}
                </span>
                {' '}but not a Grand Award
              </span>
            </div>
          ) : (
            <span className="text-white/40">This project did not win an award.</span>
          )}
        </div>
      </motion.div>

      {/* Next button */}
      <motion.button
        onClick={onNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full mt-4 py-3 px-6 rounded-xl font-medium text-sm
          bg-white/[0.06] border border-white/[0.08] text-white/70
          hover:bg-white/[0.1] hover:text-white/90
          transition-colors duration-200"
      >
        Next Project →
      </motion.button>
    </motion.div>
  )
}
