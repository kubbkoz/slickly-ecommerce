<script setup lang="ts">
import { countries } from '~/stores/locale'

const props = withDefaults(
  defineProps<{
    variant?: 'dark' | 'light'
    dropDirection?: 'down' | 'up'
  }>(),
  { variant: 'dark', dropDirection: 'down' },
)

const locale = useLocaleStore()
const isOpen = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)

function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
    trigger.value?.focus()
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

function select(code: string) {
  locale.setCountry(code)
  isOpen.value = false
}
</script>

<template>
  <div ref="root" class="relative" @keydown="onKeydown">
    <button
      ref="trigger"
      type="button"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      class="flex items-center gap-1.5 min-h-11 px-1 -mx-1 font-label-sm text-label-sm uppercase tracking-widest cursor-pointer transition-colors duration-200 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2"
      :class="
        props.variant === 'dark'
          ? 'text-white hover:text-secondary-container focus-visible:outline-secondary-container'
          : 'text-on-background hover:text-primary focus-visible:outline-primary'
      "
      @click="isOpen = !isOpen"
    >
      <span class="material-symbols-outlined text-[20px]" aria-hidden="true">language</span>
      <span>{{ locale.country.code }}</span>
      <span class="material-symbols-outlined text-[18px]" aria-hidden="true">{{ isOpen ? 'expand_less' : 'expand_more' }}</span>
    </button>

    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      :enter-from-class="dropDirection === 'up' ? 'opacity-0 translate-y-1' : 'opacity-0 -translate-y-1'"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      :leave-to-class="dropDirection === 'up' ? 'opacity-0 translate-y-1' : 'opacity-0 -translate-y-1'"
    >
      <ul
        v-if="isOpen"
        role="menu"
        class="absolute right-0 w-56 bg-background border border-grid-line shadow-xl rounded-default overflow-hidden z-50"
        :class="dropDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'"
      >
        <li v-for="option in countries" :key="option.code" role="none">
          <button
            type="button"
            role="menuitem"
            :aria-current="option.code === locale.countryCode ? 'true' : undefined"
            class="w-full flex items-center justify-between gap-3 px-4 py-3 text-left cursor-pointer transition-colors duration-200 hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :class="option.code === locale.countryCode ? 'bg-surface-container-low' : ''"
            @click="select(option.code)"
          >
            <span class="flex flex-col">
              <span class="font-body-md text-body-md text-on-surface">{{ option.name }}</span>
              <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">{{ option.languageLabel }} · {{ option.currency }}</span>
            </span>
            <span class="material-symbols-outlined text-[18px] text-primary" :class="option.code === locale.countryCode ? '' : 'opacity-0'" aria-hidden="true">
              check
            </span>
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>
