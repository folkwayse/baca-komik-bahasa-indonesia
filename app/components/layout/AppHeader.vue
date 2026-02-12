<script setup lang="ts">
const isDark = useDark()
const isSearchOpen = ref(false)
const searchQuery = ref('')

const navigation = [
  { name: 'Home', to: '/', icon: 'i-lucide-home' },
  { name: 'Popular', to: '/?section=popular', icon: 'i-lucide-trending-up' },
  { name: 'Latest', to: '/?section=latest', icon: 'i-lucide-clock' },
  { name: 'Genres', to: '/genres', icon: 'i-lucide-grid-3x3' },
  { name: 'History', to: '/history', icon: 'i-lucide-history' }
]

const onSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
    isSearchOpen.value = false
    searchQuery.value = ''
  }
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-navy-200/20 dark:border-navy-800/30">
    <div class="container mx-auto px-4 max-w-7xl h-full flex items-center justify-between gap-4">
      <!-- Logo -->
      <AppLogo />

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-1">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          class="px-3 py-2 text-sm font-medium text-navy-600 dark:text-navy-300 hover:text-navy-900 dark:hover:text-white hover:bg-navy-100/50 dark:hover:bg-navy-800/50 rounded-lg transition-colors"
          :class="{ 'text-navy-900 dark:text-white bg-navy-100/50 dark:bg-navy-800/50': $route.path === item.to }"
        >
          {{ item.name }}
        </NuxtLink>
      </nav>

      <!-- Right Actions -->
      <div class="flex items-center gap-2">
        <!-- Search Button -->
        <UButton
          variant="ghost"
          icon="i-lucide-search"
          class="md:hidden"
          @click="isSearchOpen = true"
        />

        <!-- Search Bar (Desktop) -->
        <div class="hidden md:block relative">
          <UInput
            v-model="searchQuery"
            type="search"
            placeholder="Cari manga..."
            icon="i-lucide-search"
            class="w-64"
            @keyup.enter="onSearch"
          />
        </div>

        <!-- Theme Toggle -->
        <UButton
          variant="ghost"
          :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
          @click="isDark = !isDark"
        />

        <!-- Bookmarks -->
        <UButton
          variant="ghost"
          icon="i-lucide-bookmark"
          to="/bookmarks"
        />

        <!-- History -->
        <UButton
          variant="ghost"
          icon="i-lucide-history"
          to="/history"
        />

        <!-- Mobile Menu -->
        <USlideover
          v-model:open="isSearchOpen"
          class="md:hidden"
        >
          <div class="p-4 space-y-4">
            <UInput
              v-model="searchQuery"
              type="search"
              placeholder="Cari manga..."
              icon="i-lucide-search"
              autofocus
              @keyup.enter="onSearch"
            />
            <div class="flex gap-2 overflow-x-auto hide-scrollbar">
              <UButton
                v-for="item in navigation"
                :key="item.name"
                :to="item.to"
                class="text-sm px-3 py-2"
                @click="isSearchOpen = false"
              >
                {{ item.name }}
              </UButton>
            </div>
          </div>
        </USlideover>
      </div>
    </div>
  </header>
</template>
