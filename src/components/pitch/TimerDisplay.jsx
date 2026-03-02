export default function TimerDisplay({ formatted, isOvertime }) {
  return (
    <div className="flex items-center">
      <span
        className={`font-mono text-xl font-bold tabular-nums tracking-wider transition-colors duration-300
          ${isOvertime
            ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse'
            : 'text-white drop-shadow-sm'
          }`}
      >
        {formatted}
      </span>
    </div>
  )
}
