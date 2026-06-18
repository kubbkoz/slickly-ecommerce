<script setup lang="ts">
const isOpen = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)

// /kosik and /pokladna show a sticky mobile checkout bar at bottom-16 — lift
// the chat bubble above it there so the two don't overlap.
const route = useRoute()
const hasMobileStickyBar = computed(() => route.path === '/kosik' || route.path === '/pokladna')

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

watch(isOpen, (open) => {
  if (open) document.addEventListener('click', onClickOutside)
  else document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div
    ref="root"
    class="fixed left-4 md:bottom-6 md:left-6 z-40"
    :class="hasMobileStickyBar ? 'bottom-36' : 'bottom-20'"
    @keydown="onKeydown"
  >
    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="isOpen"
        role="dialog"
        aria-modal="false"
        aria-label="Live chat"
        class="absolute bottom-full left-0 mb-3 w-72 max-w-[calc(100vw-2rem)] bg-background border border-grid-line shadow-xl rounded-default overflow-hidden"
      >
        <div class="flex items-center justify-between px-4 py-3 bg-primary text-on-primary">
          <span class="font-label-sm text-label-sm uppercase tracking-widest">Live Chat</span>
          <button
            type="button"
            aria-label="Zavrieť chat"
            class="min-w-11 min-h-11 -mr-2 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:text-secondary-container rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container"
            @click="isOpen = false"
          >
            <span class="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>
        <div class="p-4 flex flex-col gap-stack-sm">
          <p class="font-body-md text-body-md text-on-background">
            Náš tím je momentálne offline. Napíšte nám a ozveme sa vám čo najskôr.
          </p>
          <a
            href="mailto:info@slickly.sk"
            class="font-label-sm text-label-sm uppercase tracking-widest text-primary flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:text-secondary rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">mail</span>
            info@slickly.sk
          </a>
        </div>
      </div>
    </Transition>

    <button
      ref="trigger"
      type="button"
      :aria-label="isOpen ? 'Zavrieť chat' : 'Otvoriť chat'"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      class="w-14 h-14 flex items-center justify-center bg-primary text-on-primary rounded-full shadow-xl cursor-pointer transition-[background-color,transform] duration-200 active:scale-95 hover:bg-primary/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container"
      @click="isOpen = !isOpen"
    >
      <span class="material-symbols-outlined text-[28px]" aria-hidden="true">{{ isOpen ? 'close' : 'chat' }}</span>
    </button>
  </div>
</template>
