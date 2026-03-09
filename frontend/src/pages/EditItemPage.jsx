import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../api'

export default function EditItemPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form,    setForm]    = useState({ title: '', topic: '', content: '', status: 'draft' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    api.get(`scripts/${id}/`)
      .then(res => setForm({
        title:   res.data.title,
        topic:   res.data.topic,
        content: res.data.content,
        status:  res.data.status,
      }))
      .catch(() => setError('Script not found.'))
      .finally(() => setFetching(false))
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.put(`scripts/${id}/`, form)
      navigate('/items')
    } catch {
      setError('Failed to update script.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="page text-center"><span className="spinner" /></div>

  return (
    <div className="page" style={{ maxWidth: 680 }}>
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <h1>Edit Script</h1>
        <Link to="/items" className="btn btn-secondary btn-sm">← Back</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="form-group">
          <label>Title</label>
          <input className="input" name="title" value={form.title} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Topic</label>
          <input className="input" name="topic" value={form.topic} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Script Content</label>
          <textarea className="textarea" name="content" value={form.content}
            onChange={handleChange} rows={12} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select className="select" name="status" value={form.status} onChange={handleChange}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <><span className="spinner" /> Saving...</> : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
