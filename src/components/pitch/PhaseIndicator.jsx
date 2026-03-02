import { PHASES, PHASE_LABELS } from '../../constants/phases'

const VISIBLE_PHASES = [PHASES.SETUP, PHASES.PITCHING, PHASES.QA, PHASES.REVIEW]

export default function PhaseIndicator({ currentPhase }) {
  const displayPhase = currentPhase === PHASES.COUNTDOWN ? PHASES.SETUP : currentPhase

  return (
    <div className="flex items-center gap-2.5">
      {VISIBLE_PHASES.map((phase, index) => {
        const isActive = phase === displayPhase
        const isPast = VISIBLE_PHASES.indexOf(displayPhase) > index

        return (
          <div key={phase} className="flex items-center gap-2.5">
            {/* Connector line */}
            {index > 0 && (
              <div className={`h-0.5 w-4 rounded-full transition-colors duration-500 bg-white/10`} />
            )}

            {/* Phase Node */}
            <div
              className={`flex items-center gap-2 transition-all duration-500 ${isActive ? 'scale-105' : 'scale-100 opacity-60'}`}
              title={PHASE_LABELS[phase]}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-700 
                ${isActive
                    ? 'bg-accent shadow-[0_0_10px_rgba(14,187,187,0.8)] scale-125'
                    : isPast
                      ? 'bg-accent/40 border border-accent/30'
                      : 'bg-white/10 border border-white/5'
                  }`}
              />
              {isActive && (
                <span className="text-sm font-semibold text-white tracking-wide animate-fade-in whitespace-nowrap">
                  {PHASE_LABELS[phase]}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
