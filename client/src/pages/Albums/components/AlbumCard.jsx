import { Link } from 'react-router-dom'

function AlbumCard({ album, onDelete }) {
  return (
    <article className="album-card">
      <div className="album-card__cover">
        <div className="album-card__shine" />
        <button
          type="button"
          className="album-card__delete"
          aria-label={`Delete album ${album.id}`}
          onClick={() => onDelete(album)}
        >
          <svg
            className="album-card__delete-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4.8c0-.9.7-1.6 1.6-1.6h4.8c.9 0 1.6.7 1.6 1.6V6" />
            <path d="M6.8 6l.9 12.2c.1 1.3 1.1 2.3 2.4 2.3h4c1.3 0 2.3-1 2.4-2.3L17.2 6" />
            <path d="M10 10.2v6.2" />
            <path d="M14 10.2v6.2" />
          </svg>
        </button>
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
          <Link className="button button--ghost" to={`/users/${album.userId}/albums/${album.id}/photos`}>
            Open photos
          </Link>
        </div>
      </div>
    </article>
  )
}

export { AlbumCard }
