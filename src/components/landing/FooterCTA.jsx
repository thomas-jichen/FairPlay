import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router'
import { fadeInUp, staggerContainer } from './animations'

export default function FooterCTA() {
  return (
    <footer>
      {/* Footer bar */}
      <div className="glass-footer py-3">
        <div className="max-w-7xl mx-auto px-12 flex items-center justify-between">
          <span className="type-wordmark text-sm text-text-primary">FairPlay</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs font-light text-text-muted hover:text-text-primary transition-colors duration-300" style={{ letterSpacing: '0.04em' }}>
              Privacy Policy
            </Link>
            <span className="text-xs font-light text-text-muted" style={{ letterSpacing: '0.04em' }}>&copy; {new Date().getFullYear()} FairPlay.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
