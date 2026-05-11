import { Link, useSearchParams } from 'react-router-dom'

function HomePage() {
  const [searchParams] = useSearchParams()
  const activePanel = searchParams.get('panel') ?? 'default'

  return (
    <section className="panel">
      <div className="panel__eyebrow">Route Placeholder</div>
      <h1 className="panel__title">Home route is ready</h1>
      <p className="panel__subtitle">
        This protected page is now owned by `pages/Home` and keeps the query-string contract for
        the future info panel.
      </p>

      <dl className="details-list">
        <div className="details-list__row">
          <dt>Path</dt>
          <dd>{activePanel === 'default' ? '/home' : `/home?panel=${activePanel}`}</dd>
        </div>
        <div className="details-list__row">
          <dt>Panel</dt>
          <dd>{activePanel}</dd>
        </div>
      </dl>

      <ul className="hint-list">
        <li>The info view stays addressable at `/home?panel=info`.</li>
        <li>Protected routing is still enforced before this page renders.</li>
      </ul>

      <div className="button-row">
        <Link className="button" to="/home?panel=info">
          Open info panel route
        </Link>
        <Link className="button button--ghost" to="/home">
          Reset to /home
        </Link>
      </div>
    </section>
  )
}

export { HomePage }
