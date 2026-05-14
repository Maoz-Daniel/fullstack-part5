import { redirect } from 'react-router-dom'
import { getUser, isAuthenticated } from '../hooks/useAuth.js'
import { getUsers } from '../services/authService.js'
import {
  getAlbumById,
  getAlbumPhotosBatch,
  getAlbumsBatch,
} from '../services/albumsService.js'
import {
  getCommentsBatch,
  getPostById,
  getPostsByUserIdBatch,
} from '../services/postsService.js'
import { getTodosBatch } from '../services/todosService.js'

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

  if (routeUserId !== user.id) {
    return redirect('/home')
  }

  return user
}

// for each comment, find the user that made it and add a username property to the comment object
function enrichCommentsWithUsername(comments, users) {
  const usersById = new Map(users.map((currentUser) => [currentUser.id, currentUser])) // Map { 1 => {id: 1, username: 'user1', ..}, 2 => {...}, .. }

  return comments.map((comment) => ({
    ...comment,
    username: usersById.get(comment.userId)?.username ?? `user${comment.userId}`,
    
    // finally, we have a comment object like this: { id: 1, postId: 1, userId: 1, body: '...', username: 'user1' }
  }))
}

export async function todosLoader() {
  const user = getUser()

  if (!user) {
    return redirect('/login')
  }

  if (!Number.isFinite(user.id)) {
    return redirect('/home')
  }
  
  try {
    const todosPage = await getTodosBatch(user.id, 1)

    return {
      user,
      todos: todosPage.data,
      nextPage: todosPage.next,
    }
  } catch {
    throw new Error('Failed to load todos.')
  }
}

export async function postsLoader() {
  const user = getUser()

  if (!user) {
    return redirect('/login')
  }

  if (!Number.isFinite(user.id)) {
    return redirect('/home')
  }

  try {
    const postsPage = await getPostsByUserIdBatch(user.id, 1)

    return {
      user,
      posts: postsPage.data,
      nextPage: postsPage.next,
    }
  } catch {
    throw new Error('Failed to load posts.')
  }
}

export async function postDetailsLoader({ params }) {
  const user = getUser()
  const routePostId = Number(params.postId)
  const routeUserId = Number(params.userId)

  if (!user) {
    return redirect('/login')
  }

  try {
    const post = await getPostById(routePostId)

    if (post.userId !== routeUserId) { // if the url params userId doesn't match the post's userId
      return redirect('/posts')
    }

    const [commentsPage, users] = await Promise.all([
      getCommentsBatch(routePostId, 1),
      getUsers(),
    ])
    const commentsWithUsername = enrichCommentsWithUsername(commentsPage.data, users)

    return {
      user,
      post,
      comments: commentsWithUsername,
      nextPage: commentsPage.next,
    }
  } catch {
    throw new Error('Failed to load post details.')
  }
}

export async function albumsLoader() {
  const user = getUser()

  if (!user) {
    return redirect('/login')
  }

  if (!Number.isFinite(user.id)) {
    return redirect('/home')
  }

  try {
    const albumsPage = await getAlbumsBatch(user.id, 1)

    return {
      user,
      albums: albumsPage.data,
      nextPage: albumsPage.next,
    }
  } catch {
    throw new Error('Failed to load albums.')
  }
}

export async function albumPhotosLoader({ params }) {
  const user = getUser()
  const routeUserId = Number(params.userId)
  const routeAlbumId = Number(params.albumId)

  if (!user) {
    return redirect('/login')
  }

  if (routeUserId !== user.id) { // if the user is trying to access an album that doesn't belong to them
    return redirect('/albums')
  }

  if (!Number.isFinite(routeAlbumId)) { 
    return redirect('/albums')
  }

  try {
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
  } catch {
    throw new Error('Failed to load album photos.')
  }
}
