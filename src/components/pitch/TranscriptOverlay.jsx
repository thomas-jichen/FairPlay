import { useRef, useEffect } from 'react'
import useSessionStore from '../../stores/useSessionStore'

const MAX_VISIBLE_LINES = 6

export default function TranscriptOverlay({ transcript, currentPhase }) {
  const containerRef = useRef(null)

  // Auto-scroll to bottom smoothly
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [transcript.length])

  if (transcript.length === 0) {
    let placeholder = "Listening for speech..."
    if (currentPhase === 'setup') placeholder = "Ready when you are..."
    if (currentPhase === 'countdown') placeholder = "Get ready..."

    return (
      <div className="w-full relative group">
        <div className="glass-panel w-full rounded-3xl p-5 md:p-6 min-h-[88px] flex items-center justify-center shadow-2xl transition-all duration-300">
          <p className="text-text-secondary/50 text-sm md:text-base font-medium tracking-wide">
            {placeholder}
          </p>
        </div>
      </div>
    )
  }

  // We map the full transcript instead of just visible segments
  return (
    <div className="w-full relative group">
      {/* Stronger top gradient to fade out older scrolled text */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/20 via-black/5 to-transparent z-10 pointer-events-none rounded-t-3xl" />

      <div
        ref={containerRef}
        className="glass-panel no-shimmer w-full rounded-3xl p-4 h-[88px] overflow-y-auto scrollbar-hide shadow-2xl transition-all duration-300 relative"
      >
        <div className="flex flex-col gap-4 min-h-full justify-end">
          {transcript.map((seg, i) => {
            const isLatest = i === transcript.length - 1
            const isRecent = i >= transcript.length - MAX_VISIBLE_LINES

            // Fade out items that are further up the scroll tree
            const opacityClass = isLatest ? 'opacity-100' : (isRecent ? 'opacity-60 hover:opacity-100' : 'opacity-30 hover:opacity-100')

            return (
              <p
                key={i}
                className={`text-base md:text-lg text-text-primary font-semibold leading-relaxed tracking-tight transition-opacity duration-300 ${opacityClass}`}
              >
                <span className="inline-block mr-3 text-[10px] md:text-xs font-bold tracking-widest text-text-secondary uppercase bg-black/5 px-2 py-0.5 rounded-full border border-black/10 align-middle -translate-y-[1px]">
                  {seg.phase === 'qa' ? 'Q&A' : 'Pitch'}
                </span>
                <span className="drop-shadow-sm">{seg.text}</span>
              </p>
            )
          })}
        </div>
      </div>
    </div>
  )
}
