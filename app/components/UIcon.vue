<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  icon?: string
  name?: string
  size?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'w-5 h-5'
})

const iconName = computed(() => {
  const icon = props.icon || props.name || ''
  return icon.replace('i-lucide-', '').replace('i-simple-icons-', '')
})

const iconSet = computed(() => {
  const icon = props.icon || props.name || ''
  if (icon.startsWith('i-lucide-')) return 'lucide'
  if (icon.startsWith('i-simple-icons-')) return 'simple-icons'
  return 'lucide'
})
</script>

<template>
  <span :class="size">
    <Icon :icon="`${iconSet}:${iconName}`" />
  </span>
</template>
