import { apiClient } from './core/apiClient.js'

function normalizeUser(user) {
  return {
    ...user,
    id: Number(user.id),
  }
}

export async function getUserByUsername(username) {
  const users = await apiClient(`/users?username=${username}`)
  return users[0] ? normalizeUser(users[0]) : null
}

export async function getUsers() {
  const users = await apiClient('/users')
  return users.map(normalizeUser)
}

export async function createUser(user) {
  const createdUser = await apiClient('/users', 'POST', user)
  return normalizeUser(createdUser)
}
