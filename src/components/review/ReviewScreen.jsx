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
  'Reviewing your methodology...',
  'Analyzing your Q&A responses...',
  'Evaluating presentation skills...',
  'Preparing your feedback...',
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="h-12 w-12 rounded-full border-4 border-surface-tertiary border-t-accent animate-spin" />
      <p className="text-lg text-text-secondary animate-pulse">
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
      <div className="min-h-screen bg-surface-primary">
        <LoadingState />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center">
        <div className="text-center px-8">
          <p className="text-lg font-medium text-red-400 mb-2">Evaluation Failed</p>
          <p className="text-sm text-text-muted mb-4 max-w-sm">{error}</p>
          <button
            onClick={() => {
              setError(null)
              hasStartedRef.current = false
            }}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white
                       hover:bg-accent-light transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Results
  return (
    <div className="min-h-screen bg-surface-primary pb-20">
      <ScoreHeader
        overallScore={evaluationResult.overallScore}
        trackType={evaluationResult.trackType}
        category={category}
        crueltyLevel={crueltyLevel}
      />

      <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-6">
          <RubricBreakdown rubricScores={evaluationResult.rubricScores} />
          <FeedbackCards feedback={evaluationResult.feedback} />

          {/* Judge impression */}
          <div className="rounded-lg border border-accent/20 bg-accent/5 p-6">
            <p className="text-sm font-medium text-accent mb-2">Judge's Overall Impression</p>
            <p className="text-base text-text-primary leading-relaxed italic">
              "{evaluationResult.judgeImpression}"
            </p>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          <VideoPlayer
            recordedBlob={recordedBlob}
            conversationHistory={conversationHistory}
          />
          <ConversationLog conversationHistory={conversationHistory} />
        </div>
      </div>

      <ActionBar
        evaluationResult={evaluationResult}
        recordedBlob={recordedBlob}
        category={category}
        crueltyLevel={crueltyLevel}
      />
    </div>
  )
}
