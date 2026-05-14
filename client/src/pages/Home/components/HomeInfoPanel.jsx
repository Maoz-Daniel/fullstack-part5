function HomeInfoPanel({ user }) {
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

export { HomeInfoPanel }
