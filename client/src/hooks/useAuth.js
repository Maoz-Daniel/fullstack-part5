import {
  clearSessionUser,
  readSessionUser,
  sanitizeSessionUser,
  STORAGE_KEY,
  writeSessionUser,
} from '../utils/session.js'
import { useLocalStorage } from './useLocalStorage.js'

export function getUser() {
  return readSessionUser()
}

export function login(user) {
  return writeSessionUser(user)
}

export function logout() {
  clearSessionUser()
}

export function isAuthenticated() {
  return getUser() !== null
}

export function useAuth() {
  const [storedUser, setStoredUser, removeStoredUser] = useLocalStorage(STORAGE_KEY, null)
  const user = sanitizeSessionUser(storedUser)

  function loginUser(nextUser) {
    const sessionUser = login(nextUser)

    setStoredUser(sessionUser) 
    return sessionUser
  }

  function logoutUser() {
    logout()
    removeStoredUser()
  }

  return {
    user,
    getUser: () => user,
    login: loginUser,
    logout: logoutUser,
    isAuthenticated: () => user !== null,
  }
}
