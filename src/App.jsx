import { useLocation, useOutlet } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'


export default function App() {
  const location = useLocation()
  const element = useOutlet()

  return (
    <div className="min-h-screen bg-surface-primary text-text-primary overflow-x-hidden relative">
      {/* Subtle colorful ambient mesh background to make glass pop */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-orange-300/60 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[50%] rounded-full bg-blue-300/60 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-rose-300/60 blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96, filter: 'blur(5px)', transition: { duration: 0.3, ease: 'easeIn' } }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen w-full relative z-10"
        >
          {element}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
