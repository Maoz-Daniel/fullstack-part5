import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog.jsx'
import { usePaginatedItems } from '../../../hooks/usePaginatedItems.js'
import { AlbumPhotosHeader } from './components/AlbumPhotosHeader.jsx'
import { PhotoCreateForm } from './components/PhotoCreateForm.jsx'
import { PhotoGrid } from './components/PhotoGrid.jsx'
import {
  createPhoto,
  deletePhoto,
  getAlbumPhotosBatch,
  updatePhoto,
} from '../../../services/albumsService.js'
import {
  buildNewPhotoPayload,
  buildUpdatedPhotoPayload,
  mergePhotos,
  validatePhotoFields,
} from './helpers.js'

function AlbumPhotosPage() {
  const { user, album, photos: initialPhotos, nextPage: initialNextPage } = useLoaderData()
  const { items: photos, setItems: setPhotos, nextPage, isLoadingMore, loadMore } =
    usePaginatedItems(initialPhotos, initialNextPage)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newThumbnailUrl, setNewThumbnailUrl] = useState('')
  const [editingPhotoId, setEditingPhotoId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingUrl, setEditingUrl] = useState('')
  const [editingThumbnailUrl, setEditingThumbnailUrl] = useState('')
  const [error, setError] = useState('')
  const [pendingDeletePhoto, setPendingDeletePhoto] = useState(null)

  async function handleLoadMore() {
    try {
      await loadMore((page) => getAlbumPhotosBatch(album.id, page), {
        mergeItems: mergePhotos,
      })
      setError('')
    } catch {
      setError('Photo loading failed.')
    }
  }

  async function handleAddPhoto(event) {
    event.preventDefault()

    const validationError = validatePhotoFields(newTitle, newUrl, newThumbnailUrl)

    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const createdPhoto = await createPhoto(
        buildNewPhotoPayload(album.id, newTitle, newUrl, newThumbnailUrl),
      )

      setPhotos((currentPhotos) => [createdPhoto, ...currentPhotos])
      setNewTitle('')
      setNewUrl('')
      setNewThumbnailUrl('')
      setError('')
    } catch {
      setError('Photo creation failed.')
    }
  }

  function handleStartEdit(photo) {
    setEditingPhotoId(photo.id)
    setEditingTitle(photo.title)
    setEditingUrl(photo.url)
    setEditingThumbnailUrl(photo.thumbnailUrl)
    setError('')
  }

  function handleCancelEdit() {
    setEditingPhotoId(null)
    setEditingTitle('')
    setEditingUrl('')
    setEditingThumbnailUrl('')
  }

  async function handleSaveEdit(photoId) {
    const validationError = validatePhotoFields(editingTitle, editingUrl, editingThumbnailUrl)

    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const updatedPhoto = await updatePhoto(
        photoId,
        buildUpdatedPhotoPayload(editingTitle, editingUrl, editingThumbnailUrl),
      )

      setPhotos((currentPhotos) =>
        currentPhotos.map((photo) => (photo.id === photoId ? updatedPhoto : photo)),
      )
      handleCancelEdit()
      setError('')
    } catch {
      setError('Photo update failed.')
    }
  }

  async function handleDeletePhoto(photoId) {
    try {
      await deletePhoto(photoId)
      setPhotos((currentPhotos) => currentPhotos.filter((photo) => photo.id !== photoId))

      if (editingPhotoId === photoId) {
        handleCancelEdit()
      }

      setError('')
    } catch {
      setError('Photo deletion failed.')
    }
  }

  async function handleConfirmDeletePhoto() {
    if (!pendingDeletePhoto) {
      return
    }

    await handleDeletePhoto(pendingDeletePhoto.id)
    setPendingDeletePhoto(null)
  }

  return (
    <section>
      <AlbumPhotosHeader album={album} userName={user.name} />

      <PhotoCreateForm
        newTitle={newTitle}
        onNewTitleChange={(value) => {
          setNewTitle(value)
          if (error) {
            setError('')
          }
        }}
        newUrl={newUrl}
        onNewUrlChange={(value) => {
          setNewUrl(value)
          if (error) {
            setError('')
          }
        }}
        newThumbnailUrl={newThumbnailUrl}
        onNewThumbnailUrlChange={(value) => {
          setNewThumbnailUrl(value)
          if (error) {
            setError('')
          }
        }}
        onSubmit={handleAddPhoto}
      />

      {error ? <p className="auth-form__error">{error}</p> : null}

      <PhotoGrid
        photos={photos}
        editingPhotoId={editingPhotoId}
        editingTitle={editingTitle}
        editingUrl={editingUrl}
        editingThumbnailUrl={editingThumbnailUrl}
        onEditingTitleChange={setEditingTitle}
        onEditingUrlChange={setEditingUrl}
        onEditingThumbnailUrlChange={setEditingThumbnailUrl}
        onStartEdit={handleStartEdit}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        onDelete={setPendingDeletePhoto}
      />

      {nextPage ? (
        <div className="button-row">
          <button type="button" className="button" onClick={handleLoadMore} disabled={isLoadingMore}>
            {isLoadingMore ? 'Loading...' : 'Load more'}
          </button>
        </div>
      ) : null}

      <ConfirmDialog
        open={pendingDeletePhoto !== null}
        title="Delete this photo?"
        message={
          pendingDeletePhoto
            ? `Photo #${pendingDeletePhoto.id} will be removed from Album #${album.id}.`
            : 'This photo will be removed from the album.'
        }
        confirmLabel="Delete photo"
        onConfirm={handleConfirmDeletePhoto}
        onCancel={() => setPendingDeletePhoto(null)}
      />
    </section>
  )
}

export { AlbumPhotosPage }
