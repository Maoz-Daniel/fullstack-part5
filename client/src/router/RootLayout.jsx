import { Outlet, useNavigation } from 'react-router-dom'

function RootLayout() {
  const navigation = useNavigation()
  const isNavigating = navigation.state !== 'idle' //idle means no navigation is happening

  return (
    <div className="app-shell">
      <div className="app-shell__backdrop" />
      <main className="app-shell__content">
        <div
          className={`app-shell__progress${isNavigating ? ' app-shell__progress--active' : ''}`}
        >
          <div className="app-shell__progress-bar" />
          <span className="app-shell__progress-label">Loading view...</span>
        </div>
        <Outlet />
      </main>
    </div>
  )
}

export { RootLayout }
