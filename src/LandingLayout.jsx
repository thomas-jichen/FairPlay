import { Outlet } from 'react-router'
import Navbar from './components/landing/Navbar'

export default function LandingLayout() {
  return (
    <div className="snap-scroll-container bg-surface-primary text-text-primary relative" id="landing-scroll-container">
      {/* Ambient liquid glass blob layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <div className="liquid-blob liquid-blob-1 -top-[15%] -left-[10%] w-[55%] h-[55%] bg-[rgba(251,191,146,0.40)]" />
        <div className="liquid-blob liquid-blob-2 top-[25%] -right-[12%] w-[45%] h-[50%] bg-[rgba(167,199,231,0.35)]" />
        <div className="liquid-blob liquid-blob-3 -bottom-[15%] left-[15%] w-[50%] h-[55%] bg-[rgba(232,180,191,0.32)]" />
        <div className="liquid-blob liquid-blob-4 top-[50%] left-[30%] w-[40%] h-[45%] bg-[rgba(196,181,228,0.28)]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}
