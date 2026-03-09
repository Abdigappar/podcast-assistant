import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function DashboardPage() {
  const { user } = useAuth()
  const [scripts, setScripts] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('scripts/'),
      api.get('ai/history/'),
    ]).then(([sRes, hRes]) => {
      setScripts(sRes.data)
      setHistory(hRes.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page text-center"><span className="spinner" /></div>

  return (
    <div className="page">
      <h1 style={{ marginBottom: 6 }}>Hello, {user.username} 👋</h1>
      <p className="text-muted" style={{ marginBottom: 32 }}>Here's your overview</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
        <div className="card text-center">
          <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--accent)' }}>{scripts.length}</div>
          <div className="text-muted">Total Scripts</div>
        </div>
        <div className="card text-center">
          <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--accent)' }}>
            {scripts.filter(s => s.status === 'published').length}
          </div>
          <div className="text-muted">Published</div>
        </div>
        <div className="card text-center">
          <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--accent)' }}>{history.length}</div>
          <div className="text-muted">AI Generations</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3" style={{ marginBottom: 32 }}>
        <Link to="/items/new" className="btn btn-primary">+ New Script</Link>
        <Link to="/ai" className="btn btn-secondary">✨ Generate with AI</Link>
        <Link to="/items" className="btn btn-secondary">📄 All Scripts</Link>
      </div>

      {/* Recent scripts */}
      <h2 style={{ marginBottom: 16 }}>Recent Scripts</h2>
      {scripts.length === 0 ? (
        <div className="card text-center">
          <p className="text-muted">No scripts yet. <Link to="/items/new">Create your first one!</Link></p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {scripts.slice(0, 5).map(s => (
            <div key={s.id} className="card flex-between">
              <div>
                <strong>{s.title}</strong>
                <p className="text-muted mt-1">{s.topic}</p>
              </div>
              <div className="flex gap-2" style={{ alignItems: 'center' }}>
                <span className={`badge badge-${s.status}`}>{s.status}</span>
                <Link to={`/items/${s.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
