function CommentCard({
  comment,
  isOwner,
  isEditing,
  editingCommentBody,
  onEditingCommentBodyChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) {
  return (
    <article className="comment-card">
      <p className="comment-card__meta">Comment #{comment.id} by @{comment.username}</p>

      {isEditing ? (
        <textarea
          className="auth-form__input auth-form__textarea comments-composer__textarea"
          value={editingCommentBody}
          onChange={(event) => onEditingCommentBodyChange(event.target.value)}
        />
      ) : (
        <p className="comment-card__body">{comment.body}</p>
      )}

      {isOwner ? (
        <div className="button-row">
          {isEditing ? (
            <>
              <button type="button" className="button" onClick={() => onSaveEdit(comment.id)}>
                Save
              </button>
              <button type="button" className="button button--ghost" onClick={onCancelEdit}>
                Cancel
              </button>
            </>
          ) : (
            <button type="button" className="button button--ghost" onClick={() => onStartEdit(comment)}>
              Edit
            </button>
          )}

          <button type="button" className="button button--ghost" onClick={() => onDelete(comment)}>
            Delete
          </button>
        </div>
      ) : null}
    </article>
  )
}

export { CommentCard }
