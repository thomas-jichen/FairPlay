import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ISEF_CATEGORIES } from '../../constants/categories'

export default function CategorySelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedCategory = ISEF_CATEGORIES.find((c) => c.value === value)

  return (
    <div className="space-y-3 relative px-1" ref={containerRef}>
      <label className="flex items-center text-sm font-medium text-text-primary tracking-tight">
        ISEF Category
        <span className="ml-1.5 flex h-1.5 w-1.5 rounded-full bg-rose-500" title="Required" />
      </label>

      <div className="relative group">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-full flex items-center justify-between rounded-2xl border bg-white/60 backdrop-blur-xl px-5 py-3.5 text-left shadow-sm transition-all duration-300
                     ${isOpen ? 'border-black/20 ring-1 ring-black/5' : 'border-black/10 hover:border-black/15'}`}
        >
          <span className={`block truncate ${!selectedCategory ? 'text-text-muted' : 'text-text-primary font-medium'}`}>
            {selectedCategory ? `${selectedCategory.label} (${selectedCategory.value})` : 'Select your research category...'}
          </span>
          <span className="pointer-events-none ml-3 flex items-center">
            <motion.svg
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`h-5 w-5 transition-colors duration-300 ${isOpen ? 'text-black' : 'text-text-muted group-hover:text-text-secondary'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </motion.svg>
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute z-50 mt-2 w-full origin-top-right rounded-2xl border border-black/5 bg-white/90 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] focus:outline-none overflow-hidden"
            >
              <div className="max-h-60 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent">
                {ISEF_CATEGORIES.map((cat) => {
                  const isSelected = cat.value === value
                  return (
                    <button
                      key={cat.value}
                      onClick={() => {
                        onChange(cat.value)
                        setIsOpen(false)
                      }}
                      className={`relative w-full flex items-center px-5 py-3 text-sm transition-colors duration-200 text-left
                                 ${isSelected ? 'bg-black/5 text-black font-semibold' : 'text-text-secondary hover:bg-black/[0.03] hover:text-black'}`}
                    >
                      <span className="block truncate">{cat.label} <span className="text-text-muted text-xs ml-1 font-normal">({cat.value})</span></span>
                      {isSelected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-5 text-black">
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
