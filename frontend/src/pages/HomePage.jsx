import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="page text-center">
      <div style={{ marginTop: 60 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎙️</div>
        <h1 style={{ fontSize: 42, fontWeight: 700, marginBottom: 12 }}>
          Podcast Script Assistant
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 18, maxWidth: 500, margin: '0 auto 32px' }}>
          Generate professional podcast scripts in seconds using AI. Save, edit, and manage all your scripts in one place.
        </p>

        {user ? (
          <div className="flex gap-3" style={{ justifyContent: 'center' }}>
            <Link to="/ai" className="btn btn-primary">✨ Generate Script</Link>
            <Link to="/items" className="btn btn-secondary">📄 My Scripts</Link>
          </div>
        ) : (
          <div className="flex gap-3" style={{ justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary">Get Started Free</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginTop: 60 }}>
          {[
            { icon: '🤖', title: 'AI-Powered', desc: 'Powered by Groq & LLaMA 3 for lightning-fast generation' },
            { icon: '📝', title: 'Full CRUD', desc: 'Create, edit, save and delete your podcast scripts' },
            { icon: '🔒', title: 'Secure', desc: 'JWT authentication, your scripts are private to you' },
          ].map(f => (
            <div key={f.title} className="card" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{f.icon}</div>
              <h3 style={{ marginBottom: 6 }}>{f.title}</h3>
              <p className="text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
