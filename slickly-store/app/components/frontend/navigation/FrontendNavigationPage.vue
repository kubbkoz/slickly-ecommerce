<script setup lang="ts">
import { Home, X } from 'lucide-vue-next';
import { sanitizeHtml } from '~/utils/sanitize';
import StickyToolbar from '../../category/StickyToolbar.vue';
import OffcanvasFilter from '../../category/OffcanvasFilter.vue';
import QuickViewModal from '../../ui/QuickViewModal.vue';
import ProductCard from '../product/ProductCard.vue';

defineOptions({ name: 'FrontendNavigationPage' });

const props = defineProps<{ navigationId: string }>();

const localePath = useLocalePath();
const route   = useRoute();
const router  = useRouter();

// --- UI State ---
const viewMode = ref<'grid' | 'list'>('grid');
const isFilterOpen = ref(false);
const selectedProduct = ref<any>(null);

// --- Mobile grid columns (1 or 2) ---
const runtimeConfig = useRuntimeConfig();
const _bikeCatIds = [
  runtimeConfig.public.shopware?.ids?.categories?.bikes,
  runtimeConfig.public.shopware?.ids?.categories?.ebikes,
].filter(Boolean) as string[];

const mobileColumns = useState<1|2>('categoryMobileColumns', () =>
  _bikeCatIds.includes(props.navigationId) ? 1 : 2
);

const _mobileColsKey = computed(() => `mtsport_grid_cols_${props.navigationId}`);

watch(mobileColumns, (val) => {
  if (import.meta.client) localStorage.setItem(_mobileColsKey.value, String(val));
});
// Scroll sentinel ref pre IntersectionObserver auto-loadMore
const loadMoreSentinel = ref<HTMLElement | null>(null);
let scrollObserver: IntersectionObserver | null = null;


// --- Navbar behaviour ---
const isCategoryPage = useState('isPageCategory', () => false);
const categoryPageCount = useState('categoryPageCount', () => 0);
isCategoryPage.value = true;
onMounted(() => {
    categoryPageCount.value++;
    isCategoryPage.value = true;

    // Restore grid column preference (localStorage → default per category)
    const savedCols = localStorage.getItem(_mobileColsKey.value);
    if (savedCols === '1' || savedCols === '2') {
        mobileColumns.value = parseInt(savedCols) as 1|2;
    } else {
        mobileColumns.value = _bikeCatIds.includes(props.navigationId) ? 1 : 2;
    }

    // ── Brand pre-filter: prichádza z brand context linku v /search ─────────
    const brandParam = Array.isArray(route.query.brand)
        ? (route.query.brand[0] as string)
        : (route.query.brand as string | undefined);
    if (brandParam) {
        clearAllFilters();
        nextTick(() => { selectedBrands.value = [brandParam]; });
        const q = { ...route.query };
        delete (q as any).brand;
        router.replace({ query: q });
    } else {
        // Restore core filters from URL params
        const q = route.query;
        if (q.brands) selectedBrands.value = String(q.brands).split(',').filter(Boolean);
        if (q.instock === '1') inStockOnly.value = true;
        if (q.promo === '1') isPromotion.value = true;
        if (q.height) riderHeight.value = parseInt(String(q.height)) || null;
        if (q.sort) sortBy.value = String(q.sort);
        if (q.price) {
            const parts = String(q.price).split(',');
            if (parts.length === 2) priceRange.value = [parseInt(parts[0]) || 0, parseInt(parts[1]) || 10000];
        }
    }

    // PRE-FETCH IntersectionObserver
    // Sleduje sentinel 300px NAD buttonom — spustí tichý background fetch.
    // Užívateľ NEVIDí žiadnu zmenu UI, ale po kliknutí na button sú dováta okamžite dostupné.
    scrollObserver = new IntersectionObserver(
        (entries) => {
            if (entries[0]?.isIntersecting) {
                prefetchNextPage();
            }
        },
        // rootMargin: '0px 0px 200px 0px' = sentinel je detekovaný 200px pred vstupom do viewportu
        // (200px namiesto 300px: redukuje race condition pri slow 4G — prefetch dokončí dostatočne včas
        //  pre seamless UX, ale neskôr ako predtým aby neflickoval button state)
        { rootMargin: '0px 0px 200px 0px', threshold: 0 }
    );
    if (loadMoreSentinel.value) {
        scrollObserver.observe(loadMoreSentinel.value);
    }
});
onUnmounted(() => {
    categoryPageCount.value--;
    if (categoryPageCount.value <= 0) { isCategoryPage.value = false; categoryPageCount.value = 0; }
    scrollObserver?.disconnect();
    scrollObserver = null;
});


// --- Category data (navigation, breadcrumbs, subcategories) ---
const {
    parentCategory,
    categoryStatus,
    categoryName,
    categoryDescription,
    categoryImage,
    categoryLevel,
    categoryMetaTitle,
    categoryMetaDescription,
    categoryKeywords,
    breadcrumbChain,
    currentCategoryUrl,
    subcategories,
    parentCategoryUrl,
    activeSubcategory,
} = useCategory(props.navigationId);

// useCategoryBreadcrumbJsonLD sa volá AŽ po useCategoryListing (nižšie) — products TDZ fix

// --- Dynamic SEO from Shopware category settings ---
useSeoMeta({
    title:           () => categoryMetaTitle.value || `${categoryName.value} | SLICKLY`,
    description:     () => categoryMetaDescription.value || categoryDescription.value || undefined,
    keywords:        () => categoryKeywords.value || undefined,
    ogTitle:         () => categoryMetaTitle.value || `${categoryName.value} | SLICKLY`,
    ogDescription:   () => categoryMetaDescription.value || categoryDescription.value || undefined,
    ogImage:         () => categoryImage.value || undefined,
});


// --- Filter state ---
const {
    selectedBrands,
    selectedProperties,
    selectedSizes,
    selectedGenders,
    selectedColors,
    selectedWheelSizes,
    selectedGeneralProperties,
    priceRange,
    inStockOnly,
    onDemandOnly,
    isPromotion,
    isFeatured,
    searchQuery,
    sortBy,
    riderHeight,
    selectedWheelsNorm,
    selectedForkNorm,
    selectedBrakesNorm,
    selectedGearsNorm,
    selectedMotorNorm,
    selectedBatteryNorm,
    activeFilterCount,
    clearAllFilters,
    handleBrandToggle,
    handleSizeToggle,
    handleGenderToggle,
    handleColorToggle,
    handleWheelSizeToggle,
    handlePropertyToggle,
    handleArrayToggle,
    toggleWheelsNorm,
    toggleForkNorm,
    toggleBrakesNorm,
    toggleGearsNorm,
    toggleMotorNorm,
    toggleBatteryNorm,
    toggleColorNorm,
} = useCategoryFilters();

// Filtrované stránky: noindex — musí byť za useCategoryFilters() kvôli TDZ
useSeoMeta({ robots: () => activeFilterCount.value > 0 ? 'noindex,follow' : 'index,follow' });

// --- URL persistence for core filters (client-only) ---
if (import.meta.client) {
    const toUrlQuery = (): Record<string, string> => {
        const q: Record<string, string> = {};
        if (selectedBrands.value.length) q.brands = selectedBrands.value.join(',');
        if (inStockOnly.value) q.instock = '1';
        if (isPromotion.value) q.promo = '1';
        if (riderHeight.value) q.height = String(riderHeight.value);
        if (sortBy.value && sortBy.value !== 'name-asc') q.sort = sortBy.value;
        if (priceRange.value[0] > 0 || priceRange.value[1] < 10000) {
            q.price = `${Math.round(priceRange.value[0])},${Math.round(priceRange.value[1])}`;
        }
        return q;
    };

    let urlSyncTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleSync = () => {
        if (urlSyncTimer) clearTimeout(urlSyncTimer);
        urlSyncTimer = setTimeout(() => {
            const q = toUrlQuery();
            const qs = new URLSearchParams(q).toString();
            const newUrl = window.location.pathname + (qs ? `?${qs}` : '');
            if (window.location.href !== window.location.origin + newUrl) {
                history.replaceState(history.state, '', newUrl);
            }
        }, 400);
    };
    // Shallow watcher pre primitive + ref-type changes (žiadny deep — bols 60fps fire pri price drag)
    watch([selectedBrands, inStockOnly, isPromotion, riderHeight, sortBy], scheduleSync);
    // Dedicated watcher pre priceRange — len pri actual value change (not pixel-by-pixel)
    watch(
        () => `${priceRange.value[0]},${priceRange.value[1]}`,
        scheduleSync,
    );
    onUnmounted(() => {
        if (urlSyncTimer) clearTimeout(urlSyncTimer);
    });
}

// --- Product listing (SWR, pagination, prefetch) ---
const {
    listingData,
    listingStatus,
    products,
    total,
    loadMore,
    prefetchNextPage,
    isLoadingMore,
    isPrefetchRunning,
    prefetchSubcategory,
    availableBrands,
    availableSizes,
    availableColors,
    availableGenders,
    availableWheelSizes,
    categoryMinPrice,
    categoryMaxPrice,
    availableWheelsNorm,
    availableForkNorm,
    availableBrakesNorm,
    availableGearsNorm,
    availableMotorNorm,
    availableBatteryNorm,
    availableColorsNorm,
} = useCategoryListing(props.navigationId, {
    sortBy,
    selectedBrands,
    selectedProperties,
    selectedColors,
    priceRange,
    inStockOnly,
    onDemandOnly,
    isPromotion,
    isFeatured,
    searchQuery,
    riderHeight,
    selectedWheelsNorm,
    selectedForkNorm,
    selectedBrakesNorm,
    selectedGearsNorm,
    selectedMotorNorm,
    selectedBatteryNorm,
});

// --- Schema.org BreadcrumbList + CollectionPage ---
// POZOR: musí byť AŽ TU — products je dostupný až po useCategoryListing (TDZ fix)
useCategoryBreadcrumbJsonLD(
    breadcrumbChain,
    categoryName,
    currentCategoryUrl,
    computed(() =>
        categoryName.value
            ? {
                  description: categoryDescription.value || undefined,
                  products: (products.value || []).slice(0, 20).map((p: any) => ({
                      id: p.id,
                      name: p.translated?.name || p.name || '',
                      url: p.seoUrls?.[0]?.seoPathInfo
                          ? `/${p.seoUrls[0].seoPathInfo}`
                          : `/detail/${p.id}`,
                      image: p.cover?.media?.url || '',
                      price: p.calculatedPrice?.unitPrice,
                  })),
              }
            : undefined
    ),
);

// --- Product display helpers ---
const {
    handleImageError,
    getProductImageUrl,
    getSecondaryImageUrl,
    calculateDiscount,
    getPrice,
    getOldPrice,
    navigateToProduct,
    getVariantLabel,
    sortVariants,
} = useProductHelpers();

// import.meta.client nie je povolené v template — použij ref
const isClient = ref(false);
onMounted(() => { isClient.value = true; });

// --- Brand Name Resolver ---
const getBrandName = (id: string) => {
    const brand = availableBrands.value.find((b: any) => b.id === id);
    return brand ? brand.name : id;
};

// --- Property Name Resolver ---
const getNormName = (id: string, normArray: {id: string, name: string}[]) => {
    if (!normArray) return id;
    const item = normArray.find(n => n.id === id);
    return item ? item.name : id;
};

// ── Pre-filter cez intent (brand name string v URL "searchBrand=...") ─────────
watch(availableBrands, (brands) => {
    const searchBrandParam = Array.isArray(route.query.searchBrand)
        ? (route.query.searchBrand[0] as string)
        : (route.query.searchBrand as string | undefined);

    if (searchBrandParam && brands && brands.length > 0) {
        const queryName = searchBrandParam.toLowerCase();
        const foundBrand = brands.find((b: any) => 
            b.name?.toLowerCase() === queryName || b.name?.toLowerCase().includes(queryName)
        );
        if (foundBrand) {
            clearAllFilters();
            nextTick(() => { 
                selectedBrands.value = [foundBrand.id]; 
            });
            // Remove parameter from URL so it doesn't trigger again on refresh
            const q = { ...route.query };
            delete (q as any).searchBrand;
            router.replace({ query: q });
        }
    }
}, { immediate: true });

</script>

<template>
  <div class="bg-white min-h-screen animate-fade-in font-sans">

    <!-- Category Header (Redesigned Hero v2) -->
    <div class="relative bg-[#f4f5f6] overflow-hidden overflow-x-clip">
        <!-- Background Image (MTShape) -->
        <div class="absolute -right-20 -bottom-20 md:-right-32 md:-bottom-32 lg:-right-40 w-[300px] md:w-[600px] lg:w-[800px] aspect-square pointer-events-none z-0 overflow-hidden">
            <img 
                src="~/assets/MTShape.svg" 
                alt="Background Shape"
                class="w-full h-full object-contain opacity-50"
            />
        </div>

        <div class="container mx-auto px-4 pt-6 md:pt-10 pb-8 md:pb-12 relative z-10 w-full">
            <!-- Breadcrumbs — plná hierarchia: 🏠 › Bicykle › Horské bicykle › Pánske -->
            <nav class="flex items-center text-xs md:text-sm text-gray-600 mb-6 gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
                <template v-if="categoryStatus !== 'pending'">
                    <NuxtLink :to="localePath('/')" class="hover:text-brand transition-colors flex items-center" aria-label="Domov">
                        <Home class="w-4 h-4" />
                    </NuxtLink>

                    <!-- Plná cesta predkov (Bicykle › Horské bicykle › ...) -->
                    <template v-for="crumb in breadcrumbChain" :key="crumb.id">
                        <span class="text-gray-400">›</span>
                        <NuxtLink :to="localePath(crumb.url)" class="hover:text-brand transition-colors truncate max-w-[100px] md:max-w-xs">
                            {{ crumb.name }}
                        </NuxtLink>
                    </template>

                    <!-- Aktuálna kategória (neklikateľná) -->
                    <span class="text-gray-400">›</span>
                    <span class="text-gray-800 font-medium truncate max-w-[150px] md:max-w-sm">{{ categoryName }}</span>
                </template>
                <template v-else>
                    <div class="h-4 bg-gray-200 animate-pulse w-48 rounded"></div>
                </template>
            </nav>

            <!-- Skeleton / Title -->
            <template v-if="categoryStatus === 'pending'">
                <div class="h-10 md:h-12 bg-gray-200 w-1/3 mb-4 rounded"></div>
                <div class="h-4 bg-gray-200 w-2/3 mb-10 rounded"></div>
            </template>
            <template v-else>
                <h1 class="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 font-tech uppercase italic">
                    {{ categoryName || 'Načítavam...' }}
                </h1>
                <div v-if="categoryDescription" class="text-sm md:text-base text-gray-700 max-w-4xl mb-10 leading-relaxed font-sans" v-html="sanitizeHtml(categoryDescription)"></div>
            </template>

            <!-- Subcategories Grid — vertical cards with a 3:4 image (matching the
                 product-image format) and 3px (rounded-sm) corners. -->
            <div v-if="subcategories && subcategories.length > 0"
                 class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 pb-6">
                <NuxtLink
                    v-for="(sub, subIdx) in subcategories"
                    :key="sub.id"
                    :to="localePath(sub.url)"
                    @mouseenter="prefetchSubcategory(sub.id)"
                    class="group flex flex-col border border-gray-100 hover:border-brand bg-white rounded-sm overflow-hidden transition-colors duration-150 active:bg-gray-50"
                >
                    <!-- 3:4 image area — same treatment as ProductCard -->
                    <div class="relative w-full aspect-[3/4] overflow-hidden bg-gray-50">
                        <NuxtImg
                            v-if="sub.image"
                            :src="sub.image"
                            :alt="sub.name || ''"
                            width="300"
                            height="400"
                            sizes="50vw md:33vw lg:25vw"
                            class="w-full h-full object-contain p-4 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                            :loading="subIdx < 4 ? 'eager' : 'lazy'"
                            :fetchpriority="subIdx === 0 ? 'high' : 'auto'"
                            decoding="async"
                        />
                        <!-- Branded monogram fallback for categories without an image -->
                        <div v-else class="absolute inset-0 flex items-center justify-center select-none">
                            <span class="font-tech font-black italic uppercase leading-none text-gray-200 text-6xl md:text-7xl transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                                {{ (sub.name || '?').trim().charAt(0) }}
                            </span>
                        </div>
                    </div>
                    <!-- Name -->
                    <div class="px-2.5 py-2.5 md:px-3 md:py-3">
                        <span class="block text-center font-bold text-[11px] md:text-xs text-gray-900 leading-tight group-hover:text-brand transition-colors line-clamp-2 font-tech uppercase tracking-wide">
                            {{ sub.name }}
                        </span>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>

    <!-- Sticky Subcategory Toolbar -->
    <StickyToolbar
        :aggregations="(listingData?.data?.aggregations || listingData?.aggregations) ?? null"
        :total="total"
        @toggleFilter="isFilterOpen = true"
    />

    <!-- Offcanvas Filter Panel -->
    <OffcanvasFilter
        :is-open="isFilterOpen"
        :navigation-id="navigationId"
        :category-name="categoryName"
        :aggregations="(listingData?.data?.aggregations || listingData?.aggregations) ?? null"
        :brands="availableBrands"
        :sizes="availableSizes"
        :genders="availableGenders"
        :colors="availableColors"
        :wheel-sizes="availableWheelSizes"
        :wheels-norm="availableWheelsNorm"
        :fork-norm="availableForkNorm"
        :brakes-norm="availableBrakesNorm"
        :gears-norm="availableGearsNorm"
        :motor-norm="availableMotorNorm"
        :battery-norm="availableBatteryNorm"
        :colors-norm="availableColorsNorm"
        :min-price="categoryMinPrice"
        :max-price="categoryMaxPrice"
        @close="isFilterOpen = false"
    />

    <!-- Main Content Area -->
    <div class="container mx-auto px-0 md:px-4 py-4 md:py-8">

        <!-- Product Grid -->
        <main>
            <!-- Active Filter Tags -->
            <ClientOnly>
              <div v-if="listingStatus === 'pending'" class="mb-6 flex flex-wrap items-center gap-2 px-4 md:px-0">
                <div class="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                <div class="h-8 w-32 bg-gray-100 animate-pulse rounded-default"></div>
                <div class="h-8 w-28 bg-gray-100 animate-pulse rounded-default"></div>
            </div>
            <div v-else-if="activeFilterCount > 0" class="mb-6 flex md:flex-wrap items-center gap-2 px-4 md:px-0 overflow-x-auto md:overflow-x-visible hide-scrollbar [&>*]:flex-shrink-0 md:[&>*]:flex-shrink">
                <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans">Aktívne filtre:</span>
                <button v-for="brandId in selectedBrands" :key="`brand-${brandId}`" @click="handleBrandToggle(brandId)"
                    class="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-gray-200"
                    :aria-label="`Zrušiť filter značky ${getBrandName(brandId)}`"
                >
                    <span>{{ getBrandName(brandId) }}</span><X class="w-2.5 h-2.5" />
                </button>
                <button v-for="size in selectedSizes" :key="`size-${size}`" @click="handleSizeToggle(size)"
                    class="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-gray-200"
                    :aria-label="`Zrušiť filter veľkosti ${size}`"
                >
                    <span>Veľkosť: {{ size }}</span><X class="w-2.5 h-2.5" />
                </button>
                <button v-if="riderHeight" @click="riderHeight = null"
                    class="inline-flex items-center gap-2 px-2 py-1 bg-brand text-white text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-transparent"
                    :aria-label="`Zrušiť filter výšky ${riderHeight}cm`"
                >
                    <span>Výška: {{ riderHeight }}cm</span><X class="w-2.5 h-2.5" />
                </button>
                <button v-for="w in selectedWheelsNorm" :key="`w-${w}`" @click="toggleWheelsNorm(w)"
                    class="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-gray-200"
                    :aria-label="`Zrušiť filter kolies ${getNormName(w, availableWheelsNorm)}`"
                >
                    <span>Kolesá: {{ getNormName(w, availableWheelsNorm) }}</span><X class="w-2.5 h-2.5" />
                </button>
                <button v-for="f in selectedForkNorm" :key="`f-${f}`" @click="toggleForkNorm(f)"
                    class="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-gray-200"
                    :aria-label="`Zrušiť filter vidlice ${getNormName(f, availableForkNorm)}`"
                >
                    <span>Vidlica: {{ getNormName(f, availableForkNorm) }}</span><X class="w-2.5 h-2.5" />
                </button>
                <button v-for="b in selectedBrakesNorm" :key="`b-${b}`" @click="toggleBrakesNorm(b)"
                    class="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-gray-200"
                    :aria-label="`Zrušiť filter bŕzd ${getNormName(b, availableBrakesNorm)}`"
                >
                    <span>Brzdy: {{ getNormName(b, availableBrakesNorm) }}</span><X class="w-2.5 h-2.5" />
                </button>
                <button v-for="g in selectedGearsNorm" :key="`g-${g}`" @click="toggleGearsNorm(g)"
                    class="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-gray-200"
                    :aria-label="`Zrušiť filter radenia ${getNormName(g, availableGearsNorm)}`"
                >
                    <span>Prehadzovačka: {{ getNormName(g, availableGearsNorm) }}</span><X class="w-2.5 h-2.5" />
                </button>
                <button v-for="m in selectedMotorNorm" :key="`m-${m}`" @click="toggleMotorNorm(m)"
                    class="inline-flex items-center gap-2 px-2 py-1 bg-[#EEF2F6] text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-colors rounded-sm border border-gray-200"
                    :aria-label="`Zrušiť filter motora ${getNormName(m, availableMotorNorm)}`"
                >
                    <span>Motor: {{ getNormName(m, availableMotorNorm) }}</span><X class="w-2.5 h-2.5" />
                </button>
                <button v-for="b in selectedBatteryNorm" :key="`bat-${b}`" @click="toggleBatteryNorm(b)"
                    class="inline-flex items-center gap-2 px-2 py-1 bg-[#EEF2F6] text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-colors rounded-sm border border-gray-200"
                    :aria-label="`Zrušiť filter batérie ${getNormName(b, availableBatteryNorm)}`"
                >
                    <span>Batéria: {{ getNormName(b, availableBatteryNorm) }}</span><X class="w-2.5 h-2.5" />
                </button>
                <button v-for="c in selectedColors" :key="`color-${c}`" @click="toggleColorNorm(c)"
                    class="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-gray-200"
                    :aria-label="`Zrušiť filter farby ${getNormName(c, availableColorsNorm)}`"
                >
                    <span>Farba: {{ getNormName(c, availableColorsNorm) }}</span><X class="w-2.5 h-2.5" />
                </button>
                <button v-if="inStockOnly" @click="inStockOnly = false"
                    class="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-gray-200"
                    aria-label="Zobraziť všetky produkty (zrušiť filter skladom)"
                >
                    <span>Skladom</span><X class="w-2.5 h-2.5" />
                </button>
                <button v-if="onDemandOnly" @click="onDemandOnly = false"
                    class="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-gray-200"
                    aria-label="Zobraziť všetky produkty (zrušiť filter na objednávku)"
                >
                    <span>Na objednávku</span><X class="w-2.5 h-2.5" />
                </button>
                <button v-if="isPromotion" @click="isPromotion = false"
                    class="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-gray-200"
                    aria-label="Zobraziť všetky produkty (zrušiť filter v akcii)"
                >
                    <span>V akcii</span><X class="w-2.5 h-2.5" />
                </button>
                <button v-if="isFeatured" @click="isFeatured = false"
                    class="inline-flex items-center gap-2 px-2 py-1 bg-brand text-white text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-transparent"
                    aria-label="Zobraziť všetky produkty (zrušiť filter odporúčaných)"
                >
                    <span>Odporúčané</span><X class="w-2.5 h-2.5" />
                </button>
                <button v-if="priceRange[0] > categoryMinPrice || priceRange[1] < categoryMaxPrice" @click="priceRange = [0, 10000]"
                    class="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-900 text-[10px] font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors rounded-sm border border-gray-200"
                    aria-label="Zrušiť filter ceny"
                >
                    <span>Cena: {{ (priceRange[0] > categoryMinPrice ? priceRange[0] : categoryMinPrice).toFixed(2) }}€ - {{ (priceRange[1] < categoryMaxPrice ? priceRange[1] : categoryMaxPrice).toFixed(2) }}€</span><X class="w-2.5 h-2.5" />
                </button>
            </div>
            </ClientOnly>

            <!-- Skeleton (SSR-safe: renders on server too for instant LCP) -->
            <div v-if="listingStatus === 'pending' && products.length === 0"
                :class="mobileColumns === 1
                    ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 md:gap-4 bg-white md:bg-transparent'
                    : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-8 md:gap-4 bg-white md:bg-transparent'">
                <div v-for="i in 8" :key="`skeleton-${i}`" class="group bg-white overflow-hidden flex flex-col relative md:border md:border-gray-100 p-2 md:p-4">
                    <div class="relative w-full aspect-square bg-gray-100 animate-pulse mb-4"></div>
                    <div class="h-4 bg-gray-200 animate-pulse w-1/4 mb-2"></div>
                    <div class="h-3 bg-gray-200 animate-pulse w-3/4 mb-1"></div>
                    <div class="h-3 bg-gray-200 animate-pulse w-1/2"></div>
                    <div class="mt-auto pt-4 flex items-end"><div class="h-4 bg-gray-200 animate-pulse w-16"></div></div>
                </div>
            </div>

            <!-- Products -->
            <div v-if="products.length > 0"
                :class="[
                    mobileColumns === 1
                        ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 md:gap-4 bg-white md:bg-transparent'
                        : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-8 md:gap-4 bg-white md:bg-transparent',
                    'transition-opacity duration-300',
                    isClient && listingStatus === 'pending' ? 'opacity-50 pointer-events-none' : ''
                ]">
                <ProductCard v-for="product in products" :key="product.id" :product="product" />
            </div>

            <!-- Empty state -->
            <div v-else-if="listingStatus !== 'pending'" class="text-center py-32 bg-gray-50">
                <p class="text-2xl font-bold text-gray-400 font-tech uppercase mb-2">Nenašli sa žiadne produkty</p>
                <p class="text-gray-500 mb-8 font-sans">Skúste zmeniť nastavenia filtrov alebo hľadajte niečo iné.</p>
                <button
                    v-if="activeFilterCount > 0"
                    @click="clearAllFilters"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
                >
                    <X class="w-3.5 h-3.5" aria-hidden="true" />
                    Vymazať všetky filtre
                </button>
            </div>

            <!-- SKELETON KARTY: okamžité zobrazenie po kliknutí na button (isLoadingMore=true) -->
            <!-- Kopírujú exaktnú výšku ProductCard pre nulový CLS skok -->
            <div
                v-if="isLoadingMore"
                :class="mobileColumns === 1
                    ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 md:gap-4 bg-white md:bg-transparent mt-1'
                    : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-8 md:gap-4 bg-white md:bg-transparent mt-1'"
                aria-label="Načítavam ďalšie produkty"
            >
                <div v-for="i in 8" :key="`loadmore-skeleton-${i}`"
                    class="bg-white border-0 md:border md:border-gray-100 flex flex-col"
                >
                    <!-- Image skeleton -->
                    <div class="relative w-full aspect-square bg-gray-100 animate-pulse"></div>
                    <!-- Info skeleton — match ProductCard min-h-[120px] aby load-more CLS bol 0 -->
                    <div class="p-2 md:p-4 flex flex-col gap-2 min-h-[120px]">
                        <div class="h-3 bg-gray-100 animate-pulse w-1/3 rounded"></div>
                        <div class="h-3 bg-gray-200 animate-pulse w-full rounded"></div>
                        <div class="h-3 bg-gray-200 animate-pulse w-3/4 rounded"></div>
                        <div class="mt-auto h-5 bg-gray-200 animate-pulse w-1/2 rounded"></div>
                    </div>
                </div>
            </div>

            <!-- PRE-FETCH Sentinel: IntersectionObserver ho detekuje 300px pred zobrazením -->
            <!-- Sleduje button "Načítať ďalšie" - spustí tichý background prefetch -->
            <div
                v-if="products.length < total && !isLoadingMore"
                ref="loadMoreSentinel"
                class="h-1 w-full mt-4"
                aria-hidden="true"
            ></div>

            <!-- Load More sekcia: progress bar + button -->
            <div v-if="products.length < total && !isLoadingMore" class="mt-8 md:mt-12 text-center pb-8">
                <!-- Progress -->
                <p class="text-gray-400 text-[10px] md:text-xs mb-4 font-bold uppercase tracking-widest font-sans">
                    Zobrazených {{ products.length }} z {{ total }} produktov
                </p>
                <div class="w-48 md:w-64 h-1 bg-gray-100 mx-auto mb-6 md:mb-8 rounded-full overflow-hidden">
                    <div class="h-full bg-brand transition-all duration-700" :style="{ width: `${(products.length / total) * 100}%` }"></div>
                </div>

                <!-- Button: 3 stavy -->
                <!-- Stav 1: prebieha isLoadingMore (nikdy sa nezobrazí — sekcia je skrytá) -->
                <!-- Stav 2: isPrefetchRunning — data sú na pozadí, button je aktívny ale indikuje prefetch -->
                <!-- Stav 3: ready — štandardný button -->
                <button
                    @click="loadMore"
                    :disabled="isLoadingMore"
                    class="relative bg-black text-white hover:bg-gray-800 px-6 py-3 md:px-10 md:py-4 uppercase tracking-widest text-xs md:text-sm font-bold min-w-[200px] md:min-w-[240px] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed rounded-default"
                    aria-label="Načítať viac produktov"
                >
                    <span class="flex items-center justify-center gap-2">
                        <!-- Subtle prefetch indicator — len malý loading dot -->
                        <span
                            v-if="isPrefetchRunning"
                            class="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse"
                            title="Produkty sa načítavajú na pozadí"
                        ></span>
                        Načítať ďalšie produkty
                    </span>
                </button>
            </div>
        </main>
    </div>

    <!-- QuickView Modal -->
    <QuickViewModal
        :is-open="!!selectedProduct"
        :product="selectedProduct"
        @close="selectedProduct = null"
        @view-details="selectedProduct && navigateToProduct(selectedProduct)"
    />

  </div>
</template>
