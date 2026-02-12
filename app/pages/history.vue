<script setup lang="ts">
const { groupedHistory, removeMangaHistory, clearHistory } = useHistory()

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

useHead({
  title: 'Riwayat Baca - KomikIndo'
})
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
            History
          </h1>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 max-w-7xl pt-16 pb-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <UIcon
                icon="i-lucide-history"
                class="w-6 h-6 text-blue-600 dark:text-blue-400"
              />
            </div>
            <div>
              <h1 class="text-3xl font-bold text-navy-900 dark:text-white">
                Riwayat Baca
              </h1>
              <p class="text-navy-500 dark:text-navy-400">
                {{ groupedHistory.length }} manga terbaca
              </p>
            </div>
          </div>

          <UButton
            v-if="groupedHistory.length > 0"
            variant="soft"
            icon="i-lucide-trash-2"
            class="bg-red-100 text-red-700 hover:bg-red-200"
            @click="clearHistory"
          >
            Hapus Semua
          </UButton>
        </div>
      </div>

      <!-- Content -->
      <div v-if="groupedHistory.length > 0">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <div
            v-for="item in groupedHistory"
            :key="item.mangaId"
            class="relative group"
          >
            <AppCard
              :to="`/chapter/${item.chapterId}?mangaId=${item.mangaId}`"
              :title="item.mangaTitle"
              :image="item.cover"
              :badge="formatTimeAgo(item.readAt)"
              badge-color="blue"
            />

            <!-- Chapter Info -->
            <div class="mt-2 px-1">
              <p class="text-xs text-navy-600 dark:text-navy-400 truncate">
                {{ item.chapterTitle }}
              </p>
            </div>

            <!-- Remove Button -->
            <button
              class="absolute top-2 left-2 z-10 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              @click.prevent="removeMangaHistory(item.mangaId)"
            >
              <UIcon
                icon="i-lucide-x"
                class="w-4 h-4"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else
        icon="i-lucide-history-x"
        title="Belum ada riwayat baca"
        description="Chapter yang kamu baca akan muncul di sini."
      >
        <template #action>
          <UButton
            variant="solid"
            to="/"
            class="mt-4"
          >
            Mulai Baca Manga
          </UButton>
        </template>
      </EmptyState>
    </div>
  </div>
</template>
