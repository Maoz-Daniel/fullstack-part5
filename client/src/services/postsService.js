import { apiClient } from './apiClient.js'
import { deleteCached, getCached, setCached } from './cacheStore.js'

function normalizePost(post) {
  return {
    ...post,
    id: Number(post.id),
    userId: Number(post.userId),
  }
}

function normalizeComment(comment) {
  return {
    ...comment,
    id: Number(comment.id),
    postId: Number(comment.postId),
    userId: Number(comment.userId),
  }
}

export async function getPosts() {
  const cacheKey = 'posts:all'
  const cachedPosts = getCached(cacheKey)

  if (cachedPosts) {
    return cachedPosts
  }

  const posts = await apiClient('/posts')
  const normalizedPosts = posts.map(normalizePost)

  return setCached(cacheKey, normalizedPosts)
}

export async function createPost(post) {
  const createdPost = await apiClient('/posts', 'POST', post)
  deleteCached('posts:all')
  return normalizePost(createdPost)
}

export async function updatePost(postId, updates) {
  const updatedPost = await apiClient(`/posts/${postId}`, 'PATCH', updates)
  deleteCached('posts:all')
  deleteCached(`post:${postId}`)
  return normalizePost(updatedPost)
}

export async function deletePost(postId) {
  deleteCached('posts:all')
  deleteCached(`post:${postId}`)
  deleteCached(`comments:post:${postId}`)
  await apiClient(`/posts/${postId}`, 'DELETE')
}

export async function getPostById(postId) {
  const cacheKey = `post:${postId}`
  const cachedPost = getCached(cacheKey)

  if (cachedPost) {
    return cachedPost
  }

  const post = await apiClient(`/posts/${postId}`)
  const normalizedPost = normalizePost(post)

  return setCached(cacheKey, normalizedPost)
}

export async function getCommentsByPostId(postId) {
  const cacheKey = `comments:post:${postId}`
  const cachedComments = getCached(cacheKey)

  if (cachedComments) {
    return cachedComments
  }

  const comments = await apiClient(`/comments?postId=${postId}`)
  const normalizedComments = comments.map(normalizeComment)

  return setCached(cacheKey, normalizedComments)
}

export async function createComment(comment) {
  const createdComment = await apiClient('/comments', 'POST', comment)
  deleteCached(`comments:post:${comment.postId}`)
  return normalizeComment(createdComment)
}

export async function updateComment(commentId, updates) {
  const comment = await apiClient(`/comments/${commentId}`)
  const updatedComment = await apiClient(`/comments/${commentId}`, 'PATCH', updates)
  deleteCached(`comments:post:${comment.postId}`)
  return normalizeComment(updatedComment)
}

export async function deleteComment(commentId) {
  const comment = await apiClient(`/comments/${commentId}`)
  await apiClient(`/comments/${commentId}`, 'DELETE')
  deleteCached(`comments:post:${comment.postId}`)
}
