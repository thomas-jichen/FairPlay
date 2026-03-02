export default function AbstractInput({ value, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-secondary">
          Abstract
        </label>
        <span className="text-xs text-text-muted">Optional</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your project abstract — judges review this before your interview"
        rows={5}
        className="w-full rounded-lg border border-border-default bg-surface-tertiary
                   px-4 py-3 text-sm text-text-primary placeholder-text-muted/50
                   focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30
                   resize-y min-h-[100px]"
      />
      <p className="text-xs text-text-muted">
        This gives the AI judge context about your project, just like real ISEF judges who read abstracts beforehand.
      </p>
    </div>
  )
}
