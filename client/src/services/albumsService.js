import { apiClient } from './apiClient.js'

export const PHOTO_BATCH_SIZE = 6

function normalizeAlbum(album) {
  return {
    ...album,
    id: String(album.id),
    userId: String(album.userId),
  }
}

function normalizePhoto(photo) {
  return {
    ...photo,
    id: String(photo.id),
    albumId: String(photo.albumId),
  }
}

export async function getAlbumsByUserId(userId) {
  const albums = await apiClient(`/albums?userId=${userId}`)
  return albums.map(normalizeAlbum)
}

export async function createAlbum(album) {
  const createdAlbum = await apiClient('/albums', 'POST', album)
  return normalizeAlbum(createdAlbum)
}

export async function getAlbumById(albumId) {
  const album = await apiClient(`/albums/${albumId}`)
  return normalizeAlbum(album)
}

export async function getAlbumPhotosBatch(albumId, page, perPage = PHOTO_BATCH_SIZE) {
  const response = await apiClient(`/photos?albumId=${albumId}&_page=${page}&_per_page=${perPage}`)

  return {
    ...response,
    data: response.data.map(normalizePhoto),
  }
}

export async function createPhoto(photo) {
  const createdPhoto = await apiClient('/photos', 'POST', photo)
  return normalizePhoto(createdPhoto)
}

export async function updatePhoto(photoId, updates) {
  const updatedPhoto = await apiClient(`/photos/${photoId}`, 'PATCH', updates)
  return normalizePhoto(updatedPhoto)
}

export async function deletePhoto(photoId) {
  await apiClient(`/photos/${photoId}`, 'DELETE')
}
