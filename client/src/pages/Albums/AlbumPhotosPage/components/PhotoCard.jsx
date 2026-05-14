function PhotoCard({
  photo,
  isEditing,
  editingTitle,
  editingUrl,
  editingThumbnailUrl,
  onEditingTitleChange,
  onEditingUrlChange,
  onEditingThumbnailUrlChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) {
  return (
    <article className="photo-card">
      <img className="photo-card__image" src={photo.thumbnailUrl} alt={photo.title} />

      {isEditing ? (
        <div className="auth-form">
          <label className="auth-form__field">
            <span className="auth-form__label">Title</span>
            <input
              className="auth-form__input"
              type="text"
              value={editingTitle}
              onChange={(event) => onEditingTitleChange(event.target.value)}
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Image URL</span>
            <input
              className="auth-form__input"
              type="text"
              value={editingUrl}
              onChange={(event) => onEditingUrlChange(event.target.value)}
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Thumbnail URL</span>
            <input
              className="auth-form__input"
              type="text"
              value={editingThumbnailUrl}
              onChange={(event) => onEditingThumbnailUrlChange(event.target.value)}
            />
          </label>
        </div>
      ) : (
        <>
          <p className="post-card__meta">Photo #{photo.id}</p>
          <h2 className="post-card__title">{photo.title}</h2>
          <div className="details-list">
            <div className="details-list__row">
              <dt>Image</dt>
              <dd>
                <a href={photo.url} target="_blank" rel="noreferrer">
                  Open full image
                </a>
              </dd>
            </div>
          </div>
        </>
      )}

      <div className="button-row">
        {isEditing ? (
          <>
            <button type="button" className="button" onClick={() => onSaveEdit(photo.id)}>
              Save
            </button>
            <button type="button" className="button button--ghost" onClick={onCancelEdit}>
              Cancel
            </button>
          </>
        ) : (
          <button type="button" className="button button--ghost" onClick={() => onStartEdit(photo)}>
            Edit
          </button>
        )}

        <button type="button" className="button button--ghost" onClick={() => onDelete(photo)}>
          Delete
        </button>
      </div>
    </article>
  )
}

export { PhotoCard }
