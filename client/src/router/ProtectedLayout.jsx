import { Outlet, useLoaderData } from 'react-router-dom'

function ProtectedLayout() {
  const user = useLoaderData()

  return (
    <section className="panel">
      <div className="panel__eyebrow">Protected App Shell</div>
      <Outlet context={user} />
    </section>
  )
}

export { ProtectedLayout }
