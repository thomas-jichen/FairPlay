import { create } from 'zustand'
import { PHASES } from '../constants/phases'

const useSessionStore = create((set) => ({
  // Settings (preserved across sessions)
  pitchDuration: 3,
  category: null,
  uploadedFile: null,
  interruptDuringPitch: true,
  crueltyLevel: 3,
  abstractText: '',
  scriptText: '',
  posterText: '',

  // Runtime state (reset on session end)
  currentPhase: PHASES.SETUP,
  transcript: [],
  currentWPM: 0,
  recordedBlob: null,
  isRecording: false,
  isSpeechActive: false,
  conversationHistory: [],
  isInterrupted: false,
  currentJudgeQuestion: null,
  isJudgeThinking: false,
  judgeSystemPrompt: null,
  contextSummary: null,
  confidenceScore: 0,
  engagementScore: 0,
  approachabilityScore: 0,
  evaluationResult: null,
  recordingStartTime: null,

  // Settings actions
  setPitchDuration: (minutes) => set({ pitchDuration: minutes }),
  setCategory: (category) => set({ category }),
  setUploadedFile: (fileData) => set({ uploadedFile: fileData }),
  setInterruptDuringPitch: (enabled) => set({ interruptDuringPitch: enabled }),
  setCrueltyLevel: (level) => set({ crueltyLevel: level }),
  setAbstractText: (text) => set({ abstractText: text }),
  setScriptText: (text) => set({ scriptText: text }),
  setPosterText: (text) => set({ posterText: text }),

  // Runtime actions
  setPhase: (phase) => set({ currentPhase: phase }),
  addTranscriptSegment: (segment) =>
    set((state) => ({ transcript: [...state.transcript, segment] })),
  setCurrentWPM: (wpm) => set({ currentWPM: wpm }),
  setRecordedBlob: (blob) => set({ recordedBlob: blob }),
  setIsRecording: (val) => set({ isRecording: val }),
  setIsSpeechActive: (val) => set({ isSpeechActive: val }),

  // Judge actions
  addConversationMessage: (msg) =>
    set((state) => ({ conversationHistory: [...state.conversationHistory, msg] })),
  setIsInterrupted: (val) => set({ isInterrupted: val }),
  setCurrentJudgeQuestion: (q) => set({ currentJudgeQuestion: q }),
  setIsJudgeThinking: (val) => set({ isJudgeThinking: val }),
  setJudgeSystemPrompt: (prompt) => set({ judgeSystemPrompt: prompt }),
  setContextSummary: (summary) => set({ contextSummary: summary }),

  // Feedback score actions
  setConfidenceScore: (score) => set({ confidenceScore: score }),
  setEngagementScore: (score) => set({ engagementScore: score }),
  setApproachabilityScore: (score) => set({ approachabilityScore: score }),
  setEvaluationResult: (result) => set({ evaluationResult: result }),
  setRecordingStartTime: (t) => set({ recordingStartTime: t }),

  // Reset runtime state (settings are preserved)
  resetSession: () => set({
    currentPhase: PHASES.SETUP,
    transcript: [],
    currentWPM: 0,
    recordedBlob: null,
    isRecording: false,
    isSpeechActive: false,
    conversationHistory: [],
    isInterrupted: false,
    currentJudgeQuestion: null,
    isJudgeThinking: false,
    judgeSystemPrompt: null,
    contextSummary: null,
    confidenceScore: 0,
    engagementScore: 0,
    approachabilityScore: 0,
    evaluationResult: null,
    recordingStartTime: null,
  }),
}))

export default useSessionStore
