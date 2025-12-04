import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'

import { useEffect } from 'react'
import api from './api/axios'

import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'

function App() {
  useEffect(() => {
    api.get('/health')
      .then(res => console.log('Backend connection successful:', res.data))
      .catch(err => console.error('Backend connection failed:', err));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/sso-callback" element={<AuthenticateWithRedirectCallback />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
