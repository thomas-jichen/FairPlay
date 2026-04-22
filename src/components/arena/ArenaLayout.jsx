import ArenaHeader from './ArenaHeader'
import ArenaFooterCTA from './ArenaFooterCTA'

export default function ArenaLayout({ children, onReset, resetLabel, showReset }) {
  return (
    <div className="arena-theme arena-backdrop min-h-screen text-white/90">
      <ArenaHeader onReset={onReset} resetLabel={resetLabel} showReset={showReset} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-1 pb-2">
        {children}
      </main>
      <ArenaFooterCTA />
    </div>
  )
}
