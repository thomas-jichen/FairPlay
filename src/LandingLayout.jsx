import { Outlet } from 'react-router'
import Navbar from './components/landing/Navbar'

export default function LandingLayout() {
  return (
    <div className="snap-scroll-container bg-surface-primary text-text-primary relative" id="landing-scroll-container">
      {/* Ambient liquid glass blob layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <div className="liquid-blob liquid-blob-1 -top-[18%] -left-[12%] w-[55%] h-[55%] bg-[rgba(255,185,135,0.70)]" />
        <div className="liquid-blob liquid-blob-2 top-[20%] -right-[15%] w-[50%] h-[55%] bg-[rgba(160,195,232,0.67)]" />
        <div className="liquid-blob liquid-blob-3 -bottom-[20%] left-[8%] w-[55%] h-[55%] bg-[rgba(238,180,200,0.62)]" />
        <div className="liquid-blob liquid-blob-4 top-[58%] left-[14%] w-[38%] h-[42%] bg-[rgba(195,178,225,0.42)]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}
