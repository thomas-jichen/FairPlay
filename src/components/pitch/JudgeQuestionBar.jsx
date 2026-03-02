import { useState, useEffect } from 'react'

export default function JudgeQuestionBar({ question, type, questionNumber, isVisible, isListening }) {
  const [show, setShow] = useState(false)
  const [showListening, setShowListening] = useState(false)

  useEffect(() => {
    if (isVisible) {
      // Small delay for entrance animation
      requestAnimationFrame(() => setShow(true))
    } else {
      setShow(false)
    }
  }, [isVisible])

  // Delay the listening indicator to match the answer detection grace period
  useEffect(() => {
    if (isListening && type !== 'opener' && type !== 'closing') {
      const timer = setTimeout(() => setShowListening(true), 3000)
      return () => clearTimeout(timer)
    } else {
      setShowListening(false)
    }
  }, [isListening, type])

  if (!isVisible && !show) return null

  return (
    <div
      className={`absolute top-20 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4
                  transition-all duration-300 ease-out
                  ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}
    >
      <div className="rounded-xl border border-accent/40 bg-surface-elevated/95 backdrop-blur-sm
                      px-6 py-4 shadow-lg shadow-accent/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center rounded-md bg-accent/15 px-2 py-0.5
                          text-xs font-semibold text-accent">
            Judge
          </span>
          {type === 'qa' && questionNumber > 0 && (
            <span className="text-xs text-text-muted">Q{questionNumber}</span>
          )}
        </div>

        <p className="text-base text-text-primary leading-relaxed">
          {question}
        </p>

        {showListening && (
          <div className="mt-3 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-xs text-text-muted">Listening for your answer...</span>
          </div>
        )}
      </div>
    </div>
  )
}
