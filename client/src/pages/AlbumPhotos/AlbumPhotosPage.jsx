import { useOutletContext, useParams } from 'react-router-dom'
import { PagePlaceholder } from '../../components/ui/PagePlaceholder.jsx'

function AlbumPhotosPage() {
  const user = useOutletContext()
  const { userId, albumId } = useParams()

  return (
    <PagePlaceholder
      title="Album photos route is ready"
      path={`/users/${userId}/albums/${albumId}/photos`}
      description="This nested route will later load album photos in batches."
      hints={[
        `Authenticated user id: ${user.id}`,
        'The userId in the URL must match the logged-in user stored in localStorage.',
      ]}
    />
  )
}

export { AlbumPhotosPage }
