import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav>
      <NavLink to="/" className="brand">🎙️ PodcastAI</NavLink>

      {user ? (
        <>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/items">Scripts</NavLink>
          <NavLink to="/ai">AI Generate</NavLink>
          {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
          <span style={{ color: 'var(--muted)', fontSize: 13, marginLeft: 8 }}>
            {user.username}
          </span>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </>
      )}
    </nav>
  )
}
