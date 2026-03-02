import { useRef, useCallback, useEffect } from 'react'
import useSessionStore from '../stores/useSessionStore'

const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

export default function useSpeechRecognition() {
  const recognitionRef = useRef(null)
  const phaseRef = useRef('pitching')
  const shouldBeListening = useRef(false)
  const sessionStartTime = useRef(null)

  const addTranscriptSegment = useSessionStore((s) => s.addTranscriptSegment)
  const setIsSpeechActive = useSessionStore((s) => s.setIsSpeechActive)

  const isSupported = !!SpeechRecognition

  const startListening = useCallback(
    (phase) => {
      if (!SpeechRecognition) return

      phaseRef.current = phase
      shouldBeListening.current = true

      if (!sessionStartTime.current) {
        sessionStartTime.current = Date.now()
      }

      if (recognitionRef.current) {
        recognitionRef.current.onend = null
        recognitionRef.current.abort()
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            const text = result[0].transcript.trim()
            if (text) {
              addTranscriptSegment({
                text,
                timestamp: (Date.now() - sessionStartTime.current) / 1000,
                phase: phaseRef.current,
              })
            }
          }
        }
      }

      recognition.onerror = (event) => {
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.warn('SpeechRecognition error:', event.error)
        }
        if (event.error === 'not-allowed') {
          shouldBeListening.current = false
          setIsSpeechActive(false)
        }
      }

      recognition.onend = () => {
        if (shouldBeListening.current) {
          try {
            recognition.start()
          } catch {
            setTimeout(() => {
              if (shouldBeListening.current && recognitionRef.current === recognition) {
                try {
                  recognition.start()
                } catch {
                  startListening(phaseRef.current)
                }
              }
            }, 100)
          }
        } else {
          setIsSpeechActive(false)
        }
      }

      recognitionRef.current = recognition
      recognition.start()
      setIsSpeechActive(true)
    },
    [addTranscriptSegment, setIsSpeechActive]
  )

  const stopListening = useCallback(() => {
    shouldBeListening.current = false
    if (recognitionRef.current) {
      recognitionRef.current.onend = null
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsSpeechActive(false)
  }, [setIsSpeechActive])

  const setPhase = useCallback((phase) => {
    phaseRef.current = phase
  }, [])

  useEffect(() => {
    return () => {
      shouldBeListening.current = false
      if (recognitionRef.current) {
        recognitionRef.current.onend = null
        recognitionRef.current.abort()
        recognitionRef.current = null
      }
    }
  }, [])

  return { startListening, stopListening, setPhase, isSupported }
}
