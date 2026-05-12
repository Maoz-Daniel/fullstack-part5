import { apiClient } from './apiClient.js'

export async function getUserByUsername(username) {
  const users = await apiClient(`/users?username=${username}`)
  return users[0] ?? null
}

export async function createUser(user) {
  return apiClient('/users', 'POST', user)
}
