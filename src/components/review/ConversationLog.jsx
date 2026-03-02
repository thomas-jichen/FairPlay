export default function ConversationLog({ conversationHistory }) {
  if (conversationHistory.length === 0) {
    return (
      <div className="glass-panel rounded-[32px] p-10 text-center shadow-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/60 border border-white mb-5 shadow-sm">
          <svg className="h-6 w-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-text-primary tracking-tight">No Q&A conversation recorded</p>
      </div>
    )
  }

  return (
    <div className="glass-panel rounded-[32px] p-6 shadow-lg relative overflow-hidden">
      {/* Top subtle fade gradient */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/60 via-white/40 to-transparent pointer-events-none z-10" />

      <div className="flex items-center gap-2 mb-6 px-2 relative z-20">
        <h3 className="text-sm font-semibold tracking-tight text-text-primary uppercase text-text-muted">Q&A Transcript</h3>
      </div>

      <div className="space-y-6 max-h-[500px] overflow-y-auto px-2 pb-8 scrollbar-hide relative z-0">
        {conversationHistory.map((msg, i) => {
          const isJudge = msg.role === 'judge'
          return (
            <div key={i} className={`flex flex-col ${isJudge ? 'items-start' : 'items-end'}`}>
              <span className={`text-[10px] font-bold tracking-widest uppercase mb-1.5 px-1 ${isJudge ? 'text-text-secondary' : 'text-text-muted'
                }`}>
                {isJudge ? 'AI Judge' : 'You'}
              </span>
              <div
                className={`max-w-[85%] rounded-[20px] px-5 py-4 ${isJudge
                  ? 'bg-white/60 border border-white shadow-sm text-text-primary rounded-tl-sm'
                  : 'bg-black text-white rounded-tr-sm shadow-md'
                  }`}
              >
                <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom subtle fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/60 via-white/40 to-transparent pointer-events-none z-10" />
    </div>
  )
}
