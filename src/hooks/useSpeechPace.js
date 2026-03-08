import { useEffect, useRef, useCallback } from 'react'
import useSessionStore from '../stores/useSessionStore'
import { PaceAnalyzer } from './pace-analyzer'

// Frequency for processing RMS (appx 60fps)
const ANALYSIS_INTERVAL_MS = 16
const FFT_SIZE = 256

function computeRMS(timeDomainData) {
  let sum = 0
  for (let i = 0; i < timeDomainData.length; i++) {
    const sample = (timeDomainData[i] - 128) / 128
    sum += sample * sample
  }
  return Math.sqrt(sum / timeDomainData.length)
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export default function useSpeechPace(streamRef, isActive) {
  const setCurrentWPM = useSessionStore((s) => s.setCurrentWPM)
  
  const audioContextRef = useRef(null)
  const sourceRef = useRef(null)
  const analyserRef = useRef(null)
  const intervalRef = useRef(null)
  
  const paceAnalyzerRef = useRef(new PaceAnalyzer())
  const displayedScoreRef = useRef(-1)
  const lastDisplayUpdateMsRef = useRef(null)

  const smoothPaceScore = useCallback((targetScore, nowMs) => {
    const target = clamp(targetScore, -1, 1)

    if (lastDisplayUpdateMsRef.current == null) {
      displayedScoreRef.current = target
      lastDisplayUpdateMsRef.current = nowMs
      return displayedScoreRef.current
    }

    const deltaMs = Math.max(1, nowMs - lastDisplayUpdateMsRef.current)
    const movingDown = target < displayedScoreRef.current
    const tauMs = movingDown ? 980 : 650
    const alpha = 1 - Math.exp(-deltaMs / tauMs)
    const maxStepPerSecond = movingDown ? 0.6 : 0.9
    const maxStep = (maxStepPerSecond * deltaMs) / 1000

    const next = displayedScoreRef.current + alpha * (target - displayedScoreRef.current)
    const step = clamp(next - displayedScoreRef.current, -maxStep, maxStep)

    displayedScoreRef.current += step
    lastDisplayUpdateMsRef.current = nowMs
    return displayedScoreRef.current
  }, [])

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect()
      sourceRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    analyserRef.current = null
    
    // Reset state
    paceAnalyzerRef.current.reset()
    displayedScoreRef.current = -1
    lastDisplayUpdateMsRef.current = null
  }, [])

  useEffect(() => {
    if (!isActive || !streamRef?.current) {
      cleanup()
      setCurrentWPM(0)
      return
    }

    const stream = streamRef.current
    const audioTracks = stream.getAudioTracks()
    if (audioTracks.length === 0) return

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      audioContextRef.current = audioContext

      const source = audioContext.createMediaStreamSource(stream)
      sourceRef.current = source

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = FFT_SIZE
      analyser.smoothingTimeConstant = 0.3
      analyserRef.current = analyser

      source.connect(analyser)

      const timeDomainData = new Uint8Array(analyser.fftSize)

      intervalRef.current = setInterval(() => {
        if (!analyserRef.current) return
        
        analyserRef.current.getByteTimeDomainData(timeDomainData)
        const rms = computeRMS(timeDomainData)
        
        const nowMs = performance.now()
        const analysis = paceAnalyzerRef.current.update(rms, nowMs)
        const smoothedScore = smoothPaceScore(analysis.score, nowMs)
        
        setCurrentWPM(smoothedScore)
      }, ANALYSIS_INTERVAL_MS)
      
    } catch (err) {
      console.warn('Pace analysis setup failed:', err)
    }

    return cleanup
  }, [isActive, streamRef, cleanup, setCurrentWPM, smoothPaceScore])
}
