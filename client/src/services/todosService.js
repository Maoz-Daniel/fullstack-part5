import { apiClient } from './apiClient.js'

function normalizeTodo(todo) { // the API returns numeric IDs, but we want them as strings for consistency with our user IDs
  return {
    ...todo,
    id: String(todo.id),
    userId: String(todo.userId),
  }
}

export async function getTodosByUserId(userId) {
  const todos = await apiClient(`/todos?userId=${userId}`, 'GET')
  return todos.map(normalizeTodo)
}

export async function createTodo(userId, title) {
  const todo = await apiClient('/todos', 'POST', {
    userId: Number(userId),
    title,
    completed: false,
  })

  return normalizeTodo(todo)
}

export async function updateTodo(todoId, updates) {
  const todo = await apiClient(`/todos/${todoId}`, 'PATCH', updates)
  return normalizeTodo(todo)
}

export async function deleteTodo(todoId) {
  await apiClient(`/todos/${todoId}`, 'DELETE')
}
