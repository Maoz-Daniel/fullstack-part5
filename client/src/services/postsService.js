import { apiClient } from './apiClient.js'

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
  const posts = await apiClient('/posts')
  return posts.map(normalizePost)
}

export async function createPost(post) {
  const createdPost = await apiClient('/posts', 'POST', post)
  return normalizePost(createdPost)
}

export async function updatePost(postId, updates) {
  const updatedPost = await apiClient(`/posts/${postId}`, 'PATCH', updates)
  return normalizePost(updatedPost)
}

export async function deletePost(postId) {
  await apiClient(`/posts/${postId}`, 'DELETE')
}

export async function getPostById(postId) {
  const post = await apiClient(`/posts/${postId}`)
  return normalizePost(post)
}

export async function getCommentsByPostId(postId) {
  const comments = await apiClient(`/comments?postId=${postId}`)
  return comments.map(normalizeComment)
}

export async function createComment(comment) {
  const createdComment = await apiClient('/comments', 'POST', comment)
  return normalizeComment(createdComment)
}

export async function updateComment(commentId, updates) {
  const updatedComment = await apiClient(`/comments/${commentId}`, 'PATCH', updates)
  return normalizeComment(updatedComment)
}

export async function deleteComment(commentId) {
  await apiClient(`/comments/${commentId}`, 'DELETE')
}
