export function validateLoginValues({ username, password }) {
  if (!username.trim()) {  // if there s no username or just whitespace
    return 'Username is required.'
  }

  if (!password.trim()) { //if there s no password or just whitespace
    return 'Password is required.'
  }

  return null
}
