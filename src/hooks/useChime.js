import { useRef, useCallback } from 'react'

export default function useChime() {
  const audioContextRef = useRef(null)

  const playChime = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    const ctx = audioContextRef.current

    const now = ctx.currentTime

    // Note 1: C5 (523 Hz)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.value = 523.25
    gain1.gain.setValueAtTime(0.3, now)
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
    osc1.connect(gain1).connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.15)

    // Note 2: E5 (659 Hz)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.value = 659.25
    gain2.gain.setValueAtTime(0.3, now + 0.15)
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35)
    osc2.connect(gain2).connect(ctx.destination)
    osc2.start(now + 0.15)
    osc2.stop(now + 0.35)
  }, [])

  return { playChime }
}
