<script setup lang="ts">
interface Props {
  type?: 'card' | 'text' | 'hero'
  count?: number
}

withDefaults(defineProps<Props>(), {
  type: 'card',
  count: 6
})
</script>

<template>
  <!-- Card Skeleton -->
  <div
    v-if="type === 'card'"
    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
  >
    <div
      v-for="i in count"
      :key="i"
      class="bg-white dark:bg-navy-900 rounded-xl overflow-hidden shadow-sm"
    >
      <div class="aspect-[224/319] bg-navy-100 dark:bg-navy-800 relative overflow-hidden">
        <div class="absolute inset-0 skeleton-shimmer" />
      </div>
      <div class="p-3 space-y-2">
        <div class="h-4 bg-navy-100 dark:bg-navy-800 rounded w-3/4 relative overflow-hidden">
          <div class="absolute inset-0 skeleton-shimmer" />
        </div>
        <div class="h-3 bg-navy-100 dark:bg-navy-800 rounded w-1/2 relative overflow-hidden">
          <div class="absolute inset-0 skeleton-shimmer" />
        </div>
      </div>
    </div>
  </div>

  <!-- Text Skeleton -->
  <div
    v-else-if="type === 'text'"
    class="space-y-3"
  >
    <div
      v-for="i in count"
      :key="i"
      class="h-4 bg-navy-100 dark:bg-navy-800 rounded relative overflow-hidden"
      :class="i % 3 === 0 ? 'w-3/4' : i % 3 === 1 ? 'w-1/2' : 'w-full'"
    >
      <div class="absolute inset-0 skeleton-shimmer" />
    </div>
  </div>

  <!-- Hero Skeleton -->
  <div
    v-else-if="type === 'hero'"
    class="relative h-[400px] md:h-[500px] bg-navy-100 dark:bg-navy-900 rounded-2xl overflow-hidden"
  >
    <div class="absolute inset-0 skeleton-shimmer" />
    <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
      <div class="h-8 bg-white/20 dark:bg-white/10 rounded w-1/3 mb-4 relative overflow-hidden">
        <div class="absolute inset-0 skeleton-shimmer" />
      </div>
      <div class="h-6 bg-white/20 dark:bg-white/10 rounded w-2/3 mb-3 relative overflow-hidden">
        <div class="absolute inset-0 skeleton-shimmer" />
      </div>
      <div class="h-4 bg-white/20 dark:bg-white/10 rounded w-1/2 relative overflow-hidden">
        <div class="absolute inset-0 skeleton-shimmer" />
      </div>
    </div>
  </div>
</template>
