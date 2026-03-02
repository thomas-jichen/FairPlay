import { useState, useEffect } from 'react'
import { Link } from 'react-router'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-navbar' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold tracking-tight text-text-primary">
          FairPlay
        </Link>
        <Link
          to="/app"
          className="rounded-full glass-cta px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try FairPlay
        </Link>
      </div>
    </nav>
  )
}
