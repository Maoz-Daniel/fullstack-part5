import { PagePlaceholder } from '../../components/ui/PagePlaceholder.jsx'

function TodosPage() {
  return (
    <PagePlaceholder
      title="Todos route is ready"
      path="/todos"
      description="This protected page is reserved for the user's todo list, filtering, search, and CRUD actions."
      hints={[
        'The route is flat by design: /todos.',
        'Todo data loading and CRUD will be added in a later step.',
      ]}
    />
  )
}

export { TodosPage }
