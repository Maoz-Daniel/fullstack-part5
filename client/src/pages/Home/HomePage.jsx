import { useOutletContext, useSearchParams } from 'react-router-dom'

function HomePage() {
  const user = useOutletContext()
  const [searchParams] = useSearchParams()
  const activePanel = searchParams.get('panel')

  if (activePanel === 'info') {
    return (
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
        </dl>
      </section>
    )
  }

  return (
    <section className="home-dashboard">
      <header className="home-hero">
        <div className="home-hero__copy">
          <h1 className="panel__title">Good to have you back, {user.name}!</h1>
          <p className="panel__subtitle">
            Your workspace is ready. Jump into your tasks, open a writing flow, or browse the
            visual side of the project without losing your place.
          </p>
        </div>

        <div className="home-hero__card">
          <p className="home-hero__label">Workspace note</p>
          <h2 className="home-hero__card-title">Everything is set up for a smooth return.</h2>
          <p className="home-hero__card-text">
            Use the navigation above as your fixed anchor, then let each section pull you into a
            different working mode without losing the overall flow of the app.
          </p>
        </div>
      </header>

      <div className="home-grid">
        <article className="home-feature home-feature--primary">
          <div className="home-feature__content">
            <p className="home-feature__kicker">Next move</p>
            <h2 className="home-feature__title">Pick the area that fits your momentum.</h2>
            <p className="home-feature__text">
              The app is split into three distinct flows: practical task tracking, long-form post
              work, and gallery-style album management.
            </p>
          </div>
        </article>

        <article className="home-feature home-feature--accent">
          <p className="home-feature__kicker">How this space works</p>
          <h2 className="home-feature__title">One account, three different rhythms.</h2>
          <ul className="home-feature__list">
            <li>Todos keep the practical checklist close and sortable.</li>
            <li>Posts give you a reading-first flow with comments and ownership.</li>
            <li>Albums open into progressive photo batches for lighter browsing.</li>
          </ul>
        </article>
      </div>
    </section>
  )
}

export { HomePage }
