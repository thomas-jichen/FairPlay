export default function ProgressBar({ seen, total }) {
  const pct = total > 0 ? (seen / total) * 100 : 0

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-2">
        <span className="type-caption text-xs text-white/35">Progress</span>
        <span className="type-caption text-xs text-white/45 tabular-nums">{seen} / {total}</span>
      </div>
      <div className="h-[3px] rounded-full bg-white/[0.05] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400/70 to-amber-300/40 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
