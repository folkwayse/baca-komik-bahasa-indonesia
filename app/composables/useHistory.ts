interface HistoryItem {
  mangaId: string
  chapterId: string
  mangaTitle: string
  chapterTitle: string
  cover: string
  readAt: number
  progress: number
}

const history = ref<HistoryItem[]>([])
let initialized = false

function initializeHistory() {
  if (initialized) return
  if (import.meta.client) {
    try {
      const stored = localStorage.getItem('komikindo:history')
      if (stored) {
        history.value = JSON.parse(stored)
      }
    } catch {
      history.value = []
    }
  }
  initialized = true
}

watch(history, (newVal) => {
  if (import.meta.client) {
    localStorage.setItem('komikindo:history', JSON.stringify(newVal))
  }
}, { deep: true })

export function useHistory() {
  initializeHistory()

  const addToHistory = (item: Omit<HistoryItem, 'readAt'>): void => {
    const existingIndex = history.value.findIndex(
      (h: HistoryItem) => h.mangaId === item.mangaId && h.chapterId === item.chapterId
    )

    if (existingIndex >= 0) {
      history.value.splice(existingIndex, 1)
    }

    history.value.unshift({
      ...item,
      readAt: Date.now()
    })

    // Keep only last 100 items
    if (history.value.length > 100) {
      history.value = history.value.slice(0, 100)
    }
  }

  const groupedHistory = computed(() => {
    const grouped = new Map<string, HistoryItem>()

    for (const item of history.value) {
      if (!grouped.has(item.mangaId)) {
        grouped.set(item.mangaId, item)
      }
    }

    return Array.from(grouped.values()).sort((a, b) => b.readAt - a.readAt)
  })

  const getLastReadChapter = (mangaId: string): HistoryItem | null => {
    const item = history.value.find((h: HistoryItem) => h.mangaId === mangaId)
    return item || null
  }

  const clearHistory = (): void => {
    history.value = []
  }

  const removeFromHistory = (mangaId: string, chapterId: string): void => {
    const index = history.value.findIndex(
      (h: HistoryItem) => h.mangaId === mangaId && h.chapterId === chapterId
    )
    if (index >= 0) {
      history.value.splice(index, 1)
    }
  }

  const removeMangaHistory = (mangaId: string): void => {
    history.value = history.value.filter((h: HistoryItem) => h.mangaId !== mangaId)
  }

  return {
    history: readonly(history),
    groupedHistory,
    addToHistory,
    getLastReadChapter,
    clearHistory,
    removeFromHistory,
    removeMangaHistory
  }
}
