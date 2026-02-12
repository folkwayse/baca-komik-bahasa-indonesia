<script setup lang="ts">
import type { MangaListItem } from '~/composables/useMangaApi'

const { fetchLatest, fetchPopular, fetchRecommended } = useMangaApi()
const { groupedHistory } = useHistory()
const { bookmarks } = useBookmarks()

const latestManga = ref<MangaListItem[]>([])
const popularManga = ref<MangaListItem[]>([])
const recommendedManga = ref<MangaListItem[]>([])
const pending = ref(true)
const error = ref<Error | null>(null)

const recentHistory = computed(() => {
  return groupedHistory.value.slice(0, 6)
})

const recentBookmarks = computed(() => {
  return [...bookmarks.value].sort((a, b) => b.addedAt - a.addedAt).slice(0, 6)
})

const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'Baru saja'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}j lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}h lalu`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}mgg lalu`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}bln lalu`
  const years = Math.floor(days / 365)
  return `${years}thn lalu`
}

async function loadData() {
  pending.value = true
  error.value = null

  try {
    const [latest, popular, recommended] = await Promise.all([
      fetchLatest(1).catch(() => []),
      fetchPopular(1).catch(() => []),
      fetchRecommended(1).catch(() => [])
    ])
    latestManga.value = latest
    popularManga.value = popular
    recommendedManga.value = recommended
  } catch (e) {
    error.value = e as Error
  } finally {
    pending.value = false
  }
}

loadData()

useHead({
  title: 'Discover Amazing Manga - KomikIndo'
})
</script>

<template>
  <div class="min-h-screen bg-navy-950">
    <!-- Hero Section -->
    <section class="pt-8 pb-6 px-4 md:px-6">
      <UContainer>
        <div class="max-w-3xl">
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">
            Discover Amazing Manga
          </h1>
          <p class="text-navy-400 text-sm md:text-base">
            Find and read your favorite manga with an immersive reading experience
          </p>
        </div>
      </UContainer>
    </section>

    <!-- Search -->
    <section class="px-4 md:px-6 pb-6">
      <UContainer>
        <a
          href="/search"
          class="max-w-xl w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-navy-950 font-medium rounded-xl transition-colors"
        >
          <UIcon icon="i-lucide-search" />
          Search manga...
        </a>
      </UContainer>
    </section>

    <!-- Lanjutkan Membaca Section -->
    <section
      v-if="recentHistory.length"
      class="px-4 md:px-6 pb-8"
    >
      <UContainer>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <UIcon
              icon="i-lucide-history"
              class="w-5 h-5 text-amber-500"
            />
            Lanjutkan Membaca
          </h2>
          <NuxtLink
            to="/history"
            class="text-amber-400 hover:text-amber-300 text-sm font-medium"
          >
            Lihat Semua
          </NuxtLink>
        </div>
        <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <NuxtLink
            v-for="item in recentHistory"
            :key="`${item.mangaId}-${item.chapterId}`"
            :to="`/chapter/${item.chapterId}?mangaId=${item.mangaId}`"
            class="group"
          >
            <div class="relative aspect-[3/4] rounded-lg overflow-hidden bg-navy-900 mb-2">
              <NuxtImg
                :src="item.cover"
                :alt="item.mangaTitle"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div class="absolute top-2 left-2 flex items-center gap-1 bg-blue-600/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <UIcon
                  icon="i-lucide-clock"
                  class="w-3 h-3 text-white"
                />
                <span class="text-xs font-semibold text-white">{{ formatTimeAgo(item.readAt) }}</span>
              </div>
            </div>
            <h3 class="font-semibold text-white text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
              {{ item.mangaTitle }}
            </h3>
            <p class="text-xs text-navy-400 truncate">
              {{ item.chapterTitle }}
            </p>
          </NuxtLink>
        </div>
      </UContainer>
    </section>

    <!-- Bookmark Favorit Section -->
    <section
      v-if="recentBookmarks.length"
      class="px-4 md:px-6 pb-8"
    >
      <UContainer>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <UIcon
              icon="i-lucide-bookmark"
              class="w-5 h-5 text-amber-500"
            />
            Bookmark Favorit
          </h2>
          <NuxtLink
            to="/bookmarks"
            class="text-amber-400 hover:text-amber-300 text-sm font-medium"
          >
            Lihat Semua
          </NuxtLink>
        </div>
        <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <NuxtLink
            v-for="item in recentBookmarks"
            :key="item.id"
            :to="item.url"
            class="group"
          >
            <div class="relative aspect-[3/4] rounded-lg overflow-hidden bg-navy-900 mb-2">
              <NuxtImg
                :src="item.cover"
                :alt="item.title"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div class="absolute top-2 left-2 flex items-center gap-1 bg-amber-600/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <UIcon
                  icon="i-lucide-bookmark"
                  class="w-3 h-3 text-white"
                />
                <span class="text-xs font-semibold text-white">{{ item.type }}</span>
              </div>
            </div>
            <h3 class="font-semibold text-white text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
              {{ item.title }}
            </h3>
          </NuxtLink>
        </div>
      </UContainer>
    </section>

    <!-- Loading State -->
    <section
      v-if="pending"
      class="px-4 md:px-6 pb-12"
    >
      <UContainer>
        <div class="space-y-12">
          <div
            v-for="section in 3"
            :key="section"
          >
            <div class="h-8 w-48 bg-navy-900 rounded mb-4 animate-pulse" />
            <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div
                v-for="i in 5"
                :key="i"
                class="aspect-[3/4] bg-navy-900 rounded-lg animate-pulse"
              />
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Error State -->
    <section
      v-else-if="error"
      class="px-4 md:px-6 pb-12"
    >
      <UContainer>
        <EmptyState
          icon="i-lucide-alert-circle"
          title="Gagal memuat data"
          description="Terjadi kesalahan saat memuat manga."
        >
          <template #action>
            <UButton
              variant="solid"
              @click="loadData"
            >
              Coba Lagi
            </UButton>
          </template>
        </EmptyState>
      </UContainer>
    </section>

    <!-- Main Content -->
    <template v-else>
      <!-- Rekomendasi Section -->
      <section
        v-if="recommendedManga.length"
        class="px-4 md:px-6 pb-12"
      >
        <UContainer>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-white">
              Rekomendasi untukmu
            </h2>
            <NuxtLink
              to="/search"
              class="text-amber-400 hover:text-amber-300 text-sm font-medium"
            >
              Lihat Semua
            </NuxtLink>
          </div>
          <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <NuxtLink
              v-for="item in recommendedManga"
              :key="item.slug"
              :to="`/manga/${item.slug}`"
              class="group"
            >
              <div class="relative aspect-[3/4] rounded-lg overflow-hidden bg-navy-900 mb-2">
                <NuxtImg
                  :src="item.cover"
                  :alt="item.title"

                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div class="absolute top-2 left-2 flex items-center gap-1 bg-navy-950/80 backdrop-blur-sm px-2 py-1 rounded-full">
                  <UIcon
                    icon="i-lucide-star"
                    class="w-3 h-3 text-amber-500"
                  />
                  <span class="text-xs font-semibold text-white">{{ item.rating || '8.5' }}</span>
                </div>
              </div>
              <h3 class="font-semibold text-white text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
                {{ item.title }}
              </h3>
            </NuxtLink>
          </div>
        </UContainer>
      </section>

      <!-- Terpopuler Section -->
      <section
        v-if="popularManga.length"
        class="px-4 md:px-6 pb-12"
      >
        <UContainer>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-white">
              Terpopuler
            </h2>
            <NuxtLink
              to="/search"
              class="text-amber-400 hover:text-amber-300 text-sm font-medium"
            >
              Lihat Semua
            </NuxtLink>
          </div>
          <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <NuxtLink
              v-for="item in popularManga"
              :key="item.slug"
              :to="`/manga/${item.slug}`"
              class="group"
            >
              <div class="relative aspect-[3/4] rounded-lg overflow-hidden bg-navy-900 mb-2">
                <NuxtImg
                  :src="item.cover"
                  :alt="item.title"

                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div class="absolute top-2 left-2 flex items-center gap-1 bg-navy-950/80 backdrop-blur-sm px-2 py-1 rounded-full">
                  <UIcon
                    icon="i-lucide-star"
                    class="w-3 h-3 text-amber-500"
                  />
                  <span class="text-xs font-semibold text-white">{{ item.rating || '8.5' }}</span>
                </div>
              </div>
              <h3 class="font-semibold text-white text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
                {{ item.title }}
              </h3>
            </NuxtLink>
          </div>
        </UContainer>
      </section>

      <!-- Latest Update Section -->
      <section
        v-if="latestManga.length"
        class="px-4 md:px-6 pb-12"
      >
        <UContainer>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-white">
              Update Terbaru
            </h2>
            <NuxtLink
              to="/search"
              class="text-amber-400 hover:text-amber-300 text-sm font-medium"
            >
              Lihat Semua
            </NuxtLink>
          </div>
          <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <NuxtLink
              v-for="item in latestManga"
              :key="item.slug"
              :to="`/manga/${item.slug}`"
              class="group"
            >
              <div class="relative aspect-[3/4] rounded-lg overflow-hidden bg-navy-900 mb-2">
                <NuxtImg
                  :src="item.cover"
                  :alt="item.title"

                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div class="absolute top-2 left-2 flex items-center gap-1 bg-navy-950/80 backdrop-blur-sm px-2 py-1 rounded-full">
                  <UIcon
                    icon="i-lucide-star"
                    class="w-3 h-3 text-amber-500"
                  />
                  <span class="text-xs font-semibold text-white">{{ item.rating || '8.5' }}</span>
                </div>
              </div>
              <h3 class="font-semibold text-white text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
                {{ item.title }}
              </h3>
            </NuxtLink>
          </div>
        </UContainer>
      </section>
    </template>
  </div>
</template>
