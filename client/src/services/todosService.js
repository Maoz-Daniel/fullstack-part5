import { apiClient } from './apiClient.js'
import { deleteCached, getCached, setCached } from './cacheStore.js'

function normalizeTodo(todo) {
  return {
    ...todo,
    id: Number(todo.id),
    userId: Number(todo.userId),
  }
}

export async function getTodosByUserId(userId) {
  const cacheKey = `todos:user:${userId}`
  const cachedTodos = getCached(cacheKey)

  if (cachedTodos) {
    return cachedTodos
  }

  const todos = await apiClient(`/todos?userId=${userId}`, 'GET')
  const normalizedTodos = todos.map(normalizeTodo)

  return setCached(cacheKey, normalizedTodos)
}

export async function createTodo(userId, title) {
  const todo = await apiClient('/todos', 'POST', {
    userId,
    title,
    completed: false,
  })

  deleteCached(`todos:user:${userId}`)
  return normalizeTodo(todo)
}

export async function updateTodo(todoId, updates) {
  const todo = await apiClient(`/todos/${todoId}`, 'PATCH', updates)
  deleteCached(`todos:user:${todo.userId}`)
  return normalizeTodo(todo)
}

export async function deleteTodo(todoId) {
  const todo = await apiClient(`/todos/${todoId}`, 'GET')
  await apiClient(`/todos/${todoId}`, 'DELETE')
  deleteCached(`todos:user:${todo.userId}`)
}
