import { redirect } from 'react-router-dom'
import { getUser, isAuthenticated } from '../hooks/useAuth.js'

export function authLandingLoader() {
  return redirect(isAuthenticated() ? '/home' : '/login')
}

export function publicOnlyLoader() { 
  if (isAuthenticated()) {
    return redirect('/home')
  }

  return null
}

export function requireAuthLoader() {
  const user = getUser()

  if (!user) {
    return redirect('/login')
  }

  return user
}

export function requireMatchingUserLoader({ params }) {
  const user = getUser()

  if (!user) {
    return redirect('/login')
  }

  if (params.userId !== user.id) {
    return redirect('/home')
  }

  return user
}
