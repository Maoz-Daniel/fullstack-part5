function TodoCard({
  todo,
  isEditing,
  editingTitle,
  onEditingTitleChange,
  onToggleCompleted,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) {
  return (
    <article className="todo-card">
      <div className="todo-card__header">
        <div>
          <p className="todo-card__meta">Todo #{todo.id}</p>
          {isEditing ? (
            <input
              className="auth-form__input"
              type="text"
              value={editingTitle}
              onChange={(event) => onEditingTitleChange(event.target.value)}
            />
          ) : (
            <h2 className="todo-card__title">{todo.title}</h2>
          )}
        </div>

        <button
          type="button"
          className={todo.completed ? 'button' : 'button button--ghost'}
          onClick={() => onToggleCompleted(todo)}
        >
          {todo.completed ? 'Completed' : 'Not completed'}
        </button>
      </div>

      <dl className="details-list">
        <div className="details-list__row">
          <dt>Id</dt>
          <dd>{todo.id}</dd>
        </div>
        <div className="details-list__row">
          <dt>State</dt>
          <dd>{todo.completed ? 'Completed' : 'Not completed'}</dd>
        </div>
      </dl>

      <div className="button-row">
        {isEditing ? (
          <>
            <button type="button" className="button" onClick={() => onSaveEdit(todo.id)}>
              Save
            </button>
            <button type="button" className="button button--ghost" onClick={onCancelEdit}>
              Cancel
            </button>
          </>
        ) : (
          <button type="button" className="button button--ghost" onClick={() => onStartEdit(todo)}>
            Edit title
          </button>
        )}

        <button type="button" className="button button--ghost" onClick={() => onDelete(todo)}>
          Delete
        </button>
      </div>
    </article>
  )
}

export { TodoCard }
