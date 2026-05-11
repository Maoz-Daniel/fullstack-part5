import { useNavigate } from 'react-router-dom'
import { AuthCard } from '../../components/ui/AuthCard.jsx'
import { useAuth } from '../../hooks/useAuth.js'

const DEMO_USER = {
  id: '1',
  username: 'Bret',
  name: 'Leanne Graham',
}

function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  function handleCreateDemoSession() {
    login(DEMO_USER)
    navigate('/home')
  }

  return (
    <AuthCard
      title="Register route is ready"
      path="/register"
      description="This will become the registration flow later. For now it verifies that the public-only routes live under pages/ and share the same session contract."
      actionLabel="Create demo session"
      onAction={handleCreateDemoSession}
    />
  )
}

export { RegisterPage }
