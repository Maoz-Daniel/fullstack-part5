import { PhotoCard } from './PhotoCard.jsx'

function PhotoGrid({
  photos,
  editingPhotoId,
  editingTitle,
  editingUrl,
  editingThumbnailUrl,
  onEditingTitleChange,
  onEditingUrlChange,
  onEditingThumbnailUrlChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) {
  return (
    <div className="photo-grid">
      {photos.length === 0 ? (
        <p className="panel__subtitle">No photos have been loaded for this album yet.</p>
      ) : (
        photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            isEditing={editingPhotoId === photo.id}
            editingTitle={editingTitle}
            editingUrl={editingUrl}
            editingThumbnailUrl={editingThumbnailUrl}
            onEditingTitleChange={onEditingTitleChange}
            onEditingUrlChange={onEditingUrlChange}
            onEditingThumbnailUrlChange={onEditingThumbnailUrlChange}
            onStartEdit={onStartEdit}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  )
}

export { PhotoGrid }
