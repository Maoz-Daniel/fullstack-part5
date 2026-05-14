import { apiClient } from './core/apiClient.js'
import { deleteCachedByPrefix, getCached, setCached } from './core/cacheStore.js'
import { parseNextPage } from './core/pagination.js'

export const TODO_BATCH_SIZE = 6

function normalizeTodo(todo) {
  return {
    ...todo,
    id: Number(todo.id),
    userId: Number(todo.userId),
  }
}

export async function getTodosBatch(userId, page, perPage = TODO_BATCH_SIZE) {
  const cacheKey = `todos:user:${userId}:page:${page}`
  const cachedTodosPage = getCached(cacheKey)

  if (cachedTodosPage) { //if we have a cached version of this todos page, return it instead of making an API call
    return cachedTodosPage
  }

  const response = await apiClient(`/todos?userId=${userId}&_page=${page}&_limit=${perPage}`, 'GET', null, {
    includeHeaders: true, // we need the headers to get the total count of todos for pagination
  })
  const normalizedTodosPage = { 
    data: response.data.map(normalizeTodo),
    next: parseNextPage(response.headers),
  }
  //now the todo objects look like: { id: 1, userId: 1, title: '...', completed: false }

  return setCached(cacheKey, normalizedTodosPage)
}

export async function createTodo(userId, title) {
  const todo = await apiClient('/todos', 'POST', {
    userId,
    title,
    completed: false,
  })

  deleteCachedByPrefix(`todos:user:${userId}:`) 
  return normalizeTodo(todo)
}

export async function updateTodo(todoId, updates) {
  const todo = await apiClient(`/todos/${todoId}`, 'PATCH', updates)
  deleteCachedByPrefix(`todos:user:${todo.userId}:`)
  return normalizeTodo(todo)
}

export async function deleteTodo(todoId) {
  const todo = await apiClient(`/todos/${todoId}`, 'GET')
  await apiClient(`/todos/${todoId}`, 'DELETE')
  deleteCachedByPrefix(`todos:user:${todo.userId}:`)
}
