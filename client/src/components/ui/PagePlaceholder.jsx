import { Link } from 'react-router-dom'

function PagePlaceholder({ title, path, description, hints, children }) { 
  return (
    <section className="panel">
      <div className="panel__eyebrow">Route Placeholder</div>
      <h1 className="panel__title">{title}</h1>
      <p className="panel__subtitle">{description}</p>

      <dl className="details-list">
        <div className="details-list__row">
          <dt>Path</dt>
          <dd>{path}</dd>
        </div>
        <div className="details-list__row">
          <dt>Status</dt>
          <dd>Resolved by the router and guarded by loaders.</dd>
        </div>
      </dl>

      <ul className="hint-list">
        {hints.map((hint) => (
          <li key={hint}>{hint}</li>
        ))}
      </ul>

      {children}

      <div className="button-row">
        <Link className="button button--ghost" to="/home">
          Back to /home
        </Link>
      </div>
    </section>
  )
}

export { PagePlaceholder }
