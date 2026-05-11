import { useOutletContext } from 'react-router-dom'
import { PagePlaceholder } from '../../components/ui/PagePlaceholder.jsx'

function AlbumsPage() {
  const user = useOutletContext() 

  return (
    <PagePlaceholder
      title="Albums route is ready"
      path="/albums"
      description="This protected page will later list the user's albums and link into their photos."
      hints={[
        `Drill-down target prepared: /users/${user.id}/albums/1/photos`,
        'Album and photo loading will be added in a later step.',
      ]}
    />
  )
}

export { AlbumsPage }
