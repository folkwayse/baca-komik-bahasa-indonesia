<script setup lang="ts">
import type { MangaDetail } from '~/composables/useMangaApi'

const route = useRoute()
const { fetchMangaDetail } = useMangaApi()
const { isBookmarked, toggleBookmark } = useBookmarks()
const { getLastReadChapter } = useHistory()

const manga = ref<MangaDetail | null>(null)
const pending = ref(true)
const error = ref<Error | null>(null)
const activeTab = ref('chapters')
const chapterFilter = ref('')

const tabs = [
  { id: 'chapters', label: 'Chapter', icon: 'i-lucide-list' },
  { id: 'info', label: 'Info', icon: 'i-lucide-info' }
]

const bookmarked = computed(() => manga.value ? isBookmarked(route.params.id as string) : false)

const lastReadChapter = computed(() => {
  return getLastReadChapter(route.params.id as string)
})

const filteredChapters = computed(() => {
  if (!chapterFilter.value.trim() || !manga.value?.chapters) {
    return manga.value?.chapters || []
  }

  const query = chapterFilter.value.toLowerCase()
  return manga.value.chapters.filter((ch: { chapter: string }) =>
    ch.chapter.toLowerCase().includes(query)
  )
})

const noResultsMessage = computed(() => {
  return chapterFilter.value ? `Tidak ada chapter dengan "${chapterFilter.value}"` : ''
})

async function loadManga() {
  pending.value = true
  error.value = null

  try {
    manga.value = await fetchMangaDetail(route.params.id as string)
  } catch (e) {
    error.value = e as Error
  } finally {
    pending.value = false
  }
}

function extractChapterId(url: string): string {
  if (!url) return ''

  const idMatch = url.match(/[?&]id=([^&]+)/)
  if (idMatch?.[1]) return idMatch[1]

  const chapterMatch = url.match(/chapter-[^\/?&]+/)
  if (chapterMatch) return chapterMatch[0]

  const lastSegment = url.split('/').pop()
  return lastSegment?.replace(/[?&].*$/, '') || url
}

function handleBookmark() {
  if (manga.value) {
    toggleBookmark({
      id: route.params.id as string,
      title: manga.value?.title || '',
      cover: manga.value?.cover || '',
      type: manga.value?.type || 'comic',
      url: route.fullPath
    })
  }
}

await loadManga()

useHead(() => ({
  title: manga.value ? `${manga.value.title} - KomikIndo` : 'Detail Manga'
}))
</script>

<template>
  <div>
    <!-- Top Navigation Bar -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-navy-950/90 backdrop-blur-md border-b border-navy-200 dark:border-navy-800">
      <div class="max-w-6xl mx-auto px-4 py-3">
        <div class="flex items-center gap-3">
          <UButton
            variant="ghost"
            icon="i-lucide-arrow-left"
            @click="() => navigateTo('/')"
          />
          <h1 class="font-semibold text-sm truncate text-navy-900 dark:text-white">
            Detail Manga
          </h1>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 max-w-7xl pt-16 pb-6 md:pb-8">
      <!-- Loading State -->
      <div v-if="pending">
        <div class="flex flex-col md:flex-row gap-8">
          <div class="shrink-0">
            <div class="w-48 md:w-64 aspect-[2/3] bg-navy-100 dark:bg-navy-800 rounded-2xl animate-pulse" />
          </div>
          <div class="flex-1 space-y-4">
            <div class="h-10 bg-navy-100 dark:bg-navy-800 rounded w-3/4 animate-pulse" />
            <div class="flex gap-2">
              <div class="h-6 w-20 bg-navy-100 dark:bg-navy-800 rounded animate-pulse" />
              <div class="h-6 w-24 bg-navy-100 dark:bg-navy-800 rounded animate-pulse" />
            </div>
            <div class="h-32 bg-navy-100 dark:bg-navy-800 rounded animate-pulse" />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <EmptyState
        v-else-if="error"
        icon="i-lucide-alert-circle"
        title="Gagal memuat data"
        description="Terjadi kesalahan saat memuat detail manga."
      >
        <template #action>
          <UButton
            variant="solid"
            @click="loadManga"
          >
            Coba Lagi
          </UButton>
        </template>
      </EmptyState>

      <template v-else-if="manga">
        <!-- Hero Banner -->
        <div class="relative -mx-4 md:-mx-8 lg:-mx-12 mb-8 h-[200px] md:h-[300px] overflow-hidden rounded-none md:rounded-2xl">
          <div class="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900">
            <div class="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-white dark:from-navy-950 via-transparent to-transparent" />
        </div>

        <!-- Content -->
        <div class="relative -mt-32 md:-mt-40 mb-8">
          <div class="flex flex-col md:flex-row gap-6 md:gap-8">
            <!-- Cover Image -->
            <div class="shrink-0 mx-auto md:mx-0">
              <div class="relative w-40 md:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white dark:ring-navy-900">
                <NuxtImg
                  :src="manga.cover"
                  :alt="manga.title"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 pt-4 md:pt-36">
              <div class="text-center md:text-left">
                <h1 class="text-2xl md:text-4xl font-bold text-navy-900 dark:text-white mb-3">
                  {{ manga.title }}
                </h1>

                <!-- Badges -->
                <div class="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <AppBadge
                    color="navy"
                    variant="solid"
                  >
                    {{ manga.type || 'Manga' }}
                  </AppBadge>
                  <AppBadge
                    v-if="manga.status"
                    color="gray"
                    variant="subtle"
                  >
                    {{ manga.status }}
                  </AppBadge>
                  <AppBadge
                    v-if="manga.score"
                    color="amber"
                    variant="solid"
                  >
                    <UIcon
                      icon="i-lucide-star"
                      class="w-3 h-3 mr-1"
                    />
                    {{ manga.score }}
                  </AppBadge>
                  <AppBadge
                    v-if="manga.score"
                    color="amber"
                    variant="solid"
                  >
                    <UIcon
                      icon="i-lucide-star"
                      class="w-3 h-3 mr-1"
                    />
                    {{ manga.score }}
                  </AppBadge>
                  <AppBadge
                    v-if="manga.chapters?.length"
                    color="green"
                    variant="subtle"
                  >
                    {{ manga.chapters.length }} Chapters
                  </AppBadge>
                </div>

                <!-- Author & Genres -->
                <div class="space-y-2 mb-6">
                  <p
                    v-if="manga.author"
                    class="text-sm text-navy-600 dark:text-navy-300"
                  >
                    <span class="font-medium">Author:</span>
                    {{ manga.author }}
                  </p>

                  <div
                    v-if="manga.genres?.length"
                    class="flex flex-wrap justify-center md:justify-start gap-1.5"
                  >
                    <NuxtLink
                      v-for="g in manga.genres"
                      :key="g"
                      :to="`/search?genre=${g.toLowerCase()}`"
                      class="px-2.5 py-1 text-xs bg-navy-100 dark:bg-navy-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-navy-700 dark:text-navy-300 hover:text-amber-700 dark:hover:text-amber-400 rounded-full transition-colors"
                    >
                      {{ g }}
                    </NuxtLink>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap justify-center md:justify-start gap-3">
                  <a
                    v-if="lastReadChapter"
                    :href="`/chapter/${lastReadChapter.chapterId}?mangaId=${route.params.id as string}`"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-navy-950 rounded-lg font-medium shadow-lg shadow-amber-500/25 transition-colors"
                  >
                    <UIcon
                      icon="i-lucide-book-open"
                      class="w-5 h-5"
                    />
                    Lanjutkan Membaca
                  </a>
                  <a
                    v-else-if="manga.chapters?.length"
                    :href="`/chapter/${encodeURIComponent(extractChapterId(manga.chapters?.at(-1)?.slug || ''))}?mangaId=${route.params.id as string}`"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-navy-950 rounded-lg font-medium shadow-lg shadow-amber-500/25 transition-colors"
                  >
                    <UIcon
                      icon="i-lucide-book-open"
                      class="w-5 h-5"
                    />
                    Baca Chapter Terbaru
                  </a>

                  <UButton
                    variant="outline"
                    size="lg"
                    :icon="bookmarked ? 'i-lucide-bookmark-check' : 'i-lucide-bookmark'"
                    @click="handleBookmark"
                  >
                    {{ bookmarked ? 'Tersimpan' : 'Simpan' }}
                  </UButton>

                  <UButton
                    variant="ghost"
                    size="lg"
                    icon="i-lucide-share-2"
                  >
                    Bagikan
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Synopsis -->
        <div
          v-if="manga.synopsis"
          class="mb-8 bg-navy-50 dark:bg-navy-900/50 rounded-2xl p-6"
        >
          <h2 class="text-lg font-semibold text-navy-900 dark:text-white mb-3 flex items-center gap-2">
            <UIcon
              icon="i-lucide-align-left"
              class="w-5 h-5 text-amber-500"
            />
            Sinopsis
          </h2>
          <p class="text-navy-600 dark:text-navy-300 leading-relaxed whitespace-pre-line">
            {{ manga.synopsis }}
          </p>
        </div>

        <!-- Tabs Navigation -->
        <div class="border-b border-navy-200 dark:border-navy-800 mb-6">
          <div class="flex gap-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors"
              :class="activeTab === tab.id ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-navy-500 dark:text-navy-400 hover:text-navy-700 dark:hover:text-navy-200'"
              @click="activeTab = tab.id"
            >
              <UIcon
                :icon="tab.icon"
                class="w-4 h-4"
              />
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Tab Content: Chapters -->
        <div v-if="activeTab === 'chapters'">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-navy-900 dark:text-white">
              Chapters
            </h2>
            <UInput
              v-model="chapterFilter"
              type="search"
              placeholder="Filter chapter..."
              icon="i-lucide-search"
              class="w-40"
            />
          </div>

          <div
            v-if="filteredChapters.length"
            class="grid gap-2"
          >
            <NuxtLink
              v-for="chapter in filteredChapters"
              :key="chapter.slug"
              :to="`/chapter/${encodeURIComponent(extractChapterId(chapter.slug))}?mangaId=${route.params.id as string}`"
              class="flex items-center justify-between p-4 bg-white dark:bg-navy-900 rounded-xl hover:bg-navy-50 dark:hover:bg-navy-800/50 border border-navy-100 dark:border-navy-800 transition-all group"
            >
              <span class="font-medium text-navy-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Chapter {{ chapter.chapter }}
              </span>

              <div class="flex items-center gap-2">
                <UIcon
                  icon="i-lucide-chevron-right"
                  class="w-5 h-5 text-navy-300 group-hover:text-amber-500 transition-colors"
                />
              </div>
            </NuxtLink>
          </div>

          <EmptyState
            v-else-if="chapterFilter && filteredChapters.length === 0"
            icon="i-lucide-search-x"
            title="Chapter tidak ditemukan"
            :description="noResultsMessage"
          />

          <EmptyState
            v-else
            icon="i-lucide-list-x"
            title="Belum ada chapter"
            description="Manga ini belum memiliki chapter."
          />
        </div>

        <!-- Tab Content: Info -->
        <div
          v-else-if="activeTab === 'info'"
          class="grid md:grid-cols-2 gap-6"
        >
          <div class="space-y-4">
            <h3 class="font-semibold text-navy-900 dark:text-white">
              Detail
            </h3>
            <dl class="space-y-3">
              <div class="flex justify-between py-2 border-b border-navy-100 dark:border-navy-800">
                <dt class="text-navy-500 dark:text-navy-400">
                  Tipe
                </dt>
                <dd class="font-medium text-navy-900 dark:text-white">
                  {{ manga.type || 'Manga' }}
                </dd>
              </div>
              <div class="flex justify-between py-2 border-b border-navy-100 dark:border-navy-800">
                <dt class="text-navy-500 dark:text-navy-400">
                  Status
                </dt>
                <dd class="font-medium text-navy-900 dark:text-white">
                  {{ manga.status || 'Unknown' }}
                </dd>
              </div>
              <div
                v-if="manga.score"
                class="flex justify-between py-2 border-b border-navy-100 dark:border-navy-800"
              >
                <dt class="text-navy-500 dark:text-navy-400">
                  Rating
                </dt>
                <dd class="font-medium text-amber-600">
                  <UIcon
                    icon="i-lucide-star"
                    class="w-4 h-4 inline mr-1"
                  />
                  {{ manga.score }}
                </dd>
              </div>
              <div
                v-if="manga.chapters?.length"
                class="flex justify-between py-2 border-b border-navy-100 dark:border-navy-800"
              >
                <dt class="text-navy-500 dark:text-navy-400">
                  Total Chapter
                </dt>
                <dd class="font-medium text-navy-900 dark:text-white">
                  {{ manga.chapters.length }}
                </dd>
              </div>
            </dl>
          </div>

          <div class="space-y-4">
            <h3 class="font-semibold text-navy-900 dark:text-white">
              Author & Artist
            </h3>
            <div
              v-if="manga.author"
              class="flex flex-wrap gap-2"
            >
              <AppBadge
                color="gray"
                variant="subtle"
              >
                {{ manga.author }}
              </AppBadge>
            </div>

            <h3 class="font-semibold text-navy-900 dark:text-white pt-4">
              Genre
            </h3>
            <div
              v-if="manga.genres?.length"
              class="flex flex-wrap gap-2"
            >
              <NuxtLink
                v-for="g in manga.genres"
                :key="g"
                :to="`/search?genre=${g.toLowerCase()}`"
              >
                <AppBadge
                  color="navy"
                  variant="outline"
                >
                  {{ g }}
                </AppBadge>
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
