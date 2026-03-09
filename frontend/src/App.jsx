import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Navbar        from './components/Navbar'
import HomePage      from './pages/HomePage'
import LoginPage     from './pages/LoginPage'
import RegisterPage  from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ItemsPage     from './pages/ItemsPage'
import NewItemPage   from './pages/NewItemPage'
import EditItemPage  from './pages/EditItemPage'
import AIPage        from './pages/AIPage'
import AdminPage     from './pages/AdminPage'


function PrivateRoute({ children }) {
  const token = localStorage.getItem('access_token')
  return token ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"          element={<HomePage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />

        {/* Protected */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/items"     element={<PrivateRoute><ItemsPage /></PrivateRoute>} />
        <Route path="/items/new" element={<PrivateRoute><NewItemPage /></PrivateRoute>} />
        <Route path="/items/:id/edit" element={<PrivateRoute><EditItemPage /></PrivateRoute>} />
        <Route path="/ai"        element={<PrivateRoute><AIPage /></PrivateRoute>} />

        {/* Admin only */}
        <Route path="/admin"     element={<AdminRoute><AdminPage /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
