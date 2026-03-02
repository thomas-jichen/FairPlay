import { Outlet } from 'react-router'
import Navbar from './components/landing/Navbar'

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-surface-primary text-text-primary overflow-x-hidden relative">
      <Navbar />
      <Outlet />
    </div>
  )
}
