import { useNavigate } from 'react-router'
import useSessionStore from '../stores/useSessionStore'
import DurationSlider from '../components/settings/DurationSlider'
import CategorySelect from '../components/settings/CategorySelect'
import FileUpload from '../components/settings/FileUpload'
import InterruptionToggle from '../components/settings/InterruptionToggle'
import CrueltySlider from '../components/settings/CrueltySlider'

export default function SettingsPage() {
  const navigate = useNavigate()

  const pitchDuration = useSessionStore((s) => s.pitchDuration)
  const setPitchDuration = useSessionStore((s) => s.setPitchDuration)
  const qaDuration = useSessionStore((s) => s.qaDuration)
  const setQaDuration = useSessionStore((s) => s.setQaDuration)
  const category = useSessionStore((s) => s.category)
  const setCategory = useSessionStore((s) => s.setCategory)
  const uploadedFile = useSessionStore((s) => s.uploadedFile)
  const setUploadedFile = useSessionStore((s) => s.setUploadedFile)
  const interruptDuringPitch = useSessionStore((s) => s.interruptDuringPitch)
  const setInterruptDuringPitch = useSessionStore((s) => s.setInterruptDuringPitch)
  const crueltyLevel = useSessionStore((s) => s.crueltyLevel)
  const setCrueltyLevel = useSessionStore((s) => s.setCrueltyLevel)

  const canStart = category !== null

  function handleStart() {
    if (!canStart) return
    navigate('/pitch')
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          FairPlay
        </h1>
        <p className="mt-2 text-text-secondary">
          ISEF Pitch Practice Photobooth
        </p>
      </div>

      <div className="space-y-8">
        <CategorySelect value={category} onChange={setCategory} />

        <DurationSlider
          label="Pitch Duration"
          value={pitchDuration}
          onChange={setPitchDuration}
          min={1}
          max={10}
          hint="ISEF suggests 2-4 min"
        />

        <DurationSlider
          label="Q&A Duration"
          value={qaDuration}
          onChange={setQaDuration}
          min={1}
          max={5}
        />

        <FileUpload
          uploadedFile={uploadedFile}
          onFileChange={setUploadedFile}
        />

        <InterruptionToggle
          enabled={interruptDuringPitch}
          onChange={setInterruptDuringPitch}
        />

        <CrueltySlider
          value={crueltyLevel}
          onChange={setCrueltyLevel}
          visible={interruptDuringPitch}
        />

        <button
          type="button"
          onClick={handleStart}
          disabled={!canStart}
          className="w-full rounded-lg bg-accent py-3 text-lg font-semibold text-white
                     transition-all hover:bg-accent-light disabled:opacity-40
                     disabled:cursor-not-allowed shadow-lg shadow-accent/20
                     hover:shadow-accent/30"
        >
          Start Session
        </button>

        {!canStart && (
          <p className="text-center text-sm text-text-muted">
            Select an ISEF category to begin
          </p>
        )}
      </div>
    </div>
  )
}
