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
      {label && (
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className="text-sm font-medium text-text-primary tracking-tight">{label}</h3>
          <span className="text-sm font-semibold text-text-primary px-3 py-1 bg-black/5 rounded-full border border-black/10 tabular-nums">
            {value} {unit}
          </span>
        </div>
      )}

      <div className="relative py-2 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
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

      <div className="flex justify-between px-1 text-xs text-text-muted mt-1">
        <span className="w-16 text-left">{min} {unit}</span>
        {hint && <span className="flex-1 text-center">{hint}</span>}
        <span className="w-16 text-right">{max} {unit}</span>
      </div>
    </div>
  )
}
