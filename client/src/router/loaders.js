import { redirect } from 'react-router-dom'
import { getUser, isAuthenticated } from '../hooks/useAuth.js'
import {
  getAlbumById,
  getAlbumPhotosBatch,
  getAlbumsByUserId,
} from '../services/albumsService.js'
import {
  getCommentsByPostId,
  getPostById,
  getPosts,
} from '../services/postsService.js'
import { getTodosByUserId } from '../services/todosService.js'

export function authLandingLoader() {
  return redirect(isAuthenticated() ? '/home' : '/login')
}

export function publicOnlyLoader() {  
  if (isAuthenticated()) {
    return redirect('/home')
  }

  return null
}

export function requireAuthLoader() {
  const user = getUser()

  if (!user) {
    return redirect('/login')
  }

  return user
}

export function requireMatchingUserLoader({ params }) {
  const user = getUser()
  const routeUserId = Number(params.userId)

  if (!user) {
    return redirect('/login')
  }

  if (!Number.isFinite(routeUserId) || routeUserId !== user.id) {
    return redirect('/home')
  }

  return user
}

export async function todosLoader() {
  const user = getUser()

  if (!user) {
    return redirect('/login')
  }

  const todos = await getTodosByUserId(user.id)

  return { user, todos }
}

export async function postsLoader() {
  const user = getUser()

  if (!user) {
    return redirect('/login')
  }

  const posts = await getPosts()

  return { user, posts }
}

export async function postDetailsLoader({ params }) {
  const user = getUser()
  const routePostId = Number(params.postId)
  const routeUserId = Number(params.userId)

  if (!user) {
    return redirect('/login')
  }

  if (!Number.isFinite(routePostId) || !Number.isFinite(routeUserId)) {
    return redirect('/posts')
  }

  const post = await getPostById(routePostId)

  if (post.userId !== routeUserId) {
    return redirect('/posts')
  }

  const comments = await getCommentsByPostId(routePostId)

  return { user, post, comments }
}

export async function albumsLoader() {
  const user = getUser()

  if (!user) {
    return redirect('/login')
  }

  const albums = await getAlbumsByUserId(user.id)

  return { user, albums }
}

export async function albumPhotosLoader({ params }) {
  const user = getUser()
  const routeUserId = Number(params.userId)
  const routeAlbumId = Number(params.albumId)

  if (!user) {
    return redirect('/login')
  }

  if (!Number.isFinite(routeUserId) || routeUserId !== user.id) {
    return redirect('/albums')
  }

  if (!Number.isFinite(routeAlbumId)) {
    return redirect('/albums')
  }

  const album = await getAlbumById(routeAlbumId)

  if (album.userId !== user.id) {
    return redirect('/albums')
  }

  const photosPage = await getAlbumPhotosBatch(album.id, 1)

  return {
    user,
    album,
    photos: photosPage.data,
    nextPage: photosPage.next,
  }
}
