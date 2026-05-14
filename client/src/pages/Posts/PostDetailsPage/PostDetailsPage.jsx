import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog.jsx'
import { getUsers } from '../../../services/authService.js'
import { usePaginatedItems } from '../../../hooks/usePaginatedItems.js'
import { CommentComposer } from './components/CommentComposer.jsx'
import { CommentsList } from './components/CommentsList.jsx'
import { PostArticle } from './components/PostArticle.jsx'
import {
  createComment,
  deleteComment,
  getCommentsBatch,
  updateComment,
} from '../../../services/postsService.js'

function enrichCommentsWithUsername(comments, users) {
  const usersById = new Map(users.map((currentUser) => [currentUser.id, currentUser]))

  return comments.map((comment) => ({
    ...comment,
    username: usersById.get(comment.userId)?.username ?? `user${comment.userId}`,
  }))
}

function PostDetailsPage() {
  const { user, post, comments: initialComments, nextPage: initialNextPage } = useLoaderData()
  const { items: comments, setItems: setComments, nextPage, isLoadingMore, loadMore } =
    usePaginatedItems(initialComments, initialNextPage)
  const [newCommentBody, setNewCommentBody] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentBody, setEditingCommentBody] = useState('')
  const [error, setError] = useState('')
  const [pendingDeleteComment, setPendingDeleteComment] = useState(null)

  async function handleAddComment(event) {
    event.preventDefault()

    if (!newCommentBody.trim()) {
      setError('Comment body is required.')
      return
    }

    try {
      const createdComment = await createComment({
        postId: post.id,
        userId: user.id,
        username: user.username,
        body: newCommentBody.trim(),
      })

      setComments((currentComments) => [...currentComments, createdComment])
      setNewCommentBody('')
      setError('')
    } catch {
      setError('Comment creation failed.')
    }
  }

  async function handleLoadMoreComments() {
    try {
      await loadMore(async (page) => {
        const [commentsPage, users] = await Promise.all([
          getCommentsBatch(post.id, page),
          getUsers(),
        ])

        return {
          ...commentsPage,
          data: enrichCommentsWithUsername(commentsPage.data, users),
        }
      })
      setError('')
    } catch {
      setError('Comment loading failed.')
    }
  }

  function handleStartEdit(comment) {
    setEditingCommentId(comment.id)
    setEditingCommentBody(comment.body)
    setError('')
  }

  function handleCancelEdit() {
    setEditingCommentId(null)
    setEditingCommentBody('')
  }

  async function handleSaveEdit(commentId) {
    if (!editingCommentBody.trim()) {
      setError('Comment body is required.')
      return
    }

    try {
      const updatedComment = await updateComment(commentId, { body: editingCommentBody.trim() })

      setComments((currentComments) =>
        currentComments.map((comment) => (comment.id === commentId ? updatedComment : comment)),
      )
      setEditingCommentId(null)
      setEditingCommentBody('')
      setError('')
    } catch {
      setError('Comment update failed.')
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await deleteComment(commentId)
      setComments((currentComments) => currentComments.filter((comment) => comment.id !== commentId))
      setError('')
    } catch {
      setError('Comment deletion failed.')
    }
  }

  async function handleConfirmDeleteComment() {
    if (!pendingDeleteComment) {
      return
    }

    await handleDeleteComment(pendingDeleteComment.id)
    setPendingDeleteComment(null)
  }

  return (
    <section className="post-details">
      <div className="button-row post-details__back">
        <Link className="button button--ghost back-link" to="/posts">
          Back to posts
        </Link>
      </div>

      <PostArticle post={post} />

      <section className="comments-section">
        <CommentComposer
          username={user.username}
          newCommentBody={newCommentBody}
          onNewCommentBodyChange={(value) => {
            setNewCommentBody(value)
            if (error) {
              setError('')
            }
          }}
          onSubmit={handleAddComment}
        />

        {error ? <p className="auth-form__error">{error}</p> : null}

        <CommentsList
          comments={comments}
          userId={user.id}
          editingCommentId={editingCommentId}
          editingCommentBody={editingCommentBody}
          onEditingCommentBodyChange={setEditingCommentBody}
          onStartEdit={handleStartEdit}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onDelete={setPendingDeleteComment}
        />

        {nextPage ? (
          <div className="button-row">
            <button
              type="button"
              className="button"
              onClick={handleLoadMoreComments}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? 'Loading...' : 'Load more'}
            </button>
          </div>
        ) : null}
      </section>

      <ConfirmDialog
        open={pendingDeleteComment !== null}
        title="Delete this comment?"
        message={
          pendingDeleteComment
            ? `Comment #${pendingDeleteComment.id} will be removed from this discussion.`
            : 'This comment will be removed from this discussion.'
        }
        confirmLabel="Delete comment"
        onConfirm={handleConfirmDeleteComment}
        onCancel={() => setPendingDeleteComment(null)}
      />
    </section>
  )
}

export { PostDetailsPage }
