import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import {
  createPost,
  deletePost,
  updatePost,
} from '../../services/postsService.js'
import { getVisiblePosts } from './helpers.js'

function PostsPage() {
  const { user, posts: initialPosts } = useLoaderData()
  const [posts, setPosts] = useState(initialPosts)
  const [viewMode, setViewMode] = useState('mine')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [editingPostId, setEditingPostId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingBody, setEditingBody] = useState('')
  const [error, setError] = useState('')

  const visiblePosts = getVisiblePosts(posts, user.id, viewMode, searchTerm)

  async function handleCreatePost(event) {
    event.preventDefault()

    if (!newTitle.trim()) {
      setError('Post title is required.')
      return
    }

    if (!newBody.trim()) {
      setError('Post body is required.')
      return
    }

    try {
      const createdPost = await createPost({
        userId: user.id,
        title: newTitle.trim(),
        body: newBody.trim(),
      })

      setPosts((currentPosts) => [createdPost, ...currentPosts])
      setNewTitle('')
      setNewBody('')
      setSelectedPostId(createdPost.id)
      setError('')
    } catch {
      setError('Post creation failed.')
    }
  }

  function handleSelectPost(postId) {
    setSelectedPostId((currentPostId) => (currentPostId === postId ? null : postId))
  }

  function handleStartEdit(post) {
    setEditingPostId(post.id)
    setEditingTitle(post.title)
    setEditingBody(post.body)
    setSelectedPostId(post.id)
    setError('')
  }

  function handleCancelEdit() {
    setEditingPostId(null)
    setEditingTitle('')
    setEditingBody('')
  }

  async function handleSaveEdit(postId) {
    if (!editingTitle.trim()) {
      setError('Post title is required.')
      return
    }

    if (!editingBody.trim()) {
      setError('Post body is required.')
      return
    }

    try {
      const updatedPost = await updatePost(postId, {
        title: editingTitle.trim(),
        body: editingBody.trim(),
      })

      setPosts((currentPosts) =>
        currentPosts.map((post) => (post.id === postId ? updatedPost : post)),
      )
      setEditingPostId(null)
      setEditingTitle('')
      setEditingBody('')
      setError('')
    } catch {
      setError('Post update failed.')
    }
  }

  async function handleDeletePost(postId) {
    try {
      await deletePost(postId)
      setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId))

      if (selectedPostId === postId) {
        setSelectedPostId(null)
      }

      if (editingPostId === postId) {
        handleCancelEdit()
      }

      setError('')
    } catch {
      setError('Post deletion failed.')
    }
  }

  return (
    <section>
      <h1 className="panel__title">Posts</h1>
      <p className="panel__subtitle">
        Switch between your posts and all posts. Select a post to reveal its body.
      </p>

      <div className="posts-layout">
        <div className="posts-main">
          <div className="posts-main__header">
            <div>
              <p className="posts-main__eyebrow">Reading view</p>
              <h2 className="posts-main__title">{visiblePosts.length} posts in view</h2>
            </div>

            <div className="posts-view-toggle" aria-label="Post view mode">
              <button
                type="button"
                className={viewMode === 'mine' ? 'button posts-view-toggle__button posts-view-toggle__button--active' : 'button button--ghost posts-view-toggle__button'}
                onClick={() => setViewMode('mine')}
              >
                My posts
              </button>
              <button
                type="button"
                className={viewMode === 'all' ? 'button posts-view-toggle__button posts-view-toggle__button--active' : 'button button--ghost posts-view-toggle__button'}
                onClick={() => setViewMode('all')}
              >
                All posts
              </button>
            </div>
          </div>

          {error ? <p className="auth-form__error">{error}</p> : null}

          <div className="posts-list">
            {visiblePosts.length === 0 ? (
              <p className="panel__subtitle">No posts match the current view.</p>
            ) : (
              visiblePosts.map((post) => {
                const isOwner = post.userId === user.id
                const isSelected = selectedPostId === post.id

                return (
                  <article
                    key={post.id}
                    className={isSelected ? 'post-card post-card--selected' : 'post-card'}
                  >
                    <div className="post-card__header">
                      {editingPostId === post.id ? (
                        <div className="post-card__select">
                          <p className="post-card__meta">Post #{post.id}</p>
                          <>
                            <input
                              className="auth-form__input"
                              type="text"
                              value={editingTitle}
                              onChange={(event) => setEditingTitle(event.target.value)}
                            />
                            <textarea
                              className="auth-form__input auth-form__textarea"
                              value={editingBody}
                              onChange={(event) => setEditingBody(event.target.value)}
                            />
                          </>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="post-card__select"
                          onClick={() => handleSelectPost(post.id)}
                        >
                          <p className="post-card__meta">Post #{post.id}</p>
                          <h2 className="post-card__title">{post.title}</h2>
                        </button>
                      )}

                      <div className="post-card__actions">
                        <Link className="button button--ghost" to={`/users/${post.userId}/posts/${post.id}`}>
                          Open comments
                        </Link>

                        {isOwner ? (
                          editingPostId === post.id ? (
                            <>
                              <button
                                type="button"
                                className="button"
                                onClick={() => handleSaveEdit(post.id)}
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
                            <>
                              <button
                                type="button"
                                className="button button--ghost"
                                onClick={() => handleStartEdit(post)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="button button--ghost"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                Delete
                              </button>
                            </>
                          )
                        ) : null}
                      </div>
                    </div>

                    {isSelected && editingPostId !== post.id ? (
                      <p className="post-card__body">{post.body}</p>
                    ) : null}
                  </article>
                )
              })
            )}
          </div>
        </div>

        <aside className="posts-sidebar">
          <div className="posts-sidebar__section">
            <p className="posts-sidebar__eyebrow">Compose</p>
            <h2 className="posts-sidebar__title">Write and refine</h2>
            <p className="panel__subtitle">
              Keep the writing tools nearby while the main column stays focused on the posts themselves.
            </p>
          </div>

          <div className="posts-toolbar">
            <label className="auth-form__field">
              <span className="auth-form__label">Search</span>
              <input
                className="auth-form__input"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
          </div>

          <form className="auth-form posts-sidebar__form" onSubmit={handleCreatePost}>
            <label className="auth-form__field">
              <span className="auth-form__label">Post title</span>
              <input
                className="auth-form__input"
                type="text"
                value={newTitle}
                onChange={(event) => {
                  setNewTitle(event.target.value)
                  if (error) {
                    setError('')
                  }
                }}
              />
            </label>

            <label className="auth-form__field">
              <span className="auth-form__label">Post body</span>
              <textarea
                className="auth-form__input auth-form__textarea"
                value={newBody}
                onChange={(event) => {
                  setNewBody(event.target.value)
                  if (error) {
                    setError('')
                  }
                }}
              />
            </label>

            <div className="button-row">
              <button type="submit" className="button">
                Create post
              </button>
            </div>
          </form>
        </aside>
      </div>
    </section>
  )
}

export { PostsPage }
