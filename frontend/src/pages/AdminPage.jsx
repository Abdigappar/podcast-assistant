import { useState, useEffect } from 'react'
import api from '../api'

export default function AdminPage() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [msg,     setMsg]     = useState('')

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    try {
      const res = await api.get('admin/users/')
      setUsers(res.data)
    } catch {
      setError('Failed to load users. Make sure you are an admin.')
    } finally {
      setLoading(false)
    }
  }

  async function handleBlock(id) {
    try {
      const res = await api.patch(`admin/users/${id}/block/`)
      setUsers(prev => prev.map(u =>
        u.id === id ? { ...u, is_blocked: res.data.is_blocked } : u
      ))
      setMsg(`User ${res.data.username} ${res.data.is_blocked ? 'blocked' : 'unblocked'}.`)
      setTimeout(() => setMsg(''), 3000)
    } catch {
      setError('Failed to update user.')
    }
  }

  if (loading) return <div className="page text-center"><span className="spinner" /></div>

  return (
    <div className="page">
      <h1 style={{ marginBottom: 6 }}>Admin Panel 🛡️</h1>
      <p className="text-muted" style={{ marginBottom: 24 }}>Manage all users</p>

      {error && <div className="alert alert-error">{error}</div>}
      {msg   && <div className="alert alert-success">{msg}</div>}

      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="text-muted">#{u.id}</td>
                <td><strong>{u.username}</strong></td>
                <td className="text-muted">{u.email || '—'}</td>
                <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                <td>
                  {u.is_blocked
                    ? <span className="badge badge-blocked">Blocked</span>
                    : <span className="badge badge-published">Active</span>}
                </td>
                <td className="text-muted">{new Date(u.date_joined).toLocaleDateString()}</td>
                <td>
                  {u.role !== 'admin' && (
                    <button
                      className={`btn btn-sm ${u.is_blocked ? 'btn-success' : 'btn-danger'}`}
                      onClick={() => handleBlock(u.id)}
                    >
                      {u.is_blocked ? 'Unblock' : 'Block'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
