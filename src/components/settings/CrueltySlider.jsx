import { CRUELTY_CONFIG } from '../../constants/crueltyConfig'

const CRUELTY_LABELS = ['', 'Gentle', 'Moderate', 'Challenging', 'Tough', 'Ruthless']

export default function CrueltySlider({ value, onChange }) {
  const config = CRUELTY_CONFIG[value]

  return (
    <div className="space-y-4 group">
      <div className="flex items-center justify-between px-1">
        <label className="text-sm font-medium text-text-primary tracking-tight">
          Judge Cruelty Level
        </label>
        <span className="text-sm font-semibold text-text-primary px-3 py-1 bg-black/5 rounded-full border border-black/10">
          {value} — {CRUELTY_LABELS[value]}
        </span>
      </div>

      <div className="relative pt-2 pb-1">
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full relative z-10"
        />
        <div
          className="absolute top-[13px] left-0 h-1.5 bg-black rounded-l-full pointer-events-none transition-all duration-200"
          style={{ width: `${((value - 1) / (5 - 1)) * 100}%` }}
        />
      </div>

      <div className="flex justify-between px-1 text-xs font-medium text-text-muted">
        <span>Gentle</span>
        <span className="text-text-secondary">Level 3 suggested</span>
        <span>Ruthless</span>
      </div>

      <div className="mt-2 rounded-2xl bg-black/[0.02] border border-black/[0.06] p-4 transition-all duration-300 flex justify-between items-center group-hover:bg-black/[0.04]">
        <span className="text-sm text-text-secondary tracking-tight">Expected Q&A Duration</span>
        <span className="tabular-nums text-sm font-semibold text-text-primary">{config.qaDurationMinutes} min</span>
      </div>
    </div>
  )
}
