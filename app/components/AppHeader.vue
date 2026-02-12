<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const showMenu = ref(false)

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Popular', to: '/popular' },
  { label: 'Latest', to: '/latest' }
]

function goToSearch() {
  router.push('/search')
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-navy-950/95 backdrop-blur-sm border-b border-navy-800">
    <div class="container mx-auto px-4 max-w-7xl py-4">
      <div class="flex items-center justify-between gap-4">
        <NuxtLink
          to="/"
          class="flex items-center gap-2"
        >
          <AppLogo />
        </NuxtLink>

        <UButton
          icon="i-lucide-search"
          variant="ghost"
          color="neutral"
          size="lg"
          class="hidden sm:flex"
          @click="goToSearch"
        />

        <nav class="hidden lg:flex items-center gap-6">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="text-sm font-medium transition-colors"
            :class="route.path === item.to ? 'text-amber-400' : 'text-navy-300 hover:text-amber-400'"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <UButton
          icon="i-lucide-search"
          variant="ghost"
          size="lg"
          class="sm:hidden"
          @click="goToSearch"
        />

        <UButton
          icon="i-lucide-menu"
          variant="ghost"
          size="lg"
          class="lg:hidden"
          @click="showMenu = !showMenu"
        />
      </div>
    </div>

    <UModal
      v-model="showMenu"
    >
      <div class="p-4 space-y-2 bg-navy-950">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="block px-4 py-3 rounded-lg text-sm font-medium transition-colors"
          :class="route.path === item.to ? 'bg-amber-500/20 text-amber-400' : 'text-navy-300 hover:bg-navy-800'"
          @click="showMenu = false"
        >
          {{ item.label }}
        </NuxtLink>
      </div>
    </UModal>
  </header>
</template>
