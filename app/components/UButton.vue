<script setup lang="ts">
interface Props {
  variant?: 'solid' | 'outline' | 'ghost' | 'soft' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'solid',
  size: 'md',
  disabled: false
})
</script>

<template>
  <component
    :is="$attrs.to ? 'NuxtLink' : 'button'"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center font-medium transition-all',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variant === 'solid' && 'bg-navy-700 hover:bg-navy-800 text-white focus:ring-navy-500',
      variant === 'outline' && 'border border-navy-600 text-navy-700 hover:bg-navy-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800',
      variant === 'ghost' && 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
      variant === 'soft' && 'bg-navy-100 text-navy-700 hover:bg-navy-200 dark:bg-navy-900/30 dark:text-navy-300 dark:hover:bg-navy-900/50',
      variant === 'icon' && 'p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full',
      size === 'sm' && 'text-sm px-3 py-1.5 gap-1.5',
      size === 'md' && 'text-sm px-4 py-2 gap-2',
      size === 'lg' && 'text-base px-6 py-3 gap-2'
    ]"
  >
    <UIcon
      v-if="icon"
      :icon="icon"
    />
    <slot />
  </component>
</template>
