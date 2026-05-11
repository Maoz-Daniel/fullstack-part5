import { Link } from 'react-router-dom'

function AuthCard({ title, path, description, actionLabel, onAction }) {
  const alternatePath = path === '/login' ? '/register' : '/login'

  return (
    <section className="panel panel--public">
      <div className="panel__eyebrow">Public Route</div>
      <h1 className="panel__title">{title}</h1>
      <p className="panel__subtitle">{description}</p>

      <dl className="details-list">
        <div className="details-list__row">
          <dt>Path</dt>
          <dd>{path}</dd>
        </div>
        <div className="details-list__row">
          <dt>Guard</dt>
          <dd>Redirects to /home if a session exists in localStorage.</dd>
        </div>
      </dl>

      <div className="button-row">
        <button type="button" className="button" onClick={onAction}>
          {actionLabel}
        </button>
        <Link className="button button--ghost" to={alternatePath}>
          Go to {alternatePath}
        </Link>
      </div>
    </section>
  )
}

export { AuthCard }
