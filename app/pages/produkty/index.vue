<script setup lang="ts">
import { products, categories, matchesSearchQuery } from '~/data/products'

const route = useRoute()
const router = useRouter()

const selectedCategory = computed(() => (route.query.kategoria as string) || '')
const onlyDeals = computed(() => route.query.akcia === '1')
const searchQuery = computed(() => (route.query.q as string) || '')

const site = useSiteUrl()
const activeCategory = computed(() => categories.find((c) => c.slug === selectedCategory.value))

// Reactive SEO — title/description/canonical follow the active filter so each
// view is distinct in search and social previews. Search-result views are
// noindex (infinite, low-value URLs); category views self-canonicalize so
// they can rank; the deals facet consolidates to the base listing.
const seoTitle = computed(() => {
  if (searchQuery.value) return `Vyhľadávanie „${searchQuery.value}“ | SLICKLY`
  if (onlyDeals.value) return 'Akciová ponuka | Zľavnená autokozmetika | SLICKLY'
  if (activeCategory.value) return `${activeCategory.value.name} | Autokozmetika | SLICKLY`
  return 'Obchod | Všetky produkty autokozmetiky | SLICKLY'
})

const seoDescription = computed(() => {
  if (searchQuery.value)
    return `Výsledky vyhľadávania pre „${searchQuery.value}“ v e-shope SLICKLY.`
  if (onlyDeals.value)
    return 'Aktuálne zľavy na keramickú ochranu, detailing a starostlivosť o vozidlo. Obmedzené množstvo.'
  if (activeCategory.value) return activeCategory.value.description
  return 'Kompletný sortiment keramickej ochrany, detailingu a starostlivosti o vozidlo.'
})

const canonicalUrl = computed(() => {
  if (selectedCategory.value) return `${site}/produkty?kategoria=${selectedCategory.value}`
  return `${site}/produkty`
})

const isNoindex = computed(() => !!searchQuery.value)

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  ogSiteName: 'SLICKLY',
  ogLocale: 'sk_SK',
  twitterCard: 'summary_large_image',
  robots: () => (isNoindex.value ? 'noindex, follow' : 'index, follow'),
})

useHead({
  link: [{ rel: 'canonical', href: () => canonicalUrl.value }],
})

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
    list = list.filter((p) => !!p.oldPrice && p.oldPrice > p.price)
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

const activeCategoryName = computed(() => activeCategory.value?.name)

// BreadcrumbList + ItemList structured data, reactive to the active filter.
const structuredData = computed(() => {
  const crumbs: { name: string; item: string }[] = [
    { name: 'Domov', item: `${site}/` },
    { name: 'Obchod', item: `${site}/produkty` },
  ]
  if (activeCategory.value) {
    crumbs.push({
      name: activeCategory.value.name,
      item: `${site}/produkty?kategoria=${activeCategory.value.slug}`,
    })
  }

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: c.item,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: seoTitle.value,
      numberOfItems: filtered.value.length,
      itemListElement: filtered.value.slice(0, 30).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${site}/produkty/${p.slug}`,
        name: p.name,
      })),
    },
  ]
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify(structuredData.value),
    },
  ],
})

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
            v-if="onlyDeals"
            type="button"
            aria-label="Zrušiť filter Iba akcie"
            class="font-label-sm text-label-sm uppercase px-4 py-2 whitespace-nowrap rounded-default border border-secondary-container bg-secondary-container text-on-background flex items-center gap-2 cursor-pointer transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            @click="clearDeals"
          >
            <span class="material-symbols-outlined text-[16px]" aria-hidden="true">close</span>
            Iba akcie
          </button>
          <button
            type="button"
            :aria-pressed="!selectedCategory && !onlyDeals"
            class="font-label-sm text-label-sm uppercase px-4 py-2 whitespace-nowrap rounded-default border cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :class="!selectedCategory && !onlyDeals ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface-variant'"
            @click="setCategory(undefined)"
          >
            Všetko
          </button>
          <button
            v-for="category in categories"
            :key="category.slug"
            type="button"
            :aria-pressed="selectedCategory === category.slug"
            class="font-label-sm text-label-sm uppercase px-4 py-2 whitespace-nowrap rounded-default border cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
                  type="button"
                  :aria-pressed="!selectedCategory"
                  class="font-body-md text-body-md w-full text-left py-1.5 cursor-pointer transition-colors duration-200 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  :class="!selectedCategory ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-background'"
                  @click="setCategory(undefined)"
                >
                  Všetky produkty
                </button>
              </li>
              <li v-for="category in categories" :key="category.slug">
                <button
                  type="button"
                  :aria-pressed="selectedCategory === category.slug"
                  class="font-body-md text-body-md w-full text-left py-1.5 cursor-pointer transition-colors duration-200 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
              type="button"
              aria-label="Zrušiť filter Iba akcie"
              class="font-label-sm text-label-sm uppercase px-3 py-2 bg-secondary-container text-on-background flex items-center gap-2 cursor-pointer transition-opacity duration-200 hover:opacity-90 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              @click="clearDeals"
            >
              <span class="material-symbols-outlined text-[16px]" aria-hidden="true">close</span>
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
            aria-label="Zoradiť produkty"
            class="font-label-sm text-label-sm uppercase border border-outline-variant px-3 py-2 bg-surface-container-lowest rounded-default outline-none cursor-pointer transition-colors duration-200 focus:ring-1 focus:ring-secondary-container focus:border-secondary-container"
          >
            <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>

        <div v-if="filtered.length" class="grid grid-cols-2 lg:grid-cols-3 gap-px bg-grid-line border border-grid-line">
          <ProductCard v-for="product in filtered" :key="product.id" :product="product" />
        </div>
        <div v-else class="flex flex-col items-center text-center gap-stack-md py-stack-lg md:py-section-padding">
          <span class="material-symbols-outlined text-[48px] text-on-surface-variant opacity-30" aria-hidden="true">{{ searchQuery ? 'search_off' : 'inventory_2' }}</span>
          <p class="font-body-md text-body-md text-on-surface-variant max-w-sm">
            {{ searchQuery ? `Nenašli sme žiadne produkty pre „${searchQuery}".` : 'V tejto kategórii momentálne nie sú dostupné žiadne produkty.' }}
          </p>
          <button
            type="button"
            class="font-label-sm text-label-sm uppercase tracking-widest px-6 h-10 border border-outline-variant rounded-default text-on-surface-variant hover:border-primary hover:text-on-background transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            @click="setCategory(undefined)"
          >
            Zobraziť všetky produkty
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
