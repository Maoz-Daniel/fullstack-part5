import { Link, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

function HomePage() {
  const navigate = useNavigate()
  const user = useOutletContext()
  const { logout } = useAuth()
  const [searchParams] = useSearchParams()
  const activePanel = searchParams.get('panel')

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <section>
      <h1 className="panel__title">{user.name}</h1>
      <p className="panel__subtitle">Choose what you want to open next from the protected area.</p>

      <nav className="button-row" aria-label="Home actions">
        <Link className={activePanel === 'info' ? 'button' : 'button button--ghost'} to="/home?panel=info">
          Info
        </Link>
        <Link className="button button--ghost" to="/todos">
          Todos
        </Link>
        <Link className="button button--ghost" to="/posts">
          Posts
        </Link>
        <Link className="button button--ghost" to="/albums">
          Albums
        </Link>
        <button type="button" className="button button--ghost" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {activePanel === 'info' ? (
        <section className="home-info">
          <h2 className="home-info__title">Info</h2>
          <dl className="details-list">
            <div className="details-list__row">
              <dt>Full name</dt>
              <dd>{user.name}</dd>
            </div>
            <div className="details-list__row">
              <dt>Username</dt>
              <dd>{user.username}</dd>
            </div>
            <div className="details-list__row">
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="details-list__row">
              <dt>Phone</dt>
              <dd>{user.phone}</dd>
            </div>
            <div className="details-list__row">
              <dt>Website</dt>
              <dd>{user.website}</dd>
            </div>
          </dl>
        </section>
      ) : null}
    </section>
  )
}

export { HomePage }
