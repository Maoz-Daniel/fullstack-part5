function AlbumsHero({
  visibleCount,
  searchTerm,
  onSearchChange,
  newTitle,
  onNewTitleChange,
  onSubmit,
}) {
  return (
    <div className="albums-hero">
      <div className="albums-hero__copy">
        <p className="albums-hero__eyebrow">Collection view</p>
        <h2 className="albums-hero__title">{visibleCount} albums ready to open</h2>
        <p className="panel__subtitle">
          The gallery stays front and center while the curation tools sit quietly just above it.
        </p>
      </div>

      <div className="albums-hero__panel">
        <label className="auth-form__field albums-hero__field">
          <span className="auth-form__label">Search</span>
          <input
            className="auth-form__input"
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <form className="auth-form albums-hero__form" onSubmit={onSubmit}>
          <label className="auth-form__field albums-hero__field">
            <span className="auth-form__label">Add album</span>
            <input
              className="auth-form__input"
              type="text"
              value={newTitle}
              onChange={(event) => onNewTitleChange(event.target.value)}
            />
          </label>

          <div className="button-row albums-hero__actions">
            <button type="submit" className="button">
              Create album
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export { AlbumsHero }
