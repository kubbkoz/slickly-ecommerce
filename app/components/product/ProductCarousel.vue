<script setup lang="ts">
import type { Product } from '~/data/products'

defineProps<{
  products: Product[]
}>()

const scrollContainer = ref<HTMLElement | null>(null)

useAutoScroll(scrollContainer)

function scroll(direction: 'left' | 'right') {
  const el = scrollContainer.value
  if (!el) return
  const amount = el.clientWidth * 0.8 * (direction === 'left' ? -1 : 1)
  el.scrollBy({ left: amount, behavior: 'smooth' })
}
</script>

<template>
  <div class="relative">
    <div
      ref="scrollContainer"
      class="flex gap-stack-sm overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar -mx-gutter md:mx-0 px-gutter md:px-0 scroll-px-gutter md:scroll-px-0 overscroll-x-contain [touch-action:pan-x]"
      role="region"
      aria-label="Karusel produktov"
      tabindex="0"
    >
      <div
        v-for="item in products"
        :key="item.id"
        class="snap-start shrink-0 w-[70%] sm:w-[42%] md:w-[31%] lg:w-[23%]"
      >
        <ProductCard :product="item" />
      </div>
    </div>

    <button
      type="button"
      aria-label="Predchádzajúce produkty"
      class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 items-center justify-center bg-background border border-grid-line rounded-full cursor-pointer transition-colors duration-200 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      @click="scroll('left')"
    >
      <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
    </button>
    <button
      type="button"
      aria-label="Ďalšie produkty"
      class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-11 h-11 items-center justify-center bg-background border border-grid-line rounded-full cursor-pointer transition-colors duration-200 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      @click="scroll('right')"
    >
      <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
    </button>
  </div>
</template>
