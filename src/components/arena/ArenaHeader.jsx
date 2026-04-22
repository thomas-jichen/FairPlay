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
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 sm:px-6 bg-transparent">
      <Link to="/" className="flex items-baseline gap-2.5 no-underline group">
        <span className="type-wordmark text-base text-white/90 group-hover:text-white transition-colors duration-300">ISEF ARENA</span>
        <span className="type-caption normal-case text-[11px] text-white/30 hidden sm:inline">by Fairplay</span>
      </Link>

      <div className="flex items-center gap-3">
        <ScoreTracker correct={correctCount} total={totalGuesses} />
        {showReset && (
          <button
            onClick={onReset}
            className="glossy-black-cta px-4 py-2 type-caption text-xs text-white/50 hover:text-white/80"
          >
            {resetLabel}
          </button>
        )}
      </div>
    </header>
  )
}
