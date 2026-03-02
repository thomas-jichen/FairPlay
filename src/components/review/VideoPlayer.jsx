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
      <div className="rounded-lg border border-border-default bg-surface-secondary p-6 text-center">
        <p className="text-sm text-text-muted">No video recording available</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border-default bg-surface-secondary overflow-hidden">
      <h3 className="text-sm font-semibold text-text-primary px-4 pt-4 pb-2">Session Recording</h3>
      <div className="relative">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
          className="w-full"
          style={{ transform: 'scaleX(-1)' }}
        />
        {activeQuestion && (
          <div className="absolute bottom-12 left-2 right-2 rounded-lg bg-black/75 backdrop-blur-sm
                          px-4 py-2 text-sm text-white transition-opacity duration-300"
               style={{ transform: 'scaleX(-1)' }}>
            <span className="text-xs text-cyan-400 font-semibold mr-2">Judge:</span>
            {activeQuestion.text}
          </div>
        )}
      </div>
    </div>
  )
}
