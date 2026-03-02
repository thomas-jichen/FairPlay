import { useState, useEffect, useRef } from 'react'
import useSessionStore from '../../stores/useSessionStore'
import { getRubricType } from '../../constants/rubrics'
import { buildEvaluationPrompt, buildEvaluationUserMessage } from '../../constants/evaluationPrompt'
import { generateEvaluation } from '../../services/judgeService'
import ScoreHeader from './ScoreHeader'
import RubricBreakdown from './RubricBreakdown'
import FeedbackCards from './FeedbackCards'
import VideoPlayer from './VideoPlayer'
import ConversationLog from './ConversationLog'
import ActionBar from './ActionBar'

const LOADING_MESSAGES = [
  'Processing pitch transcript...',
  'Analyzing Q&A responses...',
  'Evaluating framework confidence...',
  'Compiling AI judge feedback...',
]

function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full" />
        <div className="relative h-16 w-16 rounded-full border-4 border-white/5 border-t-accent animate-spin shadow-[0_0_20px_rgba(14,187,187,0.3)]" />
      </div>
      <p className="text-lg font-medium tracking-wide text-text-secondary animate-pulse">
        {LOADING_MESSAGES[messageIndex]}
      </p>
    </div>
  )
}

export default function ReviewScreen() {
  const evaluationResult = useSessionStore((s) => s.evaluationResult)
  const setEvaluationResult = useSessionStore((s) => s.setEvaluationResult)
  const conversationHistory = useSessionStore((s) => s.conversationHistory)
  const transcript = useSessionStore((s) => s.transcript)
  const recordedBlob = useSessionStore((s) => s.recordedBlob)
  const confidenceScore = useSessionStore((s) => s.confidenceScore)
  const engagementScore = useSessionStore((s) => s.engagementScore)
  const approachabilityScore = useSessionStore((s) => s.approachabilityScore)
  const category = useSessionStore((s) => s.category)
  const crueltyLevel = useSessionStore((s) => s.crueltyLevel)
  const abstractText = useSessionStore((s) => s.abstractText)
  const posterText = useSessionStore((s) => s.posterText)
  const contextSummary = useSessionStore((s) => s.contextSummary)

  const [error, setError] = useState(null)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    if (evaluationResult || hasStartedRef.current) return
    hasStartedRef.current = true

    async function runEvaluation() {
      try {
        const rubricType = getRubricType(category)

        const systemPrompt = buildEvaluationPrompt({
          category,
          crueltyLevel,
          rubricType,
          abstractText,
          posterText,
          contextSummary,
        })

        const userMessage = buildEvaluationUserMessage({
          transcript,
          conversationHistory,
          confidenceScore,
          engagementScore,
          approachabilityScore,
          rubricType,
        })

        const result = await generateEvaluation({ systemPrompt, userMessage })
        setEvaluationResult(result)
      } catch (err) {
        console.error('Evaluation failed:', err)
        setError(err.message || 'Failed to generate evaluation')
        hasStartedRef.current = false
      }
    }

    runEvaluation()
  }, [
    evaluationResult,
    setEvaluationResult,
    category,
    crueltyLevel,
    abstractText,
    posterText,
    contextSummary,
    transcript,
    conversationHistory,
    confidenceScore,
    engagementScore,
    approachabilityScore,
  ])

  // Loading state
  if (!evaluationResult && !error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] pt-20">
        <LoadingState />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="glass-panel text-center p-10 max-w-md rounded-2xl border-red-500/20 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-6 drop-shadow-md">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-xl font-bold text-white mb-2 tracking-wide">Evaluation Failed</p>
          <p className="text-sm text-text-secondary leading-relaxed mb-8">{error}</p>
          <button
            onClick={() => {
              setError(null)
              hasStartedRef.current = false
            }}
            className="w-full rounded-full bg-accent/90 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(14,187,187,0.3)]
                       transition-all duration-300 hover:bg-accent hover:scale-[1.02] active:scale-[0.98]"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    )
  }

  // Results
  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-32">
      {/* Dynamic ambient background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] opacity-70 mix-blend-screen animate-pulse duration-10000" />
      </div>

      <div className="relative z-10 pt-10 animate-[slide-up_0.6s_ease-out_both]">
        <ScoreHeader
          overallScore={evaluationResult.overallScore}
          trackType={evaluationResult.trackType}
          category={category}
          crueltyLevel={crueltyLevel}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left column */}
        <div className="lg:col-span-7 space-y-8 animate-[slide-up_0.8s_ease-out_both]" style={{ animationDelay: '0.1s' }}>
          <RubricBreakdown rubricScores={evaluationResult.rubricScores} />

          <div className="animate-[slide-up_0.8s_ease-out_both]" style={{ animationDelay: '0.2s' }}>
            <FeedbackCards feedback={evaluationResult.feedback} />
          </div>

          {/* Judge impression */}
          <div className="glass-panel overflow-hidden rounded-2xl relative p-8 group animate-[slide-up_0.8s_ease-out_both]" style={{ animationDelay: '0.3s' }}>
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-light opacity-80" />

            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 hidden md:flex">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold tracking-wide text-white drop-shadow-sm">System Verdict</h3>
            </div>

            <div className="relative">
              <svg className="absolute -top-3 -left-4 h-8 w-8 text-white/5 transform -scale-x-100 rotate-180" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.456-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="relative z-10 text-lg md:text-xl text-text-secondary leading-relaxed font-medium pl-6">
                {evaluationResult.judgeImpression}
              </p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-5 space-y-8 animate-[slide-up_0.8s_ease-out_both]" style={{ animationDelay: '0.4s' }}>
          <VideoPlayer
            recordedBlob={recordedBlob}
            conversationHistory={conversationHistory}
          />
          <div className="sticky top-8">
            <ConversationLog conversationHistory={conversationHistory} />
          </div>
        </div>
      </div>

      <div className="animate-[slide-up_0.8s_ease-out_both]" style={{ animationDelay: '0.6s' }}>
        <ActionBar
          evaluationResult={evaluationResult}
          recordedBlob={recordedBlob}
          category={category}
          crueltyLevel={crueltyLevel}
        />
      </div>
    </div>
  )
}
