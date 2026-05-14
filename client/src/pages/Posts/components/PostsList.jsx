import { PostCard } from './PostCard.jsx'
import { PostsViewToggle } from './PostsViewToggle.jsx'

function PostsList({
  visiblePosts,
  userId,
  viewMode,
  onViewModeChange,
  selectedPostId,
  editingPostId,
  editingTitle,
  editingBody,
  onEditingTitleChange,
  onEditingBodyChange,
  onSelectPost,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeletePost,
  nextPage,
  isLoadingMore,
  isSwitchingMode,
  onLoadMorePosts,
  error,
}) {
  return (
    <div className="posts-main">
      <div className="posts-main__header">
        <div>
          <p className="posts-main__eyebrow">Reading view</p>
          <h2 className="posts-main__title">{visiblePosts.length} posts in view</h2>
        </div>

        <PostsViewToggle viewMode={viewMode} onChange={onViewModeChange} />
      </div>

      {error ? <p className="auth-form__error">{error}</p> : null}

      <div className="posts-list">
        {visiblePosts.length === 0 ? (
          <p className="panel__subtitle">No posts match the current view.</p>
        ) : (
          visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isOwner={post.userId === userId}
              isSelected={selectedPostId === post.id}
              isEditing={editingPostId === post.id}
              editingTitle={editingTitle}
              editingBody={editingBody}
              onEditingTitleChange={onEditingTitleChange}
              onEditingBodyChange={onEditingBodyChange}
              onSelect={onSelectPost}
              onStartEdit={onStartEdit}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onDelete={onDeletePost}
            />
          ))
        )}
      </div>

      {nextPage ? (
        <div className="button-row">
          <button
            type="button"
            className="button"
            onClick={onLoadMorePosts}
            disabled={isLoadingMore || isSwitchingMode}
          >
            {isLoadingMore ? 'Loading...' : 'Load more'}
          </button>
        </div>
      ) : null}
    </div>
  )
}

export { PostsList }
