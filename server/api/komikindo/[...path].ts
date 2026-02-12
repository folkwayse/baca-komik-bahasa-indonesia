import { defineEventHandler, getQuery, createError } from 'h3'
import { gunzip } from 'node:zlib'
import { promisify } from 'node:util'

const gunzipAsync = promisify(gunzip)

const API_BASE = 'https://kmkindo.click'
const KIRYUU_API_BASE = 'http://45.76.148.33:8080/api/kiryuu/v6'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = query.page as string

  if (!page) {
    throw createError({ statusCode: 400, statusMessage: 'Missing page parameter' })
  }

  let url: string
  let useKiryuuApi = false

  if (page === 'chapter') {
    useKiryuuApi = true
    const chapterId = query.id as string
    let apiChapterId = chapterId

    if (!chapterId.startsWith('/manga/')) {
      const mangaId = query.mangaId as string
      if (mangaId) {
        apiChapterId = `/manga/${mangaId}/${chapterId}/`
      } else {
        apiChapterId = `/${chapterId}/`
      }
    }

    url = `${KIRYUU_API_BASE}/chapter?id=${encodeURIComponent(apiChapterId)}`
  } else {
    const searchParams = new URLSearchParams()
    searchParams.set('page', page)

    Object.entries(query).forEach(([key, value]) => {
      if (key !== 'page' && value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    })

    url = `${API_BASE}?${searchParams.toString()}`
  }

  const response = await fetch(url, {
    headers: useKiryuuApi
      ? {
          'Host': '45.76.148.33:8080',
          'User-Agent': 'Dart/2.8 (dart:io)',
          'Accept-Encoding': 'gzip',
          'content-type': 'application/json',
          'content-length': '0'
        }
      : {
          'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 13; SM-G780G Build/TP1A.220624.014)',
          'Accept-Encoding': 'gzip',
          'Connection': 'Keep-Alive'
        }
  })

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: 'Failed to fetch from komikindo API'
    })
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const isGzipped = buffer[0] === 0x1f && buffer[1] === 0x8b

  let text: string
  if (isGzipped) {
    const decompressed = await gunzipAsync(buffer)
    text = decompressed.toString('utf-8')
  } else {
    text = buffer.toString('utf-8')
  }

  try {
    const data = JSON.parse(text)

    if (useKiryuuApi && page === 'chapter') {
      return {
        title: data.title || '',
        chapter: '',
        thumb: data.content?.[0] || '',
        image: data.content || [],
        link: query.id as string || ''
      }
    }

    return data
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to parse API response'
    })
  }
})
