import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx'
import { usePaginatedItems } from '../../hooks/usePaginatedItems.js'
import { createAlbum, deleteAlbum, getAlbumsBatch } from '../../services/albumsService.js'
import { AlbumsHero } from './components/AlbumsHero.jsx'
import { AlbumsList } from './components/AlbumsList.jsx'
import { getVisibleAlbums } from './helpers.js'

function AlbumsPage() {
  const { user, albums: initialAlbums, nextPage: initialNextPage } = useLoaderData()
  const { items: albums, setItems: setAlbums, nextPage, isLoadingMore, loadMore } =
    usePaginatedItems(initialAlbums, initialNextPage)
  const [searchTerm, setSearchTerm] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [error, setError] = useState('')
  const [pendingDeleteAlbum, setPendingDeleteAlbum] = useState(null)

  const visibleAlbums = getVisibleAlbums(albums, searchTerm)

  async function handleCreateAlbum(event) {
    event.preventDefault()

    if (!newTitle.trim()) {
      setError('Album title is required.')
      return
    }

    try {
      const createdAlbum = await createAlbum({
        userId: user.id,
        title: newTitle.trim(),
      })

      setAlbums((currentAlbums) => [createdAlbum, ...currentAlbums])
      setNewTitle('')
      setError('')
    } catch {
      setError('Album creation failed.')
    }
  }

  async function handleLoadMore() {
    try {
      await loadMore((page) => getAlbumsBatch(user.id, page))
      setError('')
    } catch {
      setError('Album loading failed.')
    }
  }

  async function handleDeleteAlbum(albumId) {
    try {
      await deleteAlbum(albumId)
      setAlbums((currentAlbums) => currentAlbums.filter((album) => album.id !== albumId))
      setError('')
    } catch {
      setError('Album deletion failed.')
    }
  }

  async function handleConfirmDeleteAlbum() {
    if (!pendingDeleteAlbum) {
      return
    }

    await handleDeleteAlbum(pendingDeleteAlbum.id)
    setPendingDeleteAlbum(null)
  }

  return (
    <section>
      <h1 className="panel__title">Albums</h1>
      <p className="panel__subtitle">
        Browse only the albums that belong to the logged-in user and open each one into its photos.
      </p>

      <div className="albums-layout">
        <AlbumsHero
          visibleCount={visibleAlbums.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          newTitle={newTitle}
          onNewTitleChange={(value) => {
            setNewTitle(value)
            if (error) {
              setError('')
            }
          }}
          onSubmit={handleCreateAlbum}
        />

        {error ? <p className="auth-form__error">{error}</p> : null}

        <AlbumsList albums={visibleAlbums} onDelete={setPendingDeleteAlbum} />

        {nextPage ? (
          <div className="button-row">
            <button type="button" className="button" onClick={handleLoadMore} disabled={isLoadingMore}>
              {isLoadingMore ? 'Loading...' : 'Load more'}
            </button>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        open={pendingDeleteAlbum !== null}
        title="Delete this album?"
        message={
          pendingDeleteAlbum
            ? `Album #${pendingDeleteAlbum.id} and its photos will be removed from your workspace.`
            : 'This album and its photos will be removed from your workspace.'
        }
        confirmLabel="Delete album"
        onConfirm={handleConfirmDeleteAlbum}
        onCancel={() => setPendingDeleteAlbum(null)}
      />
    </section>
  )
}

export { AlbumsPage }
