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
            className="type-cta rounded-full glossy-black-cta px-5 py-2 text-sm
                       transition-all duration-300 hover:scale-105 active:scale-95"
          >
            End Pitch
          </button>
        )
      case PHASES.QA:
        return (
          <button
            type="button"
            onClick={onNextPhase}
            className="type-cta rounded-full glossy-black-cta px-5 py-2 text-sm
                       transition-all duration-300 hover:scale-105 active:scale-95"
          >
            End Q&A
          </button>
        )
      case PHASES.REVIEW:
        return (
          <button
            type="button"
            onClick={onEndSession}
            className="glass-pill hover:bg-white/60
                       px-5 py-2 text-sm font-medium text-text-primary shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Back to Settings
          </button>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full flex items-center justify-between gap-4">
      {/* Left side: Phase Indicator */}
      <div className="flex-1 flex justify-start -ml-2">
        <div className="glass-pill no-shimmer shadow-lg pl-2 pr-4 py-1.5 flex items-center">
          <PhaseIndicator currentPhase={currentPhase} />
        </div>
      </div>

      {/* Center: Timer, Feedback Metrics & Pace Slider */}
      {(currentPhase === PHASES.PITCHING || currentPhase === PHASES.QA) && (
        <div className="glass-pill no-shimmer px-6 py-2.5 flex flex-col items-center gap-2 shadow-2xl">
          {/* Top row: Timer + Feedback Pills */}
          <div className="flex items-center gap-6">
            {isInterrupted && (
              <span className="inline-flex items-center rounded-full bg-red-100 border border-red-200 px-3 py-1 text-xs font-bold tracking-wide uppercase text-red-600 animate-[pulse_2s_infinite] shadow-sm">
                PAUSED
              </span>
            )}
            <TimerDisplay formatted={timerFormatted} isOvertime={isOvertime} />

            {!isInterrupted && feedbackScores && (
              <>
                <div className="w-px h-6 bg-black/10" />
                <FeedbackPills
                  confidence={feedbackScores.confidence}
                  engagement={feedbackScores.engagement}
                  approachability={feedbackScores.approachability}
                />
              </>
            )}
          </div>

          {/* Bottom row: Pace Slider */}
          {!isInterrupted && (
            <div className="w-full min-w-[280px]">
              <PaceIndicator wpm={wpm} />
            </div>
          )}
        </div>
      )}

      {/* Right side: Actions */}
      <div className="flex-1 flex justify-end">
        {renderAction()}
      </div>
    </div>
  )
}
