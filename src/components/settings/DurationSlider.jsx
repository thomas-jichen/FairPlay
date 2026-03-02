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
      <div className="flex items-center justify-between px-1">
        <label className="text-sm font-medium text-text-primary tracking-tight">
          {label}
        </label>
        <span className="text-base tabular-nums font-semibold text-text-primary">
          {value} <span className="text-sm font-medium text-text-secondary">{unit}</span>
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
          className="absolute top-[13px] left-0 h-1.5 bg-black rounded-l-full pointer-events-none transition-all duration-200"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
      </div>

      <div className="flex justify-between px-1 text-xs text-text-muted">
        <span>{min} {unit}</span>
        {hint && <span>{hint}</span>}
        <span>{max} {unit}</span>
      </div>
    </div>
  )
}
