<script setup lang="ts">
import { usePageLoading } from '~/composables/usePageLoading'

const { isLoading, progress, isError } = usePageLoading()
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-150 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isLoading"
      class="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-navy-950/50 dark:bg-gray-950/50"
    >
      <div
        class="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 transition-all duration-300 ease-out relative overflow-hidden"
        :style="{ width: `${progress}%` }"
      >
        <div class="absolute inset-0 animate-[shimmer_1.5s_infinite]" />
      </div>
      <div
        v-if="isError"
        class="absolute inset-0 bg-red-500/80"
      />
    </div>
  </Transition>
</template>
