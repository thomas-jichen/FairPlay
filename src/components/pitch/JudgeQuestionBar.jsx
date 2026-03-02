import { useState, useEffect } from 'react'

export default function JudgeQuestionBar({ question, type, questionNumber, isVisible, isListening }) {
  const [show, setShow] = useState(false)
  const [showListening, setShowListening] = useState(false)

  useEffect(() => {
    if (isVisible) {
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
      className={`w-full transition-all duration-700 ease-spring transform origin-top
                  ${show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-8'}`}
    >
      <div className="glass-panel rounded-[32px] p-6 md:p-8 shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 border border-black/10">
                <svg className="h-4 w-4 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold tracking-wide text-text-secondary uppercase">
                AI Judge
              </span>
            </div>

            {type === 'qa' && questionNumber > 0 && (
              <span className="rounded-full bg-black/5 border border-black/5 px-3 py-1 text-xs font-bold text-text-secondary">
                Q{questionNumber}
              </span>
            )}

            {type === 'interruption' && (
              <span className="rounded-full bg-red-100 border border-red-200 px-3 py-1 text-xs font-bold tracking-widest text-red-600 uppercase shadow-sm">
                Interruption
              </span>
            )}
          </div>

          <p className="text-lg md:text-2xl font-semibold text-text-primary leading-relaxed tracking-tight">
            "{question}"
          </p>

          {showListening && (
            <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between animate-fade-in">
              <span className="text-xs font-medium text-text-muted tracking-wide uppercase">Listening for response</span>
              <div className="flex items-center gap-1.5 opacity-80">
                <div className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-[bounce_1s_infinite_0ms]" />
                <div className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-[bounce_1s_infinite_200ms]" />
                <div className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-[bounce_1s_infinite_400ms]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
