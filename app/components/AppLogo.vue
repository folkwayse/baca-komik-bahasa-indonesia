<template>
  <NuxtLink
    to="/"
    class="flex items-center gap-2 group"
  >
    <div class="relative w-10 h-10 bg-gradient-to-br from-navy-600 to-navy-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
      <UIcon
        name="i-lucide-book-open"
        class="w-6 h-6 text-white"
      />
      <div class="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
        <span class="text-[8px] font-bold text-white">K</span>
      </div>
    </div>
    <div class="hidden sm:block">
      <span class="text-xl font-bold text-navy-800 dark:text-white leading-none">
        Komik<span class="text-amber-500">Indo</span>
      </span>
      <span class="block text-[10px] text-navy-500 dark:text-navy-400 tracking-wider uppercase">
        Baca Manga Online
      </span>
    </div>
  </NuxtLink>
</template>
