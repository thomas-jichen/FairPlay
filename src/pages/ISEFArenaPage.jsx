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
      showReset={seen > 0 && gamePhase !== 'complete'}
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="text-5xl mb-4">
        {pct >= 70 ? '🏆' : pct >= 50 ? '👏' : '💪'}
      </div>
      <h2 className="text-2xl font-bold text-white/90 mb-2">
        {categoryLabel ? `All ${categoryLabel} projects reviewed!` : 'All projects reviewed!'}
      </h2>
      <p className="text-white/40 mb-6">
        You got <span className="text-white/70 font-semibold">{correct}</span> out of{' '}
        <span className="text-white/70 font-semibold">{total}</span> correct ({pct}%)
      </p>
      <button
        onClick={onReset}
        className="px-6 py-3 rounded-xl font-medium text-sm bg-white/[0.08] border border-white/[0.1] text-white/70 hover:bg-white/[0.12] hover:text-white/90 transition-colors"
      >
        Start Over
      </button>
    </motion.div>
  )
}
