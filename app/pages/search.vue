<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDebounceFn } from '@vueuse/core'
import { GENRES } from '~/constants/genres'

interface FilterOption {
  value: number | string
  label: string
  slug?: string
}

interface FilterConfig {
  name: string
  key: string
  type?: 'checkbox' | 'radio'
  options: FilterOption[]
}

const searchStore = useSearchStore()
const { searchQuery, mangaList, pending, allLoaded, error, isSearchMode, filterState, showFilters, queryParam } = storeToRefs(searchStore)
const { fetchManga, handleSearch, clearSearch, clearFilters } = searchStore

const loadMoreSentinel = ref<HTMLElement | null>(null)

const debouncedFetchManga = useDebounceFn((reset = true) => {
  fetchManga(reset)
}, 500)

function updateRadioFilter(key: 'status' | 'type' | 'order', value: string) {
  filterState.value[key] = value
  debouncedFetchManga()
}

function toggleGenre(genreId: number) {
  const index = filterState.value.genre.indexOf(genreId)
  if (index > -1) {
    filterState.value.genre.splice(index, 1)
  } else {
    filterState.value.genre.push(genreId)
  }
  debouncedFetchManga()
}

const filterConfig: FilterConfig[] = [
  {
    name: 'Status',
    key: 'status',
    type: 'radio',
    options: [
      { value: '', label: 'All' }, { value: 'Ongoing', label: 'Ongoing' }, { value: 'Completed', label: 'Completed' }
    ]
  },
  {
    name: 'Jenis Komik',
    key: 'type',
    type: 'radio',
    options: [
      { value: '', label: 'All' }, { value: 'Manga', label: 'Manga' }, { value: 'Manhwa', label: 'Manhwa' }, { value: 'Manhua', label: 'Manhua' }
    ]
  },
  {
    name: 'Format',
    key: 'bw',
    type: 'radio',
    options: [
      { value: '', label: 'All' }, { value: 'bw', label: 'Hitam Putih' }, { value: 'colorized', label: 'Berwarna' }
    ]
  },
  {
    name: 'Order by',
    key: 'order',
    type: 'radio',
    options: [
      { value: '', label: 'Default' }, { value: 'title', label: 'A-Z' },
      { value: 'titlereverse', label: 'Z-A' }, { value: 'update', label: 'Latest Update' },
      { value: 'latest', label: 'Latest Added' }, { value: 'popular', label: 'Popular' }
    ]
  }
]

let observer: IntersectionObserver | null = null

function setupObserver() {
  if (observer) {
    observer.disconnect()
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !allLoaded.value && !pending.value && mangaList.value.length > 0) {
        fetchManga(false)
      }
    })
  }, { rootMargin: '100px' })

  nextTick(() => {
    if (loadMoreSentinel.value) {
      observer?.observe(loadMoreSentinel.value)
    }
  })
}

onMounted(() => {
  setupObserver()
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

watch(() => mangaList.value.length, () => {
  nextTick(() => {
    if (loadMoreSentinel.value && observer) {
      observer.observe(loadMoreSentinel.value)
    }
  })
})

useHead({
  title: computed(() => queryParam.value ? `${queryParam.value} - Search` : 'Search - KomikIndo')
})
</script>

<template>
  <div class="min-h-screen bg-navy-950">
    <!-- Header -->
    <div class="sticky top-0 z-20 bg-navy-950/95 backdrop-blur-sm border-b border-navy-800">
      <UContainer class="py-4">
        <div class="flex items-center gap-4">
          <UButton
            variant="ghost"
            icon="i-lucide-arrow-left"
            class="text-white"
            @click="() => navigateTo('/')"
          />
          <div class="flex-1 relative">
            <UIcon
              icon="i-lucide-search"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search manga..."
              class="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
              @keyup.enter="handleSearch"
            >
            <UButton
              v-if="searchQuery"
              icon="i-lucide-x"
              variant="ghost"
              class="absolute right-2 top-1/2 -translate-y-1/2"
              @click="clearSearch"
            />
          </div>
          <UButton
            v-if="!isSearchMode"
            variant="solid"
            :class="showFilters ? 'bg-amber-500 hover:bg-amber-600' : 'bg-navy-700 hover:bg-navy-800'"
            icon="i-lucide-filter"
            class="lg:hidden"
            @click="showFilters = !showFilters"
          >
            <span class="hidden sm:inline">Filter</span>
            <UBadge
              v-if="filterState.status || filterState.type || filterState.order || filterState.genre.length"
              color="amber"
              variant="solid"
              class="ml-2"
            >
              {{ ((filterState.status ? 1 : 0) + (filterState.type ? 1 : 0) + (filterState.order ? 1 : 0) + filterState.genre.length) }}
            </UBadge>
          </UButton>
        </div>
      </UContainer>
    </div>

    <div
      v-if="!isSearchMode"
      class="hidden lg:block bg-navy-900/50 border-b border-navy-800"
    >
      <UContainer class="py-3">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-2">
            <span class="text-xs text-navy-400 font-medium">Status:</span>
            <select
              v-model="filterState.status"
              class="bg-navy-900 border border-navy-700 text-navy-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500 w-24 cursor-pointer"
              @change="debouncedFetchManga()"
            >
              <option
                v-for="opt in filterConfig.find(f => f.key === 'status')?.options || []"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-navy-400 font-medium">Jenis:</span>
            <select
              v-model="filterState.type"
              class="bg-navy-900 border border-navy-700 text-navy-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500 w-24 cursor-pointer"
              @change="debouncedFetchManga()"
            >
              <option
                v-for="opt in filterConfig.find(f => f.key === 'type')?.options || []"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-navy-400 font-medium">Order:</span>
            <select
              v-model="filterState.order"
              class="bg-navy-900 border border-navy-700 text-navy-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500 w-32 cursor-pointer"
              @change="debouncedFetchManga()"
            >
              <option
                v-for="opt in filterConfig.find(f => f.key === 'order')?.options || []"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-6">
      <div class="flex gap-6">
        <!-- Filter Sidebar (Desktop) -->
        <aside
          v-if="!isSearchMode"
          class="hidden lg:block w-64 shrink-0"
        >
          <div class="sticky top-24 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div class="flex items-center justify-between">
              <h2 class="font-bold text-white">
                Filters
              </h2>
              <UButton
                v-if="filterState.status || filterState.type || filterState.order || filterState.genre.length"
                size="sm"
                variant="ghost"
                @click="clearFilters"
              >
                Clear All
              </UButton>
            </div>

            <div
              v-for="filter in filterConfig"
              :key="filter.key"
            >
              <h3 class="font-medium text-white mb-2 text-sm">
                {{ filter.name }}
              </h3>
              <div class="space-y-1">
                <label
                  v-for="opt in filter.options"
                  :key="opt.value"
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    :name="filter.key"
                    :value="opt.value"
                    :checked="filterState[filter.key as keyof typeof filterState] === opt.value"
                    class="w-4 h-4 text-amber-500 bg-navy-900 border-navy-700 focus:ring-amber-500"
                    @change="updateRadioFilter(filter.key as 'status' | 'type' | 'order', opt.value as string)"
                  >
                  <span class="text-xs text-navy-300">{{ opt.label }}</span>
                </label>
              </div>
            </div>

            <div>
              <h3 class="font-medium text-white mb-2 text-sm">
                Genre
                <span
                  v-if="filterState.genre.length"
                  class="text-amber-500 ml-1"
                >({{ filterState.genre.length }})</span>
              </h3>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="genre in GENRES"
                  :key="genre.id"
                  type="button"
                  class="px-2 py-0.5 text-xs rounded border transition-colors"
                  :class="filterState.genre.includes(genre.id) ? 'bg-amber-500 border-amber-500 text-navy-950' : 'bg-navy-900 border-navy-700 text-navy-300 hover:border-amber-500'"
                  @click="toggleGenre(genre.id)"
                >
                  {{ genre.name }}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 min-w-0">
          <!-- Results Header -->
          <div class="mb-4">
            <p class="text-navy-400 text-sm">
              {{ isSearchMode ? `Hasil pencarian untuk "${queryParam}"` : 'Semua Komik' }}
              <span v-if="mangaList.length"> · {{ mangaList.length }} item</span>
            </p>
          </div>

          <!-- Loading -->
          <div v-if="pending && mangaList.length === 0">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div
                v-for="i in 8"
                :key="i"
                class="aspect-[3/4] bg-navy-900 rounded-lg animate-pulse"
              />
            </div>
          </div>

          <!-- Error -->
          <EmptyState
            v-else-if="error"
            icon="i-lucide-alert-circle"
            title="Failed to load"
            description="There was an error fetching manga data."
          >
            <template #action>
              <UButton
                variant="solid"
                @click="fetchManga(true)"
              >
                Try Again
              </UButton>
            </template>
          </EmptyState>

          <!-- Results -->
          <template v-else>
            <div v-if="mangaList.length > 0">
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <NuxtLink
                  v-for="item in mangaList"
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
                    <div class="absolute top-2 right-2">
                      <span
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="item.type?.toLowerCase() === 'manga' ? 'bg-amber-500/90 text-navy-950' : 'bg-blue-500/90 text-white'"
                      >
                        {{ item.type || 'Manga' }}
                      </span>
                    </div>
                  </div>
                  <h3 class="font-semibold text-white text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
                    {{ item.title }}
                  </h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs px-2 py-0.5 bg-navy-800 text-navy-300 rounded">
                      Ch. {{ item.last_chapter?.chapter || '?' }}
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-1 mt-2">
                    <span
                      v-for="g in item.genres?.slice(0, 2)"
                      :key="g"
                      class="text-[10px] px-2 py-0.5 bg-navy-900 text-navy-400 rounded"
                    >
                      {{ g }}
                    </span>
                  </div>
                </NuxtLink>
              </div>

              <div
                v-if="!allLoaded && mangaList.length > 0"
                class="flex justify-center mt-8"
              >
                <UIcon
                  icon="i-lucide-loader-2"
                  class="w-6 h-6 text-amber-500 animate-spin"
                />
              </div>

              <div
                v-else-if="mangaList.length > 0"
                class="text-center mt-8 text-navy-500"
              >
                <p>All results loaded</p>
              </div>

              <div
                v-if="!allLoaded"
                ref="loadMoreSentinel"
                class="h-4"
              />
            </div>

            <!-- Empty State -->
            <EmptyState
              v-else-if="!pending"
              icon="i-lucide-search-x"
              title="No results found"
              description="Try adjusting your search terms or filters."
            />
          </template>
        </main>
      </div>
    </UContainer>

    <!-- Mobile Filter Slideover -->
    <USlideover
      v-if="!isSearchMode"
      :open="showFilters"
      position="right"
      @update:open="showFilters = $event"
    >
      <div class="p-4 h-full overflow-y-auto bg-navy-950">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-white">
            Filters
          </h2>
          <UButton
            icon="i-lucide-x"
            variant="ghost"
            @click="showFilters = false"
          />
        </div>

        <UButton
          v-if="filterState.status || filterState.type || filterState.order || filterState.genre.length"
          size="sm"
          variant="ghost"
          class="mb-4"
          @click="clearFilters"
        >
          Clear All
        </UButton>

        <div
          v-for="filter in filterConfig"
          :key="filter.key"
          class="border-b border-navy-800 pb-4 mb-4"
        >
          <h3 class="font-medium text-white mb-3 text-sm">
            {{ filter.name }}
          </h3>

          <div class="space-y-2">
            <label
              v-for="opt in filter.options"
              :key="opt.value"
              class="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                :name="filter.key"
                :value="opt.value"
                :checked="filterState[filter.key as keyof typeof filterState] === opt.value"
                class="w-4 h-4 text-amber-500 bg-navy-900 border-navy-700 focus:ring-amber-500"
                @change="updateRadioFilter(filter.key as 'status' | 'type' | 'order', opt.value as string)"
              >
              <span class="text-sm text-navy-300">{{ opt.label }}</span>
            </label>
          </div>
        </div>

        <div class="border-b border-navy-800 pb-4 mb-4">
          <h3 class="font-medium text-white mb-3 text-sm">
            Genre
            <span
              v-if="filterState.genre.length"
              class="text-amber-500 ml-1"
            >({{ filterState.genre.length }})</span>
          </h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="genre in GENRES"
              :key="genre.id"
              type="button"
              class="px-2 py-1 text-xs rounded border transition-colors"
              :class="filterState.genre.includes(genre.id) ? 'bg-amber-500 border-amber-500 text-navy-950' : 'bg-navy-900 border-navy-700 text-navy-300 hover:border-amber-500'"
              @click="toggleGenre(genre.id)"
            >
              {{ genre.name }}
            </button>
          </div>
        </div>
      </div>
    </USlideover>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(251, 191, 36, 0.5);
  border-radius: 2px;
}
</style>
