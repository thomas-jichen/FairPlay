import { Outlet } from 'react-router'

export default function App() {
  return (
    <div className="min-h-screen bg-surface-primary text-text-primary">
      <Outlet />
    </div>
  )
}
