import { useEffect, useRef, useCallback } from 'react'
import useSessionStore from '../stores/useSessionStore'

const SILENCE_THRESHOLD = 4000
const FALLBACK_TIMEOUT = 30000
const MINIMUM_ANSWER_TIME = 7000
const GRACE_PERIOD = 2000

export default function useAnswerDetection({ active, onAnswerComplete }) {
  const activationTimeRef = useRef(null)
  const lastSegmentTimeRef = useRef(null)
  const segmentCountRef = useRef(0)
  const collectedTextRef = useRef([])
  const baselineTranscriptLenRef = useRef(0)
  const intervalRef = useRef(null)
  const onCompleteRef = useRef(onAnswerComplete)
  onCompleteRef.current = onAnswerComplete

  const setStatus = useSessionStore.getState().setAnswerDetectionStatus

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    activationTimeRef.current = null
    lastSegmentTimeRef.current = null
    segmentCountRef.current = 0
    collectedTextRef.current = []
  }, [])

  useEffect(() => {
    if (!active) {
      cleanup()
      setStatus(null)
      return
    }

    const transcript = useSessionStore.getState().transcript
    baselineTranscriptLenRef.current = transcript.length
    activationTimeRef.current = Date.now()
    lastSegmentTimeRef.current = null
    segmentCountRef.current = 0
    collectedTextRef.current = []

    // Start in grace period
    setStatus('grace')

    const unsubscribe = useSessionStore.subscribe((state, prevState) => {
      // Ignore segments during grace period (residual speech from before interruption)
      if (Date.now() - activationTimeRef.current < GRACE_PERIOD) return

      if (state.transcript.length > prevState.transcript.length) {
        const newSegments = state.transcript.slice(prevState.transcript.length)
        for (const seg of newSegments) {
          if (state.transcript.indexOf(seg) >= baselineTranscriptLenRef.current) {
            collectedTextRef.current.push(seg.text)
            segmentCountRef.current++
            lastSegmentTimeRef.current = Date.now()
            // Student is speaking — update status
            setStatus('heard')
          }
        }
      }
    })

    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const elapsed = now - activationTimeRef.current

      // Grace period: don't process anything for the first 2 seconds
      if (elapsed < GRACE_PERIOD) return

      // Transition from grace to listening when grace ends
      const currentStatus = useSessionStore.getState().answerDetectionStatus
      if (currentStatus === 'grace') {
        setStatus('listening')
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
        setStatus(null)
        onCompleteRef.current(text)
        return
      }

      // Fallback timeout
      if (activationTimeRef.current && now - activationTimeRef.current >= FALLBACK_TIMEOUT) {
        const text = collectedTextRef.current.join(' ') || '(no response detected)'
        cleanup()
        unsubscribe()
        setStatus(null)
        onCompleteRef.current(text)
      }
    }, 500)

    return () => {
      cleanup()
      unsubscribe()
      setStatus(null)
    }
  }, [active, cleanup])
}
