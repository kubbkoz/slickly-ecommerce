<script setup lang="ts">
import { products } from '~/data/products'

const wishlist = useWishlistStore()

useSeo({
  title: 'Obľúbené | SLICKLY',
  description: 'Vaše obľúbené produkty SLICKLY.',
  noindex: true,
})

const items = computed(() => products.filter((p) => wishlist.has(p.id)))
</script>

<template>
  <div class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin py-stack-lg md:py-12">
    <!-- Breadcrumb -->
    <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant block mb-stack-lg md:mb-8">
      <NuxtLink to="/" class="hover:text-on-background">Domov</NuxtLink> / Obľúbené
    </span>

    <h1 class="font-headline-lg text-headline-lg md:text-headline-xl uppercase border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-lg md:mb-8">
      Obľúbené produkty
    </h1>

    <ClientOnly>
      <div v-if="items.length" class="grid grid-cols-2 lg:grid-cols-3 gap-px bg-grid-line border border-grid-line">
        <ProductCard v-for="product in items" :key="product.id" :product="product" />
      </div>
      <div v-else class="py-stack-lg flex flex-col items-center gap-stack-md text-center">
        <span class="material-symbols-outlined text-[56px] text-on-surface-variant opacity-30" aria-hidden="true">favorite</span>
        <p class="font-body-md text-body-md text-on-surface-variant">Zatiaľ nemáte žiadne obľúbené produkty.</p>
        <NuxtLink
          to="/produkty"
          class="h-12 px-6 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Prehliadať produkty
        </NuxtLink>
      </div>
      <template #fallback>
        <div class="py-stack-lg flex flex-col items-center gap-stack-md text-center">
          <span class="material-symbols-outlined text-[56px] text-on-surface-variant opacity-30" aria-hidden="true">favorite</span>
          <p class="font-body-md text-body-md text-on-surface-variant">Načítavajú sa obľúbené…</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
