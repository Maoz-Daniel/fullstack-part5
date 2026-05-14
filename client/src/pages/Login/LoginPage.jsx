import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { getUserByUsername } from '../../services/authService.js'
import { validateLoginValues } from './validation.js'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const validationError = validateLoginValues({ username, password })

    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const user = await getUserByUsername(username.trim()) 

      if (!user || user.website !== password) {
        setError('Invalid username or password.')
        return
      }

      login(user)
      navigate('/home')
    } catch {
      setError('Login failed. Please try again.')
    }
  }

  return (
    <section className="panel panel--public">
      <div className="panel__eyebrow">Welcome back</div>
      <h1 className="panel__title">Login</h1>
      <p className="panel__subtitle">
        Enter your username and website password to open your session.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-form__field">
          <span className="auth-form__label">Username</span>
          <input
            className="auth-form__input"
            type="text"
            name="username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value)
              if (error) {
                setError('')
              }
            }}
          />
        </label>

        <label className="auth-form__field">
          <span className="auth-form__label">Password</span>
          <input
            className="auth-form__input"
            type="password"
            name="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              if (error) {
                setError('')
              }
            }}
          />
        </label>

        {error ? <p className="auth-form__error">{error}</p> : null}

        <div className="button-row">
          <button type="submit" className="button">
            Login
          </button>
          <Link className="button button--ghost" to="/register">
            Go to register
          </Link>
        </div>
      </form>
    </section>
  )
}

export { LoginPage }
