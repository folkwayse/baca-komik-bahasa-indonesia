<script setup lang="ts">
const route = useRoute()

const navigation = [
  { name: 'Home', to: '/', icon: 'i-lucide-home' },
  { name: 'Popular', to: '/?section=popular', icon: 'i-lucide-trending-up' },
  { name: 'Latest', to: '/?section=latest', icon: 'i-lucide-clock' },
  { name: 'Bookmarks', to: '/bookmarks', icon: 'i-lucide-bookmark' },
  { name: 'History', to: '/history', icon: 'i-lucide-history' }
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-navy-950 border-t border-navy-200 dark:border-navy-800 md:hidden">
    <div class="flex items-center justify-around h-16 max-w-md mx-auto">
      <NuxtLink
        v-for="item in navigation"
        :key="item.name"
        :to="item.to"
        class="flex flex-col items-center justify-center gap-1 w-16 h-full text-navy-500 dark:text-navy-400 hover:text-navy-900 dark:hover:text-white transition-colors"
        :class="{ 'text-navy-900 dark:text-amber-400': route.path === item.to || (item.to.includes('?') && route.path === '/') }"
      >
        <UIcon
          :name="item.icon"
          class="w-6 h-6"
        />
        <span class="text-[10px] font-medium">{{ item.name }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
