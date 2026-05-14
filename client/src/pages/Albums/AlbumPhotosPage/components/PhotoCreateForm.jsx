function PhotoCreateForm({
  newTitle,
  onNewTitleChange,
  newUrl,
  onNewUrlChange,
  newThumbnailUrl,
  onNewThumbnailUrlChange,
  onSubmit,
}) {
  return (
    <form className="auth-form auth-form--grid" onSubmit={onSubmit}>
      <label className="auth-form__field">
        <span className="auth-form__label">Photo title</span>
        <input
          className="auth-form__input"
          type="text"
          value={newTitle}
          onChange={(event) => onNewTitleChange(event.target.value)}
        />
      </label>

      <label className="auth-form__field">
        <span className="auth-form__label">Image URL</span>
        <input
          className="auth-form__input"
          type="text"
          value={newUrl}
          onChange={(event) => onNewUrlChange(event.target.value)}
        />
      </label>

      <label className="auth-form__field">
        <span className="auth-form__label">Thumbnail URL</span>
        <input
          className="auth-form__input"
          type="text"
          value={newThumbnailUrl}
          onChange={(event) => onNewThumbnailUrlChange(event.target.value)}
        />
      </label>

      <div className="button-row">
        <button type="submit" className="button">
          Add photo
        </button>
      </div>
    </form>
  )
}

export { PhotoCreateForm }
