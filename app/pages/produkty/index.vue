<script setup lang="ts">
import { products, categories, matchesSearchQuery } from '~/data/products'

useSeoMeta({
  title: 'Obchod | SLICKLY',
  description: 'Kompletný sortiment keramickej ochrany, detailingu a starostlivosti o vozidlo.',
})

const route = useRoute()
const router = useRouter()

const selectedCategory = computed(() => (route.query.kategoria as string) || '')
const onlyDeals = computed(() => route.query.akcia === '1')
const searchQuery = computed(() => (route.query.q as string) || '')

const sortOptions = [
  { value: 'odporucane', label: 'Odporúčané' },
  { value: 'cena-asc', label: 'Cena: od najnižšej' },
  { value: 'cena-desc', label: 'Cena: od najvyššej' },
  { value: 'nazov', label: 'Názov A-Z' },
]
const sort = ref('odporucane')

const filtered = computed(() => {
  let list = [...products]
  if (searchQuery.value) {
    list = list.filter((p) => matchesSearchQuery(p, searchQuery.value))
  }
  if (selectedCategory.value) {
    list = list.filter((p) => p.category === selectedCategory.value)
  }
  if (onlyDeals.value) {
    list = list.filter((p) => p.badge)
  }
  switch (sort.value) {
    case 'cena-asc':
      list.sort((a, b) => a.price - b.price)
      break
    case 'cena-desc':
      list.sort((a, b) => b.price - a.price)
      break
    case 'nazov':
      list.sort((a, b) => a.name.localeCompare(b.name))
      break
  }
  return list
})

const activeCategoryName = computed(
  () => categories.find((c) => c.slug === selectedCategory.value)?.name,
)

function setCategory(slug?: string) {
  const query = { ...route.query }
  if (slug) {
    query.kategoria = slug
  } else {
    delete query.kategoria
  }
  router.push({ query })
}

function clearDeals() {
  const query = { ...route.query }
  delete query.akcia
  router.push({ query })
}
</script>

<template>
  <div class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin py-stack-lg md:py-12">
    <!-- Header -->
    <div class="flex flex-col gap-stack-xs md:gap-2 mb-stack-lg md:mb-8 border-b border-grid-line pb-stack-lg md:pb-6">
      <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
        <NuxtLink to="/" class="hover:text-on-background">Domov</NuxtLink> / Obchod
        <template v-if="activeCategoryName"> / {{ activeCategoryName }}</template>
        <template v-if="searchQuery"> / Vyhľadávanie</template>
      </span>
      <h1 class="font-headline-lg text-headline-lg md:text-headline-xl uppercase">
        <template v-if="searchQuery">Výsledky vyhľadávania pre „{{ searchQuery }}“</template>
        <template v-else>{{ onlyDeals ? 'Akciová ponuka' : activeCategoryName || 'Všetky produkty' }}</template>
      </h1>
    </div>

    <div class="flex flex-col md:flex-row gap-stack-lg md:gap-12">
      <!-- Filters -->
      <aside class="md:w-64 shrink-0">
        <!-- Mobile: horizontal chips -->
        <div class="flex md:hidden gap-2 overflow-x-auto hide-scrollbar pb-2">
          <button
            class="font-label-sm text-label-sm uppercase px-4 py-2 whitespace-nowrap rounded-default border"
            :class="!selectedCategory && !onlyDeals ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface-variant'"
            @click="setCategory(undefined)"
          >
            Všetko
          </button>
          <button
            v-for="category in categories"
            :key="category.slug"
            class="font-label-sm text-label-sm uppercase px-4 py-2 whitespace-nowrap rounded-default border"
            :class="selectedCategory === category.slug ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface-variant'"
            @click="setCategory(category.slug)"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- Desktop: sidebar -->
        <div class="hidden md:flex flex-col gap-stack-lg sticky top-28">
          <div>
            <h2 class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-stack-sm">Kategórie</h2>
            <ul class="flex flex-col gap-1">
              <li>
                <button
                  class="font-body-md text-body-md w-full text-left py-1.5 transition-colors"
                  :class="!selectedCategory ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-background'"
                  @click="setCategory(undefined)"
                >
                  Všetky produkty
                </button>
              </li>
              <li v-for="category in categories" :key="category.slug">
                <button
                  class="font-body-md text-body-md w-full text-left py-1.5 transition-colors"
                  :class="selectedCategory === category.slug ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-background'"
                  @click="setCategory(category.slug)"
                >
                  {{ category.name }}
                </button>
              </li>
            </ul>
          </div>
          <div v-if="onlyDeals">
            <button
              class="font-label-sm text-label-sm uppercase px-3 py-2 bg-secondary-container text-on-background flex items-center gap-2"
              @click="clearDeals"
            >
              <span class="material-symbols-outlined text-[16px]">close</span>
              Iba akcie
            </button>
          </div>
        </div>
      </aside>

      <!-- Product grid -->
      <div class="flex-grow">
        <div class="flex justify-between items-center mb-stack-md">
          <p class="font-technical-data text-technical-data text-on-surface-variant uppercase">{{ filtered.length }} produktov</p>
          <select
            v-model="sort"
            class="font-label-sm text-label-sm uppercase border border-outline-variant px-3 py-2 bg-surface-container-lowest rounded-default outline-none focus:ring-1 focus:ring-secondary-container focus:border-secondary-container"
          >
            <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>

        <div v-if="filtered.length" class="grid grid-cols-2 lg:grid-cols-3 gap-px bg-grid-line border border-grid-line">
          <ProductCard v-for="product in filtered" :key="product.id" :product="product" />
        </div>
        <div v-else class="py-stack-lg text-center text-on-surface-variant font-body-md">
          V tejto kategórii momentálne nie sú dostupné žiadne produkty.
        </div>
      </div>
    </div>
  </div>
</template>
