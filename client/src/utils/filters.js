export function filterItemsByIdAndTitle(items, searchTerm) {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase()

  return items.filter((item) => {
    if (!normalizedSearchTerm) {
      return true
    }

    return `${item.id} ${item.title}`.toLowerCase().includes(normalizedSearchTerm)
  })
}
