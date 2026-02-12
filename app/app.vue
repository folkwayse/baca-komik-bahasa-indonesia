<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'id',
    class: useDark() ? 'dark' : ''
  }
})

const title = 'KomikIndo - Baca Manga Indonesia Online'
const description = 'Platform baca manga online terlengkap dengan ribuan judul manga favorit. Update tercepat, gratis, dan kualitas terbaik.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: '/og-image.jpg',
  twitterImage: '/og-image.jpg',
  twitterCard: 'summary_large_image'
})

useDark()
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
    <PageLoadingBar />
    <main>
      <NuxtPage />
    </main>

    <AppFooter />
  </div>
</template>
