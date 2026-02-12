<script setup lang="ts">
const { bookmarks, removeBookmark } = useBookmarks()

const sortedBookmarks = computed(() => {
  return [...bookmarks.value].sort((a, b) => b.addedAt - a.addedAt)
})

useHead({
  title: 'Bookmark Saya - KomikIndo'
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
            Bookmark
          </h1>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 max-w-7xl pt-16 pb-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
            <UIcon
              icon="i-lucide-bookmark"
              class="w-6 h-6 text-amber-600 dark:text-amber-400"
            />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-navy-900 dark:text-white">
              Bookmark Saya
            </h1>
            <p class="text-navy-500 dark:text-navy-400">
              {{ bookmarks.length }} manga tersimpan
            </p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-if="sortedBookmarks.length > 0">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <div
            v-for="manga in sortedBookmarks"
            :key="manga.id"
            class="relative group"
          >
            <AppCard
              :to="manga.url"
              :title="manga.title"
              :image="manga.cover"
              :badge="manga.type"
              badge-color="navy"
            />

            <!-- Remove Button -->
            <button
              class="absolute top-2 left-2 z-10 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              @click.prevent="removeBookmark(manga.id)"
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
        icon="i-lucide-bookmark-x"
        title="Belum ada bookmark"
        description="Simpan manga favoritmu untuk mengaksesnya dengan cepat."
      >
        <template #action>
          <UButton
            variant="solid"
            to="/"
            class="mt-4"
          >
            Jelajahi Manga
          </UButton>
        </template>
      </EmptyState>
    </div>
  </div>
</template>
