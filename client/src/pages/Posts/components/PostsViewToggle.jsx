function getToggleButtonClass(isActive) {
  return isActive
    ? 'button posts-view-toggle__button posts-view-toggle__button--active'
    : 'button button--ghost posts-view-toggle__button'
}

function PostsViewToggle({ viewMode, onChange }) {
  return (
    <div className="posts-view-toggle" aria-label="Post view mode">
      <button
        type="button"
        className={getToggleButtonClass(viewMode === 'mine')}
        onClick={() => onChange('mine')}
      >
        My posts
      </button>
      <button
        type="button"
        className={getToggleButtonClass(viewMode === 'all')}
        onClick={() => onChange('all')}
      >
        All posts
      </button>
    </div>
  )
}

export { PostsViewToggle }
