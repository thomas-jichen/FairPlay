import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import useSessionStore from '../stores/useSessionStore'
import DurationSlider from '../components/settings/DurationSlider'
import CategorySelect from '../components/settings/CategorySelect'
import FileUpload from '../components/settings/FileUpload'
import AbstractInput from '../components/settings/AbstractInput'
import ScriptInput from '../components/settings/ScriptInput'
import InterruptionToggle from '../components/settings/InterruptionToggle'
import CrueltySlider from '../components/settings/CrueltySlider'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward

  const pitchDuration = useSessionStore((s) => s.pitchDuration)
  const setPitchDuration = useSessionStore((s) => s.setPitchDuration)
  const category = useSessionStore((s) => s.category)
  const setCategory = useSessionStore((s) => s.setCategory)
  const uploadedFile = useSessionStore((s) => s.uploadedFile)
  const setUploadedFile = useSessionStore((s) => s.setUploadedFile)
  const abstractText = useSessionStore((s) => s.abstractText)
  const setAbstractText = useSessionStore((s) => s.setAbstractText)
  const scriptText = useSessionStore((s) => s.scriptText)
  const setScriptText = useSessionStore((s) => s.setScriptText)
  const interruptDuringPitch = useSessionStore((s) => s.interruptDuringPitch)
  const setInterruptDuringPitch = useSessionStore((s) => s.setInterruptDuringPitch)
  const crueltyLevel = useSessionStore((s) => s.crueltyLevel)
  const setCrueltyLevel = useSessionStore((s) => s.setCrueltyLevel)

  const canStart = category !== null

  function handleStart() {
    if (!canStart) return
    navigate('/app/pitch')
  }

  const nextStep = () => {
    setDirection(1)
    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setDirection(-1)
    setStep((prev) => prev - 1)
  }

  const stepVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 1,
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 1,
      },
    }),
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center py-10 px-4 md:px-8 overflow-y-auto overflow-x-hidden">
      {/* Subtle top gradient */}
      <div className="fixed top-0 inset-x-0 h-40 bg-gradient-to-b from-black/[0.03] to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center gap-8 pb-20 mt-8 px-4 sm:px-0">
        {/* Header */}
        <div className="space-y-2 mb-4 text-center">
          <a
            href="/"
            className="inline-block hover:opacity-80 transition-opacity"
          >
            <h1 className="type-display text-4xl tracking-tight text-text-primary">
              FAIRPLAY
            </h1>
          </a>
          <p className="type-body text-lg text-text-secondary">
            Personalized realistic ISEF judging simulations.
          </p>
        </div>

        <div className="relative w-full min-h-[600px] h-[75vh] self-stretch">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full glass-panel rounded-3xl p-8 flex flex-col items-center justify-center space-y-8"
              >
                <div className="text-center space-y-3 max-w-sm">
                  <h2 className="text-2xl font-medium tracking-tight text-text-primary">Ready to practice?</h2>
                  <p className="text-text-secondary text-sm">
                    Sign up to save and review your progress, or continue as a guest to get started immediately.
                  </p>
                </div>

                <div className="w-full max-w-sm space-y-4">
                  {/* Mock Google Sign-In */}
                  <button
                    type="button"
                    className="w-full relative overflow-hidden rounded-2xl bg-white border border-black/[0.08] py-3.5 px-4 flex items-center justify-center gap-3 text-sm font-medium tracking-tight text-black shadow-sm hover:bg-neutral-50 hover:border-black/[0.12] transition-all active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <title>Sign in with Google</title>
                      <desc>Google G Logo</desc>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-black/[0.08]"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-[#fcfcfc] px-3 text-text-muted">or</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full relative overflow-hidden rounded-2xl bg-black py-4 text-sm font-medium tracking-tight text-white shadow-md hover:bg-black/80 transition-all active:scale-[0.98]"
                  >
                    Continue as Guest
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full glass-panel rounded-3xl p-8 flex flex-col h-full"
              >
                <div className="border-b border-black-[0.05] pb-4 mb-8 flex items-center justify-between">
                  <h2 className="type-overline text-text-primary">Project Setup</h2>
                  <span className="text-xs font-medium text-text-muted">Step 2 of 3</span>
                </div>

                <div className="space-y-8 flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide">
                  <CategorySelect value={category} onChange={setCategory} />
                  <AbstractInput value={abstractText} onChange={setAbstractText} />
                  <ScriptInput value={scriptText} onChange={setScriptText} />
                  <FileUpload uploadedFile={uploadedFile} onFileChange={setUploadedFile} />

                  <div className="flex items-center gap-2 pt-1 pb-4">
                    <svg className="w-3.5 h-3.5 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-text-muted hover:text-text-primary transition-colors duration-300"
                      style={{ letterSpacing: '0.02em' }}
                    >
                      Your uploads are never stored or used for training — <span className="underline underline-offset-2">view our IP policy</span>
                    </a>
                  </div>
                </div>

                <div className="pt-6 border-t border-black/[0.05] flex gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-4 rounded-2xl bg-black/[0.04] text-text-primary text-sm font-medium hover:bg-black/[0.08] transition-colors active:scale-[0.98]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canStart}
                    className="flex-1 rounded-2xl bg-black py-4 text-base font-medium tracking-tight text-white shadow-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/80 transition-all active:scale-[0.98]"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full glass-panel rounded-3xl p-8 flex flex-col h-full"
              >
                <div className="border-b border-black-[0.05] pb-4 mb-8 flex items-center justify-between">
                  <h2 className="type-overline text-text-primary">Session Preferences</h2>
                  <span className="text-xs font-medium text-text-muted">Step 3 of 3</span>
                </div>

                <div className="space-y-16 flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide">
                  <div className="space-y-4">
                    <DurationSlider
                      label="Session Timing"
                      value={pitchDuration}
                      onChange={setPitchDuration}
                      min={1}
                      max={10}
                      hint="ISEF suggests 2-4 min"
                    />
                  </div>

                  <div className="space-y-4">
                    <InterruptionToggle label="Judge Behavior" enabled={interruptDuringPitch} onChange={setInterruptDuringPitch} />
                  </div>

                  <div className="space-y-4">
                    <CrueltySlider label="Judge Cruelty" value={crueltyLevel} onChange={setCrueltyLevel} />
                  </div>
                </div>

                <div className="pt-6 border-t border-black/[0.05] flex gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-4 rounded-2xl bg-black/[0.04] text-text-primary text-sm font-medium hover:bg-black/[0.08] transition-colors active:scale-[0.98]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleStart}
                    className="flex-1 rounded-2xl bg-black py-4 text-base font-medium tracking-tight text-white shadow-md hover:bg-black/80 transition-all active:scale-[0.98]"
                  >
                    Start Session
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Privacy Policy */}
        <div className="text-center pt-8">
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-light text-text-muted hover:text-text-primary transition-colors duration-300"
            style={{ letterSpacing: '0.04em' }}
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}
