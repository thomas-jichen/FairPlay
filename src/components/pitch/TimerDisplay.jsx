export default function TimerDisplay({ formatted, isOvertime }) {
  return (
    <span
      className={`font-mono text-2xl font-bold tabular-nums
        ${isOvertime ? 'text-red-400 animate-pulse' : 'text-text-primary'}`}
    >
      {formatted}
    </span>
  )
}
