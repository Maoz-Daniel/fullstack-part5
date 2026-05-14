function TodosSidebar({
  newTitle,
  onNewTitleChange,
  onAddTodo,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  error,
}) {
  return (
    <aside className="todos-sidebar">
      <div className="todos-sidebar__section">
        <p className="todos-sidebar__eyebrow">Workspace</p>
        <h2 className="todos-sidebar__title">Plan the next move</h2>
        <p className="panel__subtitle">
          Add a task, filter the list, and keep the main column focused on the work itself.
        </p>
      </div>

      <form className="auth-form todos-sidebar__form" onSubmit={onAddTodo}>
        <label className="auth-form__field">
          <span className="auth-form__label">Add todo</span>
          <input
            className="auth-form__input"
            type="text"
            name="newTodo"
            value={newTitle}
            onChange={(event) => onNewTitleChange(event.target.value)}
          />
        </label>

        <div className="button-row">
          <button type="submit" className="button">
            Create todo
          </button>
        </div>
      </form>

      <div className="todos-toolbar">
        <label className="auth-form__field">
          <span className="auth-form__label">Search</span>
          <input
            className="auth-form__input"
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <label className="auth-form__field">
          <span className="auth-form__label">Sort by</span>
          <select
            className="auth-form__input"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
          >
            <option value="id">Id</option>
            <option value="title">Title</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>

      {error ? <p className="auth-form__error">{error}</p> : null}
    </aside>
  )
}

export { TodosSidebar }
