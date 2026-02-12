import { defineStore } from 'pinia'
import type { MangaListItem } from '~/composables/useMangaApi'

interface FilterState {
  genre: number[]
  status: string
  type: string
  order: string
}

export const useSearchStore = defineStore('search', () => {
  const route = useRoute()
  const router = useRouter()
  const { searchManga, fetchMangaList } = useMangaApi()

  const queryParam = computed(() => route.query.q as string || '')
  const isSearchMode = computed(() => !!queryParam.value)

  const searchQuery = ref('')
  const mangaList = ref<MangaListItem[]>([])
  const page = ref(1)
  const pending = ref(false)
  const allLoaded = ref(false)
  const error = ref<Error | null>(null)
  const showFilters = ref(false)

  const filterState = reactive<FilterState>({
    genre: [],
    status: '',
    type: '',
    order: ''
  })

  watch(queryParam, (newQuery) => {
    searchQuery.value = newQuery
    fetchManga(true)
  }, { immediate: true })

  function clearFilters() {
    filterState.genre = []
    filterState.status = ''
    filterState.type = ''
    filterState.order = ''
  }

  function clearSearch() {
    router.push({ path: '/search', query: {} })
    searchQuery.value = ''
  }

  async function fetchManga(reset = false) {
    if (reset) {
      page.value = 1
      mangaList.value = []
      allLoaded.value = false
    }

    if (allLoaded.value || pending.value) return

    pending.value = true
    error.value = null

    try {
      const hasActiveFilters = filterState.genre.length || filterState.status
        || filterState.type || filterState.order

      let results: MangaListItem[]

      if (queryParam.value) {
        results = await searchManga(queryParam.value, page.value)
      } else if (hasActiveFilters) {
        results = await fetchMangaList(
          page.value,
          filterState.type,
          filterState.status,
          filterState.genre,
          filterState.order
        )
      } else {
        results = await fetchMangaList(page.value)
      }

      if (results.length < 10) {
        allLoaded.value = true
      }

      mangaList.value = [...mangaList.value, ...results]
      page.value++
    } catch (e) {
      error.value = e as Error
    } finally {
      pending.value = false
    }
  }

  function handleSearch() {
    if (searchQuery.value.trim()) {
      router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
    }
  }

  return {
    queryParam,
    isSearchMode,
    searchQuery,
    mangaList,
    page,
    pending,
    allLoaded,
    error,
    showFilters,
    filterState,
    clearFilters,
    clearSearch,
    fetchManga,
    handleSearch
  }
})
