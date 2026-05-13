import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { createAlbum } from '../../services/albumsService.js'
import { getVisibleAlbums } from './helpers.js'

function AlbumsPage() {
  const { user, albums: initialAlbums } = useLoaderData()
  const [albums, setAlbums] = useState(initialAlbums)
  const [searchTerm, setSearchTerm] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [error, setError] = useState('')

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

  return (
    <section>
      <h1 className="panel__title">Albums</h1>
      <p className="panel__subtitle">
        Browse only the albums that belong to the logged-in user and open each one into its photos.
      </p>

      <form className="auth-form" onSubmit={handleCreateAlbum}>
        <label className="auth-form__field">
          <span className="auth-form__label">Add album</span>
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

        <div className="button-row">
          <button type="submit" className="button">
            Create album
          </button>
        </div>
      </form>

      <div className="posts-toolbar">
        <label className="auth-form__field">
          <span className="auth-form__label">Search</span>
          <input
            className="auth-form__input"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>
      </div>

      {error ? <p className="auth-form__error">{error}</p> : null}

      <div className="posts-list">
        {visibleAlbums.length === 0 ? (
          <p className="panel__subtitle">No albums match the current search.</p>
        ) : (
          visibleAlbums.map((album) => (
            <article key={album.id} className="post-card">
              <div className="post-card__header">
                <div className="post-card__select">
                  <p className="post-card__meta">Album #{album.id}</p>
                  <h2 className="post-card__title">{album.title}</h2>
                </div>

                <div className="post-card__actions">
                  <Link className="button button--ghost" to={`/users/${album.userId}/albums/${album.id}/photos`}>
                    Open photos
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export { AlbumsPage }
