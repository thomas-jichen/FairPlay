const COLOR_STYLES = {
  green: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', shadow: 'shadow-sm' },
  yellow: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', shadow: 'shadow-sm' },
  red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', shadow: 'shadow-sm' },
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
