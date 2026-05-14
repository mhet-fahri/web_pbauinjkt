import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n/config'
import App from './App.jsx'

const getBasename = () => {
  const match = window.location.pathname.match(/^\/(ar|en)(\/|$)/);
  return match ? `/${match[1]}` : '/';
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={getBasename()}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
