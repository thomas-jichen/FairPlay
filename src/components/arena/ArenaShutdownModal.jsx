import { useEffect } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

export default function ArenaShutdownModal() {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 py-8 bg-black/55 backdrop-blur-2xl"
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-none"
      >
        {/* Announcement card */}
        <div className="glass-panel-dark rounded-3xl p-7 sm:p-9">
          <div className="type-caption text-[10px] text-amber-400/80 mb-3 uppercase tracking-[0.14em]">
            Important update
          </div>
          <h2 className="type-display text-3xl sm:text-4xl text-white/95 leading-tight mb-4">
            ISEF Arena is on pause.
          </h2>
          <p className="type-body text-[15px] text-white/65 leading-relaxed">
            Thank you for your interest in ISEF Arena. The Society for Science
            has asked us to take the game offline indefinitely while we work
            towards a partnership to continue ISEF Arena.
          </p>
        </div>

        {/* Fairplay CTA card */}
        <Link
          to="/"
          className="glass-panel-dark group mt-4 block rounded-2xl p-6 sm:p-7 ring-1 ring-amber-400/15 hover:ring-amber-400/30 no-underline"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex-1 min-w-0">
              <div className="type-caption text-[10px] text-amber-400/80 mb-2">
                From the team behind ISEF Arena
              </div>
              <h3 className="type-title text-lg sm:text-xl text-white/95 mb-1.5">
                Practice like the real thing.
              </h3>
              <p className="type-body text-sm text-white/55 leading-relaxed">
                Fairplay simulates full judging rounds: pitch, Q&amp;A, rubric
                feedback, with poster and abstract context, so you&apos;ll be ready
                before judging.
              </p>
            </div>
            <div className="shrink-0">
              <span className="glossy-black-cta inline-flex items-center gap-2 rounded-full px-5 py-2.5 type-cta text-sm">
                Try Fairplay
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">&rarr;</span>
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}
