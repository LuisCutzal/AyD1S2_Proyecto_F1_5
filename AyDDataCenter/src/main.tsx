import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//local imports
import App from './App.tsx'
import './index.css'
import ErrorBoundary from './components/shared/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
  </StrictMode>
)