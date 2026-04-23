import { Link } from 'react-router'

export default function Navbar() {
  const scrollTo = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent pointer-events-none">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-8">
          <button
            onClick={() => scrollTo('top')}
            className="type-wordmark text-lg text-text-primary"
          >
            FAIRPLAY
          </button>
          <div className="flex items-center gap-6">
            <button
              onClick={() => scrollTo('features')}
              className="text-sm font-light text-text-secondary hover:text-text-primary transition-colors duration-300" style={{ fontFamily: '"Söhne", "Helvetica Neue", -apple-system, sans-serif' }}
            >
              Features
            </button>
            <button
              onClick={() => scrollTo('team')}
              className="text-sm font-light text-text-secondary hover:text-text-primary transition-colors duration-300" style={{ fontFamily: '"Söhne", "Helvetica Neue", -apple-system, sans-serif' }}
            >
              Team
            </button>
            <Link
              to="/privacy"
              onClick={() => window.scrollTo(0, 0)}
              className="text-sm font-light text-text-secondary hover:text-text-primary transition-colors duration-300" style={{ fontFamily: '"Söhne", "Helvetica Neue", -apple-system, sans-serif' }}
            >
              Privacy
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/isefarena"
            target="_blank"
            rel="noopener noreferrer"
            className="type-cta rounded-full px-5 py-2.5 text-sm text-white no-underline hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            style={{
              background: 'linear-gradient(165deg, rgba(255,160,60,0.95) 0%, rgba(220,120,20,0.98) 40%, rgba(180,80,0,0.98) 100%)',
              border: '1px solid rgba(255,180,100,0.4)',
              boxShadow: '0 4px 16px rgba(200,100,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            TRY JUDGING
          </Link>
          <a
            href="/app"
            target="_blank"
            rel="noopener noreferrer"
            className="type-cta rounded-full glossy-black-cta px-5 py-2.5 text-sm"
          >
            TRY PITCHING
          </a>
        </div>
      </div>
    </nav>
  )
}
