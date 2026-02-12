export interface MangaListItem {
  title: string
  slug: string
  cover: string
  genres: string[]
  rating: string
  status: string
  type: string
  last_chapter: {
    chapter: string
    slug: string
    tanggal?: string
  }
  nsfw?: boolean
}

export interface ChapterInfo {
  chapter: string
  slug: string
  tanggal?: string
}

export interface MangaDetail {
  title: string
  subtitle?: string
  cover: string
  genres: string[]
  synopsis: string
  score: string
  author: string
  published: string
  status: string
  type?: string
  serialization?: string
  chapters: ChapterInfo[]
}

export interface ChapterDetail {
  title: string
  thumb: string
  chapter: string
  image: string[]
  link: string
  image2?: string
}

export interface SearchResponse {
  mangas: MangaListItem[]
}

export const useMangaApi = () => {
  const fetchLatest = async (page = 1): Promise<MangaListItem[]> => {
    const response = await $fetch<SearchResponse>('/api/komikindo', {
      params: { page: 'filter', paged: page, status: '', order: 'latest' }
    })
    return response.mangas || []
  }

  const fetchPopular = async (page = 1): Promise<MangaListItem[]> => {
    const response = await $fetch<SearchResponse>('/api/komikindo', {
      params: { page: 'filter', paged: page, status: '', order: 'popular' }
    })
    return response.mangas || []
  }

  const fetchRecommended = async (page = 1): Promise<MangaListItem[]> => {
    const response = await $fetch<SearchResponse>('/api/komikindo', {
      params: { page: 'filter', paged: page, status: '', order: 'update' }
    })
    return response.mangas || []
  }

  const searchManga = async (query: string, page = 1, type = '', status = '', order = 'update'): Promise<MangaListItem[]> => {
    const params: Record<string, string | number> = { page: 'search', search: query, paged: page }
    if (type) params.type = type
    if (status) params.status = status
    if (order) params.order = order
    const response = await $fetch<SearchResponse>('/api/komikindo', { params })
    return response.mangas || []
  }

  const fetchByGenre = async (genre: string, page = 1): Promise<MangaListItem[]> => {
    const response = await $fetch<SearchResponse>('/api/komikindo', {
      params: { page: 'filter', paged: page, genres: genre }
    })
    return response.mangas || []
  }

  const fetchMangaList = async (
    page = 1,
    type = '',
    status = '',
    genre: number[] = [],
    order = 'update'
  ): Promise<MangaListItem[]> => {
    const params: Record<string, string | number> = { page: 'filter', paged: page }
    if (type) params.type = type
    if (status) params.status = status
    if (order) params.order = order
    if (genre.length > 0) {
      params.genres = genre.join(',')
    }
    const response = await $fetch<SearchResponse>('/api/komikindo', { params })
    return response.mangas || []
  }

  const fetchMangaDetail = async (id: string): Promise<MangaDetail> => {
    return $fetch<MangaDetail>('/api/komikindo', {
      params: { page: 'manga', id }
    })
  }

  const fetchChapter = async (id: string, mangaId?: string): Promise<ChapterDetail> => {
    const params: Record<string, string> = { page: 'chapter', id }
    if (mangaId) params.mangaId = mangaId
    return $fetch<ChapterDetail>('/api/komikindo', { params })
  }

  return {
    fetchLatest,
    fetchPopular,
    fetchRecommended,
    searchManga,
    fetchByGenre,
    fetchMangaList,
    fetchMangaDetail,
    fetchChapter
  }
}
