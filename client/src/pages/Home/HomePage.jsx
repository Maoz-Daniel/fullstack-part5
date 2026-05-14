import { useOutletContext, useSearchParams } from 'react-router-dom'
import { HomeFeatureGrid } from './components/HomeFeatureGrid.jsx'
import { HomeHero } from './components/HomeHero.jsx'
import { HomeInfoPanel } from './components/HomeInfoPanel.jsx'

function HomePage() {
  const user = useOutletContext() // get the user object from the ProtectedLayout's Outlet context
  const [searchParams] = useSearchParams()
  const activePanel = searchParams.get('panel')

  if (activePanel === 'info') {
    return <HomeInfoPanel user={user} />
  }

  return (
    <section className="home-dashboard">
      <HomeHero userName={user.name} />
      <HomeFeatureGrid />
    </section>
  )
}

export { HomePage }
