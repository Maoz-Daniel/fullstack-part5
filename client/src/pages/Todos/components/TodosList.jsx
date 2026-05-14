import { TodoCard } from './TodoCard.jsx'

function TodosList({
  visibleTodos,
  editingTodoId,
  editingTitle,
  onEditingTitleChange,
  onToggleCompleted,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) {
  return (
    <div className="todos-main">
      <div className="todos-main__header">
        <div>
          <p className="todos-main__eyebrow">Your list</p>
          <h2 className="todos-main__title">{visibleTodos.length} tasks in view</h2>
        </div>
      </div>

      <div className="todos-list">
        {visibleTodos.length === 0 ? (
          <p className="panel__subtitle">No todos match the current filters.</p>
        ) : (
          visibleTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              isEditing={editingTodoId === todo.id}
              editingTitle={editingTitle}
              onEditingTitleChange={onEditingTitleChange}
              onToggleCompleted={onToggleCompleted}
              onStartEdit={onStartEdit}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}

export { TodosList }
