import { useState, useEffect } from 'react'
import { Link } from 'react-router'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const container = document.getElementById('landing-scroll-container')
    if (!container) return
    const handleScroll = () => setScrolled(container.scrollTop > 60)
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-navbar' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="type-wordmark text-lg text-text-primary">
            FairPlay
          </Link>
          <div className="flex items-center gap-6">
            <button
              onClick={() => scrollTo('team')}
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-300"
            >
              Team
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-300"
            >
              Features
            </button>
          </div>
        </div>
        <Link
          to="/app"
          className="type-cta rounded-full glass-cta px-5 py-2.5 text-sm text-white"
        >
          Try FairPlay
        </Link>
      </div>
    </nav>
  )
}
