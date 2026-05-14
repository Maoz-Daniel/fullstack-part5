export function mergePhotos(currentPhotos, incomingPhotos) {
  const seenIds = new Set(currentPhotos.map((photo) => photo.id))
  const uniqueIncoming = incomingPhotos.filter((photo) => !seenIds.has(photo.id))
  return [...currentPhotos, ...uniqueIncoming]
}

export function validatePhotoFields(title, url, thumbnailUrl) {
  if (!title.trim()) {
    return 'Photo title is required.'
  }

  if (!url.trim()) {
    return 'Photo URL is required.'
  }

  if (!thumbnailUrl.trim()) {
    return 'Thumbnail URL is required.'
  }

  return null
}

export function buildNewPhotoPayload(albumId, title, url, thumbnailUrl) {
  return {
    albumId,
    title: title.trim(),
    url: url.trim(),
    thumbnailUrl: thumbnailUrl.trim(),
  }
}

export function buildUpdatedPhotoPayload(title, url, thumbnailUrl) {
  return {
    title: title.trim(),
    url: url.trim(),
    thumbnailUrl: thumbnailUrl.trim(),
  }
}
