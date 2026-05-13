export const STORAGE_KEY = 'loggedInUser'

function hasNumericId(user) { // checks the user exist , and that he has a numeric id.
  return Boolean(user && typeof user === 'object' && typeof user.id === 'number' && Number.isFinite(user.id))
}

function buildSessionUser(user) {
  const sessionUser = { ...user }
  delete sessionUser.website // remove the password from the session user object for security reasons
  return sessionUser
}

export function sanitizeSessionUser(user) { // return the user if he is OK
  return hasNumericId(user) ? user : null
}

export function readSessionUser() { 
  const rawValue = window.localStorage.getItem(STORAGE_KEY) //try to get the user from localStorage

  if (!rawValue) {
    return null
  }

  try {
    return sanitizeSessionUser(JSON.parse(rawValue)) //try to parse the user and return it if it's OK
  } catch {
    return null
  }
}

export function writeSessionUser(user) {
  const sanitizedUser = sanitizeSessionUser(user) //check if the user is OK

  if (!sanitizedUser) {
    throw new Error('A session user must be an object with a numeric id.')
  }

  const sessionUser = buildSessionUser(sanitizedUser)

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser)) //store the user in localStorage
  return sessionUser
}

export function clearSessionUser() { 
  window.localStorage.removeItem(STORAGE_KEY)
}
