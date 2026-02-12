<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  name: string
  key: string
  type?: 'checkbox' | 'radio'
  options: FilterOption[]
}

interface FilterState {
  genre: string[]
  demographic: string[]
  content: string[]
  theme: string[]
  status: string
  type: string
  bw: string
  order: string
}

interface Props {
  modelValue: boolean
  filterConfig: FilterConfig[]
  filterState: FilterState
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'apply' | 'clear'): void
  (e: 'toggle-filter', filterKey: string, value: string, isArray: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const drawerRef = ref<HTMLElement | null>(null)
const backdropRef = ref<HTMLElement | null>(null)

onClickOutside(drawerRef, () => {
  emit('update:modelValue', false)
}, { ignore: [backdropRef] })

const isActive = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

function toggleFilter(filterKey: string, value: string, isArray: boolean) {
  emit('toggle-filter', filterKey, value, isArray)
}

function applyFilters() {
  emit('apply')
}

function clearFilters() {
  emit('clear')
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isActive"
        ref="backdropRef"
        class="fixed inset-0 z-50 bg-black/50 lg:hidden"
        @click="isActive = false"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="isActive"
        ref="drawerRef"
        class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-navy-950 border-l border-navy-800 shadow-xl lg:hidden flex flex-col"
      >
        <div class="p-4 border-b border-navy-800">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-white">
              Filters
            </h2>
            <button
              class="p-2 rounded-lg hover:bg-navy-800 transition-colors"
              @click="isActive = false"
            >
              <UIcon
                name="i-lucide-x"
                class="w-5 h-5 text-navy-300"
              />
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-6">
          <div
            v-for="filter in filterConfig"
            :key="filter.key"
            class="space-y-3"
          >
            <h3 class="font-medium text-white">
              {{ filter.name }}
            </h3>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label
                v-for="opt in filter.options"
                :key="opt.value"
                class="flex items-center gap-2 cursor-pointer"
              >
                <input
                  v-if="filter.type === 'radio'"
                  type="radio"
                  :checked="filterState[filter.key as keyof FilterState] === opt.value"
                  class="w-4 h-4 text-amber-500 bg-navy-900 border-navy-700 focus:ring-amber-500 focus:ring-offset-navy-950"
                  @change="toggleFilter(filter.key, opt.value, false)"
                >

                <input
                  v-else
                  type="checkbox"
                  :checked="Array.isArray(filterState[filter.key as keyof FilterState]) && (filterState[filter.key as keyof FilterState] as string[]).includes(opt.value)"
                  class="w-4 h-4 text-amber-500 bg-navy-900 border-navy-700 rounded focus:ring-amber-500 focus:ring-offset-navy-950"
                  @change="toggleFilter(filter.key, opt.value, true)"
                >

                <span class="text-sm text-navy-300">{{ opt.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-navy-800">
          <div class="flex gap-3">
            <button
              class="flex-1 px-4 py-2.5 rounded-lg bg-navy-800 text-navy-300 font-medium hover:bg-navy-700 transition-colors"
              @click="clearFilters"
            >
              Clear All
            </button>
            <button
              class="flex-1 px-4 py-2.5 rounded-lg bg-amber-500 text-navy-950 font-medium hover:bg-amber-600 transition-colors"
              @click="applyFilters"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>
