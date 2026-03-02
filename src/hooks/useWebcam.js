import { useState, useEffect, useRef, useCallback } from 'react'

export default function useWebcam() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsActive(true)
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Camera and microphone access was denied. Please allow access and try again.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera or microphone found. Please connect them and try again.')
      } else if (err.name === 'NotReadableError') {
        setError('Camera or microphone is in use by another application. Please close it and try again.')
      } else {
        setError(err.message || 'Failed to access camera and microphone.')
      }
      setIsActive(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsActive(false)
  }, [])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return {
    videoRef,
    streamRef,
    isActive,
    error,
    startCamera,
    stopCamera,
  }
}
