import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Admin from './Admin.jsx' // Make sure you created this file from the previous step!

// Simple "Router" to check the current URL
const path = window.location.pathname;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* If the URL ends in /admin, show the Dashboard. Otherwise show the App. */}
    {path === '/admin' ? <Admin /> : <App />}
  </StrictMode>,
)