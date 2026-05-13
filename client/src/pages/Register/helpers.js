export const INITIAL_FORM_DATA = {
  username: '',
  password: '',
  verifyPassword: '',
  name: '',
  email: '',
  phone: '',
  street: '',
  suite: '',
  city: '',
  zipcode: '',
  lat: '',
  lng: '',
  companyName: '',
  companyCatchPhrase: '',
  companyBs: '',
}

export function buildUserPayload(formData) {
  return {
    name: formData.name.trim(),
    username: formData.username.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    website: formData.password,
    address: {
      street: formData.street.trim(),
      suite: formData.suite.trim(),
      city: formData.city.trim(),
      zipcode: formData.zipcode.trim(),
      geo: {
        lat: formData.lat.trim(),
        lng: formData.lng.trim(),
      },
    },
    company: {
      name: formData.companyName.trim(),
      catchPhrase: formData.companyCatchPhrase.trim(),
      bs: formData.companyBs.trim(),
    },
  }
}
