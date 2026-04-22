import { motion, AnimatePresence } from 'framer-motion'

export default function ScoreTracker({ correct, total }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <div className="flex items-center gap-2.5">
      <div className="glossy-black-cta flex items-center gap-2 px-4 py-2 rounded-xl pointer-events-none select-none">
        <div className="flex items-center gap-1.5 border-r border-white/10 pr-2.5">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={correct}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-emerald-400 font-semibold text-sm tabular-nums"
            >
              {correct}
            </motion.span>
          </AnimatePresence>
          <span className="text-white/25 text-sm">/</span>
          <span className="text-white/55 text-sm tabular-nums">{total}</span>
        </div>
        <span className="type-caption text-xs text-white/40 tabular-nums">{pct}%</span>
      </div>
    </div>
  )
}
