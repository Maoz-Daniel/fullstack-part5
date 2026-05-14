import { apiClient } from './core/apiClient.js'
import { deleteCached, deleteCachedByPrefix, getCached, setCached } from './core/cacheStore.js'
import { parseNextPage } from './core/pagination.js'

export const POST_BATCH_SIZE = 6
export const COMMENT_BATCH_SIZE = 6

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

export async function getPostsBatch(page, perPage = POST_BATCH_SIZE) {
  const cacheKey = `posts:all:page:${page}`
  const cachedPostsPage = getCached(cacheKey)

  if (cachedPostsPage) {
    return cachedPostsPage
  }

  const response = await apiClient(`/posts?_page=${page}&_limit=${perPage}`, 'GET', null, {
    includeHeaders: true,
  })
  const normalizedPostsPage = {
    data: response.data.map(normalizePost),
    next: parseNextPage(response.headers),
  }

  return setCached(cacheKey, normalizedPostsPage)
}

export async function getPostsByUserIdBatch(userId, page, perPage = POST_BATCH_SIZE) {
  const cacheKey = `posts:user:${userId}:page:${page}`
  const cachedPostsPage = getCached(cacheKey)

  if (cachedPostsPage) {
    return cachedPostsPage
  }

  const response = await apiClient(`/posts?userId=${userId}&_page=${page}&_limit=${perPage}`, 'GET', null, {
    includeHeaders: true,
  })
  const normalizedPostsPage = {
    data: response.data.map(normalizePost),
    next: parseNextPage(response.headers),
  }

  return setCached(cacheKey, normalizedPostsPage)
}

export async function createPost(post) {
  const createdPost = await apiClient('/posts', 'POST', post)
  deleteCachedByPrefix('posts:all:')
  deleteCachedByPrefix(`posts:user:${post.userId}:`)
  return normalizePost(createdPost)
}

export async function updatePost(postId, updates) {
  const updatedPost = await apiClient(`/posts/${postId}`, 'PATCH', updates)
  deleteCachedByPrefix('posts:all:')
  deleteCachedByPrefix(`posts:user:${updatedPost.userId}:`)
  deleteCached(`post:${postId}`)
  return normalizePost(updatedPost)
}

export async function deletePost(postId) {
  const post = await apiClient(`/posts/${postId}`)
  deleteCachedByPrefix('posts:all:')
  deleteCachedByPrefix(`posts:user:${post.userId}:`)
  deleteCached(`post:${postId}`)
  deleteCachedByPrefix(`comments:post:${postId}:`)
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

export async function getCommentsBatch(postId, page, perPage = COMMENT_BATCH_SIZE) {
  const cacheKey = `comments:post:${postId}:page:${page}`
  const cachedCommentsPage = getCached(cacheKey)

  if (cachedCommentsPage) {
    return cachedCommentsPage
  }

  const response = await apiClient(`/comments?postId=${postId}&_page=${page}&_limit=${perPage}`, 'GET', null, {
    includeHeaders: true,
  })
  const normalizedCommentsPage = {
    data: response.data.map(normalizeComment),
    next: parseNextPage(response.headers),
  }

  return setCached(cacheKey, normalizedCommentsPage)
}

export async function createComment(comment) {
  const createdComment = await apiClient('/comments', 'POST', comment)
  deleteCachedByPrefix(`comments:post:${comment.postId}:`)
  return normalizeComment(createdComment)
}

export async function updateComment(commentId, updates) {
  const comment = await apiClient(`/comments/${commentId}`)
  const updatedComment = await apiClient(`/comments/${commentId}`, 'PATCH', updates)
  deleteCachedByPrefix(`comments:post:${comment.postId}:`)
  return normalizeComment(updatedComment)
}

export async function deleteComment(commentId) {
  const comment = await apiClient(`/comments/${commentId}`)
  await apiClient(`/comments/${commentId}`, 'DELETE')
  deleteCachedByPrefix(`comments:post:${comment.postId}:`)
}
