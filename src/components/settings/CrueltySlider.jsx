import { CRUELTY_CONFIG } from '../../constants/crueltyConfig'

const CRUELTY_LABELS = ['', 'Gentle', 'Moderate', 'Challenging', 'Tough', 'Ruthless']

export default function CrueltySlider({ value, onChange }) {
  const config = CRUELTY_CONFIG[value]

  return (
    <div className="space-y-4 group">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-primary tracking-wide">
          Judge Cruelty Level
        </label>
        <span className="text-sm font-semibold text-accent drop-shadow-[0_0_8px_rgba(14,187,187,0.4)] px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
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
          className="absolute top-[13px] left-0 h-2 bg-gradient-to-r from-accent-dark/50 to-accent rounded-l-full pointer-events-none transition-all duration-200"
          style={{ width: `${((value - 1) / (5 - 1)) * 100}%` }}
        />
      </div>

      <div className="flex justify-between text-xs font-medium text-text-muted">
        <span>Gentle</span>
        <span className="text-accent-light/50">Level 3 suggested</span>
        <span>Ruthless</span>
      </div>

      <div className="mt-2 rounded-xl bg-black/20 border border-white/5 p-4 backdrop-blur-sm transition-all duration-300 group-hover:bg-black/30 group-hover:border-white/10 flex justify-between items-center">
        <span className="text-sm text-text-secondary">Expected Q&A Duration</span>
        <span className="tabular-nums text-sm font-bold text-accent">{config.qaDurationMinutes} min</span>
      </div>
    </div>
  )
}
