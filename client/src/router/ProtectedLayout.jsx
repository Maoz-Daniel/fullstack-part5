import { Outlet, useLoaderData } from 'react-router-dom'
import { ProtectedNavigation } from '../components/ui/ProtectedNavigation.jsx'

function ProtectedLayout() {
  const user = useLoaderData()

  return (
    <section className="panel">
      <ProtectedNavigation />
      <Outlet context={user} />
    </section>
  )
}

export { ProtectedLayout }
