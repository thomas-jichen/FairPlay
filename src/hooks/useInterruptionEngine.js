import { useEffect, useRef } from 'react'
import useSessionStore from '../stores/useSessionStore'
import { analyzeForInterruption } from '../services/judgeService'
import { INTERRUPTION_COOLDOWNS, INTERRUPTION_RATE_CAPS } from '../constants/crueltyConfig'

const CHECK_INTERVAL_MS = 5000
const MIN_NEW_CHARS = 30
const MIN_PITCH_ELAPSED_MS = 20000

export default function useInterruptionEngine({ enabled, crueltyLevel, onInterrupt }) {
  const pendingRef = useRef(false)
  const lastCheckedLengthRef = useRef(0)
  const onInterruptRef = useRef(onInterrupt)
  onInterruptRef.current = onInterrupt

  // Rate limiting refs
  const lastInterruptTimeRef = useRef(0)
  const interruptCountRef = useRef(0)
  const engineStartTimeRef = useRef(0)

  // Record engine start time on first enable
  useEffect(() => {
    if (enabled && engineStartTimeRef.current === 0) {
      engineStartTimeRef.current = Date.now()
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(() => {
      if (pendingRef.current) return

      const state = useSessionStore.getState()
      if (state.isInterrupted) return
      if (!state.judgeSystemPrompt) return

      // Don't interrupt in the first 20 seconds of the pitch
      if (Date.now() - engineStartTimeRef.current < MIN_PITCH_ELAPSED_MS) return

      // Cooldown: skip if too soon after last interruption
      const cooldown = INTERRUPTION_COOLDOWNS[crueltyLevel] || 20000
      if (Date.now() - lastInterruptTimeRef.current < cooldown) return

      // Rate cap: skip if we've exceeded the max rate
      const rateCap = INTERRUPTION_RATE_CAPS[crueltyLevel] || 1
      const elapsedMinutes = (Date.now() - engineStartTimeRef.current) / 60000
      if (elapsedMinutes > 0 && interruptCountRef.current / elapsedMinutes >= rateCap) return

      // Build full pitch transcript from finalized segments + interim
      const finalizedText = state.transcript
        .filter((s) => s.phase === 'pitching')
        .map((s) => s.text)
        .join(' ')
      const interimText = state.interimText || ''
      const fullPitchTranscript = (finalizedText + (interimText ? ' ' + interimText : '')).trim()

      if (!fullPitchTranscript) return

      // Check if enough new content since last check
      const newChars = fullPitchTranscript.length - lastCheckedLengthRef.current
      if (newChars < MIN_NEW_CHARS) return

      const recentPortion = fullPitchTranscript.slice(lastCheckedLengthRef.current).trim()
      if (!recentPortion) return

      pendingRef.current = true

      analyzeForInterruption({
        systemPrompt: state.judgeSystemPrompt,
        conversationHistory: state.conversationHistory,
        fullPitchTranscript,
        recentPortion,
        crueltyLevel,
      })
        .then((result) => {
          lastCheckedLengthRef.current = fullPitchTranscript.length
          pendingRef.current = false

          if (result.interrupt && result.question && !useSessionStore.getState().isInterrupted) {
            lastInterruptTimeRef.current = Date.now()
            interruptCountRef.current += 1
            onInterruptRef.current(result.question)
          }
        })
        .catch((err) => {
          console.warn('Interruption analysis failed:', err)
          lastCheckedLengthRef.current = fullPitchTranscript.length
          pendingRef.current = false
        })
    }, CHECK_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [enabled, crueltyLevel])
}
