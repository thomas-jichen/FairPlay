import { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router'
import useSessionStore from '../stores/useSessionStore'
import useWebcam from '../hooks/useWebcam'
import useTimer from '../hooks/useTimer'
import useCountdown from '../hooks/useCountdown'
import useRecorder from '../hooks/useRecorder'
import useSpeechRecognition from '../hooks/useSpeechRecognition'
import useSpeechPace from '../hooks/useSpeechPace'
import usePostureDetection from '../hooks/usePostureDetection'
import useToneAnalysis from '../hooks/useToneAnalysis'
import useFeedbackScores from '../hooks/useFeedbackScores'
import useChime from '../hooks/useChime'
import useInterruptionEngine from '../hooks/useInterruptionEngine'
import useQAEngine from '../hooks/useQAEngine'
import useAnswerDetection from '../hooks/useAnswerDetection'
import { PHASES } from '../constants/phases'
import { CRUELTY_CONFIG } from '../constants/crueltyConfig'
import { getRubricType } from '../constants/rubrics'
import { buildSystemPrompt } from '../constants/judgePrompt'
import { summarizeJudgeContext } from '../services/judgeService'
import WebcamFeed from '../components/pitch/WebcamFeed'
import TopBar from '../components/pitch/TopBar'
import CountdownOverlay from '../components/pitch/CountdownOverlay'
import TranscriptOverlay from '../components/pitch/TranscriptOverlay'
import JudgeQuestionBar from '../components/pitch/JudgeQuestionBar'
import PosterThumbnail from '../components/pitch/PosterThumbnail'
import ReviewScreen from '../components/review/ReviewScreen'

export default function PitchPage() {
  const navigate = useNavigate()
  const hasStartedCountdown = useRef(false)

  const pitchDuration = useSessionStore((s) => s.pitchDuration)
  const category = useSessionStore((s) => s.category)
  const currentPhase = useSessionStore((s) => s.currentPhase)
  const setPhase = useSessionStore((s) => s.setPhase)
  const resetSession = useSessionStore((s) => s.resetSession)
  const transcript = useSessionStore((s) => s.transcript)
  const currentWPM = useSessionStore((s) => s.currentWPM)
  const crueltyLevel = useSessionStore((s) => s.crueltyLevel)
  const interruptDuringPitch = useSessionStore((s) => s.interruptDuringPitch)
  const isInterrupted = useSessionStore((s) => s.isInterrupted)
  const currentJudgeQuestion = useSessionStore((s) => s.currentJudgeQuestion)
  const uploadedFile = useSessionStore((s) => s.uploadedFile)

  const qaDuration = CRUELTY_CONFIG[crueltyLevel].qaDurationMinutes

  // Redirect if no category selected
  useEffect(() => {
    if (!category) {
      navigate('/', { replace: true })
    }
  }, [category, navigate])

  const webcam = useWebcam()
  const recorder = useRecorder(webcam.streamRef)
  const speech = useSpeechRecognition()
  const chime = useChime()

  const isPaceActive = (currentPhase === PHASES.PITCHING || currentPhase === PHASES.QA) && !isInterrupted
  useSpeechPace(isPaceActive)

  // Phase 4: Real-time feedback
  const posture = usePostureDetection(webcam.videoRef, isPaceActive)
  const tone = useToneAnalysis(webcam.streamRef, isPaceActive)
  const feedbackScores = useFeedbackScores({
    active: isPaceActive,
    postureScore: posture.postureScore,
    gestureScore: posture.gestureScore,
    eyeContactScore: posture.eyeContactScore,
    volumeScore: tone.volumeScore,
    pitchVarianceScore: tone.pitchVarianceScore,
  })

  const timerDuration =
    currentPhase === PHASES.PITCHING ? pitchDuration * 60
      : currentPhase === PHASES.QA ? qaDuration * 60
        : 0

  const timer = useTimer(timerDuration)
  const countdown = useCountdown(3)

  // Build system prompt when entering countdown (with context summarization)
  useEffect(() => {
    if (currentPhase === PHASES.COUNTDOWN && !useSessionStore.getState().judgeSystemPrompt) {
      const store = useSessionStore.getState()

      const buildPrompt = async () => {
        let contextSummary = null

        if (store.abstractText || store.posterText) {
          try {
            contextSummary = await summarizeJudgeContext({
              abstractText: store.abstractText,
              posterText: store.posterText,
            })
            store.setContextSummary(contextSummary)
          } catch (err) {
            console.warn('Context summarization failed, using raw text:', err)
          }
        }

        const prompt = buildSystemPrompt({
          category: store.category,
          abstractText: store.abstractText,
          posterText: store.posterText,
          crueltyLevel: store.crueltyLevel,
          rubricType: getRubricType(store.category),
          contextSummary,
        })
        store.setJudgeSystemPrompt(prompt)
      }

      buildPrompt()
    }
  }, [currentPhase])

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

  // Q&A engine
  const qaEngine = useQAEngine({
    active: currentPhase === PHASES.QA,
    onQuestion: (question, type, questionNumber) => {
      const store = useSessionStore.getState()
      store.setCurrentJudgeQuestion({ text: question.text, type, questionNumber })
      store.addConversationMessage({
        role: 'judge',
        text: question.text,
        timestamp: Date.now(),
        phase: 'qa',
      })
    },
    onComplete: () => {
      handleNextPhase()
    },
    chime,
  })

  // Track overtime for Q&A soft cutoff
  useEffect(() => {
    if (currentPhase === PHASES.QA && timer.isOvertime) {
      qaEngine.setOvertime()
    }
  }, [currentPhase, timer.isOvertime, qaEngine])

  // Interruption engine
  useInterruptionEngine({
    enabled: currentPhase === PHASES.PITCHING && interruptDuringPitch && !isInterrupted,
    crueltyLevel,
    onInterrupt: (question) => {
      timer.pause()
      chime.playChime()
      const store = useSessionStore.getState()
      store.setIsInterrupted(true)
      store.setCurrentJudgeQuestion({ text: question, type: 'interruption' })
      store.addConversationMessage({
        role: 'judge',
        text: question,
        timestamp: Date.now(),
        phase: 'pitching',
      })
    },
  })

  // Answer detection — active during interruptions or Q&A with active question
  const answerDetectionActive =
    isInterrupted ||
    (currentPhase === PHASES.QA &&
      currentJudgeQuestion !== null &&
      currentJudgeQuestion.type !== 'opener' &&
      currentJudgeQuestion.type !== 'closing')

  useAnswerDetection({
    active: answerDetectionActive,
    onAnswerComplete: (answerText) => {
      if (isInterrupted) {
        // Resume pitch after interruption
        const store = useSessionStore.getState()
        store.addConversationMessage({
          role: 'student',
          text: answerText,
          timestamp: Date.now(),
          phase: 'pitching',
        })
        store.setIsInterrupted(false)
        store.setCurrentJudgeQuestion(null)
        timer.start()
      } else if (currentPhase === PHASES.QA) {
        qaEngine.handleAnswerComplete(answerText)
      }
    },
  })

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
      webcam.stopCamera()
      useSessionStore.getState().setCurrentJudgeQuestion(null)
    }
  }, [currentPhase, qaDuration, timer, setPhase, recorder, speech, webcam])

  const handleEndSession = useCallback(() => {
    webcam.stopCamera()
    recorder.stopRecording()
    speech.stopListening()
    resetSession()
    navigate('/')
  }, [webcam, recorder, speech, resetSession, navigate])

  if (!category) return null

  if (currentPhase === PHASES.REVIEW) {
    return (
      <div className="animate-fade-in bg-surface-primary min-h-screen">
        <ReviewScreen />
      </div>
    )
  }

  const showPitchOrQA = currentPhase === PHASES.PITCHING || currentPhase === PHASES.QA

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black animate-fade-in font-sans">
      <WebcamFeed
        videoRef={webcam.videoRef}
        isActive={webcam.isActive}
        error={webcam.error}
        onRequestCamera={webcam.startCamera}
      />

      {/* Floating UI Overlays layer */}
      <div className="absolute inset-0 pointer-events-none p-4 md:p-6 flex flex-col justify-between z-10">

        {/* Top layer: TopBar */}
        <div className="w-full max-w-7xl mx-auto flex justify-center pointer-events-auto">
          <TopBar
            currentPhase={currentPhase}
            timerFormatted={timer.formatted}
            isOvertime={timer.isOvertime}
            isInterrupted={isInterrupted}
            wpm={currentWPM}
            feedbackScores={feedbackScores}
            onNextPhase={handleNextPhase}
            onEndSession={handleEndSession}
          />
        </div>

        {/* Center layer: Countdown */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <CountdownOverlay count={countdown.count} />
        </div>

        {/* Notifications Layer (Top Middle) */}
        <div className="absolute top-28 left-0 right-0 flex justify-center pointer-events-none z-20 px-4">
          {currentJudgeQuestion && (
            <div className="w-full max-w-3xl pointer-events-auto origin-top" style={{ animation: 'slide-down-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
              <JudgeQuestionBar
                question={currentJudgeQuestion.text}
                type={currentJudgeQuestion.type}
                questionNumber={currentJudgeQuestion.questionNumber || 0}
                isVisible={true}
                isListening={answerDetectionActive}
              />
            </div>
          )}
        </div>

        {/* Bottom layer: Transcript and Poster */}
        <div className="w-full max-w-7xl mx-auto flex justify-between items-end gap-6 pointer-events-none">
          {/* Bottom Left: Poster */}
          <div className="pointer-events-auto">
            {uploadedFile && showPitchOrQA && (
              <PosterThumbnail uploadedFile={uploadedFile} />
            )}
          </div>

          {/* Bottom Center: Transcript */}
          <div className="flex-1 flex justify-center pb-4 max-w-3xl pointer-events-auto">
            {showPitchOrQA && (
              <TranscriptOverlay transcript={transcript} />
            )}
          </div>

          {/* Spacer for right-alignment balance */}
          <div className="w-[180px] hidden md:block"></div>
        </div>

      </div>

      {!speech.isSupported && currentPhase === PHASES.SETUP && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 glass-pill px-6 py-3 border-yellow-500/30">
          <p className="text-sm font-medium text-yellow-400">
            Speech recognition is not supported in this browser. Transcript and pace tracking will be unavailable.
          </p>
        </div>
      )}
    </div>
  )
}
