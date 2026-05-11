import { Outlet } from 'react-router-dom'

function RootLayout() {
  return (
    <div className="app-shell">
      <div className="app-shell__backdrop" />
      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  )
}

export { RootLayout }
