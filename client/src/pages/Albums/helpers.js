import { filterItemsByIdAndTitle } from '../../utils/filters.js'

export function getVisibleAlbums(albums, searchTerm) {
  return filterItemsByIdAndTitle(albums, searchTerm)
}
