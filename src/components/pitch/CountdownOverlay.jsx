import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CountdownOverlay({ count }) {
  const [show, setShow] = useState(false)

  // Force re-render of inner components to restart animation for each number
  useEffect(() => {
    if (count !== null && count > 0) {
      setShow(false)
      const timer = setTimeout(() => setShow(true), 10)
      return () => clearTimeout(timer)
    }
  }, [count])

  if (count === null || count <= 0) return null

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-xl transition-opacity duration-300">
      <div className="relative flex flex-col items-center justify-center">

        {/* Animated Background Pulse Ring */}
        <motion.div
          key={`ring-${count}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.5, opacity: [0, 0.4, 0] }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute w-64 h-64 rounded-full bg-accent/20 blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />

        {/* Number Display */}
        <div className="h-40 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {show && (
              <motion.span
                key={count}
                initial={{ scale: 0.2, opacity: 0, filter: 'blur(10px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  opacity: { duration: 0.2 },
                  exit: { duration: 0.4, ease: "easeIn" }
                }}
                className="block text-[180px] font-bold text-white tracking-tighter drop-shadow-[0_0_50px_rgba(14,187,187,0.7)]"
              >
                {count}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Text Below */}
        <p className="mt-8 text-xl tracking-[0.2em] text-text-secondary font-medium uppercase animate-pulse">
          Get Ready
        </p>

      </div>
    </div>
  )
}
