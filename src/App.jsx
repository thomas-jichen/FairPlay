import { useLocation, useOutlet } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'

export default function App() {
  const location = useLocation()
  const element = useOutlet()

  return (
    <div className="min-h-screen bg-surface-primary text-text-primary overflow-x-hidden bg-[#050505]">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96, filter: 'blur(5px)', transition: { duration: 0.3, ease: 'easeIn' } }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen w-full relative"
        >
          {element}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
