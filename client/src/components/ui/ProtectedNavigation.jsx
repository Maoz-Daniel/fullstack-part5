import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

function getNavButtonClass(isActive) {
  return isActive ? 'button protected-nav__link protected-nav__link--active' : 'button button--ghost protected-nav__link'
}

function isPostsRoute(pathname) {
  return pathname === '/posts' || pathname.includes('/posts/')
}

function isAlbumsRoute(pathname) {
  return pathname === '/albums' || pathname.includes('/albums/')
}

function ProtectedNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const searchParams = new URLSearchParams(location.search)
  const isHomeActive = location.pathname === '/home' && searchParams.get('panel') !== 'info'
  const isInfoActive = location.pathname === '/home' && searchParams.get('panel') === 'info'
  const isTodosActive = location.pathname === '/todos'
  const isPostsActive = isPostsRoute(location.pathname)
  const isAlbumsActive = isAlbumsRoute(location.pathname)
  const accountClassName = isInfoActive
    ? 'button protected-nav__account protected-nav__account--active'
    : 'button button--ghost protected-nav__account'

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="protected-nav" aria-label="Protected navigation">
      <div className="protected-nav__group">
        <Link className={getNavButtonClass(isHomeActive)} to="/home">
          Home
        </Link>
        <Link className={getNavButtonClass(isTodosActive)} to="/todos">
          Todos
        </Link>
        <Link className={getNavButtonClass(isPostsActive)} to="/posts">
          Posts
        </Link>
        <Link className={getNavButtonClass(isAlbumsActive)} to="/albums">
          Albums
        </Link>
      </div>

      <div className="protected-nav__actions">
        <Link className={accountClassName} to="/home?panel=info" aria-label="Account info">
          <svg
            className="protected-nav__account-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="8" r="4" />
          </svg>
        </Link>
        <button type="button" className="button protected-nav__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export { ProtectedNavigation }
