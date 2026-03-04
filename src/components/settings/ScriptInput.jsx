export default function ScriptInput({ value, onChange }) {
    return (
        <div className="space-y-3 group">
            <div className="flex items-center justify-between px-1">
                <label className="text-sm font-medium text-text-primary tracking-tight">
                    Pitch Script
                </label>
                <span className="text-xs text-text-muted">Optional</span>
            </div>

            <div className="relative">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Paste your pitch script here for the teleprompter..."
                    rows={4}
                    className="relative w-full rounded-2xl border border-black/[0.06] bg-black/[0.02] backdrop-blur-sm
                     px-4 py-3.5 text-sm text-text-primary placeholder-text-secondary/50
                     focus:border-black/[0.15] focus:bg-white focus:outline-none focus:ring-4 focus:ring-black/[0.04]
                     resize-y min-h-[100px] shadow-sm transition-all duration-300"
                />
            </div>
            <p className="text-xs text-text-muted pl-1">
                This text will feed into your teleprompter during the practice session.
            </p>
        </div>
    )
}
