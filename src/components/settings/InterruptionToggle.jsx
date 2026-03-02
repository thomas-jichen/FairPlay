export default function InterruptionToggle({ enabled, onChange }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-text-primary tracking-wide">
          Interruption Style
        </label>
        <p className="text-xs text-text-muted">
          Decide if the judge waits until the Q&A phase or interrupts mid-pitch.
        </p>
      </div>

      <div className="relative flex rounded-xl border border-white/10 bg-black/20 p-1 backdrop-blur-sm isolation-auto">
        {/* Sliding background indicator */}
        <div
          className="absolute inset-y-1 w-[calc(50%-4px)] flex rounded-lg bg-surface-elevated shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-white/10 transition-transform duration-300 ease-spring z-0"
          style={{ transform: enabled ? 'translateX(calc(100% + 4px))' : 'translateX(0)' }}
        >
          {/* Subtle glow for active item */}
          <div className="absolute inset-0 rounded-lg bg-accent/5" />
        </div>

        <button
          type="button"
          onClick={() => onChange(false)}
          className={`relative z-10 flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-300
            ${!enabled
              ? 'text-white'
              : 'text-text-muted hover:text-text-secondary'
            }`}
        >
          Wait until end
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`relative z-10 flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-300
            ${enabled
              ? 'text-white'
              : 'text-text-muted hover:text-text-secondary'
            }`}
        >
          Interrupt dynamically
        </button>
      </div>
    </div>
  )
}
