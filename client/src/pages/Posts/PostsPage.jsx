import { useOutletContext } from 'react-router-dom'
import { PagePlaceholder } from '../../components/ui/PagePlaceholder.jsx'

function PostsPage() {
  const user = useOutletContext()

  return (
    <PagePlaceholder
      title="Posts route is ready"
      path="/posts"
      description="This protected page will become the posts overview and selection screen."
      hints={[
        `Drill-down target prepared: /users/${user.id}/posts/1`,
        'Post data loading and drill-down behavior will be added in a later step.',
      ]}
    />
  )
}

export { PostsPage }
