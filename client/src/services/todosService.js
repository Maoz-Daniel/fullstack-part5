import { apiClient } from './apiClient.js'

function normalizeTodo(todo) {
  return {
    ...todo,
    id: Number(todo.id),
    userId: Number(todo.userId),
  }
}

export async function getTodosByUserId(userId) {
  const todos = await apiClient(`/todos?userId=${userId}`, 'GET')
  return todos.map(normalizeTodo)
}

export async function createTodo(userId, title) {
  const todo = await apiClient('/todos', 'POST', {
    userId,
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
