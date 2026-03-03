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
              onClick={() => scrollTo('team')}
              className="text-sm font-light text-text-secondary hover:text-text-primary transition-colors duration-300" style={{ fontFamily: '"Söhne", "Helvetica Neue", -apple-system, sans-serif' }}
            >
              Team
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="text-sm font-light text-text-secondary hover:text-text-primary transition-colors duration-300" style={{ fontFamily: '"Söhne", "Helvetica Neue", -apple-system, sans-serif' }}
            >
              Features
            </button>
          </div>
        </div>
        <a
          href="/app"
          target="_blank"
          rel="noopener noreferrer"
          className="type-cta rounded-full glossy-black-cta px-5 py-2.5 text-sm"
        >
          TRY FAIRPLAY
        </a>
      </div>
    </nav>
  )
}
