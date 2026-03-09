import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

const EMPTY = { title: '', topic: '', content: '', status: 'draft' }

export default function NewItemPage() {
  const [form,    setForm]    = useState(EMPTY)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.topic.trim()) {
      setError('Title and topic are required.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.post('scripts/', form)
      navigate('/items')
    } catch (err) {
      setError('Failed to create script.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 680 }}>
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <h1>New Script</h1>
        <Link to="/items" className="btn btn-secondary btn-sm">← Back</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="form-group">
          <label>Title *</label>
          <input className="input" name="title" value={form.title}
            onChange={handleChange} placeholder="Episode title..." />
        </div>
        <div className="form-group">
          <label>Topic *</label>
          <input className="input" name="topic" value={form.topic}
            onChange={handleChange} placeholder="Main topic or theme..." />
        </div>
        <div className="form-group">
          <label>Script Content</label>
          <textarea className="textarea" name="content" value={form.content}
            onChange={handleChange} rows={10} placeholder="Write your script here or use AI to generate it..." />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select className="select" name="status" value={form.status} onChange={handleChange}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="spinner" /> Saving...</> : 'Save Script'}
          </button>
          <Link to="/ai" className="btn btn-secondary">✨ Generate with AI first</Link>
        </div>
      </div>
    </div>
  )
}
