export function validateRegisterAccountStep({ username, password, verifyPassword }) {
  if (!username.trim()) {
    return 'Username is required.'
  }

  if (!password.trim()) {
    return 'Password is required.'
  }

  if (!verifyPassword.trim()) {
    return 'Verify password is required.'
  }

  if (password !== verifyPassword) {
    return 'Passwords do not match.'
  }

  return null
}

export function validateRegisterProfileStep(formData) {
  if (!formData.name.trim()) {
    return 'Name is required.'
  }

  if (!formData.email.trim()) {
    return 'Email is required.'
  }

  if (!formData.phone.trim()) {
    return 'Phone is required.'
  }

  if (!formData.street.trim()) {
    return 'Street is required.'
  }

  if (!formData.suite.trim()) {
    return 'Suite is required.'
  }

  if (!formData.city.trim()) {
    return 'City is required.'
  }

  if (!formData.zipcode.trim()) {
    return 'Zipcode is required.'
  }

  if (!formData.lat.trim()) {
    return 'Latitude is required.'
  }

  if (!formData.lng.trim()) {
    return 'Longitude is required.'
  }

  if (!formData.companyName.trim()) {
    return 'Company name is required.'
  }

  if (!formData.companyCatchPhrase.trim()) {
    return 'Company catch phrase is required.'
  }

  if (!formData.companyBs.trim()) {
    return 'Company business string is required.'
  }

  return null
}
