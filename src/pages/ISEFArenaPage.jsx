import { useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ArenaLayout from '../components/arena/ArenaLayout'
import VideoCard, { preloadVideo } from '../components/arena/VideoCard'
import GuessButtons from '../components/arena/GuessButtons'
import ResultReveal from '../components/arena/ResultReveal'
import CategoryFilter from '../components/arena/CategoryFilter'
import ProgressBar from '../components/arena/ProgressBar'
import useArenaStore from '../stores/useArenaStore'
import projects from '../data/isef-projects.json'

export default function ISEFArenaPage() {
  const currentProject = useArenaStore(s => s.currentProject)
  const gamePhase = useArenaStore(s => s.gamePhase)
  const userGuess = useArenaStore(s => s.userGuess)
  const isCorrect = useArenaStore(s => s.isCorrect)
  const selectedCategory = useArenaStore(s => s.selectedCategory)
  const categoryScores = useArenaStore(s => s.categoryScores)
  const scoreKey = selectedCategory || 'all'
  const correctCount = categoryScores[scoreKey]?.correctCount || 0
  const totalGuesses = categoryScores[scoreKey]?.totalGuesses || 0
  const allProjects = useArenaStore(s => s.allProjects)
  const seenProjectIds = useArenaStore(s => s.seenProjectIds)
  const initGame = useArenaStore(s => s.initGame)
  const makeGuess = useArenaStore(s => s.makeGuess)
  const nextProject = useArenaStore(s => s.nextProject)
  const peekNextProject = useArenaStore(s => s.peekNextProject)
  const setCategory = useArenaStore(s => s.setCategory)
  const resetGame = useArenaStore(s => s.resetGame)
  const resetCategoryProgress = useArenaStore(s => s.resetCategoryProgress)

  useEffect(() => {
    document.title = 'ISEF Arena'
    initGame(projects)
    return () => { document.title = 'Fairplay' }
  }, [initGame])

  // Preload next video when in revealed phase
  useEffect(() => {
    if (gamePhase !== 'revealed') return

    const next = peekNextProject()
    if (!next?.videoUrl) return

    const cleanup = preloadVideo(next.videoUrl)
    return () => cleanup?.()
  }, [gamePhase, peekNextProject])

  const handleNext = () => {
    nextProject()
  }

  const pool = useMemo(() => {
    if (!selectedCategory) return allProjects
    return allProjects.filter(p => p.categoryCode === selectedCategory)
  }, [allProjects, selectedCategory])

  const total = pool.length
  const seen = pool.filter(p => seenProjectIds.has(p.id)).length

  return (
    <ArenaLayout
      onReset={selectedCategory ? resetCategoryProgress : resetGame}
      resetLabel={selectedCategory ? `Reset ${selectedCategory}` : 'Reset All'}
      showReset={gamePhase !== 'complete'}
    >
      <CategoryFilter selected={selectedCategory} onSelect={setCategory} />
      <ProgressBar seen={seen} total={total} />

      {gamePhase === 'complete' ? (
        <CompletionScreen
          correct={correctCount}
          total={totalGuesses}
          onReset={selectedCategory ? resetCategoryProgress : resetGame}
          categoryLabel={selectedCategory}
        />
      ) : currentProject ? (
        <div>
          <AnimatePresence mode="wait">
            <VideoCard
              key={currentProject.id}
              project={currentProject}
              autoplay
            />
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {gamePhase === 'playing' ? (
              <GuessButtons key="buttons" onGuess={makeGuess} disabled={false} />
            ) : (
              <ResultReveal
                key="result"
                project={currentProject}
                userGuess={userGuess}
                isCorrect={isCorrect}
                onNext={handleNext}
              />
            )}
          </AnimatePresence>
        </div>
      ) : null}
    </ArenaLayout>
  )
}

function CompletionScreen({ correct, total, onReset, categoryLabel }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const qualifier =
    pct >= 80 ? 'Sharper than most ISEF judges.'
    : pct >= 60 ? 'Solid judging instincts.'
    : pct >= 40 ? 'A respectable read on the room.'
    : 'The panel is a tougher call than it looks.'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center pt-10 pb-4"
    >
      <div className="type-caption text-[10px] text-white/35 mb-5">
        {categoryLabel ? `${categoryLabel} · Complete` : 'Round Complete'}
      </div>
      <div className="type-display text-7xl sm:text-8xl text-white tabular-nums mb-3">
        {pct}%
      </div>
      <p className="type-body text-base text-white/55 mb-1">
        {qualifier}
      </p>
      <p className="type-caption text-[10px] text-white/35 mb-8 tabular-nums">
        {correct} of {total} correct
      </p>
      <button
        onClick={onReset}
        className="glossy-black-cta px-7 py-3 rounded-2xl type-cta text-sm text-white/85 hover:text-white"
      >
        Start Over
      </button>
    </motion.div>
  )
}
