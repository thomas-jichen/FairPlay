import { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router'
import useSessionStore from '../stores/useSessionStore'
import useWebcam from '../hooks/useWebcam'
import useTimer from '../hooks/useTimer'
import useCountdown from '../hooks/useCountdown'
import useRecorder from '../hooks/useRecorder'
import useSpeechRecognition from '../hooks/useSpeechRecognition'
import useSpeechPace from '../hooks/useSpeechPace'
import { PHASES } from '../constants/phases'
import WebcamFeed from '../components/pitch/WebcamFeed'
import TopBar from '../components/pitch/TopBar'
import CountdownOverlay from '../components/pitch/CountdownOverlay'
import TranscriptOverlay from '../components/pitch/TranscriptOverlay'

export default function PitchPage() {
  const navigate = useNavigate()
  const hasStartedCountdown = useRef(false)

  const pitchDuration = useSessionStore((s) => s.pitchDuration)
  const qaDuration = useSessionStore((s) => s.qaDuration)
  const category = useSessionStore((s) => s.category)
  const currentPhase = useSessionStore((s) => s.currentPhase)
  const setPhase = useSessionStore((s) => s.setPhase)
  const resetSession = useSessionStore((s) => s.resetSession)
  const transcript = useSessionStore((s) => s.transcript)
  const currentWPM = useSessionStore((s) => s.currentWPM)

  // Redirect if no category selected
  useEffect(() => {
    if (!category) {
      navigate('/', { replace: true })
    }
  }, [category, navigate])

  const webcam = useWebcam()
  const recorder = useRecorder(webcam.streamRef)
  const speech = useSpeechRecognition()

  const isPaceActive = currentPhase === PHASES.PITCHING || currentPhase === PHASES.QA
  useSpeechPace(isPaceActive)

  const timerDuration =
    currentPhase === PHASES.PITCHING ? pitchDuration * 60
    : currentPhase === PHASES.QA ? qaDuration * 60
    : 0

  const timer = useTimer(timerDuration)
  const countdown = useCountdown(3)

  // Start 3-2-1 countdown when camera is ready
  useEffect(() => {
    if (webcam.isActive && currentPhase === PHASES.SETUP && !hasStartedCountdown.current) {
      hasStartedCountdown.current = true
      setPhase(PHASES.COUNTDOWN)
      countdown.start()
    }
  }, [webcam.isActive, currentPhase, setPhase, countdown])

  // When countdown finishes, begin pitching + start recording/speech
  useEffect(() => {
    if (countdown.isDone && currentPhase === PHASES.COUNTDOWN) {
      setPhase(PHASES.PITCHING)
      timer.reset(pitchDuration * 60)
      setTimeout(() => timer.start(), 50)

      recorder.startRecording()
      speech.startListening('pitching')
    }
  }, [countdown.isDone, currentPhase, setPhase, timer, pitchDuration, recorder, speech])

  const handleNextPhase = useCallback(() => {
    if (currentPhase === PHASES.PITCHING) {
      timer.pause()
      setPhase(PHASES.QA)
      timer.reset(qaDuration * 60)
      setTimeout(() => timer.start(), 50)

      speech.setPhase('qa')
    } else if (currentPhase === PHASES.QA) {
      timer.pause()
      setPhase(PHASES.REVIEW)

      recorder.stopRecording()
      speech.stopListening()
    }
  }, [currentPhase, qaDuration, timer, setPhase, recorder, speech])

  const handleEndSession = useCallback(() => {
    webcam.stopCamera()
    recorder.stopRecording()
    speech.stopListening()
    resetSession()
    navigate('/')
  }, [webcam, recorder, speech, resetSession, navigate])

  if (!category) return null

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <WebcamFeed
        videoRef={webcam.videoRef}
        isActive={webcam.isActive}
        error={webcam.error}
        onRequestCamera={webcam.startCamera}
      />

      <CountdownOverlay count={countdown.count} />

      <TopBar
        currentPhase={currentPhase}
        timerFormatted={timer.formatted}
        isOvertime={timer.isOvertime}
        wpm={currentWPM}
        onNextPhase={handleNextPhase}
        onEndSession={handleEndSession}
      />

      {isPaceActive && (
        <TranscriptOverlay transcript={transcript} />
      )}

      {!speech.isSupported && currentPhase === PHASES.SETUP && (
        <div className="absolute bottom-6 left-6 z-20 rounded-lg bg-yellow-500/10 border border-yellow-500/30
                        px-4 py-2 text-sm text-yellow-400">
          Speech recognition is not supported in this browser. Transcript and pace tracking will be unavailable.
        </div>
      )}
    </div>
  )
}
