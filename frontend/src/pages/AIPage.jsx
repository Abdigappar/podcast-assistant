import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function AIPage() {
  const [prompt,  setPrompt]  = useState('')
  const [result,  setResult]  = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(null)

  // Load history when page opens
  useEffect(() => {
    api.get('ai/history/').then(res => setHistory(res.data))
  }, [])

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setResult('')
    try {
      const res = await api.post('ai/generate/', { prompt })
      setResult(res.data.result)

      // Prepend to local history
      const newItem = {
        id:         Date.now(),
        prompt,
        result:     res.data.result,
        created_at: new Date().toISOString(),
      }
      setHistory(prev => [newItem, ...prev].slice(0, 10))
    } catch (err) {
      setResult('❌ Error: ' + (err.response?.data?.error || 'Something went wrong.'))
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <div className="page">
      <h1 style={{ marginBottom: 6 }}>✨ AI Script Generator</h1>
      <p className="text-muted" style={{ marginBottom: 28 }}>
        Describe your podcast topic and get a full script in seconds.
      </p>

      {/* Input Area */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="form-group">
          <label>What's your podcast episode about?</label>
          <textarea
            className="textarea"
            rows={4}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. 'An episode about the history of jazz and how it influenced modern hip-hop'"
          />
        </div>
        <div className="flex gap-3">
          <button className="btn btn-primary" onClick={handleGenerate} disabled={loading || !prompt.trim()}>
            {loading ? <><span className="spinner" /> Generating...</> : '✨ Generate Script'}
          </button>
          <button className="btn btn-secondary" onClick={() => setPrompt('')}>Clear</button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="card" style={{ marginBottom: 32, borderColor: 'var(--accent)' }}>
          <div className="flex-between" style={{ marginBottom: 16 }}>
            <h3>Generated Script</h3>
            <div className="flex gap-2">
              <button className="btn btn-secondary btn-sm" onClick={() => copyToClipboard(result)}>
                📋 Copy
              </button>
              <Link
                to="/items/new"
                className="btn btn-primary btn-sm"
                state={{ content: result, topic: prompt }}
              >
                💾 Save as Script
              </Link>
            </div>
          </div>
          <pre style={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'var(--font)',
            lineHeight: 1.7,
            color: 'var(--text)',
            fontSize: 14,
          }}>
            {result}
          </pre>
        </div>
      )}

      {/* History Section — shows at least 5 items */}
      <h2 style={{ marginBottom: 16 }}>
        Recent Generations
        <span className="text-muted" style={{ fontSize: 14, marginLeft: 8, fontWeight: 400 }}>
          (last {history.length})
        </span>
      </h2>

      {history.length === 0 ? (
        <div className="card text-center">
          <p className="text-muted">No generations yet. Try generating a script above!</p>
        </div>
      ) : (
        history.map((item, index) => (
          <div key={item.id || index} className="history-item">
            <div className="prompt">💬 {item.prompt}</div>
            <div className="preview">
              {expanded === index
                ? item.result
                : item.result.slice(0, 180) + (item.result.length > 180 ? '...' : '')}
            </div>
            <div className="flex-between mt-1">
              <span className="timestamp">
                🕐 {new Date(item.created_at).toLocaleString()}
              </span>
              <div className="flex gap-2">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setExpanded(expanded === index ? null : index)}
                >
                  {expanded === index ? 'Show less' : 'Read more'}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => copyToClipboard(item.result)}
                >
                  📋 Copy
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
