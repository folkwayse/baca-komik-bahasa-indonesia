<script setup lang="ts">
import type { ChapterDetail } from '~/composables/useMangaApi'
import { useSwipe } from '@vueuse/core'

const route = useRoute()
const { fetchChapter, fetchMangaDetail } = useMangaApi()
const { addToHistory } = useHistory()
const { getCachedChapter, setCachedChapter, preloadChapter, isChapterCached, getCacheSize, clearCache, getCachedManga, setCachedManga } = useChapterCache()
const { isBookmarked, toggleBookmark } = useBookmarks()

const chapter = ref<ChapterDetail | null>(null)
const manga = ref<{ title: string, id: string, cover: string } | null>(null)
const chapterList = ref<Array<{ id: string, chapter: string }>>([])
const currentChapterId = ref(route.params.id as string)

const pending = ref(true)
const error = ref<Error | null>(null)
const showChapterList = ref(false)
const showSettings = ref(false)
const isFullscreen = ref(false)
const hideNav = ref(false)
const isFromCache = ref(false)
const preloadingChapter = ref<{ id: string, label: string } | null>(null)
let lastScrollY = 0
let hasTriggeredPreload = false

const brightness = ref(100)
const fitMode = ref<'width' | 'height' | 'original'>('width')
const readingDirection = ref<'rtl' | 'ltr'>('rtl')

const swipeContainer = ref<HTMLElement | null>(null)
const { direction, isSwiping } = useSwipe(swipeContainer, {
  threshold: 100,
  passive: true
})

watchEffect(() => {
  if (isSwiping.value) return
  if (direction.value === 'left') nextChapter()
  if (direction.value === 'right') prevChapter()
})

const currentChapterIndex = computed(() => {
  return chapterList.value.findIndex(c => c.id === currentChapterId.value)
})

const currentChapterNumber = computed(() => {
  const current = chapterList.value[currentChapterIndex.value]
  return current?.chapter || ''
})

const totalChapters = computed(() => chapterList.value.length)

const displayIndex = computed(() => {
  if (totalChapters.value === 0 || currentChapterIndex.value === -1) return 0
  return currentChapterIndex.value + 1
})

const progress = computed(() => {
  if (totalChapters.value === 0) return 0
  return (currentChapterIndex.value + 1) / totalChapters.value * 100
})

const mangaTitle = computed(() => manga.value?.title || 'Manga')

function extractChapterId(url: string): string {
  if (!url) return ''
  const idMatch = url.match(/[?&]id=([^&]+)/)
  if (idMatch?.[1]) return idMatch[1]
  const chapterMatch = url.match(/chapter-[^\/?&]+/)
  if (chapterMatch) return chapterMatch[0]
  const lastSegment = url.split('/').pop()
  return lastSegment?.replace(/[?&].*$/, '') || url
}

function parseChapterNumber(chapterStr: string): number {
  const match = chapterStr.match(/(\d+(?:\.\d+)?)/)
  if (!match || !match[1]) return 0
  const num = parseFloat(match[1])
  return isNaN(num) ? 0 : num
}

function sortChapterList(chapterList: Array<{ id: string, chapter: string }>) {
  return [...chapterList].sort((a, b) => {
    const numA = parseChapterNumber(a.chapter)
    const numB = parseChapterNumber(b.chapter)
    if (numA !== numB) return numA - numB
    return a.chapter.localeCompare(b.chapter)
  })
}

async function loadMangaDetail(mangaId: string, chapterId: string) {
  const detail = await fetchMangaDetail(mangaId)
  const chapterListData = detail.chapters
    ?.map((c: { slug: string, chapter: string }) => ({
      id: extractChapterId(c.slug),
      chapter: c.chapter
    }))
    || []

  manga.value = {
    title: detail.title,
    id: mangaId,
    cover: detail.cover
  }

  chapterList.value = sortChapterList(chapterListData)

  console.log('[DEBUG] loadMangaDetail - chapterListData (first 3):', chapterList.value.slice(0, 3))
  console.log('[DEBUG] loadMangaDetail - chapterListData (last 3):', chapterList.value.slice(-3))
  console.log('[DEBUG] loadMangaDetail - currentChapterId:', chapterId)
  console.log('[DEBUG] loadMangaDetail - currentChapterIndex:', chapterList.value.findIndex(c => c.id === chapterId))

  setCachedManga(mangaId, {
    mangaId,
    title: detail.title,
    cover: detail.cover,
    chapterList: chapterListData
  })

  return chapterList.value
}

async function loadChapter() {
  const chapterId = route.params.id as string
  const mangaId = route.query.mangaId as string
  const cached = getCachedChapter(chapterId)

  if (cached) {
    isFromCache.value = true
    chapter.value = {
      title: cached.title,
      chapter: cached.chapter,
      image: cached.image,
      thumb: cached.thumb,
      link: cached.link,
      image2: cached.image2
    }
    currentChapterId.value = chapterId
    pending.value = false

    if (mangaId && !manga.value) {
      const cachedManga = getCachedManga(mangaId)
      if (cachedManga) {
        manga.value = {
          title: cachedManga.title,
          id: mangaId,
          cover: cachedManga.cover
        }
        chapterList.value = sortChapterList(cachedManga.chapterList)

        console.log('[DEBUG] loadChapter (cached) - chapterList.value (first 3):', chapterList.value.slice(0, 3))
        console.log('[DEBUG] loadChapter (cached) - chapterList.value (last 3):', chapterList.value.slice(-3))
        console.log('[DEBUG] loadChapter (cached) - currentChapterId:', chapterId)
        console.log('[DEBUG] loadChapter (cached) - currentChapterIndex:', chapterList.value.findIndex(c => c.id === chapterId))

        if (chapterList.value.findIndex(c => c.id === chapterId) === -1) {
          await loadMangaDetail(mangaId, chapterId)
        }
      } else {
        await loadMangaDetail(mangaId, chapterId)
      }
    }

    if (manga.value) {
      addToHistory({
        mangaId: manga.value.id,
        chapterId: currentChapterId.value,
        mangaTitle: manga.value.title,
        chapterTitle: chapter.value.title,
        cover: manga.value.cover,
        progress: 0
      })
    }

    hasTriggeredPreload = false
    return
  }

  pending.value = true
  error.value = null
  isFromCache.value = false

  try {
    chapter.value = await fetchChapter(chapterId, mangaId)
    currentChapterId.value = chapterId

    setCachedChapter(chapterId, {
      ...chapter.value,
      chapterId
    })

    if (mangaId) {
      const cachedManga = getCachedManga(mangaId)
      if (cachedManga) {
        manga.value = {
          title: cachedManga.title,
          id: mangaId,
          cover: cachedManga.cover
        }
        chapterList.value = sortChapterList(cachedManga.chapterList)

        console.log('[DEBUG] fetch path (cached) - chapterList.value (first 3):', chapterList.value.slice(0, 3))
        console.log('[DEBUG] fetch path (cached) - chapterList.value (last 3):', chapterList.value.slice(-3))
        console.log('[DEBUG] fetch path (cached) - currentChapterId:', chapterId)
        console.log('[DEBUG] fetch path (cached) - currentChapterIndex:', chapterList.value.findIndex(c => c.id === chapterId))

        if (chapterList.value.findIndex(c => c.id === chapterId) === -1) {
          await loadMangaDetail(mangaId, chapterId)
        }
      } else {
        await loadMangaDetail(mangaId, chapterId)
      }
    }

    if (chapter.value && manga.value) {
      addToHistory({
        mangaId: manga.value.id,
        chapterId: currentChapterId.value,
        mangaTitle: manga.value.title,
        chapterTitle: chapter.value.title,
        cover: manga.value.cover,
        progress: 0
      })
    }
  } catch (e) {
    error.value = e as Error
  } finally {
    pending.value = false
  }
}

function prevChapter() {
  const idx = currentChapterIndex.value
  if (idx > 0 && chapterList.value.length > 0) {
    const prevId = chapterList.value[idx - 1]?.id
    if (prevId) {
      navigateTo(`/chapter/${prevId}?mangaId=${route.query.mangaId}`)
    }
  }
}

function nextChapter() {
  const idx = currentChapterIndex.value
  if (idx >= 0 && idx < chapterList.value.length - 1 && chapterList.value.length > 0) {
    const nextId = chapterList.value[idx + 1]?.id
    if (nextId) {
      navigateTo(`/chapter/${nextId}?mangaId=${route.query.mangaId}`)
    }
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      prevChapter()
      break
    case 'ArrowRight':
      e.preventDefault()
      nextChapter()
      break
    case 'c':
    case 'C':
      e.preventDefault()
      showChapterList.value = true
      break
    case 's':
    case 'S':
      e.preventDefault()
      showSettings.value = true
      break
    case 'h':
    case 'H':
      e.preventDefault()
      navigateTo('/')
      break
    case '/':
      e.preventDefault()
      navigateTo('/')
      break
  }
}

async function handleScroll() {
  const currentScrollY = window.scrollY
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollPercent = scrollHeight > 0 ? currentScrollY / scrollHeight : 0

  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    hideNav.value = true
  } else if (currentScrollY < lastScrollY) {
    hideNav.value = false
  }
  lastScrollY = currentScrollY

  if (!hasTriggeredPreload && scrollPercent >= 0.6 && chapterList.value.length > 0) {
    hasTriggeredPreload = true

    const currentIndex = currentChapterIndex.value
    const nextIndex = currentIndex + 1
    const prevIndex = currentIndex - 1

    if (nextIndex < chapterList.value.length) {
      const nextChapterId = chapterList.value[nextIndex]?.id
      if (!nextChapterId) return

      const isCached = isChapterCached(nextChapterId)

      if (!isCached) {
        preloadingChapter.value = { id: nextChapterId, label: 'selanjutnya' }

        try {
          const nextChapterData = await fetchChapter(nextChapterId, route.query.mangaId as string)
          await preloadChapter(nextChapterId, {
            ...nextChapterData,
            chapterId: nextChapterId
          })
        } catch {
        } finally {
          preloadingChapter.value = null
        }
      }
    }

    if (prevIndex >= 0) {
      const prevChapterId = chapterList.value[prevIndex]?.id
      if (!prevChapterId) return

      const isCached = isChapterCached(prevChapterId)

      if (!isCached) {
        preloadingChapter.value = { id: prevChapterId, label: 'sebelumnya' }

        try {
          const prevChapterData = await fetchChapter(prevChapterId, route.query.mangaId as string)
          await preloadChapter(prevChapterId, {
            ...prevChapterData,
            chapterId: prevChapterId
          })
        } catch {
        } finally {
          preloadingChapter.value = null
        }
      }
    }
  }
}

onMounted(() => {
  lastScrollY = window.scrollY
  hasTriggeredPreload = false
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})

const imageFitClass = computed(() => {
  switch (fitMode.value) {
    case 'width': return 'w-full h-auto'
    case 'height': return 'h-screen w-auto'
    case 'original': return 'w-auto h-auto max-w-none'
    default: return 'w-full h-auto'
  }
})

await loadChapter()

watch(() => route.params.id, (newId) => {
  if (newId) {
    currentChapterId.value = newId as string
    loadChapter()
  }
})

useHead(() => ({
  title: chapter.value ? `${chapter.value.title} - ${mangaTitle.value || 'KomikIndo'}` : 'Baca Chapter'
}))
</script>

<template>
  <div class="min-h-screen bg-navy-950">
    <div
      v-if="pending"
      class="fixed inset-0 flex items-center justify-center bg-navy-950"
    >
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-navy-700 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
        <p class="text-navy-400">
          Memuat chapter...
        </p>
      </div>
    </div>

    <div
      v-else-if="error"
      class="fixed inset-0 flex items-center justify-center bg-navy-950"
    >
      <div class="text-center px-4">
        <Icon
          name="i-lucide-alert-circle"
          class="w-16 h-16 text-red-500 mx-auto mb-4"
        />
        <p class="text-white text-lg mb-4">
          Gagal memuat chapter
        </p>
        <button
          class="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-navy-950 transition-colors"
          @click="loadChapter"
        >
          Coba Lagi
        </button>
      </div>
    </div>

    <template v-else-if="chapter">
      <div
        class="fixed top-0 left-0 right-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-navy-800/50 transition-transform duration-300"
        :class="hideNav ? '-translate-y-full' : 'translate-y-0'"
      >
        <div class="max-w-6xl mx-auto px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <button
                class="px-3 py-2 rounded-lg hover:bg-navy-800 transition-colors text-white"
                @click="() => navigateTo(route.query.mangaId ? `/manga/${route.query.mangaId}` : '/')"
              >
                <Icon
                  name="i-lucide-arrow-left"
                  class="w-5 h-5"
                />
              </button>

              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <h1 class="text-white font-semibold text-sm truncate max-w-[150px] md:max-w-md">
                    {{ mangaTitle }}
                  </h1>
                </div>
                <p class="text-navy-400 text-xs">
                  Chapter {{ currentChapterNumber }} · {{ displayIndex }}/{{ totalChapters }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div class="hidden md:flex items-center gap-2 text-xs text-navy-400">
                <span>{{ displayIndex }}</span>
                <div class="w-20 h-1 bg-navy-800 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-amber-500 transition-all"
                    :style="{ width: `${progress}%` }"
                  />
                </div>
                <span>{{ totalChapters }}</span>
              </div>

              <div class="w-px h-6 bg-navy-800 hidden md:block" />

              <button
                class="px-3 py-2 rounded-lg hover:bg-navy-800 transition-colors text-white"
                @click="showSettings = true"
              >
                <Icon
                  name="i-lucide-settings"
                  class="w-5 h-5"
                />
              </button>

              <button
                class="px-3 py-2 rounded-lg hover:bg-navy-800 transition-colors text-white"
                @click="showChapterList = true"
              >
                <Icon
                  name="i-lucide-menu"
                  class="w-5 h-5"
                />
              </button>

              <button
                class="px-3 py-2 rounded-lg hover:bg-navy-800 transition-colors text-white hidden sm:flex"
                @click="toggleFullscreen"
              >
                <Icon
                  :name="isFullscreen ? 'i-lucide-minimize' : 'i-lucide-maximize'"
                  class="w-5 h-5"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref="swipeContainer"
        class="pt-16 pb-32"
        :style="{ filter: `brightness(${brightness}%)` }"
      >
        <div class="max-w-4xl mx-auto">
          <img
            v-for="(img, index) in chapter.image"
            :key="index"
            :src="`/api/image?url=${encodeURIComponent(img)}`"
            :alt="`Page ${index + 1}`"
            :loading="index === 0 ? 'eager' : 'lazy'"
            width="800"
            height="auto"
            :class="imageFitClass"
            class="block m-0"
          >
        </div>
      </div>

      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="preloadingChapter"
          class="fixed bottom-0 left-0 right-0 z-[60] h-[5px] bg-navy-900"
        >
          <div class="h-full w-full bg-gradient-to-r from-navy-600 via-navy-500 to-navy-600 animate-pulse" />
        </div>
      </Transition>

      <div
        class="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300"
        :class="hideNav ? 'translate-y-full' : 'translate-y-0'"
      >
        <div class="max-w-xl mx-auto px-4 py-3">
          <div class="glass rounded-xl bg-navy-900/80 backdrop-blur-xl border border-navy-800/50 p-2">
            <div class="flex items-center justify-between gap-2">
              <button
                class="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-navy-800/50 hover:bg-navy-700/50 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                :disabled="currentChapterIndex === 0"
                @click="prevChapter"
              >
                <Icon
                  name="i-lucide-chevron-left"
                  class="w-4 h-4"
                />
              </button>

              <div class="flex items-center gap-2 px-3">
                <span class="text-white text-sm font-medium">
                  {{ displayIndex }}
                </span>
                <span class="text-navy-500 text-xs">
                  /
                </span>
                <span class="text-navy-400 text-sm">
                  {{ totalChapters }}
                </span>
              </div>

              <button
                class="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-navy-700/50 hover:bg-navy-600/50 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                :disabled="currentChapterIndex >= totalChapters - 1"
                @click="nextChapter"
              >
                <Icon
                  name="i-lucide-chevron-right"
                  class="w-4 h-4"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="showChapterList"
        class="fixed inset-0 z-50"
      >
        <div
          class="absolute inset-0 bg-black/50"
          @click="showChapterList = false"
        />
        <div class="absolute left-0 top-0 bottom-0 w-80 bg-navy-900 transition-transform duration-300">
          <div class="p-4 border-b border-navy-800 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-white">
              Daftar Chapter
            </h2>
            <button
              class="px-3 py-2 rounded-lg hover:bg-navy-800 transition-colors text-white"
              @click="showChapterList = false"
            >
              <Icon
                name="i-lucide-x"
                class="w-5 h-5"
              />
            </button>
          </div>

          <div class="overflow-y-auto h-[calc(100%-70px)] p-4 space-y-2">
            <NuxtLink
              v-for="ch in chapterList"
              :key="ch.id"
              :to="`/chapter/${ch.id}?mangaId=${route.query.mangaId}`"
              class="flex items-center justify-between p-3 rounded-xl transition-colors"
              :class="ch.id === currentChapterId ? 'bg-amber-500/20 border border-amber-500/50' : 'bg-navy-800/50 hover:bg-navy-800 border border-transparent'"
              @click="showChapterList = false"
            >
              <span
                class="font-medium"
                :class="ch.id === currentChapterId ? 'text-amber-400' : 'text-white'"
              >
                Chapter {{ ch.chapter }}
              </span>
              <Icon
                v-if="ch.id === currentChapterId"
                name="i-lucide-book-open"
                class="w-4 h-4 text-amber-400"
              />
            </NuxtLink>
          </div>
        </div>
      </div>

      <div
        v-if="showSettings"
        class="fixed inset-0 z-50"
      >
        <div
          class="absolute inset-0 bg-black/50"
          @click="showSettings = false"
        />
        <div class="absolute right-0 top-0 bottom-0 w-80 bg-navy-900 transition-transform duration-300">
          <div class="p-4 border-b border-navy-800 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-white">
              Pengaturan
            </h2>
            <button
              class="px-3 py-2 rounded-lg hover:bg-navy-800 transition-colors text-white"
              @click="showSettings = false"
            >
              <Icon
                name="i-lucide-x"
                class="w-5 h-5"
              />
            </button>
          </div>

          <div class="p-4 space-y-6">
            <div class="flex gap-2">
              <button
                class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-white transition-colors"
                @click="navigateTo('/')"
              >
                <Icon
                  name="i-lucide-home"
                  class="w-4 h-4"
                />
                <span class="text-sm">Home</span>
              </button>
              <button
                class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-white transition-colors"
                @click="navigateTo('/search')"
              >
                <Icon
                  name="i-lucide-search"
                  class="w-4 h-4"
                />
                <span class="text-sm">Search</span>
              </button>
            </div>

            <button
              class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors"
              :class="manga && isBookmarked(manga.id) ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400' : 'bg-navy-800 hover:bg-navy-700 text-white'"
              @click="manga && toggleBookmark({ id: manga.id, title: manga.title, cover: manga.cover, type: 'manga', url: `/manga/${manga.id}` })"
            >
              <Icon
                :name="manga && isBookmarked(manga.id) ? 'i-lucide-bookmark-check' : 'i-lucide-bookmark'"
                class="w-4 h-4"
              />
              <span class="text-sm">{{ manga && isBookmarked(manga.id) ? 'Ditandai' : 'Tandai' }}</span>
            </button>

            <div>
              <label class="text-sm font-medium text-navy-300 mb-2 block">
                Kecerahan
              </label>
              <div class="flex items-center gap-3">
                <Icon
                  name="i-lucide-sun"
                  class="w-4 h-4 text-navy-500"
                />
                <input
                  v-model.number="brightness"
                  type="range"
                  min="50"
                  max="150"
                  class="flex-1 h-2 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                >
                <span class="text-sm text-navy-400 w-10">{{ brightness }}%</span>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-navy-300 mb-2 block">
                Mode Tampilan
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="mode in [
                    { value: 'width', label: 'Fit Width', icon: 'i-lucide-move-horizontal' },
                    { value: 'height', label: 'Fit Height', icon: 'i-lucide-move-vertical' },
                    { value: 'original', label: 'Original', icon: 'i-lucide-maximize' }
                  ]"
                  :key="mode.value"
                  class="p-3 rounded-xl border-2 transition-all text-center"
                  :class="fitMode === mode.value ? 'border-amber-500 bg-amber-500/10' : 'border-navy-700 bg-navy-800'"
                  @click="fitMode = mode.value as any"
                >
                  <Icon
                    :name="mode.icon"
                    class="w-5 h-5 mx-auto mb-1"
                    :class="fitMode === mode.value ? 'text-amber-500' : 'text-navy-400'"
                  />
                  <span
                    class="text-xs"
                    :class="fitMode === mode.value ? 'text-amber-400' : 'text-navy-400'"
                  >{{ mode.label }}</span>
                </button>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-navy-300 mb-2 block">
                Arah Baca
              </label>
              <div class="flex gap-2">
                <button
                  class="flex-1 p-3 rounded-xl border-2 transition-all text-center"
                  :class="readingDirection === 'rtl' ? 'border-amber-500 bg-amber-500/10' : 'border-navy-700 bg-navy-800'"
                  @click="readingDirection = 'rtl'"
                >
                  <span
                    class="text-sm"
                    :class="readingDirection === 'rtl' ? 'text-amber-400' : 'text-navy-400'"
                  >Kanji →
                    Kiri</span>
                </button>
                <button
                  class="flex-1 p-3 rounded-xl border-2 transition-all text-center"
                  :class="readingDirection === 'ltr' ? 'border-amber-500 bg-amber-500/10' : 'border-navy-700 bg-navy-800'"
                  @click="readingDirection = 'ltr'"
                >
                  <span
                    class="text-sm"
                    :class="readingDirection === 'ltr' ? 'text-amber-400' : 'text-navy-400'"
                  >Kiri →
                    Kanan</span>
                </button>
              </div>
            </div>

            <div class="pt-4 border-t border-navy-800">
              <h3 class="text-sm font-medium text-navy-300 mb-3">
                Cache Chapter
              </h3>
              <div class="flex items-center justify-between mb-3">
                <span class="text-navy-400 text-sm">
                  {{ getCacheSize() }} chapter tersimpan
                </span>
              </div>
              <button
                class="w-full px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors text-sm"
                @click="clearCache"
              >
                Hapus Semua Cache
              </button>
            </div>

            <div class="pt-4 border-t border-navy-800">
              <h3 class="text-sm font-medium text-navy-300 mb-3">
                Shortcut Keyboard
              </h3>
              <div class="space-y-2 text-sm">
                <div class="flex items-center justify-between text-navy-400">
                  <span>Chapter Sebelumnya</span>
                  <span class="px-2 py-1 bg-navy-800 rounded text-xs">←</span>
                </div>
                <div class="flex items-center justify-between text-navy-400">
                  <span>Chapter Selanjutnya</span>
                  <span class="px-2 py-1 bg-navy-800 rounded text-xs">→</span>
                </div>
                <div class="flex items-center justify-between text-navy-400">
                  <span>Daftar Chapter</span>
                  <span class="px-2 py-1 bg-navy-800 rounded text-xs">C</span>
                </div>
                <div class="flex items-center justify-between text-navy-400">
                  <span>Pengaturan</span>
                  <span class="px-2 py-1 bg-navy-800 rounded text-xs">S</span>
                </div>
                <div class="flex items-center justify-between text-navy-400">
                  <span>Ke Halaman Utama</span>
                  <span class="px-2 py-1 bg-navy-800 rounded text-xs">H</span>
                </div>
                <div class="flex items-center justify-between text-navy-400">
                  <span>Ke Search</span>
                  <span class="px-2 py-1 bg-navy-800 rounded text-xs">/</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
