import { Link } from 'react-router-dom'

function AlbumPhotosHeader({ album, userName }) {
  return (
    <>
      <div className="button-row album-photos__back">
        <Link className="button button--ghost back-link" to="/albums">
          Back to /albums
        </Link>
      </div>

      <article className="post-card post-card--selected">
        <p className="post-card__meta">Album #{album.id}</p>
        <h1 className="panel__title">{album.title}</h1>
        <p className="panel__subtitle">Managing photos as {userName}.</p>
      </article>
    </>
  )
}

export { AlbumPhotosHeader }
