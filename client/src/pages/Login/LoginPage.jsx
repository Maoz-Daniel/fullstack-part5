import { useNavigate } from 'react-router-dom'
import { AuthCard } from '../../components/ui/AuthCard.jsx'
import { useAuth } from '../../hooks/useAuth.js'

const DEMO_USER = {
  id: '1',
  username: 'Bret',
  name: 'Leanne Graham',
}

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  function handleCreateDemoSession() {
    login(DEMO_USER)
    navigate('/home')
  }

  return (
    <AuthCard
      title="Login route is ready"
      path="/login"
      description="This is a placeholder screen for the architecture step. The real login form and server validation will come in the auth stage."
      actionLabel="Create demo session"
      onAction={handleCreateDemoSession}
    />
  )
}

export { LoginPage }
