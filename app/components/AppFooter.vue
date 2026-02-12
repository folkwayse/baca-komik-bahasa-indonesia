<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-navy-900/50 border-t border-navy-800 mt-12 hidden lg:block">
    <div class="container mx-auto px-4 max-w-7xl py-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <AppLogo />
        </div>

        <p class="text-sm text-navy-400">
          &copy; {{ currentYear }} KomikIndo. All rights reserved.
        </p>

        <div class="flex items-center gap-4">
          <NuxtLink
            to="/about"
            class="text-sm text-navy-400 hover:text-amber-400 transition-colors"
          >
            About
          </NuxtLink>
          <NuxtLink
            to="/privacy"
            class="text-sm text-navy-400 hover:text-amber-400 transition-colors"
          >
            Privacy
          </NuxtLink>
          <NuxtLink
            to="/terms"
            class="text-sm text-navy-400 hover:text-amber-400 transition-colors"
          >
            Terms
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
