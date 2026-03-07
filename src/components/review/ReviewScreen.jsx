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
        <div className="relative h-12 w-12 rounded-full border-4 border-black/5 border-t-black animate-spin" />
      </div>
      <p className="type-body text-base text-text-secondary animate-pulse">
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
      <div className="min-h-screen pt-20">
        <LoadingState />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel text-center p-10 max-w-md rounded-[32px]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-6 border border-white/50">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-text-primary mb-2 tracking-tight">Evaluation Failed</p>
          <p className="type-body text-sm text-text-secondary leading-relaxed mb-8">{error}</p>
          <button
            onClick={() => {
              setError(null)
              hasStartedRef.current = false
            }}
            className="w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-md
                       transition-all hover:bg-black/80 hover:scale-[1.02] active:scale-[0.98]"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    )
  }

  // Results
  return (
    <div className="min-h-screen pb-32">
      <div className="relative z-10 pt-10 px-6 lg:px-8 max-w-7xl mx-auto animate-[slide-up_0.6s_ease-out_both]">
        <ScoreHeader
          overallScore={evaluationResult.overallScore}
          trackType={evaluationResult.trackType}
          category={category}
          crueltyLevel={crueltyLevel}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
        {/* Left column */}
        <div className="lg:col-span-7 space-y-8 animate-[slide-up_0.8s_ease-out_both]" style={{ animationDelay: '0.1s' }}>
          <RubricBreakdown rubricScores={evaluationResult.rubricScores} />

          <div className="animate-[slide-up_0.8s_ease-out_both]" style={{ animationDelay: '0.2s' }}>
            <FeedbackCards feedback={evaluationResult.feedback} />
          </div>

          {/* Judge impression */}
          <div className="glass-panel rounded-3xl p-8 space-y-6 relative overflow-hidden animate-[slide-up_0.8s_ease-out_both]" style={{ animationDelay: '0.3s' }}>
            <div className="border-b border-black/[0.05] pb-4">
              <h2 className="text-lg font-medium tracking-tight text-text-primary">System Verdict</h2>
            </div>

            <div className="relative z-10 field-justification">
              <p className="type-body text-base text-text-secondary leading-relaxed">
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
            <ConversationLog conversationHistory={conversationHistory} transcript={transcript} />
          </div>
        </div>
      </div>

      <div className="pb-32 pt-16 animate-[slide-up_0.8s_ease-out_both]" style={{ animationDelay: '0.6s' }}>
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
