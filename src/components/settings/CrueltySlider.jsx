const CRUELTY_LABELS = ['', 'Gentle', 'Moderate', 'Challenging', 'Tough', 'Ruthless']

export default function CrueltySlider({ value, onChange, visible }) {
  if (!visible) return null

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
    </div>
  )
}
