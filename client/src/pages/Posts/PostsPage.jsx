import { useEffect, useState } from 'react'
import { useLoaderData, useSearchParams } from 'react-router-dom'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx'
import { usePaginatedItems } from '../../hooks/usePaginatedItems.js'
import {
  createPost,
  deletePost,
  getPostsBatch,
  getPostsByUserIdBatch,
  updatePost,
} from '../../services/postsService.js'
import { PostsList } from './components/PostsList.jsx'
import { PostsSidebar } from './components/PostsSidebar.jsx'

function getNormalizedViewMode(value) {
  return value === 'all' ? 'all' : 'mine'
}

function PostsPage() {
  const { user, posts: initialPosts, nextPage: initialNextPage } = useLoaderData()
  const [searchParams, setSearchParams] = useSearchParams()
  const { items: posts, setItems: setPosts, nextPage, isLoadingMore, loadMore, replacePage } =
    usePaginatedItems(initialPosts, initialNextPage)
  const viewMode = getNormalizedViewMode(searchParams.get('view'))
  const searchTerm = searchParams.get('q') ?? ''
  const [loadedViewMode, setLoadedViewMode] = useState('mine')
  const [isSwitchingMode, setIsSwitchingMode] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [editingPostId, setEditingPostId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingBody, setEditingBody] = useState('')
  const [error, setError] = useState('')
  const [pendingDeletePost, setPendingDeletePost] = useState(null)

  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const visiblePosts = normalizedSearchTerm
    ? posts.filter((post) => `${post.id} ${post.title}`.toLowerCase().includes(normalizedSearchTerm))
    : posts

  function updatePostsSearchParams(nextViewMode, nextSearchTerm) {
    const nextParams = new URLSearchParams()

    if (nextViewMode === 'all') {
      nextParams.set('view', 'all')
    }

    if (nextSearchTerm.trim()) {
      nextParams.set('q', nextSearchTerm)
    }

    setSearchParams(nextParams)
  }

  useEffect(() => {
    if (viewMode === loadedViewMode) {
      return
    }

    let isCancelled = false

    async function syncPostsForViewMode() {
      setIsSwitchingMode(true)

      try {
        const postsPage =
          viewMode === 'mine'
            ? await getPostsByUserIdBatch(user.id, 1)
            : await getPostsBatch(1)

        if (isCancelled) {
          return
        }

        replacePage(postsPage)
        setLoadedViewMode(viewMode)
        setSelectedPostId(null)
        setEditingPostId(null)
        setEditingTitle('')
        setEditingBody('')
        setError('')
      } catch {
        if (!isCancelled) {
          setError('Post loading failed.')
        }
      } finally {
        if (!isCancelled) {
          setIsSwitchingMode(false)
        }
      }
    }

    void syncPostsForViewMode()

    return () => {
      isCancelled = true
    }
  }, [loadedViewMode, replacePage, user.id, viewMode])

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

  async function handleChangeViewMode(nextMode) {
    if (nextMode === viewMode) {
      return
    }

    updatePostsSearchParams(nextMode, searchTerm)
  }

  async function handleLoadMorePosts() {
    try {
      await loadMore((page) =>
        viewMode === 'mine' ? getPostsByUserIdBatch(user.id, page) : getPostsBatch(page),
      )
      setError('')
    } catch {
      setError('Post loading failed.')
    }
  }

  async function handleConfirmDeletePost() {
    if (!pendingDeletePost) {
      return
    }

    await handleDeletePost(pendingDeletePost.id)
    setPendingDeletePost(null)
  }

  return (
    <section>
      <h1 className="panel__title">Posts</h1>
      <p className="panel__subtitle">
        Switch between your posts and all posts. Select a post to reveal its body.
      </p>

      <div className="posts-layout">
        <PostsList
          visiblePosts={visiblePosts}
          userId={user.id}
          viewMode={viewMode}
          onViewModeChange={handleChangeViewMode}
          selectedPostId={selectedPostId}
          editingPostId={editingPostId}
          editingTitle={editingTitle}
          editingBody={editingBody}
          onEditingTitleChange={setEditingTitle}
          onEditingBodyChange={setEditingBody}
          onSelectPost={handleSelectPost}
          onStartEdit={handleStartEdit}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onDeletePost={setPendingDeletePost}
          nextPage={nextPage}
          isLoadingMore={isLoadingMore}
          isSwitchingMode={isSwitchingMode}
          onLoadMorePosts={handleLoadMorePosts}
          error={error}
        />

        <PostsSidebar
          searchTerm={searchTerm}
          onSearchChange={(value) => updatePostsSearchParams(viewMode, value)}
          newTitle={newTitle}
          onNewTitleChange={(value) => {
            setNewTitle(value)
            if (error) {
              setError('')
            }
          }}
          newBody={newBody}
          onNewBodyChange={(value) => {
            setNewBody(value)
            if (error) {
              setError('')
            }
          }}
          onSubmit={handleCreatePost}
        />
      </div>

      <ConfirmDialog
        open={pendingDeletePost !== null}
        title="Delete this post?"
        message={
          pendingDeletePost
            ? `Post #${pendingDeletePost.id} and its comment view will be removed from your workspace.`
            : 'This post will be removed from your workspace.'
        }
        confirmLabel="Delete post"
        onConfirm={handleConfirmDeletePost}
        onCancel={() => setPendingDeletePost(null)}
      />
    </section>
  )
}

export { PostsPage }
