import { useRef, useEffect } from 'react'
import useSessionStore from '../../stores/useSessionStore'

const MAX_VISIBLE_LINES = 4

export default function TranscriptOverlay({ transcript }) {
  const containerRef = useRef(null)
  const conversationHistory = useSessionStore((s) => s.conversationHistory)

  // Get recent judge messages to interleave
  const recentJudgeMessages = conversationHistory
    .filter((msg) => msg.role === 'judge')
    .slice(-2)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [transcript.length, conversationHistory.length])

  if (transcript.length === 0 && recentJudgeMessages.length === 0) return null

  const visibleSegments = transcript.slice(-MAX_VISIBLE_LINES)

  return (
    <div className="absolute bottom-6 left-6 z-20 max-w-sm">
      <div
        ref={containerRef}
        className="rounded-lg bg-black/50 backdrop-blur-sm border border-border-default/30
                   px-4 py-3 max-h-36 overflow-y-auto"
      >
        {visibleSegments.map((seg, i) => {
          const globalIndex = transcript.length - visibleSegments.length + i
          return (
            <p
              key={globalIndex}
              className="text-sm text-text-secondary/80 leading-relaxed"
            >
              <span className="text-text-muted text-xs mr-1.5 uppercase">
                {seg.phase === 'qa' ? 'Q&A' : 'Pitch'}
              </span>
              {seg.text}
            </p>
          )
        })}
      </div>
    </div>
  )
}
