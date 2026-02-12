<script setup lang="ts">
interface Props {
  variant?: 'solid' | 'outline' | 'soft'
  color?: 'navy' | 'amber' | 'gray'
}

withDefaults(defineProps<Props>(), {
  variant: 'solid',
  color: 'navy'
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variant === 'solid' && `bg-${color}-700 text-white`,
      variant === 'outline' && `border border-${color}-600 text-${color}-700 dark:border-${color}-400 dark:text-${color}-300`,
      variant === 'soft' && `bg-${color}-100 text-${color}-700 dark:bg-${color}-900/30 dark:text-${color}-300`
    ]"
  >
    <slot />
  </span>
</template>
