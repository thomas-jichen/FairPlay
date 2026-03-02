import { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router'
import useSessionStore from '../stores/useSessionStore'
import useWebcam from '../hooks/useWebcam'
import useTimer from '../hooks/useTimer'
import useCountdown from '../hooks/useCountdown'
import { PHASES } from '../constants/phases'
import WebcamFeed from '../components/pitch/WebcamFeed'
import TopBar from '../components/pitch/TopBar'
import CountdownOverlay from '../components/pitch/CountdownOverlay'

export default function PitchPage() {
  const navigate = useNavigate()
  const hasStartedCountdown = useRef(false)

  const pitchDuration = useSessionStore((s) => s.pitchDuration)
  const qaDuration = useSessionStore((s) => s.qaDuration)
  const category = useSessionStore((s) => s.category)
  const currentPhase = useSessionStore((s) => s.currentPhase)
  const setPhase = useSessionStore((s) => s.setPhase)
  const resetSession = useSessionStore((s) => s.resetSession)

  // Redirect if no category selected
  useEffect(() => {
    if (!category) {
      navigate('/', { replace: true })
    }
  }, [category, navigate])

  const webcam = useWebcam()

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

  // When countdown finishes, begin pitching
  useEffect(() => {
    if (countdown.isDone && currentPhase === PHASES.COUNTDOWN) {
      setPhase(PHASES.PITCHING)
      timer.reset(pitchDuration * 60)
      setTimeout(() => timer.start(), 50)
    }
  }, [countdown.isDone, currentPhase, setPhase, timer, pitchDuration])

  const handleNextPhase = useCallback(() => {
    if (currentPhase === PHASES.PITCHING) {
      timer.pause()
      setPhase(PHASES.QA)
      timer.reset(qaDuration * 60)
      setTimeout(() => timer.start(), 50)
    } else if (currentPhase === PHASES.QA) {
      timer.pause()
      setPhase(PHASES.REVIEW)
    }
  }, [currentPhase, qaDuration, timer, setPhase])

  const handleEndSession = useCallback(() => {
    webcam.stopCamera()
    resetSession()
    navigate('/')
  }, [webcam, resetSession, navigate])

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
        onNextPhase={handleNextPhase}
        onEndSession={handleEndSession}
      />
    </div>
  )
}
