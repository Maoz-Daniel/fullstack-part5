import { NavLink, Outlet, useLoaderData, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

const navigationItems = [
  { to: '/home', label: 'Home' },
  { to: '/todos', label: 'Todos' },
  { to: '/posts', label: 'Posts' },
  { to: '/albums', label: 'Albums' },
]

function ProtectedLayout() {
  const navigate = useNavigate()
  const user = useLoaderData()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <section className="panel">
      <div className="panel__eyebrow">Protected App Shell</div>
      <div className="panel__header">
        <div>
          <h1 className="panel__title">Session active</h1>
          <p className="panel__subtitle">
            Logged in as <strong>{user.name ?? user.username}</strong> with user id{' '}
            <strong>{user.id}</strong>.
          </p>
        </div>
        <button type="button" className="button button--ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <nav className="nav-tabs" aria-label="Protected pages">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? 'nav-tabs__link nav-tabs__link--active' : 'nav-tabs__link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Outlet context={user} />
    </section>
  )
}

export { ProtectedLayout }
