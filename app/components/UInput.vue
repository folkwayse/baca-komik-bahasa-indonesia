<script setup lang="ts">
interface Props {
  modelValue?: string
  placeholder?: string
  icon?: string
  type?: 'text' | 'email' | 'password' | 'search'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="relative">
    <UIcon
      v-if="icon"
      :icon="icon"
      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all placeholder:text-gray-400 dark:text-white',
        icon && 'pl-10',
        disabled && 'opacity-50 cursor-not-allowed'
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </div>
</template>
