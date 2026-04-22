import { Link } from 'react-router'

export default function ArenaFooterCTA() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-6">


      {/* Tagline */}
      <p className="type-body text-[14px] sm:text-md text-white/40 text-center leading-relaxed">
        Think you can spot a Grand Award winner? Judge every ISEF 2025 finalist and find out.
      </p>

      {/* Fairplay ad card */}
      <Link
        to="/"
        className="glass-panel-dark group mt-5 block rounded-2xl p-6 sm:p-7 ring-1 ring-amber-400/10 hover:ring-amber-400/25 no-underline"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex-1 min-w-0">
            <div className="type-caption text-[10px] text-amber-400/80 mb-2">
              From the team behind ISEF Arena
            </div>
            <h3 className="type-title text-lg sm:text-xl text-white/95 mb-1.5">
              Practice like the real thing.
            </h3>
            <p className="type-body text-sm text-white/55 leading-relaxed">
              Fairplay simulates full judging rounds: pitch, Q&amp;A, rubric feedback, and more with poster and abstract context, so you'll be ready before judging.
            </p>
          </div>
          <div className="shrink-0">
            <span className="glossy-black-cta inline-flex items-center gap-2 rounded-full px-5 py-2.5 type-cta text-sm">
              Try Fairplay
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </span>
          </div>
        </div>
      </Link>
    </section>
  )
}
