import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import useSessionStore from '../stores/useSessionStore'
import useAuthStore from '../stores/useAuthStore'
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
  const [direction, setDirection] = useState(1)
  const googleButtonRef = useRef(null)
  const [settingsLoaded, setSettingsLoaded] = useState(false)

  // Session store
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
  const hydrateFromSaved = useSessionStore((s) => s.hydrateFromSaved)

  // Auth store
  const user = useAuthStore((s) => s.user)
  const isSignedIn = useAuthStore((s) => s.isSignedIn)
  const signIn = useAuthStore((s) => s.signIn)
  const signOut = useAuthStore((s) => s.signOut)
  const loadSavedSettings = useAuthStore((s) => s.loadSavedSettings)
  const saveSettings = useAuthStore((s) => s.saveSettings)
  const restoreSession = useAuthStore((s) => s.restoreSession)

  const canStart = category !== null

  // Restore session on mount
  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  // If user is already signed in on mount, skip to step 2
  useEffect(() => {
    if (isSignedIn && step === 1) {
      setDirection(1)
      setStep(2)
    }
  }, [isSignedIn])

  // Load saved settings when signed-in user reaches step 2
  useEffect(() => {
    if (isSignedIn && step === 2 && !settingsLoaded) {
      loadSavedSettings().then((saved) => {
        if (saved) {
          hydrateFromSaved(saved)
        }
        setSettingsLoaded(true)
      })
    }
  }, [isSignedIn, step, settingsLoaded, loadSavedSettings, hydrateFromSaved])

  // Google Sign-In callback
  const handleGoogleSignIn = useCallback(async (response) => {
    const success = await signIn(response)
    if (success) {
      setDirection(1)
      setStep(2)
    }
  }, [signIn])

  // Initialize Google Sign-In button
  useEffect(() => {
    if (step !== 1 || !googleButtonRef.current) return

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) return

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
      })

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: googleButtonRef.current.offsetWidth,
        text: 'continue_with',
        shape: 'pill',
        logo_alignment: 'left',
      })
    }

    // The GIS script might not be loaded yet since it's async
    if (window.google?.accounts?.id) {
      initializeGoogle()
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval)
          initializeGoogle()
        }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [step, handleGoogleSignIn])

  function handleStart() {
    if (!canStart) return
    // Save settings for signed-in users
    if (isSignedIn) {
      saveSettings({
        category,
        pitchDuration,
        crueltyLevel,
        interruptDuringPitch,
      })
    }
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

  // User info badge for steps 2+3
  const UserBadge = () => {
    if (!isSignedIn || !user) return null
    return (
      <div className="flex items-center gap-2.5">
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-7 h-7 rounded-full border border-black/[0.06]"
          referrerPolicy="no-referrer"
        />
        <span className="text-xs font-medium text-text-secondary truncate max-w-[120px]">
          {user.name}
        </span>
        <button
          type="button"
          onClick={() => {
            signOut()
            setStep(1)
            setDirection(-1)
          }}
          className="text-[10px] text-text-muted hover:text-text-primary transition-colors ml-1"
        >
          Sign out
        </button>
      </div>
    )
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
            Personalized realistic ISEF judging simulations
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
                  {/* Real Google Sign-In button rendered by GIS */}
                  <div
                    ref={googleButtonRef}
                    className="w-full flex items-center justify-center min-h-[44px]"
                  />

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
                  <div className="flex items-center gap-4">
                    <UserBadge />
                    <span className="text-xs font-medium text-text-muted">Step 2 of 3</span>
                  </div>
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
                    onClick={() => {
                      if (isSignedIn) {
                        // Signed-in users go back to step 1 only via sign-out
                        signOut()
                      }
                      prevStep()
                    }}
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
                  <div className="flex items-center gap-4">
                    <UserBadge />
                    <span className="text-xs font-medium text-text-muted">Step 3 of 3</span>
                  </div>
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
