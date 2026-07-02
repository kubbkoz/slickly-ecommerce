<script setup lang="ts">
import {
    SlidersHorizontal, PackageSearch, Tag, Euro, Check, X, ChevronDown,
    RotateCcw, Search, Star, Loader2, ChevronUp, FolderOpen, ArrowRight
} from 'lucide-vue-next';
import AddToCartButton from '~/components/ui/AddToCartButton.vue';
import BaseStockStatus from '~/components/ui/BaseStockStatus.vue';
import { useAdvancedSearch, type SearchSortOrder } from '~/composables/useAdvancedSearch';
import { highlightText } from '~/utils/highlight';
import { getCategoryUrl, slugify } from '~/utils/url';
import { useProductHelpers } from '~/composables/useProductHelpers';
import { useSearchIntent } from '~/composables/useSearchIntent';
import { usePrice, useShopwareContext, useShopwareLanguage, useAsyncData, useNuxtApp, useRuntimeConfig, useState, onMounted, onUnmounted, watch, computed, ref, useRouter, useRoute, useHead, useSeoMeta, useI18n, useLocalePath } from '#imports';
import { onClickOutside, watchDebounced, useDebounceFn } from '@vueuse/core';

defineOptions({ name: 'SearchPage' });

const localePath    = useLocalePath();
const router        = useRouter();
const { getFormattedPrice } = usePrice();
const { getProductUrl, getProductImageUrl, getSecondaryImageUrl, getPrice, getOldPrice, calculateDiscount, handleImageError, navigateToProduct, getVariantLabel, getFormattedName, sortVariants } = useProductHelpers();

const {
    searchTerm, selectedBrands, selectedProperties,
    minPrice, maxPrice, sortBy, page,
    products, total, totalPages, loading,
    availableManufacturers, availablePriceRange, availablePropertyGroups,
    hasActiveFilters,
    toggleBrand, toggleProperty, setPriceRange, setSort, setPage, resetFilters,
    SEARCH_LIMIT, inStock, isPromo,
    loadMore, prefetchNextPage, isLoadingMore, isPrefetchRunning,
} = useAdvancedSearch();

const loadMoreSentinel = ref<HTMLElement | null>(null);
let scrollObserver: IntersectionObserver | null = null;

// ── Lifecycle & Watchers (Moved BEFORE await points) ────────────────────────
const isCategoryPage = useState('isPageCategory', () => false);

onMounted(() => { 
    isCategoryPage.value = true;
    
    // PRE-FETCH IntersectionObserver
    scrollObserver = new IntersectionObserver(
        (entries) => {
            if (entries[0]?.isIntersecting) {
                prefetchNextPage();
            }
        },
        { rootMargin: '0px 0px 300px 0px', threshold: 0 }
    );
    if (loadMoreSentinel.value) {
        scrollObserver.observe(loadMoreSentinel.value);
    }
});

onUnmounted(() => { 
    isCategoryPage.value = false;
    scrollObserver?.disconnect();
    scrollObserver = null;
});

// ── SEO & Canonical ──────────────────────────────────────────────────────────
const pageTitle = computed(() =>
    searchTerm.value
        ? `Výsledky hľadania: "${searchTerm.value}" | SLICKLY`
        : 'Vyhľadávanie | SLICKLY'
);

const metaDescription = computed(() =>
    searchTerm.value && total.value > 0
        ? `Nájdených ${total.value} produktov pre "${searchTerm.value}". Bicykle, helmy, komponenty a príslušenstvo na SLICKLY.`
        : 'Vyhľadajte bicykle, helmy, komponenty a cyklistické príslušenstvo na SLICKLY.'
);

const _siteUrl = (useRuntimeConfig().public.siteUrl as string) || 'https://mtsport.store';
useHead({
    title: pageTitle,
    link: computed(() => [
        {
            rel:  'canonical',
            href: searchTerm.value
                ? `${_siteUrl}/search?search=${encodeURIComponent(searchTerm.value)}`
                : `${_siteUrl}/search`,
        },
        ...(page.value > 1 ? [{ rel: 'prev', href: `${_siteUrl}/search?search=${encodeURIComponent(searchTerm.value)}` }] : []),
    ]),
});
useSeoMeta({ title: pageTitle, description: metaDescription, ogTitle: pageTitle, ogDescription: metaDescription });

// ── Brand Context Links ───────────────────────────────────────────────────────────────
const { locale } = useI18n();
const { apiClient } = useShopwareContext();
const { currentLanguageId } = useShopwareLanguage();
const runtimeConfig = useRuntimeConfig();

// null = not yet fetched | [] = fetched but empty | string[] = category IDs
const mfrCategoryIds = ref<string[] | null>(null);

// Normalize: lowercase + strip diacritics for comparison
const _norm = (s: string) =>
    s.toLowerCase().trim().normalize('NFD').replace(/\p{Mn}/gu, '');

// EXACT match only — "superior" → SUPERIOR ✔  "sup" → no match ✔
const matchedManufacturer = computed(() => {
    if (!searchTerm.value || !availableManufacturers.value?.length) return null;
    const term = _norm(searchTerm.value);
    return availableManufacturers.value.find(m => _norm(m.name) === term) ?? null;
});

// Slug pre dedikovanú brand stránku /znacka/{slug} (zhoduje sa s /api/manufacturers slugify)
const matchedBrandSlug = computed(() =>
    matchedManufacturer.value ? slugify(matchedManufacturer.value.name) : ''
);

// Watcher for brand categorization
watch(
    matchedManufacturer,
    async (mfr) => {
        if (import.meta.server) return; // client-only: no extra SSR request
        mfrCategoryIds.value = null;
        if (!mfr) return;
        try {
            const response = await apiClient.invoke('searchPage post /search' as any, {
                headers: { 'sw-language-id': currentLanguageId.value },
                body: {
                    search: mfr.name,
                    limit:  1,
                    filter: [{ type: 'equals', field: 'manufacturerId', value: mfr.id }],
                    aggregations: [
                        { name: 'cats', type: 'terms', field: 'categoryIds', limit: 500 }
                    ],
                    includes: { product: ['id'] },
                },
            }) as any;
            const buckets: any[] = response?.data?.aggregations?.cats?.buckets ?? [];
            mfrCategoryIds.value = buckets.map((b: any) => b.key as string);
        } catch (e) {
            console.error('[BrandContext] aggregation failed', e);
            mfrCategoryIds.value = [];
        }
    },
    { immediate: true }
);

// Top-level nav categories — unikátny kľúč, iný handler než useCategory.ts
const { data: navCategories } = await useAsyncData<any[]>(
    `search-nav-categories-${locale.value}`,
    async () => {
        const rootId = runtimeConfig.public.shopware.ids.rootCategory as string;
        const response = await apiClient.invoke('readCategoryList post /category', {
            headers: { 'sw-language-id': currentLanguageId.value },
            body: {
                limit: 30,
                filter: [
                    { type: 'equals', field: 'parentId', value: rootId },
                    { type: 'equals', field: 'active',   value: true  },
                    { type: 'equals', field: 'visible',  value: true  },
                ],
                associations: { seoUrls: {}, media: {} },
            },
        });
        return (response as any).data?.elements ?? [];
    },
    {
        lazy: true,
        getCachedData(key) {
            const nuxtApp = useNuxtApp();
            return nuxtApp.payload.data?.[key] ?? nuxtApp.static?.data?.[key];
        },
    }
);

// ── Category Search (matching categories by name) ─────────────────────────────
const { data: searchedCategoriesData, refresh: refreshSearchedCategories } = await useAsyncData<any[]>(
    'search-matched-categories',
    async () => {
        const term = searchTerm.value.trim();
        if (!term || term.length < 2) return [];
        try {
            const response = await apiClient.invoke('readCategoryList post /category', {
                headers: { 'sw-language-id': currentLanguageId.value },
                body: {
                    limit: 12,
                    filter: [
                        { type: 'contains', field: 'name', value: term },
                        { type: 'equals', field: 'active', value: true },
                        { type: 'equals', field: 'visible', value: true },
                    ],
                    sort: [{ field: 'level', order: 'ASC' }],
                    associations: { seoUrls: {}, media: {} },
                },
            });
            const items = ((response as any).data?.elements ?? []) as any[];
            // Exclude folders and root-only internal nodes
            return items.filter((c: any) => c.type !== 'folder' && c.type !== 'link');
        } catch {
            return [];
        }
    },
    { lazy: true }
);

const matchedCategories = computed(() => searchedCategoriesData.value ?? []);

// Refresh category results when search term changes
watch(searchTerm, useDebounceFn(() => {
    refreshSearchedCategories();
}, 350));

// Auto-redirect: if this page was reached with a query that resolves to a direct category match
const { resolve: resolveIntent } = useSearchIntent();
onMounted(() => {
    if (searchTerm.value && import.meta.client) {
        const intent = resolveIntent(searchTerm.value);
        if (intent.isRedirect) {
            router.replace(localePath(intent.path));
        }
    }
});

// Build links — only categories that actually contain manufacturer's products
const brandContextLinks = computed(() => {
    if (!matchedManufacturer.value || !navCategories.value?.length) return [];
    if (mfrCategoryIds.value === null) return []; // still loading
    if (mfrCategoryIds.value.length === 0) return [];

    const idsSet = new Set(mfrCategoryIds.value);
    const mfr = matchedManufacturer.value;

    return navCategories.value
        .filter((cat: any) => cat.active !== false && cat.visible !== false)
        .filter((cat: any) => idsSet.has(cat.id))
        .map((cat: any) => ({
            id:      cat.id,
            name:    cat.translated?.name || cat.name || '',
            image:   cat.media?.url || '',
            url:     { path: getCategoryUrl(cat), query: { brand: mfr.id } },
            mfrId:   mfr.id,
            mfrName: mfr.name,
        }));
});

// ── Offcanvas Filter ──────────────────────────────────────────────────────────
const isFilterOpen = ref(false);

// ── Sort Dropdown (mirrors StickyToolbar) ─────────────────────────────────────
const sortOptions: { value: SearchSortOrder; label: string }[] = [
    { value: 'score',      label: 'Relevancia'            },
    { value: 'price-asc',  label: 'Od najlacnejších'      },
    { value: 'price-desc', label: 'Od najdrahších'        },
    { value: 'name-asc',   label: 'Názov od A-Z'          },
    { value: 'name-desc',  label: 'Názov od Z-A'          },
];

const isSortOpen      = ref(false);
const sortDropdownRef = ref<HTMLElement | null>(null);
onClickOutside(sortDropdownRef, () => { isSortOpen.value = false; });

const activeSortLabel = computed(() =>
    sortOptions.find(o => o.value === sortBy.value)?.label || 'Relevancia'
);

const handleSortSelect = (val: SearchSortOrder) => {
    setSort(val);
    isSortOpen.value = false;
};

// ── Quick Chip filters (StickyToolbar style) ──────────────────────────────────
const inStockActiveRoute = inStock;
const isPromoActive      = isPromo;

const route = useRoute();
const toggleInStock = () => {
    const q = { ...route.query } as Record<string, any>;
    if (q.in_stock) delete q.in_stock; else { q.in_stock = '1'; delete q.page; }
    router.replace({ path: '/search', query: q });
};

const togglePromo = () => {
    const q = { ...route.query } as Record<string, any>;
    if (q.promo) delete q.promo; else { q.promo = '1'; delete q.page; }
    router.replace({ path: '/search', query: q });
};
const isUnderTo       = (max: number) => maxPrice.value === max && !minPrice.value;
const togglePriceChip = (max: number) => {
    if (isUnderTo(max)) setPriceRange(availablePriceRange.value.min, availablePriceRange.value.max);
    else setPriceRange(availablePriceRange.value.min, max);
};

// ── Price range local state (mirrors ProductFilters dual slider) ───────────────
const localMin = ref<number>(minPrice.value ?? 0);
const localMax = ref<number>(maxPrice.value ?? 10_000);

watch(availablePriceRange, (range) => {
    if (minPrice.value === undefined) localMin.value = range.min;
    if (maxPrice.value === undefined) localMax.value = range.max;
}, { immediate: true });
watch(minPrice, v => { if (v !== undefined) localMin.value = v; });
watch(maxPrice, v => { if (v !== undefined) localMax.value = v; });

watchDebounced([localMin, localMax], ([min, max]) => setPriceRange(min, max), { debounce: 400 });

const trackLeft  = computed(() => {
    const total = availablePriceRange.value.max - availablePriceRange.value.min;
    if (total <= 0) return 0;
    return ((localMin.value - availablePriceRange.value.min) / total) * 100;
});
const trackRight = computed(() => {
    const total = availablePriceRange.value.max - availablePriceRange.value.min;
    if (total <= 0) return 0;
    return 100 - (((localMax.value - availablePriceRange.value.min) / total) * 100);
});

const onMinSlider = (e: Event) => {
    const v = Number((e.target as HTMLInputElement).value);
    localMin.value = Math.min(v, localMax.value - 1);
};
const onMaxSlider = (e: Event) => {
    const v = Number((e.target as HTMLInputElement).value);
    localMax.value = Math.max(v, localMin.value + 1);
};

const formatPrice = (v: number) => v % 1 === 0 ? v.toString() : v.toFixed(2).replace('.', ',');

// ── Accordion sections for Offcanvas (mirrors ProductFilters openSections) ────
const openSections = ref<Record<string, boolean>>({
    price:      true,
    brands:     false,
    properties: false,
});

const toggleSection = (id: string) => {
    openSections.value[id] = !openSections.value[id];
};

// ── Brand search (mirrors ProductFilters brandSearch) ─────────────────────────
const brandSearch     = ref('');
const showAllBrands   = ref(false);
const filteredBrands  = computed(() =>
    availableManufacturers.value.filter(b =>
        b.name.toLowerCase().includes(brandSearch.value.toLowerCase())
    )
);
const displayedBrands = computed(() =>
    (brandSearch.value || showAllBrands.value) ? filteredBrands.value : filteredBrands.value.slice(0, 6)
);
const hasMoreBrands   = computed(() => !brandSearch.value && filteredBrands.value.length > 6 && !showAllBrands.value);

// ── Hover state for ProductCard expansion ─────────────────────────────────────
const hoveredProduct = ref<string | null>(null);

// ── Product Quantities (for simple products in search results) ────────────────
const productQuantities = ref<Record<string, number>>({});
const getQuantity = (productId: string) => productQuantities.value[productId] || 1;
const setQuantity = (productId: string, val: number) => {
    productQuantities.value[productId] = Math.max(1, val);
};
const incrementQty = (e: MouseEvent, productId: string) => {
    e.stopPropagation();
    setQuantity(productId, getQuantity(productId) + 1);
};
const decrementQty = (e: MouseEvent, productId: string) => {
    e.stopPropagation();
    setQuantity(productId, getQuantity(productId) - 1);
};

// ── Active filter count (for badge) ──────────────────────────────────────────
const activeFilterCount = computed(() => {
    let n = selectedBrands.value.length + selectedProperties.value.length;
    if (minPrice.value !== undefined || maxPrice.value !== undefined) n++;
    return n;
});

// Brand name resolver for active filter tags
const getBrandName = (id: string) =>
    availableManufacturers.value.find((b: any) => b.id === id)?.name || id;

// Property option name resolver for active filter tags
const getPropertyName = (id: string) => {
    for (const group of availablePropertyGroups.value) {
        const opt = group.options.find((o: any) => o.id === id);
        if (opt) return opt.name;
    }
    return id;
};
</script>

<template>
  <div class="bg-white min-h-screen animate-fade-in font-sans">

    <!-- Search Header (mirrors category header hero) -->
    <div class="relative bg-[#f4f5f6] overflow-hidden">
      <div class="absolute -right-20 -bottom-20 md:-right-32 md:-bottom-32 w-[300px] md:w-[600px] lg:w-[800px] aspect-square pointer-events-none z-0">
        <img src="~/assets/MTShape.svg" alt="" class="w-full h-full object-contain opacity-50" />
      </div>

      <div class="container mx-auto px-4 pt-6 md:pt-10 pb-8 md:pb-12 relative z-10 w-full">
        <!-- Breadcrumb -->
        <nav class="flex items-center text-xs md:text-sm text-gray-600 mb-6 gap-2">
          <NuxtLink :to="localePath('/')" class="hover:text-brand transition-colors flex items-center" aria-label="Domov">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </NuxtLink>
          <span class="text-gray-400">›</span>
          <span class="text-gray-800 font-medium">Vyhľadávanie</span>
          <template v-if="searchTerm">
            <span class="text-gray-400">›</span>
            <span class="text-gray-600 truncate max-w-[200px] md:max-w-sm">{{ searchTerm }}</span>
          </template>
        </nav>

        <!-- Title skeleton -->
        <template v-if="loading && !searchTerm">
          <div class="h-10 md:h-12 bg-gray-200 w-1/3 mb-4 animate-pulse"></div>
          <div class="h-4 bg-gray-200 w-2/3 mb-10 animate-pulse"></div>
        </template>
        <template v-else>
          <h1 class="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-2 font-tech uppercase italic">
            <template v-if="searchTerm">{{ searchTerm }}</template>
            <template v-else>Vyhľadávanie</template>
          </h1>
          <p v-if="searchTerm && !loading" class="text-sm text-gray-500 font-sans mb-4">
            <template v-if="total > 0">Nájdených {{ total }} produktov</template>
            <template v-else>Žiadne výsledky pre „{{ searchTerm }}"</template>
          </p>
        </template>

        <!-- Matched výrobca → dedikovaná brand stránka /znacka/{slug} -->
        <NuxtLink
          v-if="matchedManufacturer && matchedBrandSlug"
          :to="localePath('/znacka/' + matchedBrandSlug)"
          class="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-black text-white hover:bg-brand transition-colors font-tech text-xs md:text-sm font-bold uppercase tracking-widest"
        >
          Zobraziť značku {{ matchedManufacturer.name }}
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>

        <!-- Brand context subcategory links (mirrors subcategories grid) -->
        <div v-if="brandContextLinks.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1.5 md:gap-2 pb-6 px-4 md:px-0">
          <NuxtLink
            v-for="link in brandContextLinks"
            :key="link.id"
            :to="link.url"
            class="group border border-gray-100 hover:border-brand bg-white transition-colors duration-150 active:bg-gray-50
                   flex items-center gap-2.5 px-2.5 py-2
                   md:flex-col md:items-center md:gap-1.5 md:px-2 md:py-2.5"
          >
            <!-- Mobile: 40×40 | Desktop: full-width 4:3 -->
            <div class="w-10 h-10 flex-shrink-0 overflow-hidden flex items-center justify-center
                        md:w-full md:h-auto md:aspect-[4/3] md:flex-shrink md:mb-0.5">
              <img v-if="link.image" :src="link.image" alt="" loading="lazy"
                   class="w-full h-full object-contain mix-blend-multiply" />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-50">
                <span class="text-[8px] font-bold uppercase text-gray-300">N/A</span>
              </div>
            </div>
            <span class="font-bold text-xs md:text-[12px] text-gray-900 leading-tight group-hover:text-brand transition-colors line-clamp-2 text-left md:text-center font-tech uppercase tracking-wide">
              {{ link.name }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Sticky Toolbar -->
    <StickyToolbar
      :aggregations="null"
      @toggleFilter="isFilterOpen = true"
    />

    <!-- Offcanvas Filter Panel -->
    <OffcanvasFilter
      :is-open="isFilterOpen"
      :category-name="searchTerm || 'Výsledky hľadania'"
      :aggregations="null"
      :brands="availableManufacturers"
      :sizes="[]"
      :genders="[]"
      :colors="[]"
      :wheel-sizes="[]"
      :min-price="availablePriceRange.min"
      :max-price="availablePriceRange.max"
      @close="isFilterOpen = false"
    />

    <!-- Main Content -->
    <div class="container mx-auto px-0 md:px-4 py-4 md:py-8">
      <main>

        <!-- Active Filter Tags -->
        <ClientOnly>
          <div v-if="loading" class="mb-6 flex flex-wrap items-center gap-2 px-4 md:px-0">
            <div class="h-6 w-24 bg-gray-200 animate-pulse"></div>
            <div class="h-8 w-32 bg-gray-100 animate-pulse"></div>
          </div>
          <div v-else-if="activeFilterCount > 0" class="mb-6 flex flex-wrap items-center gap-2 px-4 md:px-0">
            <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans">Aktívne filtre:</span>
            <button
              v-for="brandId in selectedBrands"
              :key="`brand-${brandId}`"
              class="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-gray-200"
              @click="toggleBrand(brandId)"
            >
              <span>{{ getBrandName(brandId) }}</span>
              <X class="w-2.5 h-2.5" />
            </button>
            <button
              v-for="propId in selectedProperties"
              :key="`prop-${propId}`"
              class="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-gray-200"
              @click="toggleProperty(propId)"
            >
              <span>{{ getPropertyName(propId) }}</span>
              <X class="w-2.5 h-2.5" />
            </button>
            <button
              v-if="inStockActiveRoute"
              class="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-gray-200"
              @click="toggleInStock"
            >
              <span>Skladom</span><X class="w-2.5 h-2.5" />
            </button>
            <button
              v-if="isPromoActive"
              class="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-gray-200"
              @click="togglePromo"
            >
              <span>V akcii</span><X class="w-2.5 h-2.5" />
            </button>
            <button
              v-if="minPrice !== undefined || maxPrice !== undefined"
              class="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-gray-200"
              @click="setPriceRange(availablePriceRange.min, availablePriceRange.max)"
            >
              <span>Cena: {{ (minPrice ?? availablePriceRange.min).toFixed(2) }}€ – {{ (maxPrice ?? availablePriceRange.max).toFixed(2) }}€</span>
              <X class="w-2.5 h-2.5" />
            </button>
          </div>
        </ClientOnly>

        <!-- ── Category Results ──────────────────────────────────────────────── -->
        <ClientOnly>
          <div v-if="matchedCategories.length > 0" class="mb-8 px-4 md:px-0">
            <div class="flex items-center gap-3 mb-4">
              <FolderOpen class="w-4 h-4 text-brand flex-shrink-0" />
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] font-sans">Kategórie</span>
              <div class="flex-1 h-px bg-gray-100"></div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              <NuxtLink
                v-for="cat in matchedCategories"
                :key="cat.id"
                :to="localePath(getCategoryUrl(cat))"
                class="group border border-gray-100 hover:border-brand bg-white overflow-hidden transition-colors duration-150 cursor-pointer"
              >
                <!-- Category image -->
                <div class="aspect-[4/3] overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                    v-if="cat.media?.url"
                    :src="cat.media.url"
                    :alt="cat.translated?.name || cat.name"
                    loading="lazy"
                    class="w-full h-full object-contain mix-blend-multiply p-3 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div v-else class="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-200">
                    <FolderOpen class="w-10 h-10" />
                  </div>
                </div>
                <!-- Category name -->
                <div class="px-3 py-2.5 border-t border-gray-100 group-hover:border-brand transition-colors">
                  <p class="font-tech text-[11px] md:text-xs uppercase font-bold text-gray-900 group-hover:text-brand transition-colors line-clamp-2 leading-tight">
                    {{ cat.translated?.name || cat.name }}
                  </p>
                  <p class="text-[9px] md:text-[10px] text-gray-400 mt-0.5 font-sans">Zobraziť kategóriu →</p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </ClientOnly>

        <!-- ── Product Results ─────────────────────────────────────────────── -->

        <!-- Skeleton -->
        <div v-if="loading && products.length === 0"
          class="grid grid-cols-2 md:grid-cols-3 gap-x-1 gap-y-8 md:gap-4 bg-white md:bg-transparent"
          :class="matchedCategories.length ? 'lg:grid-cols-3' : 'lg:grid-cols-4'">
          <div v-for="i in 8" :key="`skeleton-${i}`" class="group bg-white overflow-hidden flex flex-col relative md:border md:border-gray-100 p-2 md:p-4">
            <div class="relative w-full aspect-square bg-gray-100 animate-pulse mb-4"></div>
            <div class="h-4 bg-gray-200 animate-pulse w-1/4 mb-2"></div>
            <div class="h-3 bg-gray-200 animate-pulse w-3/4 mb-1"></div>
            <div class="h-3 bg-gray-200 animate-pulse w-1/2"></div>
            <div class="mt-auto pt-4 flex items-end"><div class="h-4 bg-gray-200 animate-pulse w-16"></div></div>
          </div>
        </div>

        <!-- Empty state (no search term) -->
        <div v-else-if="!searchTerm" class="text-center py-32 bg-gray-50">
          <p class="text-2xl font-bold text-gray-400 font-tech uppercase mb-2">Začnite písať</p>
          <p class="text-gray-500 mb-8 font-sans">Zadajte hľadaný výraz do vyhľadávacieho poľa.</p>
        </div>

        <!-- Zero results -->
        <div v-else-if="!loading && total === 0 && searchTerm" class="text-center py-32 bg-gray-50">
          <p class="text-2xl font-bold text-gray-400 font-tech uppercase mb-2">Nenašli sa žiadne produkty</p>
          <p class="text-gray-500 mb-8 font-sans">Skúste zmeniť hľadaný výraz alebo zrušiť filtre.</p>
          <button
            v-if="hasActiveFilters"
            class="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors font-sans"
            @click="resetFilters"
          >
            <RotateCcw class="w-4 h-4" />
            Zrušiť všetky filtre
          </button>
        </div>

        <!-- Products -->
        <div v-if="products.length > 0"
          class="grid grid-cols-2 md:grid-cols-3 gap-x-1 gap-y-8 md:gap-4 bg-white md:bg-transparent transition-opacity duration-300"
          :class="[{ 'opacity-50 pointer-events-none': loading }, matchedCategories.length ? 'lg:grid-cols-3' : 'lg:grid-cols-4']">
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>

        <!-- Load more skeletons -->
        <div
          v-if="isLoadingMore"
          class="grid grid-cols-2 md:grid-cols-3 gap-x-1 gap-y-8 md:gap-4 bg-white md:bg-transparent mt-1"
          :class="matchedCategories.length ? 'lg:grid-cols-3' : 'lg:grid-cols-4'"
          aria-label="Načítavam ďalšie produkty"
        >
          <div v-for="i in 8" :key="`loadmore-skeleton-${i}`" class="bg-white border border-gray-100 flex flex-col">
            <div class="relative w-full aspect-square bg-gray-100 animate-pulse"></div>
            <div class="p-2 md:p-4 flex flex-col gap-2">
              <div class="h-3 bg-gray-100 animate-pulse w-1/3"></div>
              <div class="h-3 bg-gray-200 animate-pulse w-full"></div>
              <div class="h-3 bg-gray-200 animate-pulse w-3/4"></div>
              <div class="mt-2 h-5 bg-gray-200 animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Prefetch sentinel -->
        <div
          v-if="products.length < total && !isLoadingMore"
          ref="loadMoreSentinel"
          class="h-1 w-full mt-4"
          aria-hidden="true"
        ></div>

        <!-- Load more button -->
        <div v-if="products.length < total && !isLoadingMore" class="mt-8 md:mt-12 text-center pb-8">
          <p class="text-gray-400 text-[10px] md:text-xs mb-4 font-bold uppercase tracking-widest font-sans">
            Zobrazených {{ products.length }} z {{ total }} produktov
          </p>
          <div class="w-48 md:w-64 h-1 bg-gray-100 mx-auto mb-6 md:mb-8 overflow-hidden">
            <div class="h-full bg-brand transition-all duration-700" :style="{ width: `${(products.length / total) * 100}%` }"></div>
          </div>
          <button
            :disabled="isLoadingMore"
            class="relative bg-black text-white hover:bg-gray-800 px-6 py-3 md:px-10 md:py-4 uppercase tracking-widest text-xs md:text-sm font-bold min-w-[200px] md:min-w-[240px] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Načítať viac produktov"
            @click="loadMore"
          >
            <span class="flex items-center justify-center gap-2">
              <span v-if="isPrefetchRunning" class="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" title="Produkty sa načítavajú na pozadí"></span>
              Načítať ďalšie produkty
            </span>
          </button>
        </div>

      </main>
    </div>
  </div>
</template>
