import { Link } from 'react-router-dom'

function PostCard({
  post,
  isOwner,
  isSelected,
  isEditing,
  editingTitle,
  editingBody,
  onEditingTitleChange,
  onEditingBodyChange,
  onSelect,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) {
  return (
    <article className={isSelected ? 'post-card post-card--selected' : 'post-card'}>
      <div className="post-card__header">
        {isEditing ? (
          <div className="post-card__select">
            <p className="post-card__meta">Post #{post.id}</p>
            <>
              <input
                className="auth-form__input"
                type="text"
                value={editingTitle}
                onChange={(event) => onEditingTitleChange(event.target.value)}
              />
              <textarea
                className="auth-form__input auth-form__textarea"
                value={editingBody}
                onChange={(event) => onEditingBodyChange(event.target.value)}
              />
            </>
          </div>
        ) : (
          <button type="button" className="post-card__select" onClick={() => onSelect(post.id)}>
            <p className="post-card__meta">Post #{post.id}</p>
            <h2 className="post-card__title">{post.title}</h2>
          </button>
        )}

        <div className="post-card__actions">
          <Link className="button button--ghost" to={`/users/${post.userId}/posts/${post.id}`}>
            Open comments
          </Link>

          {isOwner ? (
            isEditing ? (
              <>
                <button type="button" className="button" onClick={() => onSaveEdit(post.id)}>
                  Save
                </button>
                <button type="button" className="button button--ghost" onClick={onCancelEdit}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button type="button" className="button button--ghost" onClick={() => onStartEdit(post)}>
                  Edit
                </button>
                <button type="button" className="button button--ghost" onClick={() => onDelete(post)}>
                  Delete
                </button>
              </>
            )
          ) : null}
        </div>
      </div>

      {isSelected && !isEditing ? <p className="post-card__body">{post.body}</p> : null}
    </article>
  )
}

export { PostCard }
