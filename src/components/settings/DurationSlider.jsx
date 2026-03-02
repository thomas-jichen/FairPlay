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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-secondary">
          {label}
        </label>
        <span className="text-lg font-mono font-semibold text-accent">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-text-muted">
        <span>{min} {unit}</span>
        {hint && <span className="text-accent/70">{hint}</span>}
        <span>{max} {unit}</span>
      </div>
    </div>
  )
}
