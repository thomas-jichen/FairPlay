import { useEffect, useRef } from 'react'
import useSessionStore from '../stores/useSessionStore'

const WINDOW_SECONDS = 5
const UPDATE_INTERVAL_MS = 1000

export default function useSpeechPace(isActive) {
  const setCurrentWPM = useSessionStore((s) => s.setCurrentWPM)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      const transcript = useSessionStore.getState().transcript
      if (transcript.length === 0) {
        setCurrentWPM(0)
        return
      }

      const latestTimestamp = transcript[transcript.length - 1].timestamp
      const windowStart = latestTimestamp - WINDOW_SECONDS

      const recentSegments = transcript.filter(
        (seg) => seg.timestamp >= windowStart
      )

      if (recentSegments.length === 0) {
        setCurrentWPM(0)
        return
      }

      const wordCount = recentSegments.reduce((count, seg) => {
        return count + seg.text.split(/\s+/).filter(Boolean).length
      }, 0)

      const earliestInWindow = recentSegments[0].timestamp
      const actualSpan = Math.max(latestTimestamp - earliestInWindow, 1)
      const effectiveWindow = Math.min(actualSpan, WINDOW_SECONDS)

      const wpm = Math.round((wordCount / effectiveWindow) * 60)
      setCurrentWPM(wpm)
    }, UPDATE_INTERVAL_MS)

    return () => {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [isActive, setCurrentWPM])
}
