function HomeFeatureGrid() {
  return (
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
  )
}

export { HomeFeatureGrid }
