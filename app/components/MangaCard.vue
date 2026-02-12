<template>
  <NuxtLink
    :to="`/manga/${mangaId}`"
    class="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
  >
    <div class="relative aspect-[224/319] overflow-hidden">
      <NuxtImg
        :src="manga.cover"
        :alt="manga.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <div class="absolute top-2 right-2">
        <UBadge
          variant="solid"
          color="navy"
        >
          {{ manga.type }}
        </UBadge>
      </div>
    </div>

    <div class="p-3">
      <h3 class="font-medium text-sm line-clamp-2 group-hover:text-primary-600 transition-colors">
        {{ manga.title }}
      </h3>
      <p class="text-xs text-gray-500 mt-1">
        {{ manga.last_chapter?.chapter || '' }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { MangaListItem } from '~/composables/useMangaApi'

const props = defineProps<{
  manga: MangaListItem
}>()

const mangaId = computed(() => props.manga.slug)
</script>
