const MAX_WORDS = 5000

export default function AbstractInput({ value, onChange }) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0
  const isOverLimit = wordCount > MAX_WORDS

  return (
    <div className="space-y-3 group">
      <div className="flex items-center justify-between px-1">
        <label className="text-sm font-medium text-text-primary tracking-tight">
          Abstract
        </label>
        <span className="text-xs text-text-muted">Optional</span>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your project abstract overview here..."
          rows={4}
          className={`relative w-full rounded-2xl border bg-black/[0.02] backdrop-blur-sm
                     px-4 py-3.5 text-sm text-text-primary placeholder-text-secondary/50
                     focus:bg-white focus:outline-none focus:ring-4
                     resize-y min-h-[100px] shadow-sm transition-all duration-300
                     ${isOverLimit
                       ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                       : 'border-black/[0.06] focus:border-black/[0.15] focus:ring-black/[0.04]'
                     }`}
        />
        <div className="flex items-center justify-between px-1 mt-1">
          {isOverLimit ? (
            <p className="text-xs text-red-500 font-medium">Exceeds {MAX_WORDS.toLocaleString()} word limit</p>
          ) : (
            <span />
          )}
          {wordCount > 0 && (
            <p className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-text-muted'}`}>
              {wordCount.toLocaleString()} words
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
