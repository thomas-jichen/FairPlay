export default function AbstractInput({ value, onChange }) {
  return (
    <div className="space-y-3 group">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-primary tracking-wide">
          Abstract
        </label>
        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] uppercase tracking-wider text-text-muted border border-white/10">Optional</span>
      </div>

      <div className="relative">
        <div className="absolute -inset-0.5 bg-accent/20 rounded-xl blur opacity-0 transition duration-500 group-focus-within:opacity-100" />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your project abstract overview here..."
          rows={4}
          className="relative w-full rounded-xl border border-white/10 bg-surface-secondary/80 backdrop-blur-sm
                     px-4 py-3.5 text-sm text-text-primary placeholder-text-muted/40
                     focus:border-accent/50 focus:bg-surface-elevated focus:outline-none focus:ring-1 focus:ring-accent/50
                     resize-y min-h-[100px] shadow-inner transition-all duration-300"
        />
      </div>
      <p className="text-xs text-text-muted pl-1">
        Provides context to the AI judge, simulating judges who read abstracts before the interview.
      </p>
    </div>
  )
}
