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
  const setInterimText = useSessionStore((s) => s.setInterimText)

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
      recognition.interimResults = true
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1

      recognition.onresult = (event) => {
        let interim = ''
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
            setInterimText('')
          } else {
            interim += result[0].transcript
          }
        }
        if (interim) {
          setInterimText(interim.trim())
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
        // If the browser aborted recognition (e.g. because an audio chime played), 
        // we must rescue any pending interim text or it will be lost forever.
        const currentInterim = useSessionStore.getState().interimText
        if (currentInterim) {
          addTranscriptSegment({
            text: currentInterim,
            timestamp: (Date.now() - sessionStartTime.current) / 1000,
            phase: phaseRef.current,
          })
          setInterimText('')
        }

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
            }, 10) // Reduced from 100ms to 10ms for faster recovery
          }
        } else {
          setIsSpeechActive(false)
        }
      }

      recognitionRef.current = recognition
      recognition.start()
      setIsSpeechActive(true)
    },
    [addTranscriptSegment, setIsSpeechActive, setInterimText]
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
