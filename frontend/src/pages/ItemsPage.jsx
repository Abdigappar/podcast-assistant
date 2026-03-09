import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function ItemsPage() {
  const [scripts, setScripts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => { fetchScripts() }, [])

  async function fetchScripts() {
    try {
      const res = await api.get('scripts/')
      setScripts(res.data)
    } catch {
      setError('Failed to load scripts.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this script?')) return
    await api.delete(`scripts/${id}/`)
    setScripts(prev => prev.filter(s => s.id !== id))
  }

  if (loading) return <div className="page text-center"><span className="spinner" /></div>

  return (
    <div className="page">
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <h1>My Scripts</h1>
        <Link to="/items/new" className="btn btn-primary">+ New Script</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {scripts.length === 0 ? (
        <div className="card text-center">
          <p className="text-muted" style={{ marginBottom: 16 }}>You haven't created any scripts yet.</p>
          <Link to="/items/new" className="btn btn-primary">Create Your First Script</Link>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Topic</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scripts.map(s => (
              <tr key={s.id}>
                <td><strong>{s.title}</strong></td>
                <td className="text-muted">{s.topic}</td>
                <td><span className={`badge badge-${s.status}`}>{s.status}</span></td>
                <td className="text-muted">{new Date(s.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <Link to={`/items/${s.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
