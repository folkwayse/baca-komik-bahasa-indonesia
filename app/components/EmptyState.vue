<script setup lang="ts">
interface Props {
  icon?: string
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'i-lucide-inbox',
  title: 'Tidak ada data',
  description: 'Data yang Anda cari tidak ditemukan'
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="w-20 h-20 bg-navy-100 dark:bg-navy-800 rounded-full flex items-center justify-center mb-4">
      <UIcon
        :name="icon"
        class="w-10 h-10 text-navy-400 dark:text-navy-500"
      />
    </div>
    <h3 class="text-lg font-semibold text-navy-900 dark:text-white mb-2">
      {{ title }}
    </h3>
    <p class="text-navy-500 dark:text-navy-400 max-w-sm">
      {{ description }}
    </p>
    <slot name="action" />
  </div>
</template>
