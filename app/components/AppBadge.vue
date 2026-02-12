<script setup lang="ts">
interface Props {
  variant?: 'solid' | 'subtle' | 'outline'
  color?: 'navy' | 'amber' | 'red' | 'green' | 'blue' | 'gray'
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  variant: 'solid',
  color: 'navy',
  size: 'md'
})
</script>

<template>
  <span
    class="inline-flex items-center font-medium rounded-full transition-colors"
    :class="{
      // Sizes
      'px-2 py-0.5 text-xs': size === 'sm',
      'px-3 py-1 text-sm': size === 'md',
      'px-4 py-1.5 text-base': size === 'lg',

      // Navy variants
      'bg-navy-600 text-white': variant === 'solid' && color === 'navy',
      'bg-navy-100 text-navy-800 dark:bg-navy-800 dark:text-navy-200': variant === 'subtle' && color === 'navy',
      'border border-navy-600 text-navy-600 dark:text-navy-400': variant === 'outline' && color === 'navy',

      // Amber variants
      'bg-amber-500 text-white': variant === 'solid' && color === 'amber',
      'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200': variant === 'subtle' && color === 'amber',
      'border border-amber-500 text-amber-600 dark:text-amber-400': variant === 'outline' && color === 'amber',

      // Red variants
      'bg-red-500 text-white': variant === 'solid' && color === 'red',
      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': variant === 'subtle' && color === 'red',
      'border border-red-500 text-red-600 dark:text-red-400': variant === 'outline' && color === 'red',

      // Green variants
      'bg-green-500 text-white': variant === 'solid' && color === 'green',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': variant === 'subtle' && color === 'green',
      'border border-green-500 text-green-600 dark:text-green-400': variant === 'outline' && color === 'green',

      // Blue variants
      'bg-blue-500 text-white': variant === 'solid' && color === 'blue',
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': variant === 'subtle' && color === 'blue',
      'border border-blue-500 text-blue-600 dark:text-blue-400': variant === 'outline' && color === 'blue',

      // Gray variants
      'bg-gray-500 text-white': variant === 'solid' && color === 'gray',
      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200': variant === 'subtle' && color === 'gray',
      'border border-gray-500 text-gray-600 dark:text-gray-400': variant === 'outline' && color === 'gray'
    }"
  >
    <slot />
  </span>
</template>
