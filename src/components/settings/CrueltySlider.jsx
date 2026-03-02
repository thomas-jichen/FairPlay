import { CRUELTY_CONFIG } from '../../constants/crueltyConfig'

const CRUELTY_LABELS = ['', 'Gentle', 'Moderate', 'Challenging', 'Tough', 'Ruthless']

export default function CrueltySlider({ value, onChange }) {
  const config = CRUELTY_CONFIG[value]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-secondary">
          Cruelty Level
        </label>
        <span className="text-sm font-semibold text-accent">
          {value} — {CRUELTY_LABELS[value]}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-text-muted">
        <span>Gentle</span>
        <span className="text-accent/70">3 suggested</span>
        <span>Ruthless</span>
      </div>
      <div className="mt-1 rounded-md bg-surface-tertiary border border-border-default px-3 py-2
                      text-xs text-text-secondary">
        Expected Q&A: <span className="font-semibold text-accent">{config.qaDurationMinutes} min</span>
      </div>
    </div>
  )
}
