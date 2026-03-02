export default function ConversationLog({ conversationHistory }) {
  if (conversationHistory.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center border-dashed border-white/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 mb-4">
          <svg className="h-6 w-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-text-muted tracking-wide">No Q&A conversation recorded</p>
      </div>
    )
  }

  return (
    <div className="glass-panel rounded-2xl border-white/10 p-5 shadow-xl bg-black/40 backdrop-blur-xl relative overflow-hidden">
      {/* Top subtle fade gradient */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />

      <div className="flex items-center gap-2 mb-5 px-1 relative z-20">
        <div className="w-1.5 h-4 bg-accent rounded-full shadow-[0_0_8px_rgba(14,187,187,0.5)]" />
        <h3 className="text-sm font-semibold tracking-wide text-white">Q&A Transcript</h3>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 pb-4 scrollbar-hide relative z-0">
        {conversationHistory.map((msg, i) => {
          const isJudge = msg.role === 'judge'
          return (
            <div key={i} className={`flex flex-col ${isJudge ? 'items-start' : 'items-end'}`}>
              <span className={`text-[10px] font-bold tracking-widest uppercase mb-1 px-1 ${isJudge ? 'text-accent' : 'text-emerald-400'
                }`}>
                {isJudge ? 'AI Judge' : 'You'}
              </span>
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-md ${isJudge
                    ? 'bg-surface-tertiary/60 border border-white/5 text-white rounded-tl-sm'
                    : 'bg-emerald-500/10 border border-emerald-500/20 text-text-secondary rounded-tr-sm'
                  }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom subtle fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
    </div>
  )
}
