export default function InterruptionToggle({ enabled, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-secondary">
        Interruption Preference
      </label>
      <div className="flex rounded-lg border border-border-default bg-surface-secondary p-1">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all
            ${!enabled
              ? 'bg-accent text-white shadow-sm'
              : 'text-text-muted hover:text-text-secondary'
            }`}
        >
          Questions after pitch
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all
            ${enabled
              ? 'bg-accent text-white shadow-sm'
              : 'text-text-muted hover:text-text-secondary'
            }`}
        >
          Interrupt during pitch
        </button>
      </div>
    </div>
  )
}
