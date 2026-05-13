import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import {
  createComment,
  deleteComment,
  updateComment,
} from '../../services/postsService.js'

function PostDetailsPage() {
  const { user, post, comments: initialComments } = useLoaderData()
  const [comments, setComments] = useState(initialComments)
  const [newCommentBody, setNewCommentBody] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentBody, setEditingCommentBody] = useState('')
  const [error, setError] = useState('')

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
        name: user.name,
        email: user.email,
        body: newCommentBody.trim(),
      })

      setComments((currentComments) => [...currentComments, createdComment])
      setNewCommentBody('')
      setError('')
    } catch {
      setError('Comment creation failed.')
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

  return (
    <section className="post-details">
      <div className="button-row post-details__back">
        <Link className="button button--ghost back-link" to="/posts">
          Back to /posts
        </Link>
      </div>

      <article className="post-card post-card--selected">
        <p className="post-card__meta">Post #{post.id}</p>
        <h1 className="panel__title">{post.title}</h1>
        <p className="post-card__body">{post.body}</p>
      </article>

      <section className="comments-section">
        <h2 className="home-info__title">Comments</h2>
        <p className="panel__subtitle">
          Commenting as {user.name} ({user.email})
        </p>

        <form className="auth-form comments-composer" onSubmit={handleAddComment}>
          <label className="auth-form__field">
            <span className="auth-form__label">Add comment</span>
            <textarea
              className="auth-form__input auth-form__textarea comments-composer__textarea"
              value={newCommentBody}
              onChange={(event) => {
                setNewCommentBody(event.target.value)
                if (error) {
                  setError('')
                }
              }}
            />
          </label>

          <div className="button-row">
            <button type="submit" className="button">
              Add comment
            </button>
          </div>
        </form>

        {error ? <p className="auth-form__error">{error}</p> : null}

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="panel__subtitle">No comments for this post yet.</p>
          ) : (
            comments.map((comment) => {
              const isOwner = comment.userId === user.id

              return (
                <article key={comment.id} className="comment-card">
                  <p className="comment-card__meta">
                    Comment #{comment.id} by {comment.name} ({comment.email})
                  </p>

                  {editingCommentId === comment.id ? (
                    <textarea
                      className="auth-form__input auth-form__textarea comments-composer__textarea"
                      value={editingCommentBody}
                      onChange={(event) => setEditingCommentBody(event.target.value)}
                    />
                  ) : (
                    <p className="comment-card__body">{comment.body}</p>
                  )}

                  {isOwner ? (
                    <div className="button-row">
                      {editingCommentId === comment.id ? (
                        <>
                          <button
                            type="button"
                            className="button"
                            onClick={() => handleSaveEdit(comment.id)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="button button--ghost"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="button button--ghost"
                          onClick={() => handleStartEdit(comment)}
                        >
                          Edit
                        </button>
                      )}

                      <button
                        type="button"
                        className="button button--ghost"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </article>
              )
            })
          )}
        </div>
      </section>
    </section>
  )
}

export { PostDetailsPage }
