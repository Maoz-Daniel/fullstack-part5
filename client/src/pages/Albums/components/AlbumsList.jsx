import { AlbumCard } from './AlbumCard.jsx'

function AlbumsList({ albums, onDelete }) {
  return (
    <div className="albums-list">
      {albums.length === 0 ? (
        <p className="panel__subtitle">No albums match the current search.</p>
      ) : (
        albums.map((album) => <AlbumCard key={album.id} album={album} onDelete={onDelete} />)
      )}
    </div>
  )
}

export { AlbumsList }
