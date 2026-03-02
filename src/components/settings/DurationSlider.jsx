export default function DurationSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = 'min',
  hint = null,
}) {
  return (
    <div className="space-y-4 group">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-primary tracking-wide">
          {label}
        </label>
        <span className="text-lg tabular-nums font-bold text-accent drop-shadow-[0_0_8px_rgba(14,187,187,0.4)]">
          {value} <span className="text-sm font-medium text-accent-light/80">{unit}</span>
        </span>
      </div>

      <div className="relative pt-2 pb-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full relative z-10"
        />
        {/* Decorative track fill (visual only) */}
        <div
          className="absolute top-[13px] left-0 h-2 bg-gradient-to-r from-accent-dark/50 to-accent rounded-l-full pointer-events-none transition-all duration-200"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
      </div>

      <div className="flex justify-between text-xs font-medium text-text-muted">
        <span>{min} {unit}</span>
        {hint && <span className="text-accent-light/50">{hint}</span>}
        <span>{max} {unit}</span>
      </div>
    </div>
  )
}
