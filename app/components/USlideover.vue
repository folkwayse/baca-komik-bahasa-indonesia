<script setup lang="ts">
interface Props {
  open?: boolean
  position?: 'left' | 'right'
}

withDefaults(defineProps<Props>(), {
  open: false,
  position: 'right'
})

defineEmits(['update:open'])
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50"
    >
      <div
        class="fixed inset-0 bg-black/50"
        @click="$emit('update:open', false)"
      />
      <div
        :class="[
          'fixed top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-xl transition-transform duration-300',
          position === 'right' ? 'right-0' : 'left-0'
        ]"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
