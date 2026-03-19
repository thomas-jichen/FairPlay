import { Link } from 'react-router'
import ScoreTracker from './ScoreTracker'
import useArenaStore from '../../stores/useArenaStore'

export default function ArenaHeader({ onReset, resetLabel, showReset }) {
  const categoryScores = useArenaStore(s => s.categoryScores)
  const selectedCategory = useArenaStore(s => s.selectedCategory)
  const scoreKey = selectedCategory || 'all'
  const correctCount = categoryScores[scoreKey]?.correctCount || 0
  const totalGuesses = categoryScores[scoreKey]?.totalGuesses || 0

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 sm:px-6 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
      <Link to="/" className="flex items-baseline gap-2 no-underline">
        <span className="text-white font-bold text-base tracking-wide">ISEF ARENA</span>
        <span className="text-white/25 text-xs hidden sm:inline">by FairPlay</span>
      </Link>

      <div className="flex items-center gap-3">
        {showReset && (
          <button
            onClick={onReset}
            className="text-xs text-white/25 hover:text-white/50 transition-colors"
          >
            {resetLabel}
          </button>
        )}
        <ScoreTracker correct={correctCount} total={totalGuesses} />
      </div>
    </header>
  )
}
