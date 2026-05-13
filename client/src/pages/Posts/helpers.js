import { filterItemsByIdAndTitle } from '../../utils/filters.js'

export function getVisiblePosts(posts, userId, viewMode, searchTerm) {
  const basePosts = viewMode === 'mine' ? posts.filter((post) => post.userId === userId) : posts

  return filterItemsByIdAndTitle(basePosts, searchTerm)
}
