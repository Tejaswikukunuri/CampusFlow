
import { useEffect, useState, type FormEvent } from 'react'
import App from './App'

const API = 'http://localhost:8080/api/auth'

type User = {
  id: number
  fullName: string
  email: string
}

export default function AuthGate() {
  const [user, setUser] = useState<User | null>(null)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/me`, { credentials: 'include' })
      .then(async response => {
        if (response.ok) setUser(await response.json())
      })
      .catch(() => setError('Cannot connect to the backend. Start Spring Boot on port 8080.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')

    try {
      const endpoint = mode === 'register' ? 'register' : 'login'
      const body = mode === 'register'
        ? { fullName: fullName.trim(), email: email.trim(), password }
        : { email: email.trim(), password }

      const response = await fetch(`${API}/${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const detail = await response.text()
        throw new Error(
          response.status === 409
            ? 'An account with this email already exists. Please sign in.'
            : response.status === 401
              ? 'Email or password is incorrect.'
              : detail || `Request failed (${response.status}).`,
        )
      }

      if (mode === 'register') {
        setMode('login')
        setPassword('')
        setError('Account created. Please sign in with your new account.')
        return
      }

      setUser(await response.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to complete the request.')
    } finally {
      setBusy(false)
    }
  }

  async function logout() {
    try {
      await fetch(`${API}/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      setUser(null)
      setPassword('')
      setMode('login')
    }
  }

  if (loading) {
    return <div style={{ padding: 40, fontFamily: 'sans-serif' }}>Checking your session…</div>
  }

  if (user) {
    return (
      <>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 12,
          padding: '10px 24px',
          background: '#fff',
          borderBottom: '1px solid #e5e9f2',
          fontFamily: 'sans-serif',
          fontSize: 13,
        }}>
          <span>Signed in as <strong>{user.fullName}</strong></span>
          <button onClick={logout} style={{
            border: '1px solid #dce1ec',
            borderRadius: 8,
            background: '#fff',
            padding: '7px 12px',
            cursor: 'pointer',
          }}>Sign out</button>
        </div>
        <App />
      </>
    )
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      background: '#f6f7fb',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <form onSubmit={handleSubmit} style={{
        width: '100%',
        maxWidth: 420,
        padding: 32,
        background: '#fff',
        border: '1px solid #e5e9f2',
        borderRadius: 18,
        boxShadow: '0 12px 40px rgba(25,35,70,.08)',
      }}>
        <div style={{
          width: 44,
          height: 44,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 13,
          background: '#5145e5',
          color: '#fff',
          fontWeight: 800,
          fontSize: 22,
        }}>C</div>

        <h1 style={{ margin: '20px 0 6px', fontSize: 28, color: '#172033' }}>
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p style={{ marginBottom: 24, color: '#68738a', fontSize: 14 }}>
          CampusFlow · Student Success Platform
        </p>

        {mode === 'register' && (
          <label style={{ display: 'block', marginBottom: 16, fontSize: 13 }}>
            Full name
            <input
              required
              maxLength={100}
              autoComplete="name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              style={fieldStyle}
            />
          </label>
        )}

        <label style={{ display: 'block', marginBottom: 16, fontSize: 13 }}>
          Email address
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={fieldStyle}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 16, fontSize: 13 }}>
          Password
          <input
            required
            type="password"
            minLength={8}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={fieldStyle}
          />
        </label>

        {error && (
          <p role="alert" style={{
            padding: 12,
            borderRadius: 8,
            background: '#fff1f2',
            color: '#be123c',
            fontSize: 13,
            overflowWrap: 'anywhere',
          }}>{error}</p>
        )}

        <button disabled={busy} type="submit" style={{
          width: '100%',
          border: 0,
          borderRadius: 9,
          padding: 12,
          background: '#5145e5',
          color: '#fff',
          fontWeight: 700,
          cursor: busy ? 'wait' : 'pointer',
        }}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#68738a' }}>
          {mode === 'login' ? 'New to CampusFlow?' : 'Already have an account?'}{' '}
          <button type="button" onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setError('')
          }} style={{
            border: 0,
            padding: 0,
            background: 'transparent',
            color: '#5145e5',
            fontWeight: 700,
            cursor: 'pointer',
          }}>
            {mode === 'login' ? 'Create account' : 'Sign in'}
          </button>
        </p>
      </form>
    </main>
  )
}

const fieldStyle = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box' as const,
  marginTop: 7,
  padding: 11,
  border: '1px solid #dce1ec',
  borderRadius: 8,
  outlineColor: '#5145e5',
}
