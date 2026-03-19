import ArenaHeader from './ArenaHeader'

export default function ArenaLayout({ children, onReset, resetLabel, showReset }) {
  return (
    <div className="arena-theme min-h-screen bg-[#0a0a0f] text-white/90">
      <ArenaHeader onReset={onReset} resetLabel={resetLabel} showReset={showReset} />
      <main className="max-w-3xl mx-auto px-4 pt-20 pb-12">
        {children}
      </main>
    </div>
  )
}
