import { useEffect, useRef, useCallback } from 'react'
import useSessionStore from '../stores/useSessionStore'

const SILENCE_THRESHOLD = 4000
const FALLBACK_TIMEOUT = 30000
const MINIMUM_ANSWER_TIME = 5000
const GRACE_PERIOD = 3000

export default function useAnswerDetection({ active, onAnswerComplete }) {
  const activationTimeRef = useRef(null)
  const lastSegmentTimeRef = useRef(null)
  const segmentCountRef = useRef(0)
  const collectedTextRef = useRef([])
  const baselineTranscriptLenRef = useRef(0)
  const intervalRef = useRef(null)
  const graceElapsedRef = useRef(false)
  const onCompleteRef = useRef(onAnswerComplete)
  onCompleteRef.current = onAnswerComplete

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    activationTimeRef.current = null
    lastSegmentTimeRef.current = null
    segmentCountRef.current = 0
    collectedTextRef.current = []
    graceElapsedRef.current = false
  }, [])

  useEffect(() => {
    if (!active) {
      cleanup()
      return
    }

    const transcript = useSessionStore.getState().transcript
    baselineTranscriptLenRef.current = transcript.length
    activationTimeRef.current = Date.now()
    lastSegmentTimeRef.current = null
    segmentCountRef.current = 0
    collectedTextRef.current = []
    graceElapsedRef.current = false

    const unsubscribe = useSessionStore.subscribe((state, prevState) => {
      if (state.transcript.length > prevState.transcript.length) {
        const newSegments = state.transcript.slice(prevState.transcript.length)
        for (const seg of newSegments) {
          if (state.transcript.indexOf(seg) >= baselineTranscriptLenRef.current) {
            collectedTextRef.current.push(seg.text)
            segmentCountRef.current++
            lastSegmentTimeRef.current = Date.now()
          }
        }
      }
    })

    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const elapsed = now - activationTimeRef.current

      // Grace period: don't process anything for the first 3 seconds
      if (elapsed < GRACE_PERIOD) return

      // After grace ends, refresh lastSegmentTime to prevent stale timestamps
      if (!graceElapsedRef.current) {
        graceElapsedRef.current = true
        if (lastSegmentTimeRef.current !== null) {
          lastSegmentTimeRef.current = now
        }
      }

      // Minimum answer time: don't complete before 5s regardless of silence
      if (elapsed < MINIMUM_ANSWER_TIME) return

      // Silence detection: at least 1 segment captured, then silence
      if (
        segmentCountRef.current > 0 &&
        lastSegmentTimeRef.current &&
        now - lastSegmentTimeRef.current >= SILENCE_THRESHOLD
      ) {
        const text = collectedTextRef.current.join(' ')
        cleanup()
        unsubscribe()
        onCompleteRef.current(text)
        return
      }

      // Fallback timeout
      if (activationTimeRef.current && now - activationTimeRef.current >= FALLBACK_TIMEOUT) {
        const text = collectedTextRef.current.join(' ') || '(no response detected)'
        cleanup()
        unsubscribe()
        onCompleteRef.current(text)
      }
    }, 500)

    return () => {
      cleanup()
      unsubscribe()
    }
  }, [active, cleanup])
}
