export function getVisibleTodos(todos, searchTerm, sortBy) {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase()

  return [...todos]
    .filter((todo) => {
      if (!normalizedSearchTerm) {
        return true
      }

      const completedLabel = todo.completed ? 'completed true' : 'not completed false'
      const fullString = `${todo.id} ${todo.title} ${completedLabel}`.toLowerCase()

      return fullString.includes(normalizedSearchTerm)
    })
    .sort((leftTodo, rightTodo) => {
      if (sortBy === 'title') {
        return leftTodo.title.localeCompare(rightTodo.title)
      }

      if (sortBy === 'completed') {
        return Number(leftTodo.completed) - Number(rightTodo.completed)
      }

      return Number(leftTodo.id) - Number(rightTodo.id)
    })
}
