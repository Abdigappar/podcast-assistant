import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function LoginPage() {
  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('auth/login/', form)
      login(res.data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <h2 style={{ marginBottom: 24 }}>Welcome back 👋</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="form-group">
          <label>Username</label>
          <input className="input" name="username" value={form.username}
            onChange={handleChange} placeholder="your_username" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input className="input" type="password" name="password" value={form.password}
            onChange={handleChange} placeholder="••••••••" />
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }}
          onClick={handleSubmit} disabled={loading}>
          {loading ? <><span className="spinner" /> Logging in...</> : 'Login'}
        </button>
      </div>

      <p className="text-center mt-2 text-muted">
        No account? <Link to="/register">Register here</Link>
      </p>
    </div>
  )
}
