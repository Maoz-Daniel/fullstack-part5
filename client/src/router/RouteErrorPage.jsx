import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

function RouteErrorPage() {
  const error = useRouteError()

  let title = 'Something went wrong'
  let message = 'The route could not be loaded.'

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`
    message = typeof error.data === 'string' ? error.data : message
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <section className="panel">
      <div className="panel__eyebrow">Routing Error</div>
      <h1 className="panel__title">{title}</h1>
      <p className="panel__subtitle">{message}</p>
    </section>
  )
}

export { RouteErrorPage }
