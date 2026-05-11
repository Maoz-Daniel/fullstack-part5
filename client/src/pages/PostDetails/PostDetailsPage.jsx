import { useOutletContext, useParams } from 'react-router-dom'
import { PagePlaceholder } from '../../components/ui/PagePlaceholder.jsx'

function PostDetailsPage() {
  const user = useOutletContext()
  const { userId, postId } = useParams()

  return (
    <PagePlaceholder
      title="Post drill-down route is ready"
      path={`/users/${userId}/posts/${postId}`}
      description="This nested route is reserved for a selected post and its comments."
      hints={[
        `Authenticated user id: ${user.id}`,
        'If the URL userId does not match the stored session user, the loader redirects to /home.',
      ]}
    />
  )
}

export { PostDetailsPage }
