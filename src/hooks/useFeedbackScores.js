import { useEffect, useRef } from 'react'
import useSessionStore from '../stores/useSessionStore'

const EMA_ALPHA = 0.3  // new_score = (1 - alpha) * old + alpha * raw

// Color thresholds
const GREEN_THRESHOLD = 0.65
const RED_THRESHOLD = 0.35

// WPM targets for pace scoring
const PACE_OPTIMAL_LOW = 130
const PACE_OPTIMAL_HIGH = 160
const PACE_MIN = 80
const PACE_MAX = 210

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val))
}

function getColor(score) {
  if (score >= GREEN_THRESHOLD) return 'green'
  if (score >= RED_THRESHOLD) return 'yellow'
  return 'red'
}

// Score how close WPM is to optimal range (130-160)
function paceScore(wpm) {
  if (wpm === 0) return 0.5 // no data
  if (wpm >= PACE_OPTIMAL_LOW && wpm <= PACE_OPTIMAL_HIGH) return 1
  if (wpm < PACE_OPTIMAL_LOW) {
    return clamp((wpm - PACE_MIN) / (PACE_OPTIMAL_LOW - PACE_MIN), 0, 1)
  }
  return clamp((PACE_MAX - wpm) / (PACE_MAX - PACE_OPTIMAL_HIGH), 0, 1)
}

// Volume balance — penalize both too loud and too quiet
function volumeBalanceScore(volumeScore) {
  const deviation = Math.abs(volumeScore - 0.7)
  return clamp(1 - deviation / 0.5, 0, 1)
}

export default function useFeedbackScores({
  active,
  postureScore,
  gestureScore,
  eyeContactScore,
  volumeScore,
  pitchVarianceScore,
}) {
  const prevConfidenceRef = useRef(0.5)
  const prevEngagementRef = useRef(0.5)
  const prevApproachabilityRef = useRef(0.5)
  const wpmHistoryRef = useRef([])

  const setConfidenceScore = useSessionStore((s) => s.setConfidenceScore)
  const setEngagementScore = useSessionStore((s) => s.setEngagementScore)
  const setApproachabilityScore = useSessionStore((s) => s.setApproachabilityScore)

  // Reactive: recompute composites immediately when any signal changes
  useEffect(() => {
    if (!active) return

    const currentWPM = useSessionStore.getState().currentWPM

    // Track WPM history for pace variety
    const wpmHistory = wpmHistoryRef.current
    if (currentWPM > 0) {
      wpmHistory.push(currentWPM)
      if (wpmHistory.length > 20) wpmHistory.shift()
    }

    // Pace variety: coefficient of variation of recent WPM readings
    let paceVarietyScore = 0.5
    if (wpmHistory.length >= 5) {
      const mean = wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length
      const variance = wpmHistory.reduce((sum, w) => sum + (w - mean) ** 2, 0) / wpmHistory.length
      const cv = mean > 0 ? Math.sqrt(variance) / mean : 0
      paceVarietyScore = clamp(cv / 0.1, 0, 1)
    }

    const pace = paceScore(currentWPM)
    const volBalance = volumeBalanceScore(volumeScore)

    // --- Confidence ---
    const rawConfidence =
      0.35 * volumeScore +
      0.30 * pitchVarianceScore +
      0.20 * postureScore +
      0.15 * pace

    // --- Engagement ---
    const rawEngagement =
      0.30 * pitchVarianceScore +
      0.25 * volumeScore +
      0.25 * gestureScore +
      0.20 * paceVarietyScore

    // --- Approachability ---
    const rawApproachability =
      0.35 * eyeContactScore +
      0.25 * postureScore +
      0.20 * pace +
      0.20 * volBalance

    // EMA smoothing
    const smoothedConfidence = (1 - EMA_ALPHA) * prevConfidenceRef.current + EMA_ALPHA * rawConfidence
    const smoothedEngagement = (1 - EMA_ALPHA) * prevEngagementRef.current + EMA_ALPHA * rawEngagement
    const smoothedApproachability = (1 - EMA_ALPHA) * prevApproachabilityRef.current + EMA_ALPHA * rawApproachability

    prevConfidenceRef.current = smoothedConfidence
    prevEngagementRef.current = smoothedEngagement
    prevApproachabilityRef.current = smoothedApproachability

    // Write to store
    setConfidenceScore(smoothedConfidence)
    setEngagementScore(smoothedEngagement)
    setApproachabilityScore(smoothedApproachability)
  }, [
    active,
    postureScore,
    gestureScore,
    eyeContactScore,
    volumeScore,
    pitchVarianceScore,
    setConfidenceScore,
    setEngagementScore,
    setApproachabilityScore,
  ])

  const confidenceScore = useSessionStore((s) => s.confidenceScore)
  const engagementScore = useSessionStore((s) => s.engagementScore)
  const approachabilityScore = useSessionStore((s) => s.approachabilityScore)

  return {
    confidence: { score: confidenceScore, color: getColor(confidenceScore) },
    engagement: { score: engagementScore, color: getColor(engagementScore) },
    approachability: { score: approachabilityScore, color: getColor(approachabilityScore) },
  }
}
