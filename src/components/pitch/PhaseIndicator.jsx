import { PHASES, PHASE_LABELS } from '../../constants/phases'

const VISIBLE_PHASES = [PHASES.SETUP, PHASES.PITCHING, PHASES.QA, PHASES.REVIEW]

export default function PhaseIndicator({ currentPhase }) {
  const displayPhase = currentPhase === PHASES.COUNTDOWN ? PHASES.SETUP : currentPhase

  return (
    <div className="flex items-center gap-1">
      {VISIBLE_PHASES.map((phase, index) => {
        const isActive = phase === displayPhase
        const isPast = VISIBLE_PHASES.indexOf(displayPhase) > index

        return (
          <div key={phase} className="flex items-center gap-1">
            {index > 0 && (
              <div className={`h-px w-4 ${isPast ? 'bg-accent' : 'bg-border-default'}`} />
            )}
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors
                ${isActive
                  ? 'bg-accent text-white'
                  : isPast
                    ? 'bg-accent/20 text-accent'
                    : 'bg-surface-tertiary text-text-muted'
                }`}
            >
              {PHASE_LABELS[phase]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
