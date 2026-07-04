<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { Home, ChevronLeft, ChevronRight, Info } from 'lucide-vue-next';
import { type Product } from '~/types';
import ProductGallery from './ProductGallery.vue';
import ProductInfo from './ProductInfo.vue';
import DownloadsTab from './tabs/DownloadsTab.vue';
import DistributorTab from './tabs/DistributorTab.vue';
import SpecsTab from './tabs/SpecsTab.vue';
import DescriptionTab from './tabs/DescriptionTab.vue';
import SupportPanel from './SupportPanel.vue';
import { useProductComparison } from '~/composables/useProductComparison';
import SizeChartModal from '~/components/ui/SizeChartModal.vue';
import ProductStickyBar from './ProductStickyBar.vue';
import { useProductReviews } from '@shopware/composables';
import { useProductBadges, badgeSizeClass } from '~/composables/useProductBadges';

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits(['back']);

const { splitPdpBadges } = useProductBadges();
const pdpBadgesSplit = computed(() => splitPdpBadges(props.product));
const mobilePdpBadges = computed(() => pdpBadgesSplit.value.topBadges);
const imagePdpBadges = computed(() => pdpBadgesSplit.value.imageBadges);

const quantity      = ref(1);
const selectedSize  = ref('');
// ✅ Initialized synchronously from SSR-resolved props — NOT deferred to onMounted
const galleryImages = ref<string[]>(
  Array.from(new Set([props.product?.image, ...(props.product?.images || [])])).filter(Boolean) as string[]
);
const activeImage     = ref(props.product?.image || '');
const isSizeChartOpen = ref(false);
const isStickyBarVisible = ref(false);
const isWatchdogOpen = ref(false);
const isPriceOfferOpen = ref(false);
const isComparisonOpen = ref(false);

const { addToComparison, isInComparison, removeFromComparison } = useProductComparison();
const comparisonToast = useState('comparisonToast', () => ({ show: false, productName: '', action: 'add' as 'add' | 'remove' }));

const handleAddToCompare = (_e: MouseEvent, p: any) => {
  if (isInComparison(p.id)) {
    removeFromComparison(p.id);
    comparisonToast.value = { show: true, productName: p.name, action: 'remove' };
    return;
  }
  const added = addToComparison({
    id: p.id,
    name: p.name,
    image: p.image || p.images?.[0] || '',
    price: p.price,
    oldPrice: p.oldPrice,
    productNumber: p._raw?.productNumber || '',
    categoryName: p.category || '',
    manufacturer: p.brand || p.manufacturer?.name || '',
    properties: (p.properties || p._raw?.properties || []).map((pr: any) => ({
      group: pr.group?.translated?.name || pr.group?.name || '',
      value: pr.translated?.name || pr.name || '',
    })),
  });
  if (added) {
    comparisonToast.value = { show: true, productName: p.name, action: 'add' };
  }
  isComparisonOpen.value = true;
};
const { productReviews, loadProductReviews } = useProductReviews(toRef(props, 'product') as any);

onMounted(async () => {
    try {
        await loadProductReviews();
    } catch (e) {
        // console.error("Failed to load reviews in ProductDetail", e);
    }
});

const effectiveReviewCount = computed(() => {
    return Math.max(props.product.reviewsCount || 0, productReviews.value?.length || 0);
});

const effectiveRating = computed(() => {
    if (props.product.rating > 0) return props.product.rating;
    if (productReviews.value?.length > 0) {
        const sum = productReviews.value.reduce((acc, r) => acc + (r.points || 0), 0);
        return sum / productReviews.value.length;
    }
    return 0;
});

onMounted(() => {
    // Safety scroll to top: ensure the PDP starts clean
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });

    const hydrated = Array.from(new Set([props.product.image, ...(props.product.images || [])])).filter(Boolean) as string[];
    if (hydrated.length > galleryImages.value.length) {
        galleryImages.value = hydrated;
    }

    let observer: IntersectionObserver | null = null;

    setTimeout(() => {
      const target = document.getElementById('buy-btn-sentinel');
      if (target) {
          observer = new IntersectionObserver(
              (entries) => {
                  const entry = entries[0];
                  if (entry) {
                      isStickyBarVisible.value = !entry.isIntersecting && entry.boundingClientRect.top < 0;
                  }
              },
              { threshold: 0 }
          );
          observer.observe(target);
      }
    }, 100);

    onUnmounted(() => {
        if (observer) observer.disconnect();
    });
});

watch(() => props.product, (newP) => {
    activeImage.value   = newP.image || '';
    galleryImages.value = Array.from(new Set([newP.image, ...(newP.images || [])])).filter(Boolean) as string[];
    if (newP.variants?.length) {
        const first = newP.variants.find(v => v.stockStatus === 'in_stock') || newP.variants[0];
        selectedSize.value = first?.size ? String(first.size) : '';
    }
}, { deep: true });

const currentVariant = computed(() => props.product.variants?.find(v => v.size === selectedSize.value));
const availableSizes = computed(() => props.product.variants?.map(v => v.size) || []);

const localePath = useLocalePath();
const router     = useRouter();
const route      = useRoute();
const { t }      = useI18n();
const { apiClient } = useShopwareContext();

const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(localePath('/'));
};

const sanitizedProductName = computed(() => props.product.name?.replace(/\s*\(Variant\)$/i, '') || '');

const selectedVariant = ref<any>(null);

// Mobile sticky ATC bar — simplified price & product for bottom sheet
const mobileBarProduct = computed(() => ({
  ...(props.product as any),
  id: selectedVariant.value?.id || props.product.id,
  availableStock: selectedVariant.value?.availableStock ?? (props.product as any).availableStock ?? 0,
  isCloseout: selectedVariant.value?.isCloseout === true || (props.product as any)._raw?.isCloseout === true,
}));

const mobileBarPrice = computed<number>(() => {
  return selectedVariant.value?.calculatedPrice?.unitPrice
    ?? (props.product as any).calculatedPrice?.unitPrice
    ?? (props.product as any).price
    ?? 0;
});

const mobileBarListPrice = computed<number | null>(() => {
  return selectedVariant.value?.calculatedPrice?.listPrice?.price
    ?? (props.product as any).calculatedPrice?.listPrice?.price
    ?? null;
});

const handleVariantSelected = async (payload: any) => {
  const optionId = typeof payload === 'string' ? payload : payload.optionId;
  const groupId = payload.groupId;

  if (!optionId) return;

  try {
    // 1. Zostavenie poľa aktuálnych vlastností
    let currentOptions = props.product?.optionIds ? [...props.product.optionIds] : [];
    
    // Odstránenie starej vlastnosti z rovnakej skupiny (ak meníme napr. M za L)
    if (groupId) {
      const settings = props.product?.configuratorSettings || [];
      const optionsInSameGroup = settings
        .filter((cs: any) => cs.option?.groupId === groupId || cs.option?.group?.id === groupId)
        .map((cs: any) => cs.option?.id);
        
      currentOptions = currentOptions.filter((id: string) => !optionsInSameGroup.includes(id));
    }
    
    // Pridanie novej vlastnosti
    if (!currentOptions.includes(optionId)) {
      currentOptions.push(optionId);
    }

    // Identifikácia rodiča pre endpoint
    const parentId = props.product.parentId || props.product.id;

    // 2. Skúsiť rozlíšiť variant lokálne na základe options, pre ušetrenie zbytočného API callu
    let foundVariantId = null;
    const targetLength = currentOptions.length;
    
    // A. Hľadanie v načítaných children
    const children = props.product?.children || [];
    for (const child of children) {
      const childOpts = child.optionIds || (child.options?.map((o:any)=>o.id) || []);
      if (childOpts.length === targetLength && currentOptions.every((id: string) => childOpts.includes(id))) {
        foundVariantId = child.id;
        break;
      }
    }
    
    // B. Fallback na vopred vypočítané adaptované varianty
    if (!foundVariantId && props.product?.variants) {
      for (const v of props.product.variants) {
        const childOpts = v.optionIds || [];
        if (childOpts.length === targetLength && currentOptions.every((id: string) => childOpts.includes(id))) {
          foundVariantId = v.id || v._raw?.id;
          break;
        }
      }
    }

    // 3. Fallback na originálny API request, ak variant nie je dostupný lokálne
    if (!foundVariantId) {
      const response: any = await apiClient.invoke('readProductVariant post /product/{productId}/find-variant' as any, {
        pathParams: { productId: parentId },
        body: { options: currentOptions }
      });
      foundVariantId = response?.variantId || response?.data?.variantId || response?.foundCombination?.variantId || response?.data?.foundCombination?.variantId;
    }

    if (foundVariantId) {
      // Vymeníme iba query parameter `variant`.
      router.push({ query: { ...route.query, variant: foundVariantId } });
    }
  } catch (error) {
    // Silent fail for variant resolution to keep UI clean
    // console.error("❌ API zlyhanie pri hľadaní variantu:", error);
  }
};
// Tab scroll helper — wait 2 frames for tab transition before scrolling so user
// sees both the tab switch animation AND the scroll. 110px offset = navbar height.
const scrollToTabContent = (elementId: string) => {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                const el = document.getElementById(elementId);
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const top = rect.top + scrollTop - 110;
                window.scrollTo({ top, behavior: 'smooth' });
            }, 100); // small delay lets tab content render before scroll target measurement
        });
    });
};

const handleOpenDescription = () => {
    scrollToTabContent('product-description-content');
};

const handleOpenReviews = () => {
    scrollToTabContent('pdp-reviews-section');
};
const breadcrumbsVisible = computed(() => {
  return props.product.breadcrumbs?.slice(1) || [];
});

// ── Shared includes & helpers ──────────────────────────────────────────────
const config = useRuntimeConfig();

const showGeometryTab = computed(() => {
  const categoryIds: string[] = (props.product as any).categoryIds || [];
  return categoryIds.some(id => id === config.public.shopware.ids.categories.bikes || id === config.public.shopware.ids.categories.ebikes);
});

const CARD_INCLUDES = {
  product: ['id', 'name', 'description', 'translated', 'cover', 'manufacturer', 'options', 'seoUrls',
            'calculatedPrice', 'childCount', 'available', 'availableStock', 'isCloseout',
            'children', 'media', 'ratingAverage', 'productReviewsCount'],
  product_media: ['media', 'position'],
  media: ['url', 'thumbnails', 'fileName', 'mimeType'],
  media_thumbnail: ['url', 'width'],
  product_manufacturer: ['id', 'name', 'translated', 'media'],
  property_group_option: ['id', 'name', 'translated', 'group'],
  property_group: ['id', 'name', 'translated'],
  seo_url: ['seoPathInfo', 'isCanonical'],
};

const CARD_ASSOC = {
  cover: { associations: { media: {} } },
  seoUrls: {},
  children: { associations: { options: { associations: { group: {} } } } },
};

const scrollCarousel = (el: HTMLElement | null, dir: 'left' | 'right') => {
  if (!el) return;
  el.scrollBy({ left: dir === 'right' ? el.clientWidth * 0.75 : -el.clientWidth * 0.75, behavior: 'smooth' });
};

// ── PDP Carousel scroll progress ──────────────────────────────────────────
const similarProgress = ref(0);
const frequentlyBoughtProgress = ref(0);
const recentlyViewedProgress = ref(0);

const onCarouselScroll = (el: HTMLElement | null, progressRef: { value: number }) => {
  if (!el) return;
  const max = el.scrollWidth - el.clientWidth;
  progressRef.value = max > 0 ? el.scrollLeft / max : 0;
};

// ── 1. Podobné produkty ────────────────────────────────────────────────────
const similarProducts = ref<any[]>([]);
const isSimilarLoading = ref(false);
const similarRef = ref<HTMLElement | null>(null);

const fetchSimilarProducts = async (product: any) => {
  const catId = product.deepestCategoryId;
  const price = product.price || 0;
  if (!catId) return;
  isSimilarLoading.value = true;
  try {
    const res = await apiClient.invoke('readProduct post /product' as any, {
      body: {
        limit: 12,
        filter: [
          { type: 'equals', field: 'parentId', value: null },
          { type: 'equalsAny', field: 'categoryIds', value: [catId] },
          { type: 'not', queries: [{ type: 'equals', field: 'id', value: product.id }] },
          ...(price > 0 ? [{ type: 'range', field: 'price', parameters: { gte: price * 0.9, lte: price * 1.5 } }] : []),
          // Len dostupné: skladom alebo na objednávku (nie vypredané isCloseout+stock=0)
          { type: 'multi', operator: 'or', queries: [
            { type: 'range', field: 'availableStock', parameters: { gt: 0 } },
            { type: 'equals', field: 'isCloseout', value: false },
          ]},
        ],
        sort: [{ field: 'ratingAverage', order: 'DESC' }],
        includes: CARD_INCLUDES,
        associations: CARD_ASSOC,
      },
    });
    similarProducts.value = (res?.data || res)?.elements || [];
  } catch (e) {
    console.error('[PDP] fetchSimilarProducts failed:', e);
  } finally {
    isSimilarLoading.value = false;
  }
};

// ── 2. Často kupované spolu ────────────────────────────────────────────────
const frequentlyBought = ref<any[]>([]);
const isFrequentlyBoughtLoading = ref(false);
const frequentlyBoughtRef = ref<HTMLElement | null>(null);

const fetchFrequentlyBought = async (productId: string) => {
  isFrequentlyBoughtLoading.value = true;
  const crossSellIds = new Set<string>();
  try {
    const res = await apiClient.invoke(`readProductCrossSelling get /product/${productId}/cross-selling` as any);
    const sections = (res as any)?.data || res;
    if (Array.isArray(sections)) {
      for (const section of sections) {
        for (const p of (section.products || [])) {
          if (p.id !== productId) crossSellIds.add(p.id);
        }
      }
    }

    if (crossSellIds.size > 0) {
      const detail = await apiClient.invoke('readProduct post /product' as any, {
        body: {
          filter: [{ type: 'equalsAny', field: 'id', value: [...crossSellIds].slice(0, 12) }],
          includes: CARD_INCLUDES,
          associations: { ...CARD_ASSOC, manufacturer: { associations: { media: {} } } },
        },
      });
      const products = (detail?.data || detail)?.elements || [];
      if (products.length > 0) {
        frequentlyBought.value = products;
        return;
      }
    }

    // Fallback: náhodné produkty z kategórie Doplnky
    const doplnkyCatId = (config.public.shopware as any).ids?.categories?.doplnky;
    if (doplnkyCatId) {
      const fallback = await apiClient.invoke('readProduct post /product' as any, {
        body: {
          limit: 12,
          filter: [
            { type: 'equals', field: 'parentId', value: null },
            { type: 'equalsAny', field: 'categoryIds', value: [doplnkyCatId] },
            { type: 'not', queries: [{ type: 'equals', field: 'id', value: productId }] },
          ],
          sort: [{ field: 'sales', order: 'DESC' }],
          includes: CARD_INCLUDES,
          associations: CARD_ASSOC,
        },
      });
      frequentlyBought.value = (fallback?.data || fallback)?.elements || [];
    }
  } catch (e) {
    console.error('[PDP] fetchFrequentlyBought failed:', e);
  } finally {
    isFrequentlyBoughtLoading.value = false;
  }
};

// ── 3. Naposledy zobrazené ─────────────────────────────────────────────────
const recentlyViewed = ref<any[]>([]);
const isRecentlyViewedLoading = ref(false);
const recentlyViewedRef = ref<HTMLElement | null>(null);
const recentlyViewedLoaded = ref(false);

const loadRecentlyViewed = async (currentProductId: string) => {
  isRecentlyViewedLoading.value = true;
  recentlyViewedLoaded.value = false;
  try {
    const raw = localStorage.getItem('mtsport_recently_viewed');
    const ids: string[] = Array.isArray(JSON.parse(raw || '[]')) ? JSON.parse(raw || '[]') : [];
    const filtered = ids.filter((id: string) => id !== currentProductId).slice(0, 12);
    if (filtered.length === 0) { recentlyViewedLoaded.value = true; return; }

    const res = await apiClient.invoke('readProduct post /product' as any, {
      body: {
        filter: [
          { type: 'equalsAny', field: 'id', value: filtered },
          { type: 'equals', field: 'parentId', value: null },
        ],
        includes: CARD_INCLUDES,
        associations: CARD_ASSOC,
      },
    });
    const products = (res?.data || res)?.elements || [];
    // Zachovaj poradie z localStorage (najnovšie prvé)
    recentlyViewed.value = filtered.map((id: string) => products.find((p: any) => p.id === id)).filter(Boolean);
  } catch (e) {
    console.error('[PDP] loadRecentlyViewed failed:', e);
  } finally {
    isRecentlyViewedLoading.value = false;
    recentlyViewedLoaded.value = true;
  }
};

// ── Watche ─────────────────────────────────────────────────────────────────
watch(() => props.product?.id, (id) => {
  if (id) {
    frequentlyBought.value = [];
    fetchFrequentlyBought(id);
    similarProducts.value = [];
    fetchSimilarProducts(props.product);
  }
}, { immediate: true });

// Recently viewed: načíta sa onMounted (client only) aj pri zmene produktu
onMounted(() => {
  if (props.product?.id) loadRecentlyViewed(props.product.id);
});
watch(() => props.product?.id, (id, oldId) => {
  if (id && id !== oldId) loadRecentlyViewed(id);
});
</script>

<template>
  <div class="bg-white min-h-screen font-sans pb-[72px] lg:pb-0">

    <!-- Desktop Sticky Mini-CTA bar (only for desktop, shows when right panel scrolled away) -->
    <ProductStickyBar
      :product="product"
      :visible="isStickyBarVisible"
      :selectedSize="selectedSize"
      v-model:quantity="quantity"
    />


    <!-- ─── 2-column layout: Header+Gallery (left) | Info (right, sticky on desktop) -->
    <div class="max-w-[1536px] mx-auto flex flex-col lg:flex-row lg:items-start lg:px-8">

      <!-- ═══ LEFT COLUMN: Mobile Header + Gallery ═══ -->
      <div class="w-full lg:w-[58%] xl:w-[60%] lg:pt-8 flex flex-col">

        <!-- MOBILE HEADER -->
        <div class="lg:hidden w-full px-4 pt-4 pb-2 bg-white flex flex-col">
          <!-- Mobile Custom Breadcrumb -->
          <nav aria-label="Breadcrumb" class="mb-4 w-full overflow-x-auto hide-scrollbar">
            <ol class="flex items-center gap-1.5 flex-nowrap text-[11px] text-gray-400 font-sans whitespace-nowrap min-w-max">
              <li>
                <NuxtLink :to="localePath('/')" class="hover:text-black transition-colors flex items-center flex-shrink-0">
                  <Home class="w-3.5 h-3.5" />
                </NuxtLink>
              </li>

              <template v-for="(bc, index) in breadcrumbsVisible" :key="index">
                <li class="text-gray-300 flex-shrink-0">›</li>
                <li class="flex-shrink-0">
                  <NuxtLink :to="'/' + bc.path" class="hover:text-brand transition-colors focus:outline-none">
                    {{ bc.name }}
                  </NuxtLink>
                </li>
              </template>

              <li class="text-gray-300 flex-shrink-0">›</li>
              <li aria-current="page" class="flex-shrink-0">
                <span class="text-black font-medium" :title="sanitizedProductName">{{ sanitizedProductName }}</span>
              </li>
            </ol>
          </nav>

          <!-- Mobile custom badges (top position) -->
          <div v-if="mobilePdpBadges.length" class="flex flex-row flex-wrap gap-1.5 mb-2">
            <span
              v-for="badge in mobilePdpBadges"
              :key="badge.id"
              :class="['font-bold uppercase tracking-wider leading-none font-tech', badgeSizeClass(badge.size)]"
              :style="{ backgroundColor: badge.bgColor, color: badge.textColor }"
            >{{ badge.text }}</span>
          </div>

          <!-- Mobile Logo -->
          <div v-if="product.manufacturer?.media?.url" class="mb-1">
            <NuxtImg :src="product.manufacturer.media.url" :alt="`${product.brand} logo`" class="h-5 w-auto object-contain mix-blend-multiply" />
          </div>

          <!-- Mobile Title -->
          <h1 class="text-2xl font-black text-black leading-tight mt-1 mb-3 font-tech uppercase tracking-wide">
            {{ sanitizedProductName }}
          </h1>

          <!-- Mobile Rating -->
          <div class="flex items-center gap-1 cursor-pointer group min-h-[44px]" @click="handleOpenReviews">
            <RatingStars :rating="effectiveRating" />
            <span class="text-gray-500 text-[11px] font-bold font-sans underline ml-1">
              {{ effectiveReviewCount }} {{ $t('pdp.reviews_count') }}
            </span>
          </div>
        </div>

        <!-- Gallery -->
        <div class="w-full">
          <ProductGallery
            :product="product"
            v-model:activeImage="activeImage"
            v-model:galleryImages="galleryImages"
            :image-badges="imagePdpBadges"
          />
        </div>
      </div>

      <!-- ═══ RIGHT COLUMN: Sticky info panel ═══ -->
      <div class="w-full lg:w-[42%] xl:w-[40%] lg:sticky lg:top-[var(--navbar-height-scrolled,88px)] lg:h-[calc(100vh-var(--navbar-height-scrolled,88px))] lg:overflow-y-auto flex-shrink-0 hide-scrollbar bg-white">
        <div class="w-full px-4 md:px-6 xl:px-10 py-6 lg:py-8 lg:pt-8 lg:pb-10 bg-white">

          <!-- Breadcrumbs — desktop only -->
          <nav aria-label="Breadcrumb" class="hidden lg:block bg-white mb-6 md:mb-10">
            <ol class="flex items-center gap-2 flex-nowrap text-sm text-gray-400 font-sans whitespace-nowrap overflow-x-auto hide-scrollbar">
              <li>
                <NuxtLink :to="localePath('/')" class="hover:text-black transition-colors flex items-center flex-shrink-0">
                  <Home class="w-4 h-4 mb-0.5" />
                </NuxtLink>
              </li>

              <template v-for="(bc, index) in breadcrumbsVisible" :key="index">
                <li class="text-gray-300 flex-shrink-0">›</li>
                <li class="flex-shrink-0">
                  <NuxtLink :to="'/' + bc.path" class="hover:text-brand transition-colors focus:outline-none">
                    {{ bc.name }}
                  </NuxtLink>
                </li>
              </template>

              <li class="text-gray-300 flex-shrink-0">›</li>
              <li aria-current="page" class="min-w-0 flex-1 overflow-hidden">
                <span class="text-black font-medium truncate block" :title="sanitizedProductName">{{ sanitizedProductName }}</span>
              </li>
            </ol>
          </nav>

          <ProductInfo
            :product="product"
            :ratingAverage="effectiveRating"
            :reviewCount="effectiveReviewCount"
            v-model:quantity="quantity"
            v-model:selectedSize="selectedSize"
            :currentVariant="currentVariant"
            :selectedVariant="selectedVariant"
            @variantSelected="handleVariantSelected"
            @openSizeChart="isSizeChartOpen = true"
            @openDescription="handleOpenDescription"
            @openReviews="handleOpenReviews"
            @addToCompare="handleAddToCompare"
            @openWatchdog="isWatchdogOpen = true"
            @openPriceOffer="isPriceOfferOpen = true"
          />
        </div>
      </div>
    </div>

    <!-- ═══ POPIS + SPECS — vždy viditeľné, 2-stĺpcový layout ═══ -->
    <div class="w-full border-t border-gray-100 bg-white">
      <div class="max-w-[1536px] mx-auto lg:px-8 lg:flex lg:items-start lg:gap-8">
        <!-- Ľavý stĺpec: Popis produktu (vždy otvorený) -->
        <div class="w-full lg:w-[58%] xl:w-[60%] px-4 lg:px-0 py-8 lg:py-12">
          <h2 class="font-tech font-black uppercase text-2xl tracking-wide text-black mb-4">Popis produktu</h2>
          <div class="section-decorator mb-8"></div>
          <DescriptionTab :product="product" :customFieldsMedia="(product as any).customFieldsMedia" />
        </div>
        <!-- Pravý stĺpec: Kompletná špecifikácia (sticky kým popis neskončí) -->
        <div class="w-full lg:w-[42%] xl:w-[40%] px-4 lg:px-0 py-8 lg:py-12 lg:sticky lg:top-[var(--navbar-height-scrolled,88px)] lg:self-start">
          <h2 class="font-tech font-black uppercase text-2xl tracking-wide text-black mb-4">Kompletná špecifikácia</h2>
          <div class="section-decorator mb-8"></div>
          <SpecsTab :product="product" :availableSizes="availableSizes" :singleColumn="true" />

        </div>
      </div>
    </div>

    <!-- ═══ RECENZIE — full-width sekcia, šedé pozadie ═══ -->
    <section id="pdp-reviews-section" class="w-full bg-gray-50 border-t border-gray-100">
      <div class="max-w-[1536px] mx-auto px-4 lg:px-8 py-16">
        <h2 class="font-tech font-black uppercase text-2xl tracking-wide text-black mb-4">Hodnotenia produktu</h2>
        <div class="section-decorator mb-10"></div>
        <ProductReviewsSection
          :product="product"
          :ratingAverage="effectiveRating"
          :reviewCount="effectiveReviewCount"
        />
      </div>
    </section>

    <!-- ═══ GEOMETRIA RÁMU — len pre bikes/ebikes ═══ -->
    <div v-if="showGeometryTab" class="w-full border-t border-gray-100 bg-white">
      <div class="max-w-[1536px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h2 class="font-tech font-black uppercase text-2xl tracking-wide text-black mb-4">Geometria rámu</h2>
        <div class="section-decorator mb-10"></div>
        <GeometryTab :product="product" :availableSizes="availableSizes" />
      </div>
    </div>

    <!-- ═══ VÝROBCA + DOKUMENTY — 2 stĺpce ═══ -->
    <div class="w-full border-t border-gray-100 bg-white">
      <div class="max-w-[1536px] mx-auto lg:px-8 lg:flex lg:items-start lg:gap-8">
        <div class="w-full lg:w-[58%] xl:w-[60%] px-4 lg:px-0 py-8 lg:py-12">
          <h2 class="font-tech font-black uppercase text-2xl tracking-wide text-black mb-4">Výrobca / distribútor</h2>
          <div class="section-decorator mb-8"></div>
          <DistributorTab :product="product" />
        </div>
        <div class="w-full lg:w-[42%] xl:w-[40%] px-4 lg:px-0 py-8 lg:py-12">
          <h2 class="font-tech font-black uppercase text-2xl tracking-wide text-black mb-4">Dokumenty a manuály</h2>
          <div class="section-decorator mb-8"></div>
          <DownloadsTab :product="product" />
        </div>
      </div>
    </div>

    <!-- ── Support Panel ── -->
    <SupportPanel />

    <!-- ── Podobné produkty ── -->
    <ClientOnly>
      <div v-if="similarProducts.length > 0 || isSimilarLoading" class="border-t border-gray-100 bg-white py-16">
        <div class="container mx-auto px-4 lg:px-8">
          <h3 class="font-tech font-black uppercase text-2xl tracking-wide text-black mb-4">Podobné produkty</h3>
          <div class="section-decorator mb-8"></div>
          <div class="relative">
            <!-- Šípky pozicionované voči výške karty (bez pb hover-space) -->
            <div class="absolute inset-x-0 top-4 bottom-[280px] pointer-events-none z-30">
              <button class="btn-nav-arrow absolute -left-5 top-1/2 -translate-y-1/2 pointer-events-auto" aria-label="Predošlé" @click="scrollCarousel(similarRef, 'left')"><ChevronLeft class="w-5 h-5" /></button>
              <button class="btn-nav-arrow absolute -right-5 top-1/2 -translate-y-1/2 pointer-events-auto" aria-label="Ďalšie" @click="scrollCarousel(similarRef, 'right')"><ChevronRight class="w-5 h-5" /></button>
            </div>
            <div>
              <div ref="similarRef" class="flex gap-x-2 overflow-x-auto scroll-smooth snap-x snap-mandatory pdp-no-scrollbar py-4 pb-[280px] -mb-[280px]" @scroll.passive="onCarouselScroll(similarRef, similarProgress)">
                <template v-if="isSimilarLoading && !similarProducts.length">
                  <div v-for="i in 4" :key="`skel-sim-${i}`" class="flex-shrink-0 snap-start w-[calc(50%-2px)] sm:w-[calc(33.333%-3px)] lg:w-[calc(25%-3px)]">
                    <div class="aspect-square bg-gray-100 animate-pulse mb-3"></div>
                    <div class="h-3 bg-gray-200 animate-pulse w-3/4 mb-2"></div>
                    <div class="h-5 bg-gray-200 animate-pulse w-1/2 mt-2"></div>
                  </div>
                </template>
                <div v-for="item in similarProducts" :key="item.id" class="flex-shrink-0 snap-start w-[calc(50%-2px)] sm:w-[calc(33.333%-3px)] lg:w-[calc(25%-3px)] flex">
                  <ProductCard :product="item" class="w-full" />
                </div>
              </div>
              <div class="flex lg:hidden justify-center mt-4">
                <div class="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-brand rounded-full transition-all duration-200" :style="`width: ${similarProgress * 100}%`" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- ── Často kupované spolu ── -->
    <ClientOnly>
      <div v-if="frequentlyBought.length > 0 || isFrequentlyBoughtLoading" class="border-t border-gray-100 bg-white py-16">
        <div class="container mx-auto px-4 lg:px-8">
          <h3 class="font-tech font-black uppercase text-2xl tracking-wide text-black mb-4">Často kupované spolu</h3>
          <div class="section-decorator mb-8"></div>
          <div class="relative">
            <div class="absolute inset-x-0 top-4 bottom-[280px] pointer-events-none z-30">
              <button class="btn-nav-arrow absolute -left-5 top-1/2 -translate-y-1/2 pointer-events-auto" aria-label="Predošlé" @click="scrollCarousel(frequentlyBoughtRef, 'left')"><ChevronLeft class="w-5 h-5" /></button>
              <button class="btn-nav-arrow absolute -right-5 top-1/2 -translate-y-1/2 pointer-events-auto" aria-label="Ďalšie" @click="scrollCarousel(frequentlyBoughtRef, 'right')"><ChevronRight class="w-5 h-5" /></button>
            </div>
            <div>
              <div ref="frequentlyBoughtRef" class="flex gap-x-2 overflow-x-auto scroll-smooth snap-x snap-mandatory pdp-no-scrollbar py-4 pb-[280px] -mb-[280px]" @scroll.passive="onCarouselScroll(frequentlyBoughtRef, frequentlyBoughtProgress)">
                <template v-if="isFrequentlyBoughtLoading && !frequentlyBought.length">
                  <div v-for="i in 4" :key="`skel-fb-${i}`" class="flex-shrink-0 snap-start w-[calc(50%-2px)] sm:w-[calc(33.333%-3px)] lg:w-[calc(25%-3px)]">
                    <div class="aspect-square bg-gray-100 animate-pulse mb-3"></div>
                    <div class="h-3 bg-gray-200 animate-pulse w-3/4 mb-2"></div>
                    <div class="h-5 bg-gray-200 animate-pulse w-1/2 mt-2"></div>
                  </div>
                </template>
                <div v-for="item in frequentlyBought" :key="item.id" class="flex-shrink-0 snap-start w-[calc(50%-2px)] sm:w-[calc(33.333%-3px)] lg:w-[calc(25%-3px)] flex">
                  <ProductCard :product="item" class="w-full" />
                </div>
              </div>
              <div class="flex lg:hidden justify-center mt-4">
                <div class="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-brand rounded-full transition-all duration-200" :style="`width: ${frequentlyBoughtProgress * 100}%`" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- ── Naposledy zobrazené produkty ── -->
    <ClientOnly>
      <div v-if="recentlyViewedLoaded" class="border-t border-gray-100 bg-white py-16">
        <div class="container mx-auto px-4 lg:px-8">
          <h3 class="font-tech font-black uppercase text-2xl tracking-wide text-black mb-4">Naposledy zobrazené</h3>
          <div class="section-decorator mb-8"></div>
          <p v-if="!isRecentlyViewedLoading && recentlyViewed.length === 0" class="text-gray-400 font-sans text-sm py-4">
            Žiadne naposledy prezerané produkty
          </p>
          <div v-else class="relative">
            <div class="absolute inset-x-0 top-4 bottom-[280px] pointer-events-none z-30">
              <button class="btn-nav-arrow absolute -left-5 top-1/2 -translate-y-1/2 pointer-events-auto" aria-label="Predošlé" @click="scrollCarousel(recentlyViewedRef, 'left')"><ChevronLeft class="w-5 h-5" /></button>
              <button class="btn-nav-arrow absolute -right-5 top-1/2 -translate-y-1/2 pointer-events-auto" aria-label="Ďalšie" @click="scrollCarousel(recentlyViewedRef, 'right')"><ChevronRight class="w-5 h-5" /></button>
            </div>
            <div>
              <div ref="recentlyViewedRef" class="flex gap-x-2 overflow-x-auto scroll-smooth snap-x snap-mandatory pdp-no-scrollbar py-4 pb-[280px] -mb-[280px]" @scroll.passive="onCarouselScroll(recentlyViewedRef, recentlyViewedProgress)">
                <template v-if="isRecentlyViewedLoading">
                  <div v-for="i in 4" :key="`skel-rv-${i}`" class="flex-shrink-0 snap-start w-[calc(50%-2px)] sm:w-[calc(33.333%-3px)] lg:w-[calc(25%-3px)]">
                    <div class="aspect-square bg-gray-100 animate-pulse mb-3"></div>
                    <div class="h-3 bg-gray-200 animate-pulse w-3/4 mb-2"></div>
                    <div class="h-5 bg-gray-200 animate-pulse w-1/2 mt-2"></div>
                  </div>
                </template>
                <div v-for="item in recentlyViewed" :key="item.id" class="flex-shrink-0 snap-start w-[calc(50%-2px)] sm:w-[calc(33.333%-3px)] lg:w-[calc(25%-3px)] flex">
                  <ProductCard :product="item" class="w-full" />
                </div>
              </div>
              <div class="flex lg:hidden justify-center mt-4">
                <div class="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-brand rounded-full transition-all duration-200" :style="`width: ${recentlyViewedProgress * 100}%`" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- Size Chart Modal -->
    <SizeChartModal
      :isOpen="isSizeChartOpen"
      @close="isSizeChartOpen = false"
      :category="product.category"
      :availableSizes="availableSizes"
    />

    <!-- PDP Action Modals -->
    <ClientOnly>
      <ComparisonModal :is-open="isComparisonOpen" @close="isComparisonOpen = false" />
      <WatchdogModal :is-open="isWatchdogOpen" :product="product" @close="isWatchdogOpen = false" />
      <PriceOfferModal :is-open="isPriceOfferOpen" :product="product" @close="isPriceOfferOpen = false" />
    </ClientOnly>
  </div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar,
.pdp-no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar,
.pdp-no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
