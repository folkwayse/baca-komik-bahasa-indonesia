interface BookmarkItem {
  id: string
  title: string
  cover: string
  type: string
  url: string
  addedAt: number
}

const bookmarks = ref<BookmarkItem[]>([])
let initialized = false

function initializeBookmarks() {
  if (initialized) return
  if (import.meta.client) {
    try {
      const stored = localStorage.getItem('komikindo:bookmarks')
      if (stored) {
        bookmarks.value = JSON.parse(stored)
      }
    } catch {
      bookmarks.value = []
    }
  }
  initialized = true
}

watch(bookmarks, (newVal) => {
  if (import.meta.client) {
    localStorage.setItem('komikindo:bookmarks', JSON.stringify(newVal))
  }
}, { deep: true })

export function useBookmarks() {
  initializeBookmarks()

  const isBookmarked = (id: string): boolean => {
    return bookmarks.value.some((item: BookmarkItem) => item.id === id)
  }

  const toggleBookmark = (manga: { id: string, title: string, cover: string, type: string, url: string }): boolean => {
    const index = bookmarks.value.findIndex((item: BookmarkItem) => item.id === manga.id)

    if (index >= 0) {
      bookmarks.value.splice(index, 1)
      return false
    } else {
      bookmarks.value.unshift({
        ...manga,
        addedAt: Date.now()
      })
      return true
    }
  }

  const removeBookmark = (id: string): void => {
    const index = bookmarks.value.findIndex((item: BookmarkItem) => item.id === id)
    if (index >= 0) {
      bookmarks.value.splice(index, 1)
    }
  }

  return {
    bookmarks: readonly(bookmarks),
    isBookmarked,
    toggleBookmark,
    removeBookmark
  }
}
