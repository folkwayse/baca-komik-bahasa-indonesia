import { ref } from 'vue'

interface CachedChapter {
  chapterId: string
  title: string
  chapter: string
  image: string[]
  thumb: string
  link: string
  image2?: string
  cachedAt: number
  imagesLoaded: boolean
}

interface CachedManga {
  mangaId: string
  title: string
  cover: string
  chapterList: Array<{ id: string, chapter: string }>
  cachedAt: number
}

const CACHE_KEY = 'komikindo:chapter-cache'
const MANGA_CACHE_KEY = 'komikindo:manga-cache'
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000
const MAX_CACHE_SIZE = 15
const MAX_MANGA_CACHE_SIZE = 10

const cache = ref<Map<string, CachedChapter>>(new Map())
const mangaCache = ref<Map<string, CachedManga>>(new Map())
let initialized = false

function initializeCache() {
  if (initialized) return
  if (import.meta.client) {
    try {
      const stored = localStorage.getItem(CACHE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, CachedChapter>
        cache.value = new Map(Object.entries(parsed))
        clearExpiredCache()
      }

      const mangaStored = localStorage.getItem(MANGA_CACHE_KEY)
      if (mangaStored) {
        const parsed = JSON.parse(mangaStored) as Record<string, CachedManga>
        mangaCache.value = new Map(Object.entries(parsed))
        clearExpiredMangaCache()
      }
    } catch {
      cache.value = new Map()
      mangaCache.value = new Map()
    }
  }
  initialized = true
}

function clearExpiredCache() {
  const now = Date.now()
  const expired: string[] = []

  cache.value.forEach((value, key) => {
    if (now - value.cachedAt > CACHE_EXPIRY) {
      expired.push(key)
    }
  })

  expired.forEach(key => cache.value.delete(key))
  saveToStorage()
}

function clearExpiredMangaCache() {
  const now = Date.now()
  const expired: string[] = []

  mangaCache.value.forEach((value, key) => {
    if (now - value.cachedAt > CACHE_EXPIRY) {
      expired.push(key)
    }
  })

  expired.forEach(key => mangaCache.value.delete(key))
  saveMangaToStorage()
}

function saveToStorage() {
  if (import.meta.client) {
    const obj = Object.fromEntries(cache.value)
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj))
  }
}

function saveMangaToStorage() {
  if (import.meta.client) {
    const obj = Object.fromEntries(mangaCache.value)
    localStorage.setItem(MANGA_CACHE_KEY, JSON.stringify(obj))
  }
}

function enforceCacheLimit() {
  if (cache.value.size > MAX_CACHE_SIZE) {
    const entries = Array.from(cache.value.entries())
    entries.sort((a, b) => a[1].cachedAt - b[1].cachedAt)

    const toRemove = entries.slice(0, entries.length - MAX_CACHE_SIZE)
    toRemove.forEach(([key]) => cache.value.delete(key))

    saveToStorage()
  }
}

function enforceMangaCacheLimit() {
  if (mangaCache.value.size > MAX_MANGA_CACHE_SIZE) {
    const entries = Array.from(mangaCache.value.entries())
    entries.sort((a, b) => a[1].cachedAt - b[1].cachedAt)

    const toRemove = entries.slice(0, entries.length - MAX_MANGA_CACHE_SIZE)
    toRemove.forEach(([key]) => mangaCache.value.delete(key))

    saveMangaToStorage()
  }
}

export function useChapterCache() {
  initializeCache()

  const getCachedChapter = (chapterId: string): CachedChapter | null => {
    const cached = cache.value.get(chapterId)
    if (!cached) return null

    const now = Date.now()
    if (now - cached.cachedAt > CACHE_EXPIRY) {
      cache.value.delete(chapterId)
      saveToStorage()
      return null
    }

    return cached
  }

  const setCachedChapter = (chapterId: string, data: Omit<CachedChapter, 'cachedAt' | 'imagesLoaded'>) => {
    cache.value.set(chapterId, {
      ...data,
      cachedAt: Date.now(),
      imagesLoaded: false
    })
    enforceCacheLimit()
    saveToStorage()
  }

  const preloadImages = async (images: string[]): Promise<boolean> => {
    const promises = images.map((img) => {
      return new Promise<void>((resolve) => {
        const image = new Image()
        const proxyUrl = `/api/image?url=${encodeURIComponent(img)}`

        image.onload = () => resolve()
        image.onerror = () => resolve()
        image.src = proxyUrl
      })
    })

    try {
      await Promise.all(promises)
      return true
    } catch {
      return false
    }
  }

  const preloadChapter = async (chapterId: string, chapterData: Omit<CachedChapter, 'cachedAt' | 'imagesLoaded'>): Promise<boolean> => {
    const existing = cache.value.get(chapterId)
    if (existing?.imagesLoaded) return true

    try {
      const loaded = await preloadImages(chapterData.image || [])

      if (loaded) {
        cache.value.set(chapterId, {
          ...chapterData,
          cachedAt: Date.now(),
          imagesLoaded: true
        })
        enforceCacheLimit()
        saveToStorage()
        return true
      }

      return false
    } catch {
      return false
    }
  }

  const isChapterCached = (chapterId: string): boolean => {
    const cached = cache.value.get(chapterId)
    if (!cached) return false

    const now = Date.now()
    if (now - cached.cachedAt > CACHE_EXPIRY) {
      cache.value.delete(chapterId)
      saveToStorage()
      return false
    }

    return cached.imagesLoaded
  }

  const getCacheSize = (): number => {
    return cache.value.size
  }

  const clearCache = (): void => {
    cache.value.clear()
    if (import.meta.client) {
      localStorage.removeItem(CACHE_KEY)
    }
  }

  const clearChapterCache = (chapterId: string): void => {
    cache.value.delete(chapterId)
    saveToStorage()
  }

  const getCachedManga = (mangaId: string): CachedManga | null => {
    const cached = mangaCache.value.get(mangaId)
    if (!cached) return null

    const now = Date.now()
    if (now - cached.cachedAt > CACHE_EXPIRY) {
      mangaCache.value.delete(mangaId)
      saveMangaToStorage()
      return null
    }

    return cached
  }

  const setCachedManga = (mangaId: string, data: Omit<CachedManga, 'cachedAt'>): void => {
    mangaCache.value.set(mangaId, {
      ...data,
      cachedAt: Date.now()
    })
    enforceMangaCacheLimit()
    saveMangaToStorage()
  }

  const isMangaCached = (mangaId: string): boolean => {
    const cached = mangaCache.value.get(mangaId)
    if (!cached) return false

    const now = Date.now()
    if (now - cached.cachedAt > CACHE_EXPIRY) {
      mangaCache.value.delete(mangaId)
      saveMangaToStorage()
      return false
    }

    return true
  }

  const getMangaCacheSize = (): number => {
    return mangaCache.value.size
  }

  return {
    getCachedChapter,
    setCachedChapter,
    preloadChapter,
    isChapterCached,
    getCacheSize,
    clearCache,
    clearChapterCache,
    getCachedManga,
    setCachedManga,
    isMangaCached,
    getMangaCacheSize
  }
}
