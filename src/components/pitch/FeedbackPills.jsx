const DOT_COLORS = {
  green: {
    bg: 'rgba(52, 211, 153, 0.90)',
    glow: '0 0 8px rgba(16, 185, 129, 0.55)',
  },
  yellow: {
    bg: 'rgba(251, 191, 36, 0.90)',
    glow: '0 0 8px rgba(245, 158, 11, 0.50)',
  },
  red: {
    bg: 'rgba(248, 113, 113, 0.90)',
    glow: '0 0 8px rgba(239, 68, 68, 0.55)',
  },
}

function Pill({ label, color }) {
  const dot = DOT_COLORS[color] || DOT_COLORS.green

  return (
    <div
      className="flex items-center gap-1.5 rounded-full glass-cta px-2.5 py-1 text-xs font-bold uppercase tracking-widest"
      style={{ fontFamily: '"Söhne", "Helvetica Neue", -apple-system, sans-serif' }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full transition-all duration-700"
        style={{
          backgroundColor: dot.bg,
          boxShadow: dot.glow,
        }}
      />
      <span className="text-[10px] text-text-primary/70">
        {label}
      </span>
    </div>
  )
}

export default function FeedbackPills({ confidence, engagement, approachability }) {
  return (
    <div className="flex items-center gap-2">
      <Pill label="Confidence" color={confidence.color} />
      <Pill label="Engagement" color={engagement.color} />
      <Pill label="Approachability" color={approachability.color} />
    </div>
  )
}
