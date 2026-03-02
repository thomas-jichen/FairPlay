import { useEffect, useRef, useCallback } from 'react'
import useSessionStore from '../stores/useSessionStore'
import { generateQAOpener, generateQAQuestion, generateClosingRemark } from '../services/judgeService'

const BETWEEN_QUESTION_PAUSE = 3500
const FINAL_QUESTION = 'One last question: is there anything about your project that you wish you had done differently, or would change if you could start over?'

export default function useQAEngine({ active, onQuestion, onComplete, chime }) {
  const hasStartedRef = useRef(false)
  const isProcessingRef = useRef(false)
  const overtimeStartRef = useRef(null)
  const questionCountRef = useRef(0)
  const askedFinalQuestionRef = useRef(false)
  const onQuestionRef = useRef(onQuestion)
  const onCompleteRef = useRef(onComplete)
  const chimeRef = useRef(chime)
  onQuestionRef.current = onQuestion
  onCompleteRef.current = onComplete
  chimeRef.current = chime

  const askNextQuestion = useCallback(async () => {
    if (isProcessingRef.current) return
    isProcessingRef.current = true

    const store = useSessionStore.getState()
    const systemPrompt = store.judgeSystemPrompt
    if (!systemPrompt) {
      isProcessingRef.current = false
      return
    }

    store.setIsJudgeThinking(true)

    try {
      const conversationHistory = useSessionStore.getState().conversationHistory
      const result = await generateQAQuestion({ systemPrompt, conversationHistory })

      questionCountRef.current++

      // Show acknowledgment briefly if present, then show question
      if (result.acknowledgment) {
        store.addConversationMessage({
          role: 'judge',
          text: result.acknowledgment,
          timestamp: Date.now(),
          phase: 'qa',
        })
      }

      store.setIsJudgeThinking(false)
      chimeRef.current?.playChime()
      onQuestionRef.current(
        { text: result.question, acknowledgment: result.acknowledgment },
        'qa',
        questionCountRef.current
      )
    } catch (err) {
      console.warn('Q&A question generation failed:', err)
      store.setIsJudgeThinking(false)
      isProcessingRef.current = false
    }
  }, [])

  const handleAnswerComplete = useCallback((answerText) => {
    const store = useSessionStore.getState()

    store.addConversationMessage({
      role: 'student',
      text: answerText,
      timestamp: Date.now(),
      phase: 'qa',
    })

    store.setCurrentJudgeQuestion(null)
    isProcessingRef.current = false

    // Check if overtime (soft cutoff)
    if (overtimeStartRef.current) {
      // If we haven't asked the final question yet, ask it
      if (!askedFinalQuestionRef.current) {
        askedFinalQuestionRef.current = true

        setTimeout(() => {
          const s = useSessionStore.getState()
          questionCountRef.current++
          chimeRef.current?.playChime()

          s.addConversationMessage({
            role: 'judge',
            text: FINAL_QUESTION,
            timestamp: Date.now(),
            phase: 'qa',
          })

          onQuestionRef.current(
            { text: FINAL_QUESTION, acknowledgment: '' },
            'qa',
            questionCountRef.current
          )
        }, BETWEEN_QUESTION_PAUSE)
        return
      }

      // Final question has been answered, now close
      const endQA = async () => {
        const systemPrompt = useSessionStore.getState().judgeSystemPrompt
        if (systemPrompt) {
          try {
            const closing = await generateClosingRemark({
              systemPrompt,
              conversationHistory: useSessionStore.getState().conversationHistory,
            })
            store.addConversationMessage({
              role: 'judge',
              text: closing,
              timestamp: Date.now(),
              phase: 'qa',
            })
            store.setCurrentJudgeQuestion({ text: closing, type: 'closing' })
            setTimeout(() => {
              store.setCurrentJudgeQuestion(null)
              onCompleteRef.current()
            }, 3000)
          } catch {
            onCompleteRef.current()
          }
        } else {
          onCompleteRef.current()
        }
      }
      endQA()
      return
    }

    // Ask next question after a pause
    setTimeout(() => askNextQuestion(), BETWEEN_QUESTION_PAUSE)
  }, [askNextQuestion])

  // Start Q&A when activated
  useEffect(() => {
    if (!active || hasStartedRef.current) return
    hasStartedRef.current = true
    questionCountRef.current = 0
    overtimeStartRef.current = null
    isProcessingRef.current = false
    askedFinalQuestionRef.current = false

    const startQA = async () => {
      const store = useSessionStore.getState()
      const systemPrompt = store.judgeSystemPrompt
      if (!systemPrompt) return

      store.setIsJudgeThinking(true)

      try {
        const conversationHistory = store.conversationHistory
        const opener = await generateQAOpener({ systemPrompt, conversationHistory })

        store.addConversationMessage({
          role: 'judge',
          text: opener,
          timestamp: Date.now(),
          phase: 'qa',
        })

        store.setIsJudgeThinking(false)
        store.setCurrentJudgeQuestion({ text: opener, type: 'opener' })

        // Show opener briefly, then ask first question
        setTimeout(() => {
          store.setCurrentJudgeQuestion(null)
          askNextQuestion()
        }, 3000)
      } catch (err) {
        console.warn('Q&A opener failed:', err)
        store.setIsJudgeThinking(false)
        askNextQuestion()
      }
    }

    startQA()

    return () => {
      // Cleanup on unmount
    }
  }, [active, askNextQuestion])

  // Reset when deactivated
  useEffect(() => {
    if (!active) {
      hasStartedRef.current = false
      isProcessingRef.current = false
      overtimeStartRef.current = null
      questionCountRef.current = 0
      askedFinalQuestionRef.current = false
    }
  }, [active])

  // Track overtime for soft cutoff
  const setOvertime = useCallback(() => {
    if (!overtimeStartRef.current) {
      overtimeStartRef.current = Date.now()
    }

    // Hard cutoff: 60s past overtime
    const elapsed = Date.now() - overtimeStartRef.current
    if (elapsed > 60000) {
      onCompleteRef.current()
    }
  }, [])

  return { handleAnswerComplete, setOvertime }
}
