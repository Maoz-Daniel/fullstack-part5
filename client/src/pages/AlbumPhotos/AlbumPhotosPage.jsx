import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import {
  createPhoto,
  deletePhoto,
  getAlbumPhotosBatch,
  updatePhoto,
} from '../../services/albumsService.js'

function AlbumPhotosPage() {
  const { user, album, photos: initialPhotos, nextPage: initialNextPage } = useLoaderData()
  const [photos, setPhotos] = useState(initialPhotos)
  const [nextPage, setNextPage] = useState(initialNextPage)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newThumbnailUrl, setNewThumbnailUrl] = useState('')
  const [editingPhotoId, setEditingPhotoId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingUrl, setEditingUrl] = useState('')
  const [editingThumbnailUrl, setEditingThumbnailUrl] = useState('')
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState('')

  function mergePhotos(currentPhotos, incomingPhotos) {
    const seenIds = new Set(currentPhotos.map((photo) => photo.id))
    const uniqueIncoming = incomingPhotos.filter((photo) => !seenIds.has(photo.id))
    return [...currentPhotos, ...uniqueIncoming]
  }

  async function handleLoadMore() {
    if (!nextPage) {
      return
    }

    setIsLoadingMore(true)

    try {
      const response = await getAlbumPhotosBatch(album.id, nextPage)

      setPhotos((currentPhotos) => mergePhotos(currentPhotos, response.data))
      setNextPage(response.next)
      setError('')
    } catch {
      setError('Photo loading failed.')
    } finally {
      setIsLoadingMore(false)
    }
  }

  async function handleAddPhoto(event) {
    event.preventDefault()

    if (!newTitle.trim()) {
      setError('Photo title is required.')
      return
    }

    if (!newUrl.trim()) {
      setError('Photo URL is required.')
      return
    }

    if (!newThumbnailUrl.trim()) {
      setError('Thumbnail URL is required.')
      return
    }

    try {
      const createdPhoto = await createPhoto({
        albumId: album.id,
        title: newTitle.trim(),
        url: newUrl.trim(),
        thumbnailUrl: newThumbnailUrl.trim(),
      })

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
    if (!editingTitle.trim()) {
      setError('Photo title is required.')
      return
    }

    if (!editingUrl.trim()) {
      setError('Photo URL is required.')
      return
    }

    if (!editingThumbnailUrl.trim()) {
      setError('Thumbnail URL is required.')
      return
    }

    try {
      const updatedPhoto = await updatePhoto(photoId, {
        title: editingTitle.trim(),
        url: editingUrl.trim(),
        thumbnailUrl: editingThumbnailUrl.trim(),
      })

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

  return (
    <section>
      <div className="button-row">
        <Link className="button button--ghost" to="/albums">
          Back to /albums
        </Link>
      </div>

      <article className="post-card post-card--selected">
        <p className="post-card__meta">Album #{album.id}</p>
        <h1 className="panel__title">{album.title}</h1>
        <p className="panel__subtitle">Managing photos as {user.name}.</p>
      </article>

      <form className="auth-form auth-form--grid" onSubmit={handleAddPhoto}>
        <label className="auth-form__field">
          <span className="auth-form__label">Photo title</span>
          <input
            className="auth-form__input"
            type="text"
            value={newTitle}
            onChange={(event) => {
              setNewTitle(event.target.value)
              if (error) {
                setError('')
              }
            }}
          />
        </label>

        <label className="auth-form__field">
          <span className="auth-form__label">Image URL</span>
          <input
            className="auth-form__input"
            type="text"
            value={newUrl}
            onChange={(event) => {
              setNewUrl(event.target.value)
              if (error) {
                setError('')
              }
            }}
          />
        </label>

        <label className="auth-form__field">
          <span className="auth-form__label">Thumbnail URL</span>
          <input
            className="auth-form__input"
            type="text"
            value={newThumbnailUrl}
            onChange={(event) => {
              setNewThumbnailUrl(event.target.value)
              if (error) {
                setError('')
              }
            }}
          />
        </label>

        <div className="button-row">
          <button type="submit" className="button">
            Add photo
          </button>
        </div>
      </form>

      {error ? <p className="auth-form__error">{error}</p> : null}

      <div className="photo-grid">
        {photos.length === 0 ? (
          <p className="panel__subtitle">No photos have been loaded for this album yet.</p>
        ) : (
          photos.map((photo) => (
            <article key={photo.id} className="photo-card">
              <img className="photo-card__image" src={photo.thumbnailUrl} alt={photo.title} />

              {editingPhotoId === photo.id ? (
                <div className="auth-form">
                  <label className="auth-form__field">
                    <span className="auth-form__label">Title</span>
                    <input
                      className="auth-form__input"
                      type="text"
                      value={editingTitle}
                      onChange={(event) => setEditingTitle(event.target.value)}
                    />
                  </label>

                  <label className="auth-form__field">
                    <span className="auth-form__label">Image URL</span>
                    <input
                      className="auth-form__input"
                      type="text"
                      value={editingUrl}
                      onChange={(event) => setEditingUrl(event.target.value)}
                    />
                  </label>

                  <label className="auth-form__field">
                    <span className="auth-form__label">Thumbnail URL</span>
                    <input
                      className="auth-form__input"
                      type="text"
                      value={editingThumbnailUrl}
                      onChange={(event) => setEditingThumbnailUrl(event.target.value)}
                    />
                  </label>
                </div>
              ) : (
                <>
                  <p className="post-card__meta">Photo #{photo.id}</p>
                  <h2 className="post-card__title">{photo.title}</h2>
                  <div className="details-list">
                    <div className="details-list__row">
                      <dt>Image</dt>
                      <dd>
                        <a href={photo.url} target="_blank" rel="noreferrer">
                          Open full image
                        </a>
                      </dd>
                    </div>
                  </div>
                </>
              )}

              <div className="button-row">
                {editingPhotoId === photo.id ? (
                  <>
                    <button
                      type="button"
                      className="button"
                      onClick={() => handleSaveEdit(photo.id)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={() => handleStartEdit(photo)}
                  >
                    Edit
                  </button>
                )}

                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => handleDeletePhoto(photo.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {nextPage ? (
        <div className="button-row">
          <button type="button" className="button" onClick={handleLoadMore} disabled={isLoadingMore}>
            {isLoadingMore ? 'Loading...' : 'Load more'}
          </button>
        </div>
      ) : null}
    </section>
  )
}

export { AlbumPhotosPage }
