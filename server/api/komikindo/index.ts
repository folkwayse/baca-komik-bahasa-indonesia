const API_BASE = 'http://45.76.148.33:8080/api/kiryuu/v6'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = query.page as string

  if (!page) {
    throw createError({ statusCode: 400, statusMessage: 'Missing page parameter' })
  }

  if (page === 'chapter') {
    const id = query.id as string
    let apiChapterId = id

    if (!id.startsWith('/manga/')) {
      const mangaId = query.mangaId as string
      if (mangaId) {
        apiChapterId = `/manga/${mangaId}/${id}/`
      } else {
        apiChapterId = `/${id}/`
      }
    }

    const url = `${API_BASE}/chapter?id=${encodeURIComponent(apiChapterId)}`

    const response = await fetch(url, {
      headers: {
        'Host': '45.76.148.33:8080',
        'User-Agent': 'Dart/2.8 (dart:io)',
        'Accept-Encoding': 'gzip',
        'content-type': 'application/json',
        'content-length': '0'
      }
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Failed to fetch chapter from Kiryuu API'
      })
    }

    const text = await response.text()
    const data = JSON.parse(text)

    return {
      title: data.title || '',
      chapter: '',
      thumb: data.content?.[0] || '',
      image: data.content || [],
      link: id
    }
  }

  let url = ''

  switch (page) {
    case 'manga': {
      const id = query.id as string
      url = `${API_BASE}/manga?id=${encodeURIComponent(id)}`
      break
    }

    case 'search': {
      const search = query.search as string
      const paged = query.paged || 1
      const type = query.type || ''
      const status = query.status || ''
      const order = query.order || ''

      const params = new URLSearchParams()
      params.set('page', String(paged))
      params.set('s', search)
      if (type) params.set('type', String(type))
      if (status) params.set('status', String(status))
      if (order) params.set('order', String(order))

      url = `${API_BASE}/search/simple?${params.toString()}`
      break
    }

    case 'filter':
    case 'latest':
    case 'terpopuler':
    case 'rekomendasi': {
      const paged = query.paged || 1
      const status = query.status || ''
      const order = query.order || 'update'
      const type = query.type || ''
      const genres = query.genres || ''

      const params = new URLSearchParams()
      params.set('page', String(paged))
      if (status) params.set('status', String(status))
      if (order) params.set('order', String(order))
      if (type) params.set('type', String(type))
      if (genres) params.set('genres', String(genres))

      url = `${API_BASE}/search?${params.toString()}`
      break
    }

    default:
      throw createError({ statusCode: 400, statusMessage: 'Invalid page parameter' })
  }

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 13; SM-G780G Build/TP1A.220624.014)',
      'Accept': 'application/json',
      'Connection': 'Keep-Alive'
    }
  })

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: 'Failed to fetch from Kiryuu API'
    })
  }

  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to parse API response'
    })
  }
})
