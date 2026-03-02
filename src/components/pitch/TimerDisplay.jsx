export default function TimerDisplay({ formatted, isOvertime }) {
  return (
    <div className="flex items-center">
      <span
        className={`text-xl font-bold tabular-nums tracking-tight transition-colors duration-300
          ${isOvertime
            ? 'text-red-600 animate-[pulse_2s_infinite]'
            : 'text-text-primary drop-shadow-sm'
          }`}
      >
        {formatted}
      </span>
    </div>
  )
}
