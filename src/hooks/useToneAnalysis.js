import { useEffect, useRef, useState, useCallback } from 'react'

const ANALYSIS_INTERVAL_MS = 200
const FFT_SIZE = 2048
const PITCH_HISTORY_SIZE = 10

// Volume normalization — RMS thresholds
const RMS_FLOOR = 0.01   // below this = silence
const RMS_MUMBLE = 0.03  // below this = mumbling
const RMS_PROJECT = 0.15 // above this = projecting well
const RMS_LOUD = 0.30    // above this = too loud

// Pitch detection range (human speech)
const MIN_PITCH_HZ = 80
const MAX_PITCH_HZ = 400

function computeRMS(timeDomainData) {
  let sum = 0
  for (let i = 0; i < timeDomainData.length; i++) {
    // Data is 0-255 centered at 128
    const sample = (timeDomainData[i] - 128) / 128
    sum += sample * sample
  }
  return Math.sqrt(sum / timeDomainData.length)
}

function normalizeVolume(rms) {
  if (rms < RMS_FLOOR) return 0
  if (rms >= RMS_PROJECT) return 1
  // Linear interpolation from mumble to projecting
  return Math.min(1, Math.max(0, (rms - RMS_MUMBLE) / (RMS_PROJECT - RMS_MUMBLE)))
}

// Autocorrelation-based pitch detection
function detectPitch(timeDomainData, sampleRate) {
  const bufferLength = timeDomainData.length
  // Convert from unsigned byte to float
  const floatData = new Float32Array(bufferLength)
  for (let i = 0; i < bufferLength; i++) {
    floatData[i] = (timeDomainData[i] - 128) / 128
  }

  // Check if there's enough signal
  let rms = 0
  for (let i = 0; i < bufferLength; i++) rms += floatData[i] * floatData[i]
  rms = Math.sqrt(rms / bufferLength)
  if (rms < 0.01) return null // too quiet to detect pitch

  // Autocorrelation
  const minLag = Math.floor(sampleRate / MAX_PITCH_HZ)
  const maxLag = Math.floor(sampleRate / MIN_PITCH_HZ)

  let bestCorrelation = 0
  let bestLag = -1

  for (let lag = minLag; lag <= maxLag && lag < bufferLength; lag++) {
    let correlation = 0
    for (let i = 0; i < bufferLength - lag; i++) {
      correlation += floatData[i] * floatData[i + lag]
    }
    correlation /= (bufferLength - lag)

    if (correlation > bestCorrelation) {
      bestCorrelation = correlation
      bestLag = lag
    }
  }

  if (bestLag === -1 || bestCorrelation < 0.01) return null
  return sampleRate / bestLag
}

function computePitchVarianceScore(pitchHistory) {
  if (pitchHistory.length < 3) return 0.5 // not enough data yet

  const mean = pitchHistory.reduce((a, b) => a + b, 0) / pitchHistory.length
  const variance = pitchHistory.reduce((sum, p) => sum + (p - mean) ** 2, 0) / pitchHistory.length
  const cv = Math.sqrt(variance) / mean // coefficient of variation

  // cv of 0 = perfectly monotone (bad), cv of 0.15+ = dynamic (good)
  // Map: cv 0 → 0, cv 0.05 → 0.3, cv 0.10 → 0.6, cv 0.15+ → 1.0
  return Math.min(1, cv / 0.15)
}

export default function useToneAnalysis(streamRef, active) {
  const audioContextRef = useRef(null)
  const sourceRef = useRef(null)
  const analyserRef = useRef(null)
  const intervalRef = useRef(null)
  const pitchHistoryRef = useRef([])

  const [volumeScore, setVolumeScore] = useState(0.5)
  const [pitchVarianceScore, setPitchVarianceScore] = useState(0.5)
  const [rawRMS, setRawRMS] = useState(0)

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
    pitchHistoryRef.current = []
  }, [])

  useEffect(() => {
    if (!active || !streamRef.current) {
      cleanup()
      return
    }

    const stream = streamRef.current

    // Check if audio track exists
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
      // Don't connect to destination — we only want to analyze, not play back

      const timeDomainData = new Uint8Array(analyser.fftSize)

      intervalRef.current = setInterval(() => {
        if (!analyserRef.current) return

        analyserRef.current.getByteTimeDomainData(timeDomainData)

        // Volume
        const rms = computeRMS(timeDomainData)
        setRawRMS(rms)
        setVolumeScore(normalizeVolume(rms))

        // Pitch
        const pitch = detectPitch(timeDomainData, audioContext.sampleRate)
        if (pitch !== null) {
          const history = pitchHistoryRef.current
          history.push(pitch)
          if (history.length > PITCH_HISTORY_SIZE) history.shift()
          setPitchVarianceScore(computePitchVarianceScore(history))
        }
      }, ANALYSIS_INTERVAL_MS)
    } catch (err) {
      console.warn('Tone analysis setup failed:', err)
    }

    return cleanup
  }, [active, streamRef, cleanup])

  return { volumeScore, pitchVarianceScore, rawRMS }
}
