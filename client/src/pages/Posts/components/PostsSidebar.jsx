function PostsSidebar({
  searchTerm,
  onSearchChange,
  newTitle,
  onNewTitleChange,
  newBody,
  onNewBodyChange,
  onSubmit,
}) {
  return (
    <aside className="posts-sidebar">
      <div className="posts-sidebar__section">
        <p className="posts-sidebar__eyebrow">Compose</p>
        <h2 className="posts-sidebar__title">Write and refine</h2>
        <p className="panel__subtitle">
          Keep the writing tools nearby while the main column stays focused on the posts themselves.
        </p>
      </div>

      <div className="posts-toolbar">
        <label className="auth-form__field">
          <span className="auth-form__label">Search</span>
          <input
            className="auth-form__input"
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
      </div>

      <form className="auth-form posts-sidebar__form" onSubmit={onSubmit}>
        <label className="auth-form__field">
          <span className="auth-form__label">Post title</span>
          <input
            className="auth-form__input"
            type="text"
            value={newTitle}
            onChange={(event) => onNewTitleChange(event.target.value)}
          />
        </label>

        <label className="auth-form__field">
          <span className="auth-form__label">Post body</span>
          <textarea
            className="auth-form__input auth-form__textarea"
            value={newBody}
            onChange={(event) => onNewBodyChange(event.target.value)}
          />
        </label>

        <div className="button-row">
          <button type="submit" className="button">
            Create post
          </button>
        </div>
      </form>
    </aside>
  )
}

export { PostsSidebar }
