import { create } from 'zustand'

const STORAGE_KEY = 'isef_arena_state'

function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    return JSON.parse(saved)
  } catch {
    return null
  }
}

function persistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      seenProjectIds: [...state.seenProjectIds],
      categoryScores: state.categoryScores,
    }))
  } catch {}
}

function pickRandom(projects, seenIds) {
  const unseen = projects.filter(p => !seenIds.has(p.id))
  if (unseen.length === 0) return null
  return unseen[Math.floor(Math.random() * unseen.length)]
}

function getCorrectAnswer(project) {
  if (project.placedGrandAward) return 'grand'
  if (project.awards?.includes('Special Award')) return 'special'
  return 'none'
}

const useArenaStore = create((set, get) => ({
  // Data
  allProjects: [],
  currentProject: null,

  // Game state
  gamePhase: 'playing', // 'playing' | 'revealed' | 'complete'
  userGuess: null, // 'grand' | 'special' | 'none'
  isCorrect: null,

  // Scores — per category, keyed by categoryCode (null key = "all")
  // { [categoryCode|'all']: { correctCount, totalGuesses } }
  categoryScores: {},

  // Tracking
  seenProjectIds: new Set(),

  // Filter
  selectedCategory: null,

  // Actions
  initGame: (projects) => {
    const saved = loadSavedState()
    const seenIds = new Set(saved?.seenProjectIds || [])
    const categoryScores = saved?.categoryScores || {}

    const first = pickRandom(projects, seenIds)

    set({
      allProjects: projects,
      seenProjectIds: seenIds,
      categoryScores,
      currentProject: first,
      gamePhase: first ? 'playing' : 'complete',
      userGuess: null,
      isCorrect: null,
      selectedCategory: null,
    })
  },

  makeGuess: (guess) => {
    const { currentProject, seenProjectIds, categoryScores, selectedCategory } = get()
    if (!currentProject) return

    const correctAnswer = getCorrectAnswer(currentProject)
    const isCorrect = guess === correctAnswer
    const newSeen = new Set(seenProjectIds)
    newSeen.add(currentProject.id)

    const scoreKey = selectedCategory || 'all'
    const prev = categoryScores[scoreKey] || { correctCount: 0, totalGuesses: 0 }
    const newScores = {
      ...categoryScores,
      [scoreKey]: {
        correctCount: prev.correctCount + (isCorrect ? 1 : 0),
        totalGuesses: prev.totalGuesses + 1,
      },
    }

    const newState = {
      userGuess: guess,
      isCorrect,
      gamePhase: 'revealed',
      seenProjectIds: newSeen,
      categoryScores: newScores,
    }

    set(newState)
    persistState({ ...get(), ...newState })
  },

  nextProject: () => {
    const { allProjects, seenProjectIds, selectedCategory } = get()

    let pool = allProjects
    if (selectedCategory) {
      pool = allProjects.filter(p => p.categoryCode === selectedCategory)
    }

    const next = pickRandom(pool, seenProjectIds)

    set({
      currentProject: next,
      gamePhase: next ? 'playing' : 'complete',
      userGuess: null,
      isCorrect: null,
    })
  },

  peekNextProject: () => {
    const { allProjects, seenProjectIds, selectedCategory, currentProject } = get()

    let pool = allProjects
    if (selectedCategory) {
      pool = allProjects.filter(p => p.categoryCode === selectedCategory)
    }

    // Exclude current project from peek
    const peekSeen = new Set(seenProjectIds)
    if (currentProject) peekSeen.add(currentProject.id)

    return pickRandom(pool, peekSeen)
  },

  setCategory: (categoryCode) => {
    const { allProjects, seenProjectIds } = get()

    let pool = allProjects
    if (categoryCode) {
      pool = allProjects.filter(p => p.categoryCode === categoryCode)
    }

    const next = pickRandom(pool, seenProjectIds)

    set({
      selectedCategory: categoryCode,
      currentProject: next,
      gamePhase: next ? 'playing' : 'complete',
      userGuess: null,
      isCorrect: null,
    })
  },

  resetGame: () => {
    const { allProjects, selectedCategory } = get()
    let pool = allProjects
    if (selectedCategory) {
      pool = allProjects.filter(p => p.categoryCode === selectedCategory)
    }

    const first = pickRandom(pool, new Set())

    set({
      seenProjectIds: new Set(),
      categoryScores: {},
      currentProject: first,
      gamePhase: first ? 'playing' : 'complete',
      userGuess: null,
      isCorrect: null,
    })

    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  },

  resetCategoryProgress: () => {
    const { allProjects, seenProjectIds, selectedCategory, categoryScores } = get()
    if (!selectedCategory) return

    const categoryProjectIds = new Set(
      allProjects
        .filter(p => p.categoryCode === selectedCategory)
        .map(p => p.id)
    )

    const newSeen = new Set([...seenProjectIds].filter(id => !categoryProjectIds.has(id)))
    const newScores = { ...categoryScores }
    delete newScores[selectedCategory]

    const pool = allProjects.filter(p => p.categoryCode === selectedCategory)
    const first = pickRandom(pool, newSeen)

    set({
      seenProjectIds: newSeen,
      categoryScores: newScores,
      currentProject: first,
      gamePhase: first ? 'playing' : 'complete',
      userGuess: null,
      isCorrect: null,
    })

    persistState({ ...get(), seenProjectIds: newSeen, categoryScores: newScores })
  },

}))

export default useArenaStore
