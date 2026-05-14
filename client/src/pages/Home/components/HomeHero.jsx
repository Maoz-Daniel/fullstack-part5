function HomeHero({ userName }) {
  return (
    <header className="home-hero">
      <div className="home-hero__copy">
        <h1 className="panel__title">Good to have you back, {userName}!</h1>
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
  )
}

export { HomeHero }
