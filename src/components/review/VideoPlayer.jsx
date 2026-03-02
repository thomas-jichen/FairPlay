import { useState, useEffect, useRef, useMemo } from 'react'
import useSessionStore from '../../stores/useSessionStore'

export default function VideoPlayer({ recordedBlob, conversationHistory }) {
  const [videoUrl, setVideoUrl] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const videoRef = useRef(null)
  const recordingStartTime = useSessionStore((s) => s.recordingStartTime)

  useEffect(() => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob)
      setVideoUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [recordedBlob])

  const activeQuestion = useMemo(() => {
    if (!recordingStartTime || !conversationHistory.length) return null

    const videoAbsoluteTime = recordingStartTime + currentTime * 1000

    const judgeMessages = conversationHistory.filter((m) => m.role === 'judge')
    let active = null
    for (const msg of judgeMessages) {
      if (msg.timestamp <= videoAbsoluteTime) {
        active = msg
      } else {
        break
      }
    }

    // Show question for 15 seconds after it was asked
    if (active && videoAbsoluteTime - active.timestamp < 15000) {
      return active
    }
    return null
  }, [currentTime, conversationHistory, recordingStartTime])

  if (!recordedBlob) {
    return (
      <div className="glass-panel flex flex-col items-center justify-center rounded-[32px] p-16 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/60 border border-white mb-6 shadow-sm">
          <svg className="h-8 w-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-text-primary tracking-tight mb-2">No video recording available</p>
        <p className="text-base font-medium text-text-secondary">Your camera may have been disabled.</p>
      </div>
    )
  }

  return (
    <div className="glass-panel rounded-3xl p-8 space-y-6 relative group">
      <div className="border-b border-black/[0.05] pb-4">
        <h2 className="text-lg font-medium tracking-tight text-text-primary">Session Recording</h2>
      </div>

      <div className="relative bg-black aspect-video flex items-center justify-center rounded-2xl overflow-hidden shadow-sm">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Floating Judge Question Overlay inside Video */}
        {activeQuestion && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-20 animate-slide-down">
            <div className="glass-panel rounded-2xl px-6 py-4 shadow-2xl bg-white/40 border-white/60">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-text-primary opacity-80">AI Judge Question</span>
              </div>
              <p className="text-base font-bold text-text-primary leading-snug" style={{ transform: 'scaleX(1)' }}>
                {activeQuestion.text}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
