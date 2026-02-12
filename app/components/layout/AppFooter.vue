<script setup lang="ts">
const currentYear = new Date().getFullYear()

interface FooterLink {
  name: string
  to?: string
  href?: string
  external?: boolean
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

const footerLinks: FooterSection[] = [
  {
    title: 'Navigasi',
    links: [
      { name: 'Home', to: '/' },
      { name: 'Manga Populer', to: '/?section=popular' },
      { name: 'Update Terbaru', to: '/?section=latest' },
      { name: 'Daftar Genre', to: '/genres' }
    ]
  },
  {
    title: 'Tentang',
    links: [
      { name: 'Tentang Kami', to: '/about' },
      { name: 'Kebijakan Privasi', to: '/privacy' },
      { name: 'Syarat Penggunaan', to: '/terms' },
      { name: 'Hubungi Kami', to: '/contact' }
    ]
  },
  {
    title: 'Komunitas',
    links: [
      { name: 'Discord', href: '#', external: true },
      { name: 'Telegram', href: '#', external: true },
      { name: 'Facebook', href: '#', external: true },
      { name: 'Twitter/X', href: '#', external: true }
    ]
  }
]
</script>

<template>
  <footer class="bg-navy-950 text-navy-300 border-t border-navy-800">
    <div class="container mx-auto px-4 max-w-7xl py-12 md:py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <!-- Brand -->
        <div class="lg:col-span-1">
          <NuxtLink
            to="/"
            class="flex items-center gap-2 mb-4"
          >
            <div class="w-10 h-10 bg-gradient-to-br from-navy-600 to-navy-800 rounded-xl flex items-center justify-center">
              <UIcon
                icon="i-lucide-book-open"
                class="w-6 h-6 text-white"
              />
            </div>
            <span class="text-xl font-bold text-white">
              Komik<span class="text-amber-500">Indo</span>
            </span>
          </NuxtLink>
          <p class="text-sm text-navy-400 mb-4">
            Platform baca manga online terlengkap dengan update tercepat. Baca ribuan manga favoritmu kapan saja, di mana saja.
          </p>
          <div class="flex gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-simple-icons-github"
              to="https://github.com"
              target="_blank"
              size="sm"
            />
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-simple-icons-discord"
              size="sm"
            />
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-simple-icons-telegram"
              size="sm"
            />
          </div>
        </div>

        <!-- Links -->
        <div
          v-for="section in footerLinks"
          :key="section.title"
          class="space-y-4"
        >
          <h4 class="font-semibold text-white">
            {{ section.title }}
          </h4>
          <ul class="space-y-2">
            <li
              v-for="link in section.links"
              :key="link.name"
            >
              <NuxtLink
                v-if="!link.external"
                :to="link.to"
                class="text-sm text-navy-400 hover:text-amber-400 transition-colors"
              >
                {{ link.name }}
              </NuxtLink>
              <a
                v-else
                :href="link.href"
                class="text-sm text-navy-400 hover:text-amber-400 transition-colors"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom -->
      <div class="mt-12 pt-8 border-t border-navy-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-sm text-navy-500">
          © {{ currentYear }} KomikIndo. All rights reserved.
        </p>
        <p class="text-xs text-navy-600">
          Dibuat dengan ❤️ untuk para penggemar manga Indonesia
        </p>
      </div>
    </div>
  </footer>
</template>
