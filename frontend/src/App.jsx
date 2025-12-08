import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import NodeJsPage from './pages/NodeJsPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminTechPage from './pages/admin/AdminTechPage'
import AdminTopicPage from './pages/admin/AdminTopicPage'
import AdminQuestionPage from './pages/admin/AdminQuestionPage'
import AdminResourcePage from './pages/admin/AdminResourcePage'



import { useEffect } from 'react'
import api from './api/axios'

import { AuthenticateWithRedirectCallback, useAuth } from '@clerk/clerk-react'

const adminRoute = import.meta.env.VITE_ADMIN_ROUTE;

function App() {
  const { getToken } = useAuth();

  useEffect(() => {
    // Add auth token to requests
    const interceptorId = api.interceptors.request.use(
        async (config) => {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    return () => {
        api.interceptors.request.eject(interceptorId);
    };
  }, [getToken]);

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
        <Route path="/preparation/nodejs" element={<NodeJsPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="contribute" replace />} />
          <Route path="contribute" element={<AdminUsersPage />} />
          <Route path="tech" element={<AdminTechPage />} />
          <Route path="topic" element={<AdminTopicPage />} />
          <Route path="question" element={<AdminQuestionPage />} />
          <Route path="resource" element={<AdminResourcePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
