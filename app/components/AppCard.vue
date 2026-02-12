<script setup lang="ts">
interface Props {
  title?: string
  image?: string
  aspectRatio?: string
  badge?: string
  badgeColor?: 'navy' | 'amber' | 'red' | 'green' | 'blue'
  to?: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  aspectRatio: '224/319',
  badgeColor: 'navy'
})
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="group relative bg-white dark:bg-navy-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
  >
    <div
      class="relative overflow-hidden"
      :style="{ aspectRatio }"
    >
      <NuxtImg
        v-if="image && !loading"
        :src="image"
        :alt="title"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div
        v-else
        class="w-full h-full bg-navy-100 dark:bg-navy-800 animate-pulse"
      />

      <!-- Badge -->
      <div
        v-if="badge"
        class="absolute top-2 right-2"
      >
        <span
          class="px-2 py-1 text-xs font-semibold rounded-md"
          :class="{
            'bg-navy-600 text-white': badgeColor === 'navy',
            'bg-amber-500 text-white': badgeColor === 'amber',
            'bg-red-500 text-white': badgeColor === 'red',
            'bg-green-500 text-white': badgeColor === 'green',
            'bg-blue-500 text-white': badgeColor === 'blue'
          }"
        >
          {{ badge }}
        </span>
      </div>

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>

    <div
      v-if="title"
      class="p-3"
    >
      <h3
        class="font-medium text-sm text-navy-900 dark:text-navy-100 line-clamp-2 group-hover:text-navy-600 dark:group-hover:text-amber-400 transition-colors"
      >
        {{ title }}
      </h3>
      <slot name="subtitle" />
    </div>
  </NuxtLink>

  <div
    v-else
    class="group relative bg-white dark:bg-navy-900 rounded-xl overflow-hidden shadow-sm"
  >
    <div
      class="relative overflow-hidden"
      :style="{ aspectRatio }"
    >
      <NuxtImg
        v-if="image && !loading"
        :src="image"
        :alt="title"
        loading="lazy"
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-full h-full bg-navy-100 dark:bg-navy-800 animate-pulse"
      />

      <div
        v-if="badge"
        class="absolute top-2 right-2"
      >
        <span
          class="px-2 py-1 text-xs font-semibold rounded-md"
          :class="{
            'bg-navy-600 text-white': badgeColor === 'navy',
            'bg-amber-500 text-white': badgeColor === 'amber',
            'bg-red-500 text-white': badgeColor === 'red',
            'bg-green-500 text-white': badgeColor === 'green',
            'bg-blue-500 text-white': badgeColor === 'blue'
          }"
        >
          {{ badge }}
        </span>
      </div>
    </div>

    <div
      v-if="title"
      class="p-3"
    >
      <h3 class="font-medium text-sm text-navy-900 dark:text-navy-100 line-clamp-2">
        {{ title }}
      </h3>
      <slot name="subtitle" />
    </div>
  </div>
</template>
