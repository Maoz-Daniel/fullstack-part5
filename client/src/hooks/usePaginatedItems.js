import { useState } from 'react'

function defaultMergeItems(currentItems, nextItems) {
  return [...currentItems, ...nextItems]
}

function usePaginatedItems(initialItems, initialNextPage) {
  const [items, setItems] = useState(initialItems)
  const [nextPage, setNextPage] = useState(initialNextPage)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  function replacePage(pageData) {
    setItems(pageData.data)
    setNextPage(pageData.next)
  }

  async function loadMore(fetchPage, options = {}) {
    const { mergeItems = defaultMergeItems } = options

    if (!nextPage || isLoadingMore) {
      return null
    }

    setIsLoadingMore(true)

    try {
      const pageData = await fetchPage(nextPage)

      setItems((currentItems) => mergeItems(currentItems, pageData.data))
      setNextPage(pageData.next)

      return pageData
    } finally {
      setIsLoadingMore(false)
    }
  }

  return {
    items,
    setItems,
    nextPage,
    setNextPage,
    isLoadingMore,
    loadMore,
    replacePage,
  }
}

export { usePaginatedItems }
