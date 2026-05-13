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
  const isInfoActive = location.pathname === '/home' && searchParams.get('panel') === 'info'
  const isTodosActive = location.pathname === '/todos'
  const isPostsActive = isPostsRoute(location.pathname)
  const isAlbumsActive = isAlbumsRoute(location.pathname)
  const infoClassName = isInfoActive
    ? 'button protected-nav__link protected-nav__info protected-nav__link--active'
    : 'button button--ghost protected-nav__link protected-nav__info'

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="protected-nav" aria-label="Protected navigation">
      <div className="protected-nav__group">
        <Link className={infoClassName} to="/home?panel=info">
          Info
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
        <button type="button" className="button protected-nav__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export { ProtectedNavigation }
