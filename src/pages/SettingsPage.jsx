import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import useSessionStore from '../stores/useSessionStore'
import DurationSlider from '../components/settings/DurationSlider'
import CategorySelect from '../components/settings/CategorySelect'
import FileUpload from '../components/settings/FileUpload'
import AbstractInput from '../components/settings/AbstractInput'
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
  const interruptDuringPitch = useSessionStore((s) => s.interruptDuringPitch)
  const setInterruptDuringPitch = useSessionStore((s) => s.setInterruptDuringPitch)
  const crueltyLevel = useSessionStore((s) => s.crueltyLevel)
  const setCrueltyLevel = useSessionStore((s) => s.setCrueltyLevel)

  const canStart = category !== null

  function handleStart() {
    if (!canStart) return
    navigate('/pitch')
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
      {/* Subtle ambient backglow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-accent/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-3xl flex flex-col gap-10 pb-20"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-3 mb-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-2xl">
            <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">
            FairPlay
          </h1>
          <p className="text-lg md:text-xl text-text-secondary font-medium tracking-wide">
            ISEF Pitch Practice Photobooth
          </p>
        </motion.div>

        {/* Panel 1: Your Project */}
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-8 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-wide text-white">Your Project</h2>
          </div>

          <div className="space-y-8">
            <CategorySelect value={category} onChange={setCategory} />
            <AbstractInput value={abstractText} onChange={setAbstractText} />
            <FileUpload uploadedFile={uploadedFile} onFileChange={setUploadedFile} />
          </div>
        </motion.div>

        {/* Panel 2: Judge Behavior */}
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-8 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-wide text-white">Judge Behavior</h2>
          </div>

          <div className="space-y-8">
            <InterruptionToggle enabled={interruptDuringPitch} onChange={setInterruptDuringPitch} />
            <CrueltySlider value={crueltyLevel} onChange={setCrueltyLevel} />
          </div>
        </motion.div>

        {/* Panel 3: Session Timing */}
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-8 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-wide text-white">Session Timing</h2>
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
            className="w-full relative group overflow-hidden rounded-full bg-gradient-to-r from-accent-dark to-accent py-5 text-xl font-bold tracking-wide text-white shadow-[0_0_30px_rgba(14,187,187,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Shine effect on hover */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              Start Session
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>

          <AnimatePresence>
            {!canStart && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm font-medium text-accent-light/80 mt-4 tracking-wide animate-pulse"
              >
                Select an ISEF category to begin
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

      </motion.div>
    </div>
  )
}
