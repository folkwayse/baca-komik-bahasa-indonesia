<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <div class="relative">
    <UButton
      size="sm"
      @click="isOpen = !isOpen"
    >
      <span>Templates</span>
      <UIcon
        icon="i-lucide-chevron-down"
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </UButton>

    <div
      v-if="isOpen"
      class="absolute top-full left-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl min-w-[200px] z-50"
    >
      <NuxtLink
        v-for="{ label, to } in [
          { label: 'Starter', to: 'https://starter-template.nuxt.dev/' },
          { label: 'Landing', to: 'https://landing-template.nuxt.dev/' },
          { label: 'Docs', to: 'https://docs-template.nuxt.dev/' },
          { label: 'SaaS', to: 'https://saas-template.nuxt.dev/' },
          { label: 'Dashboard', to: 'https://dashboard-template.nuxt.dev/' },
          { label: 'Chat', to: 'https://chat-template.nuxt.dev/' },
          { label: 'Portfolio', to: 'https://portfolio-template.nuxt.dev/' },
          { label: 'Changelog', to: 'https://changelog-template.nuxt.dev/' }
        ]"
        :key="label"
        :to="to"
        class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        @click="isOpen = false"
      >
        {{ label }}
      </NuxtLink>
    </div>

    <div
      v-if="isOpen"
      class="fixed inset-0"
      @click="isOpen = false"
    />
  </div>
</template>
