import { useRef, useCallback } from 'react'
import useSessionStore from '../stores/useSessionStore'

export default function useRecorder(streamRef) {
  const recorderRef = useRef(null)
  const chunksRef = useRef([])

  const setRecordedBlob = useSessionStore((s) => s.setRecordedBlob)
  const setIsRecording = useSessionStore((s) => s.setIsRecording)

  const startRecording = useCallback(() => {
    if (!streamRef.current) return

    chunksRef.current = []

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : ''

    const options = mimeType ? { mimeType } : {}
    const recorder = new MediaRecorder(streamRef.current, options)

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data)
      }
    }

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || 'video/webm',
      })
      setRecordedBlob(blob)
      setIsRecording(false)
      chunksRef.current = []
    }

    recorder.onerror = (e) => {
      console.error('MediaRecorder error:', e.error)
      setIsRecording(false)
    }

    recorderRef.current = recorder
    recorder.start(1000)
    setIsRecording(true)
  }, [streamRef, setRecordedBlob, setIsRecording])

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
      recorderRef.current = null
    }
  }, [])

  return { startRecording, stopRecording }
}
