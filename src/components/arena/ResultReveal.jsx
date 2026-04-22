import { motion } from 'framer-motion'

export default function ResultReveal({ project, userGuess, isCorrect, onNext }) {
  const hasAwards = project.awards.length > 0
  const awardText = project.awards.join(', ')

  return (
    <motion.div
      className="mt-7"
      initial={{ opacity: 0, scale: 0.97, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className={`glass-panel-dark rounded-2xl p-6 border-l-2 ${
          isCorrect ? 'border-l-emerald-400/70' : 'border-l-rose-400/70'
        }`}
        animate={
          isCorrect
            ? { boxShadow: ['0 0 0px rgba(34,197,94,0)', '0 0 32px rgba(34,197,94,0.12)', '0 0 0px rgba(34,197,94,0)'] }
            : { x: [0, -6, 6, -3, 3, 0] }
        }
        transition={isCorrect ? { duration: 1.4, repeat: 1 } : { duration: 0.4 }}
      >
        <div className="flex items-baseline gap-3 mb-3">
          <span
            className={`type-caption text-[11px] ${
              isCorrect ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isCorrect ? 'Correct' : 'Not quite'}
          </span>
          <span className="h-px flex-1 bg-white/[0.08]" />
        </div>

        <p className="type-body text-[15px] leading-relaxed text-white/75">
          {project.placedGrandAward ? (
            <>
              This project took home a{' '}
              <span className="text-[#f5c542] font-medium">{awardText}</span>.
            </>
          ) : hasAwards ? (
            <>
              This project won a{' '}
              <span className="text-[#9bb8e0] font-medium">{awardText}</span>, but no Grand Award.
            </>
          ) : (
            <span className="text-white/50">This project did not place.</span>
          )}
        </p>
      </motion.div>

      <motion.button
        onClick={onNext}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="glass-panel-dark w-full mt-4 py-3.5 rounded-2xl type-cta text-sm text-white/85 hover:text-white"
      >
        Next Project <span className="inline-block ml-1 transition-transform group-hover:translate-x-0.5">→</span>
      </motion.button>
    </motion.div>
  )
}
