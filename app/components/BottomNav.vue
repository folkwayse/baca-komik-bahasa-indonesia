<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: 'Home', to: '/', icon: 'i-lucide-home' },
  { label: 'Search', to: '/search', icon: 'i-lucide-search' },
  { label: 'Popular', to: '/popular', icon: 'i-lucide-trending-up' },
  { label: 'Latest', to: '/latest', icon: 'i-lucide-clock' }
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-navy-950/95 backdrop-blur-sm border-t border-navy-800">
    <div class="flex items-center justify-around">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center gap-1 px-4 py-3 transition-colors"
        :class="route.path === item.to ? 'text-amber-400' : 'text-navy-400'"
      >
        <UIcon
          :name="item.icon"
          class="w-5 h-5"
        />
        <span class="text-xs font-medium">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
