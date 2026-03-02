import { create } from 'zustand'
import { PHASES } from '../constants/phases'

const useSessionStore = create((set) => ({
  // Settings
  pitchDuration: 3,
  qaDuration: 3,
  category: null,
  uploadedFile: null,
  interruptDuringPitch: false,
  crueltyLevel: 3,

  // Runtime state
  currentPhase: PHASES.SETUP,
  transcript: [],
  currentWPM: 0,
  recordedBlob: null,
  isRecording: false,
  isSpeechActive: false,

  // Settings actions
  setPitchDuration: (minutes) => set({ pitchDuration: minutes }),
  setQaDuration: (minutes) => set({ qaDuration: minutes }),
  setCategory: (category) => set({ category }),
  setUploadedFile: (fileData) => set({ uploadedFile: fileData }),
  setInterruptDuringPitch: (enabled) => set({ interruptDuringPitch: enabled }),
  setCrueltyLevel: (level) => set({ crueltyLevel: level }),

  // Runtime actions
  setPhase: (phase) => set({ currentPhase: phase }),
  addTranscriptSegment: (segment) =>
    set((state) => ({ transcript: [...state.transcript, segment] })),
  setCurrentWPM: (wpm) => set({ currentWPM: wpm }),
  setRecordedBlob: (blob) => set({ recordedBlob: blob }),
  setIsRecording: (val) => set({ isRecording: val }),
  setIsSpeechActive: (val) => set({ isSpeechActive: val }),

  // Reset runtime state (settings are preserved)
  resetSession: () => set({
    currentPhase: PHASES.SETUP,
    transcript: [],
    currentWPM: 0,
    recordedBlob: null,
    isRecording: false,
    isSpeechActive: false,
  }),
}))

export default useSessionStore
