import { motion, AnimatePresence } from 'framer-motion'

export default function ScoreTracker({ correct, total }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08]">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={correct}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-[#22c55e] font-semibold text-sm tabular-nums"
          >
            {correct}
          </motion.span>
        </AnimatePresence>
        <span className="text-white/30 text-sm">/</span>
        <span className="text-white/60 text-sm tabular-nums">{total}</span>
      </div>
      {total > 0 && (
        <span className="text-xs text-white/40 tabular-nums">{pct}%</span>
      )}
    </div>
  )
}
