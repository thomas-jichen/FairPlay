import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Analytics } from '@vercel/analytics/react'
import App from './App'
import LandingLayout from './LandingLayout'
import LandingPage from './pages/LandingPage'
import SettingsPage from './pages/SettingsPage'
import PitchPage from './pages/PitchPage'
import PrivacyPage from './pages/PrivacyPage'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      { index: true, element: <LandingPage /> },
    ],
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
  },
  {
    path: '/app',
    element: <App />,
    children: [
      { index: true, element: <SettingsPage /> },
      { path: 'pitch', element: <PitchPage /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Analytics />
  </StrictMode>
)
