import { apiClient } from './apiClient.js'
import { deleteCached, deleteCachedByPrefix, getCached, setCached } from './cacheStore.js'

export const PHOTO_BATCH_SIZE = 6

function parseNextPage(headers) {
  const linkHeader = headers.get('Link')

  if (!linkHeader) {
    return null
  }

  const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/)

  if (!nextMatch) {
    return null
  }

  const nextUrl = new URL(nextMatch[1])
  const nextPage = Number(nextUrl.searchParams.get('_page'))

  return Number.isNaN(nextPage) ? null : nextPage
}

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

export async function getAlbumsByUserId(userId) {
  const cacheKey = `albums:user:${userId}`
  const cachedAlbums = getCached(cacheKey)

  if (cachedAlbums) {
    return cachedAlbums
  }

  const albums = await apiClient(`/albums?userId=${userId}`)
  const normalizedAlbums = albums.map(normalizeAlbum)

  return setCached(cacheKey, normalizedAlbums)
}

export async function createAlbum(album) {
  const createdAlbum = await apiClient('/albums', 'POST', album)
  deleteCached(`albums:user:${album.userId}`)
  return normalizeAlbum(createdAlbum)
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
