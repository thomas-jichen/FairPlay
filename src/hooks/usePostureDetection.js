import { useEffect, useRef, useState, useCallback } from 'react'
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

const TARGET_FPS = 8
const FRAME_INTERVAL_MS = 1000 / TARGET_FPS // ~125ms

// MediaPipe Pose landmark indices
const NOSE = 0
const LEFT_SHOULDER = 11
const RIGHT_SHOULDER = 12
const LEFT_ELBOW = 13
const RIGHT_ELBOW = 14
const LEFT_WRIST = 15
const RIGHT_WRIST = 16
const LEFT_HIP = 23
const RIGHT_HIP = 24

// Thresholds
const SHOULDER_LEVEL_THRESHOLD = 0.06  // max y-diff before penalizing
const CENTER_THRESHOLD = 0.25          // max nose.x deviation from 0.5
const FIDGET_THRESHOLD = 0.03          // per-landmark displacement threshold
const FIDGET_LANDMARK_COUNT = 6        // how many landmarks to track for fidget

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val))
}

function landmarkScore(landmarks) {
  if (!landmarks || landmarks.length === 0) {
    return { postureScore: 0, gestureScore: 0, eyeContactScore: 0 }
  }

  const nose = landmarks[NOSE]
  const lShoulder = landmarks[LEFT_SHOULDER]
  const rShoulder = landmarks[RIGHT_SHOULDER]
  const lWrist = landmarks[LEFT_WRIST]
  const rWrist = landmarks[RIGHT_WRIST]
  const lHip = landmarks[LEFT_HIP]
  const rHip = landmarks[RIGHT_HIP]

  // --- Shoulder level (are shoulders even?) ---
  const shoulderYDiff = Math.abs(lShoulder.y - rShoulder.y)
  const shoulderLevel = 1 - clamp(shoulderYDiff / SHOULDER_LEVEL_THRESHOLD, 0, 1)

  // --- Centered in frame ---
  const noseXDev = Math.abs(nose.x - 0.5)
  const centered = 1 - clamp(noseXDev / CENTER_THRESHOLD, 0, 1)

  // --- Torso facing camera (both shoulders visible and roughly equidistant) ---
  const shoulderMidX = (lShoulder.x + rShoulder.x) / 2
  const shoulderSpread = Math.abs(lShoulder.x - rShoulder.x)
  // If shoulders are too close together, person is turned sideways
  const facingCamera = clamp(shoulderSpread / 0.25, 0, 1)

  // --- Posture composite ---
  const postureScore = shoulderLevel * 0.4 + centered * 0.3 + facingCamera * 0.3

  // --- Eye contact (face oriented toward camera) ---
  const shoulderMidY = (lShoulder.y + rShoulder.y) / 2
  const headAboveShoulders = nose.y < shoulderMidY ? 1 : 0.3 // head should be above shoulders
  const faceCentered = 1 - clamp(Math.abs(nose.x - 0.5) / 0.2, 0, 1)
  const eyeContactScore = headAboveShoulders * 0.5 + faceCentered * 0.5

  // --- Gesture detection ---
  // Good: wrists visible and moving, below shoulder level but above hip
  // Bad: wrists not detected (visibility < 0.5), or arms crossed
  const lWristVisible = lWrist.visibility > 0.5
  const rWristVisible = rWrist.visibility > 0.5

  let gestureScore = 0.3 // base — no hands visible = not great

  if (lWristVisible || rWristVisible) {
    gestureScore = 0.5 // at least one hand visible

    // Check if hands are in "gesturing zone" (between hip and shoulder height)
    const hipY = (lHip.y + rHip.y) / 2
    const shoulderY = shoulderMidY

    const checkGesturing = (wrist, visible) => {
      if (!visible) return 0
      // Wrist between shoulder and hip = good gesture zone
      if (wrist.y > shoulderY && wrist.y < hipY) return 1
      // Wrist above shoulders = emphatic gesture (still good)
      if (wrist.y <= shoulderY) return 0.7
      // Below hips = resting
      return 0.2
    }

    const lGesture = checkGesturing(lWrist, lWristVisible)
    const rGesture = checkGesturing(rWrist, rWristVisible)
    gestureScore = Math.max(lGesture, rGesture)

    // Crossed arms penalty: both wrists visible and close together horizontally
    if (lWristVisible && rWristVisible) {
      const wristXDiff = Math.abs(lWrist.x - rWrist.x)
      if (wristXDiff < 0.08 && lWrist.y > shoulderY) {
        gestureScore *= 0.5 // likely crossed arms
      }
    }
  }

  return { postureScore, gestureScore, eyeContactScore }
}

function computeFidgetScore(currentLandmarks, previousLandmarks) {
  if (!previousLandmarks || !currentLandmarks) return 1 // no data = assume still

  const trackIndices = [NOSE, LEFT_SHOULDER, RIGHT_SHOULDER, LEFT_ELBOW, RIGHT_ELBOW, LEFT_HIP]
  let totalDisplacement = 0

  for (const idx of trackIndices) {
    const curr = currentLandmarks[idx]
    const prev = previousLandmarks[idx]
    const dx = curr.x - prev.x
    const dy = curr.y - prev.y
    totalDisplacement += Math.sqrt(dx * dx + dy * dy)
  }

  const avgDisplacement = totalDisplacement / trackIndices.length
  // Low displacement = good (score 1), high displacement = fidgeting (score 0)
  return 1 - clamp(avgDisplacement / FIDGET_THRESHOLD, 0, 1)
}

export default function usePostureDetection(videoRef, active) {
  const landmarkerRef = useRef(null)
  const rafRef = useRef(null)
  const lastFrameTimeRef = useRef(0)
  const prevLandmarksRef = useRef(null)
  const initializingRef = useRef(false)

  const [postureScore, setPostureScore] = useState(0.5)
  const [gestureScore, setGestureScore] = useState(0.5)
  const [eyeContactScore, setEyeContactScore] = useState(0.5)
  const [isReady, setIsReady] = useState(false)

  const cleanup = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (landmarkerRef.current) {
      landmarkerRef.current.close()
      landmarkerRef.current = null
    }
    prevLandmarksRef.current = null
    setIsReady(false)
  }, [])

  useEffect(() => {
    if (!active || !videoRef.current) {
      cleanup()
      return
    }

    if (initializingRef.current) return
    initializingRef.current = true

    let cancelled = false

    async function initialize() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )

        if (cancelled) return

        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        })

        if (cancelled) {
          landmarker.close()
          return
        }

        landmarkerRef.current = landmarker
        setIsReady(true)
        startDetectionLoop()
      } catch (err) {
        console.warn('MediaPipe pose detection failed to initialize:', err)
      } finally {
        initializingRef.current = false
      }
    }

    function startDetectionLoop() {
      function detect(timestamp) {
        if (cancelled || !landmarkerRef.current || !videoRef.current) return

        // Throttle to target FPS
        if (timestamp - lastFrameTimeRef.current < FRAME_INTERVAL_MS) {
          rafRef.current = requestAnimationFrame(detect)
          return
        }
        lastFrameTimeRef.current = timestamp

        const video = videoRef.current
        if (video.readyState < 2) {
          // Video not ready yet
          rafRef.current = requestAnimationFrame(detect)
          return
        }

        try {
          const result = landmarkerRef.current.detectForVideo(video, performance.now())

          if (result.landmarks && result.landmarks.length > 0) {
            const landmarks = result.landmarks[0]
            const scores = landmarkScore(landmarks)
            const fidgetScore = computeFidgetScore(landmarks, prevLandmarksRef.current)

            // Incorporate fidget into posture (steady = good)
            setPostureScore(scores.postureScore * 0.7 + fidgetScore * 0.3)
            setGestureScore(scores.gestureScore)
            setEyeContactScore(scores.eyeContactScore)

            prevLandmarksRef.current = landmarks.map((l) => ({ ...l }))
          }
        } catch (err) {
          // Silently continue — occasional frame failures are expected
        }

        rafRef.current = requestAnimationFrame(detect)
      }

      rafRef.current = requestAnimationFrame(detect)
    }

    initialize()

    return () => {
      cancelled = true
      cleanup()
      initializingRef.current = false
    }
  }, [active, videoRef, cleanup])

  return { postureScore, gestureScore, eyeContactScore, isReady }
}
