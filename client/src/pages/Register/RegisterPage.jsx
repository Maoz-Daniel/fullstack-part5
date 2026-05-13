import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { createUser, getUserByUsername } from '../../services/authService.js'
import { buildUserPayload, INITIAL_FORM_DATA } from './helpers.js'
import {
  validateRegisterAccountStep,
  validateRegisterProfileStep,
} from './validation.js'

function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target  // when the user type input, we create event. in the target we have the name of the input and the value that the user type

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    })) //keep all same and update only the field that change

    if (error) {
      setError('')
    }
  }

  async function handleAccountStepSubmit(event) { // step 1 of the registration procces.
    event.preventDefault() // prevent the default form submission behavior, which would cause a page reload. we want to handle the form submission with our own logic 

    const validationError = validateRegisterAccountStep(formData)

    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const existingUser = await getUserByUsername(formData.username.trim())

      if (existingUser) {
        setError('Username already exists.')
        return
      }

      setStep(2)
    } catch {
      setError('Registration check failed. Please try again.')
    }
  }

  async function handleProfileStepSubmit(event) { // step 2 of the registration procces.
    event.preventDefault()

    const validationError = validateRegisterProfileStep(formData)

    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const createdUser = await createUser(buildUserPayload(formData))

      login(createdUser)
      navigate('/home')
    } catch {
      setError('Registration failed. Please try again.')
    }
  }

  return (
    <section className="panel panel--public">
      <div className="panel__eyebrow">Create your account</div>
      <h1 className="panel__title">Register</h1>
      <p className="panel__subtitle">
        Create a new user in two steps, then open a session and continue to /home.
      </p>

      <dl className="details-list">
        <div className="details-list__row">
          <dt>Path</dt>
          <dd>/register</dd>
        </div>
        <div className="details-list__row">
          <dt>Step</dt>
          <dd>{step === 1 ? 'Account details' : 'Profile details'}</dd>
        </div>
      </dl>

      {step === 1 ? (
        <form className="auth-form" onSubmit={handleAccountStepSubmit}>
          <label className="auth-form__field">
            <span className="auth-form__label">Username</span>
            <input
              className="auth-form__input"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Password</span>
            <input
              className="auth-form__input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Verify password</span>
            <input
              className="auth-form__input"
              type="password"
              name="verifyPassword"
              value={formData.verifyPassword}
              onChange={handleChange}
            />
          </label>

          {error ? <p className="auth-form__error">{error}</p> : null}

          <div className="button-row">
            <button type="submit" className="button">
              Continue
            </button>
            <Link className="button button--ghost" to="/login">
              Go to /login
            </Link>
          </div>
        </form>
      ) : (
        <form className="auth-form auth-form--grid" onSubmit={handleProfileStepSubmit}>
          <label className="auth-form__field">
            <span className="auth-form__label">Full name</span>
            <input
              className="auth-form__input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Email</span>
            <input
              className="auth-form__input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Phone</span>
            <input
              className="auth-form__input"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Street</span>
            <input
              className="auth-form__input"
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Suite</span>
            <input
              className="auth-form__input"
              type="text"
              name="suite"
              value={formData.suite}
              onChange={handleChange}
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">City</span>
            <input
              className="auth-form__input"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Zipcode</span>
            <input
              className="auth-form__input"
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Latitude</span>
            <input
              className="auth-form__input"
              type="text"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Longitude</span>
            <input
              className="auth-form__input"
              type="text"
              name="lng"
              value={formData.lng}
              onChange={handleChange}
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Company name</span>
            <input
              className="auth-form__input"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Company catch phrase</span>
            <input
              className="auth-form__input"
              type="text"
              name="companyCatchPhrase"
              value={formData.companyCatchPhrase}
              onChange={handleChange}
            />
          </label>

          <label className="auth-form__field">
            <span className="auth-form__label">Company business string</span>
            <input
              className="auth-form__input"
              type="text"
              name="companyBs"
              value={formData.companyBs}
              onChange={handleChange}
            />
          </label>

          {error ? <p className="auth-form__error">{error}</p> : null}

          <div className="button-row">
            <button type="submit" className="button">
              Register
            </button>
            <button type="button" className="button button--ghost" onClick={() => setStep(1)}>
              Back
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

export { RegisterPage }
