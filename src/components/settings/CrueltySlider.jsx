import { CRUELTY_CONFIG } from '../../constants/crueltyConfig'

const CRUELTY_LABELS = ['', 'Gentle', 'Moderate', 'Challenging', 'Tough', 'Ruthless']

export default function CrueltySlider({ label, value, onChange }) {
  const config = CRUELTY_CONFIG[value]

  return (
    <div className="space-y-4 group">
      {label && (
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className="text-sm font-medium text-text-primary tracking-tight">{label}</h3>
          <span className="text-sm font-semibold text-text-primary px-3 py-1 bg-black/5 rounded-full border border-black/10">
            {value} — {CRUELTY_LABELS[value]}
          </span>
        </div>
      )}

      <div className="relative py-2 flex items-center">
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-black/10 rounded-full appearance-none outline-none relative z-10
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform
                     [&::-webkit-slider-thumb]:mt-[-7px]
                     [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-black/10
                     [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:appearance-none
                     [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-md cursor-pointer
                     [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-black/10"
        />
      </div>

      <div className="flex justify-between px-1 text-xs font-medium text-text-muted mt-1">
        <span className="w-20 text-left">Gentle</span>
        <span className="flex-1 text-center text-text-secondary">Balanced</span>
        <span className="w-20 text-right">Ruthless</span>
      </div>

      <div className="mt-2 rounded-2xl bg-black/[0.02] border border-black/[0.06] p-4 transition-all duration-300 flex justify-between items-center group-hover:bg-black/[0.04]">
        <span className="type-body text-sm text-text-secondary tracking-tight">Expected Q&A Duration</span>
        <span className="tabular-nums text-sm font-semibold text-text-primary">{config.qaDurationMinutes} min</span>
      </div>
    </div>
  )
}
