function CommentComposer({ username, newCommentBody, onNewCommentBodyChange, onSubmit }) {
  return (
    <>
      <h2 className="home-info__title">Comments</h2>
      <p className="panel__subtitle">Commenting as @{username}</p>

      <form className="auth-form comments-composer" onSubmit={onSubmit}>
        <label className="auth-form__field">
          <span className="auth-form__label">Add comment</span>
          <textarea
            className="auth-form__input auth-form__textarea comments-composer__textarea"
            value={newCommentBody}
            onChange={(event) => onNewCommentBodyChange(event.target.value)}
          />
        </label>

        <div className="button-row">
          <button type="submit" className="button">
            Add comment
          </button>
        </div>
      </form>
    </>
  )
}

export { CommentComposer }
