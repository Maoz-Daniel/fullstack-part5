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

      <div className="albums-layout">
        <div className="albums-hero">
          <div className="albums-hero__copy">
            <p className="albums-hero__eyebrow">Collection view</p>
            <h2 className="albums-hero__title">{visibleAlbums.length} albums ready to open</h2>
            <p className="panel__subtitle">
              The gallery stays front and center while the curation tools sit quietly just above it.
            </p>
          </div>

          <div className="albums-hero__panel">
            <label className="auth-form__field albums-hero__field">
              <span className="auth-form__label">Search</span>
              <input
                className="auth-form__input"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <form className="auth-form albums-hero__form" onSubmit={handleCreateAlbum}>
              <label className="auth-form__field albums-hero__field">
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

              <div className="button-row albums-hero__actions">
                <button type="submit" className="button">
                  Create album
                </button>
              </div>
            </form>
          </div>
        </div>

        {error ? <p className="auth-form__error">{error}</p> : null}

        <div className="albums-list">
          {visibleAlbums.length === 0 ? (
            <p className="panel__subtitle">No albums match the current search.</p>
          ) : (
            visibleAlbums.map((album) => (
              <article key={album.id} className="album-card">
                <div className="album-card__cover">
                  <div className="album-card__shine" />
                  <p className="album-card__meta">Album #{album.id}</p>
                  <h2 className="album-card__title">{album.title}</h2>
                  <p className="album-card__subtitle">A saved collection ready to open and manage.</p>
                </div>

                <div className="album-card__footer">
                  <div className="album-card__stack" aria-hidden="true">
                    <span className="album-card__stack-layer album-card__stack-layer--back" />
                    <span className="album-card__stack-layer album-card__stack-layer--mid" />
                    <span className="album-card__stack-layer album-card__stack-layer--front" />
                  </div>

                  <div className="album-card__actions">
                    <Link
                      className="button button--ghost"
                      to={`/users/${album.userId}/albums/${album.id}/photos`}
                    >
                      Open photos
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export { AlbumsPage }
