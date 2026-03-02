import { useRef, useEffect } from 'react'
import useSessionStore from '../../stores/useSessionStore'

const MAX_VISIBLE_LINES = 6

export default function TranscriptOverlay({ transcript }) {
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

  if (transcript.length === 0) return null

  const visibleSegments = transcript.slice(-MAX_VISIBLE_LINES)

  return (
    <div className="w-full relative group">
      {/* Soft top gradient to fade out older text */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/20 to-transparent z-10 pointer-events-none rounded-t-2xl" />

      <div
        ref={containerRef}
        className="glass-panel w-full rounded-2xl p-4 md:p-5 max-h-[220px] overflow-y-auto scrollbar-hide border-white/10 bg-black/40 backdrop-blur-md shadow-2xl transition-all duration-300 hover:bg-black/50"
      >
        <div className="flex flex-col gap-3 min-h-full justify-end">
          {visibleSegments.map((seg, i) => {
            const globalIndex = transcript.length - visibleSegments.length + i
            const isLatest = i === visibleSegments.length - 1
            const opacityClass = isLatest ? 'opacity-100' : 'opacity-60 hover:opacity-100'

            return (
              <p
                key={globalIndex}
                className={`text-base md:text-lg text-white font-medium leading-relaxed tracking-wide transition-opacity duration-300 ${opacityClass}`}
              >
                <span className="inline-block mr-3 text-xs md:text-sm font-bold tracking-widest text-accent uppercase opacity-80 bg-accent/10 px-2 py-0.5 rounded-sm border border-accent/20">
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
