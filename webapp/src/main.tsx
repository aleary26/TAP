import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PlatformProvider } from './contexts/PlatformContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlatformProvider>
      <App />
    </PlatformProvider>
  </StrictMode>,
)
