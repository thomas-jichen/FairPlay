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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center py-16 px-4 md:px-8 overflow-y-auto overflow-x-hidden">
      {/* Subtle top gradient */}
      <div className="fixed top-0 inset-x-0 h-40 bg-gradient-to-b from-black/[0.03] to-transparent pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-2xl flex flex-col gap-10 pb-20 mt-12"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-2 mb-4 px-2">
          <h1 className="type-display text-4xl tracking-tight text-text-primary">
            FAIRPLAY
          </h1>
          <p className="type-body text-lg text-text-secondary">
            ISEF Pitch Practice
          </p>
        </motion.div>

        {/* Panel 1: Your Project */}
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-8 space-y-8">
          <div className="border-b border-black-[0.05] pb-4">
            <h2 className="type-overline text-text-primary">Your Project</h2>
          </div>

          <div className="space-y-8">
            <CategorySelect value={category} onChange={setCategory} />
            <AbstractInput value={abstractText} onChange={setAbstractText} />
            <ScriptInput value={scriptText} onChange={setScriptText} />
            <FileUpload uploadedFile={uploadedFile} onFileChange={setUploadedFile} />

            <div className="flex items-center gap-2 pt-1">
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
        </motion.div>

        {/* Panel 2: Judge Behavior */}
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-8 space-y-8">
          <div className="border-b border-black-[0.05] pb-4">
            <h2 className="type-overline text-text-primary">Judge Behavior</h2>
          </div>

          <div className="space-y-8">
            <InterruptionToggle enabled={interruptDuringPitch} onChange={setInterruptDuringPitch} />
            <CrueltySlider value={crueltyLevel} onChange={setCrueltyLevel} />
          </div>
        </motion.div>

        {/* Panel 3: Session Timing */}
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-8 space-y-8">
          <div className="border-b border-black-[0.05] pb-4">
            <h2 className="type-overline text-text-primary">Session Timing</h2>
          </div>

          <div className="space-y-10">
            <DurationSlider
              label="Pitch Duration"
              value={pitchDuration}
              onChange={setPitchDuration}
              min={1}
              max={10}
              hint="ISEF suggests 2-4 min"
            />
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div variants={itemVariants} className="pt-6">
          <button
            type="button"
            onClick={handleStart}
            disabled={!canStart}
            className="w-full relative overflow-hidden rounded-2xl bg-black py-4 text-base font-medium tracking-tight text-white shadow-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/80 transition-all active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Start Session
            </span>
          </button>

          <AnimatePresence>
            {!canStart && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm font-medium text-text-secondary mt-4 tracking-tight"
              >
                Select an ISEF category to begin
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Privacy Policy */}
        <motion.div variants={itemVariants} className="text-center pb-4">
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-light text-text-muted hover:text-text-primary transition-colors duration-300"
            style={{ letterSpacing: '0.04em' }}
          >
            Privacy Policy
          </a>
        </motion.div>

      </motion.div>
    </div>
  )
}
