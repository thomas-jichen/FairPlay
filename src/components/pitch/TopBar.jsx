import PhaseIndicator from './PhaseIndicator'
import TimerDisplay from './TimerDisplay'
import PaceIndicator from './PaceIndicator'
import FeedbackPills from './FeedbackPills'
import { PHASES } from '../../constants/phases'

export default function TopBar({
  currentPhase,
  timerFormatted,
  isOvertime,
  isInterrupted,
  wpm,
  feedbackScores,
  onNextPhase,
  onEndSession,
}) {
  function renderAction() {
    switch (currentPhase) {
      case PHASES.PITCHING:
        return (
          <button
            type="button"
            onClick={onNextPhase}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white
                       hover:bg-accent-light transition-colors"
          >
            End Pitch
          </button>
        )
      case PHASES.QA:
        return (
          <button
            type="button"
            onClick={onNextPhase}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white
                       hover:bg-accent-light transition-colors"
          >
            End Q&A
          </button>
        )
      case PHASES.REVIEW:
        return (
          <button
            type="button"
            onClick={onEndSession}
            className="rounded-lg border border-border-default bg-surface-tertiary
                       px-4 py-2 text-sm font-medium text-text-secondary
                       hover:text-text-primary transition-colors"
          >
            Back to Settings
          </button>
        )
      default:
        return null
    }
  }

  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between
                    px-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
      <PhaseIndicator currentPhase={currentPhase} />

      {(currentPhase === PHASES.PITCHING || currentPhase === PHASES.QA) && (
        <div className="flex items-center gap-3">
          {isInterrupted && (
            <span className="inline-flex items-center rounded-md bg-accent/20 px-2.5 py-1
                            text-xs font-semibold text-accent animate-pulse">
              PAUSED
            </span>
          )}
          <TimerDisplay formatted={timerFormatted} isOvertime={isOvertime} />
          {!isInterrupted && <PaceIndicator wpm={wpm} />}
          {!isInterrupted && feedbackScores && (
            <FeedbackPills
              confidence={feedbackScores.confidence}
              engagement={feedbackScores.engagement}
              approachability={feedbackScores.approachability}
            />
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        {renderAction()}
      </div>
    </div>
  )
}
