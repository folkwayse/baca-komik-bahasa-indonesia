<script setup lang="ts">
interface Props {
  modelValue?: boolean | string[]
  indeterminate?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

defineEmits(['update:modelValue'])

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.length > 0 && props.indeterminate === undefined
  }
  return props.modelValue
})
</script>

<template>
  <div class="relative flex items-center">
    <input
      type="checkbox"
      :checked="isChecked"
      :indeterminate="indeterminate"
      :disabled="disabled"
      :class="[
        'h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'dark:border-gray-600 dark:bg-gray-900 dark:checked:bg-navy-600'
      ]"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    >
  </div>
</template>
