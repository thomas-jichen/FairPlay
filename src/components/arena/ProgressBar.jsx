export default function ProgressBar({ seen, total }) {
  const pct = total > 0 ? (seen / total) * 100 : 0

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-white/30">Progress</span>
        <span className="text-xs text-white/30 tabular-nums">{seen} / {total}</span>
      </div>
      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-white/20 to-white/10 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
