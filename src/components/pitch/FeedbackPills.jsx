const COLOR_STYLES = {
  green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]' },
  yellow: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]' },
}

function Pill({ label, color }) {
  const style = COLOR_STYLES[color] || COLOR_STYLES.green

  return (
    <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold tracking-wider transition-all duration-700 ease-out ${style.bg} ${style.border} ${style.shadow}`}>
      <div className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-700 bg-current ${style.text}`} />
      <span className={`transition-colors duration-700 ${style.text}`}>
        {label}
      </span>
    </div>
  )
}

export default function FeedbackPills({ confidence, engagement, approachability }) {
  return (
    <div className="flex items-center gap-2">
      <Pill label="CONF" color={confidence.color} />
      <Pill label="ENG" color={engagement.color} />
      <Pill label="APP" color={approachability.color} />
    </div>
  )
}
