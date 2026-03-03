import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router'
import { fadeInUp, staggerContainer } from './animations'

export default function FooterCTA() {
  return (
    <footer>
      {/* Privacy Promise */}
      <div className="max-w-2xl mx-auto text-center px-6 pt-1 pb-16">
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 rounded-full bg-black/[0.03] border border-black/[0.06] flex items-center justify-center">
            <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
        </div>
        <h3 className="type-title text-xl text-text-primary mb-3">Your Research Stays Yours</h3>
        <p className="type-body text-sm text-text-secondary leading-relaxed max-w-lg mx-auto mb-6">
          We never store your abstracts, posters, or recordings. All data is processed in real time and permanently discarded after each session. Our AI models are never trained on your work.
        </p>
        <Link
          to="/privacy"
          className="inline-flex items-center gap-2 text-xs font-medium text-text-muted hover:text-text-primary transition-colors duration-300"
          style={{ letterSpacing: '0.04em', fontFamily: '"Montserrat", sans-serif' }}
        >
          Read our full IP & Privacy Policy
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

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
