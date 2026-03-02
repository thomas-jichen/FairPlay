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
          <h1 className="text-4xl font-medium tracking-tight text-text-primary">
            FairPlay
          </h1>
          <p className="text-lg text-text-secondary tracking-tight">
            ISEF Pitch Practice
          </p>
        </motion.div>

        {/* Panel 1: Your Project */}
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-8 space-y-8">
          <div className="border-b border-black-[0.05] pb-4">
            <h2 className="text-lg font-medium tracking-tight text-text-primary">Your Project</h2>
          </div>

          <div className="space-y-8">
            <CategorySelect value={category} onChange={setCategory} />
            <AbstractInput value={abstractText} onChange={setAbstractText} />
            <FileUpload uploadedFile={uploadedFile} onFileChange={setUploadedFile} />
          </div>
        </motion.div>

        {/* Panel 2: Judge Behavior */}
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-8 space-y-8">
          <div className="border-b border-black-[0.05] pb-4">
            <h2 className="text-lg font-medium tracking-tight text-text-primary">Judge Behavior</h2>
          </div>

          <div className="space-y-8">
            <InterruptionToggle enabled={interruptDuringPitch} onChange={setInterruptDuringPitch} />
            <CrueltySlider value={crueltyLevel} onChange={setCrueltyLevel} />
          </div>
        </motion.div>

        {/* Panel 3: Session Timing */}
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-8 space-y-8">
          <div className="border-b border-black-[0.05] pb-4">
            <h2 className="text-lg font-medium tracking-tight text-text-primary">Session Timing</h2>
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

      </motion.div>
    </div>
  )
}
