<script setup lang="ts">
import type { Product, Category } from '~/data/products'

const props = defineProps<{
  query: string
  results: Product[]
  recommended: Product[]
  featured: Product[]
  categories: Category[]
}>()

const emit = defineEmits<{
  select: []
}>()

const trimmedQuery = computed(() => props.query.trim())
</script>

<template>
  <div class="flex flex-col gap-stack-lg">
    <template v-if="trimmedQuery">
      <div>
        <h3 class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm mb-stack-sm">
          Návrhy
        </h3>
        <ul v-if="results.length" class="flex flex-col divide-y divide-grid-line">
          <li v-for="item in results" :key="item.id">
            <SearchResultItem :product="item" @click="emit('select')" />
          </li>
        </ul>
        <div v-else class="flex items-center gap-3 py-stack-sm text-on-surface-variant">
          <span class="material-symbols-outlined text-[24px] shrink-0" aria-hidden="true">search_off</span>
          <p class="font-body-md text-body-md">Žiadne produkty pre „{{ trimmedQuery }}".</p>
        </div>
      </div>

      <NuxtLink
        :to="{ path: '/produkty', query: { q: trimmedQuery } }"
        class="flex items-center justify-between gap-2 font-label-sm text-label-sm uppercase tracking-widest text-primary hover:text-on-background transition-colors duration-200 py-stack-sm border-t border-grid-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-default"
        @click="emit('select')"
      >
        Zobraziť všetky výsledky pre „{{ trimmedQuery }}"
        <span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
      </NuxtLink>
    </template>

    <template v-else>
      <div>
        <h3 class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm mb-stack-sm">
          Vybrané kategórie
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-stack-sm">
          <NuxtLink
            v-for="category in categories"
            :key="category.slug"
            :to="{ path: '/produkty', query: { kategoria: category.slug } }"
            class="group relative aspect-[2/1] md:aspect-square overflow-hidden border border-grid-line focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-secondary-container"
            @click="emit('select')"
          >
            <NuxtImg
              :src="category.image"
              :alt="category.name"
              loading="lazy"
              width="400"
              height="300"
              sizes="320px md:256px"
              class="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-300 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <span class="absolute bottom-2 left-2 text-white font-label-sm text-label-sm uppercase">{{ category.name }}</span>
          </NuxtLink>
        </div>
      </div>

      <div v-if="recommended.length">
        <h3 class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm mb-stack-sm">
          Odporúčame
        </h3>
        <ul class="flex flex-col divide-y divide-grid-line">
          <li v-for="item in recommended" :key="item.id">
            <SearchResultItem :product="item" @click="emit('select')" />
          </li>
        </ul>
      </div>

      <div v-if="featured.length">
        <h3 class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm mb-stack-sm">
          Vybrané produkty
        </h3>
        <ul class="flex flex-col divide-y divide-grid-line">
          <li v-for="item in featured" :key="item.id">
            <SearchResultItem :product="item" @click="emit('select')" />
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
