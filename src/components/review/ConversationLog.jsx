export default function ConversationLog({ conversationHistory }) {
  if (conversationHistory.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-surface-secondary p-6 text-center">
        <p className="text-sm text-text-muted">No Q&A conversation recorded</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border-default bg-surface-secondary p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Q&A Conversation</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {conversationHistory.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role !== 'judge' ? 'pl-4' : ''}`}>
            <span className={`shrink-0 text-xs font-semibold mt-0.5 ${
              msg.role === 'judge' ? 'text-accent' : 'text-green-400'
            }`}>
              {msg.role === 'judge' ? 'Judge' : 'You'}
            </span>
            <p className="text-sm text-text-secondary leading-relaxed">{msg.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
