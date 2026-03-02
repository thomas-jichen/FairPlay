const COLOR_CLASSES = {
  green: 'bg-green-500/20 text-green-400 border-green-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
}

function Pill({ label, color }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium
                  transition-colors duration-700 ${COLOR_CLASSES[color]}`}
    >
      {label}
    </span>
  )
}

export default function FeedbackPills({ confidence, engagement, approachability }) {
  return (
    <>
      <Pill label="Confidence" color={confidence.color} />
      <Pill label="Engagement" color={engagement.color} />
      <Pill label="Approachability" color={approachability.color} />
    </>
  )
}
