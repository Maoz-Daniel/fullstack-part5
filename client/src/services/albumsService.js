import { apiClient } from './core/apiClient.js'
import { deleteCached, deleteCachedByPrefix, getCached, setCached } from './core/cacheStore.js'
import { parseNextPage } from './core/pagination.js'

export const ALBUM_BATCH_SIZE = 6
export const PHOTO_BATCH_SIZE = 6

function normalizeAlbum(album) {
  return {
    ...album,
    id: Number(album.id),
    userId: Number(album.userId),
  }
}

function normalizePhoto(photo) {
  return {
    ...photo,
    id: Number(photo.id),
    albumId: Number(photo.albumId),
  }
}

export async function getAlbumsBatch(userId, page, perPage = ALBUM_BATCH_SIZE) {
  const cacheKey = `albums:user:${userId}:page:${page}`
  const cachedAlbumsPage = getCached(cacheKey)

  if (cachedAlbumsPage) {
    return cachedAlbumsPage
  }

  const response = await apiClient(`/albums?userId=${userId}&_page=${page}&_limit=${perPage}`, 'GET', null, {
    includeHeaders: true,
  })
  const normalizedAlbumsPage = {
    data: response.data.map(normalizeAlbum),
    next: parseNextPage(response.headers),
  }

  return setCached(cacheKey, normalizedAlbumsPage)
}

export async function createAlbum(album) {
  const createdAlbum = await apiClient('/albums', 'POST', album)
  deleteCachedByPrefix(`albums:user:${album.userId}:`)
  return normalizeAlbum(createdAlbum)
}

export async function deleteAlbum(albumId) {
  const album = await apiClient(`/albums/${albumId}`)
  await apiClient(`/albums/${albumId}`, 'DELETE')
  deleteCachedByPrefix(`albums:user:${album.userId}:`)
  deleteCached(`album:${albumId}`)
  deleteCachedByPrefix(`photos:album:${albumId}:`)
}

export async function getAlbumById(albumId) {
  const cacheKey = `album:${albumId}`
  const cachedAlbum = getCached(cacheKey)

  if (cachedAlbum) {
    return cachedAlbum
  }

  const album = await apiClient(`/albums/${albumId}`)
  const normalizedAlbum = normalizeAlbum(album)

  return setCached(cacheKey, normalizedAlbum)
}

export async function getAlbumPhotosBatch(albumId, page, perPage = PHOTO_BATCH_SIZE) {
  const cacheKey = `photos:album:${albumId}:page:${page}`
  const cachedPhotosPage = getCached(cacheKey)

  if (cachedPhotosPage) {
    return cachedPhotosPage
  }

  const response = await apiClient(`/photos?albumId=${albumId}&_page=${page}&_limit=${perPage}`, 'GET', null, {
    includeHeaders: true,
  })

  const normalizedPhotosPage = {
    data: response.data.map(normalizePhoto),
    next: parseNextPage(response.headers),
  }

  return setCached(cacheKey, normalizedPhotosPage)
}

export async function createPhoto(photo) {
  const createdPhoto = await apiClient('/photos', 'POST', photo)
  deleteCachedByPrefix(`photos:album:${photo.albumId}:`)
  return normalizePhoto(createdPhoto)
}

export async function updatePhoto(photoId, updates) {
  const photo = await apiClient(`/photos/${photoId}`)
  const updatedPhoto = await apiClient(`/photos/${photoId}`, 'PATCH', updates)
  deleteCachedByPrefix(`photos:album:${photo.albumId}:`)
  return normalizePhoto(updatedPhoto)
}

export async function deletePhoto(photoId) {
  const photo = await apiClient(`/photos/${photoId}`)
  await apiClient(`/photos/${photoId}`, 'DELETE')
  deleteCachedByPrefix(`photos:album:${photo.albumId}:`)
}
