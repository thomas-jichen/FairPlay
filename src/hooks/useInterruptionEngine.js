import { useEffect, useRef } from 'react'
import useSessionStore from '../stores/useSessionStore'
import { analyzeForInterruption } from '../services/judgeService'
import { CRUELTY_CONFIG, INTERRUPTION_BUFFER_CONFIG } from '../constants/crueltyConfig'

export default function useInterruptionEngine({ enabled, crueltyLevel, onInterrupt }) {
  const bufferRef = useRef([])
  const lastCheckTimeRef = useRef(0)
  const pendingRef = useRef(false)
  const onInterruptRef = useRef(onInterrupt)
  onInterruptRef.current = onInterrupt

  useEffect(() => {
    if (!enabled) {
      bufferRef.current = []
      return
    }

    const config = CRUELTY_CONFIG[crueltyLevel]
    if (!config || config.interruptionMode === 'none') return

    const bufferConfig = INTERRUPTION_BUFFER_CONFIG[config.interruptionMode]
    if (!bufferConfig || bufferConfig.segmentsBeforeCheck === Infinity) return

    const unsubscribe = useSessionStore.subscribe((state, prevState) => {
      if (state.transcript.length <= prevState.transcript.length) return
      if (state.isInterrupted) return

      const newSegments = state.transcript.slice(prevState.transcript.length)
      for (const seg of newSegments) {
        if (seg.phase === 'pitching') {
          bufferRef.current.push(seg)
        }
      }

      const now = Date.now()
      const timeSinceLastCheck = (now - lastCheckTimeRef.current) / 1000

      if (
        bufferRef.current.length >= bufferConfig.segmentsBeforeCheck &&
        timeSinceLastCheck >= bufferConfig.minSecondsBetween &&
        !pendingRef.current
      ) {
        pendingRef.current = true
        const recentTranscript = bufferRef.current.map((s) => s.text).join(' ')

        // Pre-filter: skip LLM call if transcript lacks substantive content
        const FILLER_WORDS = new Set(['um', 'uh', 'like', 'so', 'and', 'the', 'a', 'an', 'is', 'it', 'you', 'know', 'okay', 'yeah', 'right', 'well', 'just', 'that', 'this', 'but', 'or', 'for', 'to', 'of', 'in', 'on', 'i', 'my', 'we'])
        const words = recentTranscript.trim().split(/\s+/)
        const substantiveWords = words.filter((w) => !FILLER_WORDS.has(w.toLowerCase()))
        if (substantiveWords.length < 15) {
          pendingRef.current = false
          return
        }

        const systemPrompt = useSessionStore.getState().judgeSystemPrompt
        const conversationHistory = useSessionStore.getState().conversationHistory

        if (!systemPrompt) {
          pendingRef.current = false
          return
        }

        analyzeForInterruption({
          systemPrompt,
          conversationHistory,
          recentTranscript,
          crueltyLevel,
        })
          .then((result) => {
            bufferRef.current = []
            lastCheckTimeRef.current = Date.now()
            pendingRef.current = false

            if (result.interrupt && result.question && !useSessionStore.getState().isInterrupted) {
              onInterruptRef.current(result.question)
            }
          })
          .catch((err) => {
            console.warn('Interruption analysis failed:', err)
            bufferRef.current = []
            lastCheckTimeRef.current = Date.now()
            pendingRef.current = false
          })
      }
    })

    return () => {
      unsubscribe()
      bufferRef.current = []
    }
  }, [enabled, crueltyLevel])
}
