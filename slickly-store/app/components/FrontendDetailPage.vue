<script setup lang="ts">
/**
 * SLICKLY CUSTOM FrontendDetailPage
 * Root cause fix: the vue-starter-template version of this file delegates ALL rendering
 * to <CmsPage :content="product.cmsPage" /> which goes through the Shopware CMS engine
 * and applies template-layer styles. We bypass that entirely and render our custom
 * <ProductDetail> component directly with the raw Shopware product object.
 *
 * VISUAL MARKER: <div id="SLICKLY-CUSTOM-PDP-MARKER"></div> is rendered below.
 */
import { getProductName } from "@shopware/helpers";
import ProductDetail from "~/components/product/ProductDetail.vue";
import ProductDetailSkeleton from "~/components/product/ProductDetailSkeleton.vue";
import ProductQA from "~/components/product/ProductQA.vue";

const props = defineProps<{
  navigationId: string;
}>();

const { buildDynamicBreadcrumbs, pushBreadcrumb } = useBreadcrumbs();
const { apiClient } = useShopwareContext();
const { currentLanguageId } = useShopwareLanguage();
const route = useRoute();
const errors = ref<string[]>([]);


const isProductPage = useState('isPageProduct', () => false);
const productPageCount = useState('productPageCount', () => 0);
onMounted(() => { productPageCount.value++; isProductPage.value = true; });
onUnmounted(() => {
    productPageCount.value--;
    if (productPageCount.value <= 0) { isProductPage.value = false; productPageCount.value = 0; }
});

const productIdToFetch = computed(() => (route.query.variant as string) || props.navigationId);

// SSR-blocking fetch — ensures server and client render the same initial HTML (no hydration mismatch).
// Variant switching uses stableAdaptedProduct to stay non-flickering during query param changes.
const { data, error, pending } = useAsyncData(
  // Language-aware cache key — prevents stale content across language switches
  `product-${productIdToFetch.value}-${currentLanguageId.value}`,
  async () => {
    // 1) Primary product fetch via Store API (readProduct) overriding `search`
    const productRes = await apiClient.invoke("readProduct post /product", {
      headers: { 'sw-language-id': currentLanguageId.value },
      body: {
        filter: [
          { 
            type: "multi", 
            operator: "or", 
            queries: [
              { type: "equals", field: "id", value: productIdToFetch.value },
              { type: "equals", field: "productNumber", value: productIdToFetch.value }
            ] 
          }
        ],
        associations: {
          properties: { associations: { group: {} } },
          children: { 
            limit: 50, 
            associations: { 
              options: { limit: 50, associations: { group: {} } },
              deliveryTime: {},
              media: { limit: 50, associations: { media: {} }, sort: [{ field: "position", order: "ASC" }] },
              cover: { associations: { media: {} } }
            } 
          },
          configuratorSettings: { 
            associations: { option: { associations: { group: {} } } } 
          },
          media: { limit: 50, associations: { media: {} }, sort: [{ field: "position", order: "ASC" }] },
          cover: { associations: { media: {} } },
          manufacturer: { associations: { media: {} } },
          // OPTIMALIZÁCIA: Stiahneme len najzákladnejšie dáta kategórie s "path"
          categories: { 
            includes: { category: ["id", "name", "translated", "path", "seoUrls"] },
            associations: { seoUrls: {} }
          },
          seoUrls: {}
        }
      }
    }).catch((err: any) => {
      console.error("[SLICKLY Product Fetch Error]", err);
      errors.value.push(err.message || "Product fetch failed");
      return null;
    });

    const productData = (productRes as any)?.data?.elements?.[0];

    if (!productData) {
      return { productResponse: null, breadcrumbs: null };
    }

    // 2) Variant Logic (Parent Fallback)
    if (productData.parentId) {
      try {
        const parentRes = await apiClient.invoke("readProduct post /product", {
          headers: { 'sw-language-id': currentLanguageId.value },
          body: {
            filter: [{ type: "equals", field: "id", value: productData.parentId }],
            associations: {
              properties: { associations: { group: {} } },
              children: { 
                limit: 50, 
                associations: { 
                  options: { limit: 50, associations: { group: {} } },
                  deliveryTime: {},
                  media: { limit: 50, associations: { media: {} }, sort: [{ field: "position", order: "ASC" }] },
                  cover: { associations: { media: {} } }
                } 
              },
              configuratorSettings: { 
                associations: { option: { associations: { group: {} } } } 
              },
              media: { limit: 50, associations: { media: {} }, sort: [{ field: "position", order: "ASC" }] },
              cover: { associations: { media: {} } },
              manufacturer: { associations: { media: {} } },
              seoUrls: {}
            }
          }
        });
        const parentProduct = (parentRes as any)?.data?.elements?.[0];
        if (parentProduct) {
          if (!productData.media?.length && parentProduct.media?.length) {
            productData.media = parentProduct.media;
          }
          if (!productData.cover?.media?.url && parentProduct.cover?.media?.url) {
            productData.cover = parentProduct.cover;
          }
          if (parentProduct.configuratorSettings) {
             // Merging parent configurator settings for UI
            productData.configuratorSettings = parentProduct.configuratorSettings;
          }
          if (parentProduct.children) {
            productData.children = parentProduct.children.elements || parentProduct.children;
            productData.childCount = parentProduct.childCount;
          }
          // MOC/PMOC a iné customFields sú na parentovi — zlúč ako základ,
          // variant vlastnými hodnotami prepíše (field-level inheritance).
          // POZOR: customFields je prekladateľné pole → reálna hodnota je v
          // `translated.customFields`, top-level `customFields` býva {}.
          const parentCF = { ...(parentProduct.customFields || {}), ...(parentProduct.translated?.customFields || {}) };
          if (Object.keys(parentCF).length) {
            productData.customFields = { ...parentCF, ...(productData.customFields || {}) };
          }
        }
      } catch (parentErr) {
        console.error("[SLICKLY SSR] Parent product fetch failed:", parentErr);
      }
    }

    // 3) Resolve custom field media UUIDs → URLs in a single batch request.
    // product.media contains only gallery images; custom field references (mts_feat_img etc.)
    // are separate Media entities that must be fetched explicitly.
    const customFieldMediaIds = [
      productData.customFields?.mts_feat_img,
      productData.customFields?.mts_grid1_img,
      productData.customFields?.mts_grid2_img,
      productData.customFields?.mts_grid3_img,
      productData.customFields?.mts_grid4_img,
      productData.customFields?.mts_video_file,
    ].filter(Boolean) as string[];

    const customFieldsMediaMap: Record<string, string> = {};

    if (customFieldMediaIds.length > 0) {
      // Resolve via internal Nitro server route → Shopware Admin API.
      // Admin credentials stay server-side, client never sees them.
      try {
        const resolved = await $fetch<Record<string, string>>('/api/resolve-media', {
          method: 'POST',
          body: { ids: customFieldMediaIds },
        });
        for (const [id, url] of Object.entries(resolved)) {
          customFieldsMediaMap[id] = proxyMediaUrl(url);
        }
      } catch {
        // Silent fail — images from custom fields won't display
      }
    }

    // 4) DYNAMIC BREADCRUMBS (Flat Path Architecture)
    let dynamicBreadcrumbs: any[] = [];
    
    // Získať najhlbšiu kategóriu podľa dĺžky property 'path'
    let targetCategory = productData.seoCategory;
    
    if (!targetCategory && productData.categories && productData.categories.length > 0) {
      targetCategory = productData.categories.reduce((prev: any, current: any) => {
        const prevDepth = (prev.path || '').split('|').length;
        const currDepth = (current.path || '').split('|').length;
        return currDepth > prevDepth ? current : prev;
      });
    }

    if (targetCategory && targetCategory.path) {
      // 'path' obsahuje všetky UUID nadradených kategórií. Extrahujeme ich.
      const pathIds = targetCategory.path.split('|').filter(Boolean);
      pathIds.push(targetCategory.id); // Pridáme aj samotnú (aktuálnu) kategóriu

      try {
        // Fetch všetkých kategórií v strome naraz (Jeden rýchly dotaz na index)
        const categoriesRes = await apiClient.invoke("readCategory post /category" as any, {
          headers: { 'sw-language-id': currentLanguageId.value },
          body: {
            filter: [{ type: "equalsAny", field: "id", value: pathIds }],
            // Optimalizácia: Sťahujeme iba to, čo vizuálne potrebujeme pre Breadcrumb
            includes: { category: ["id", "name", "translated", "seoUrls"] },
            associations: { seoUrls: {} }
          }
        });

        const categories = (categoriesRes as any)?.data?.elements || [];

        // Poskladáme Breadcrumbs presne v poradí hierarchie zhora nadol
        dynamicBreadcrumbs = pathIds.map((id: string) => {
          const cat = categories.find((c: any) => c.id === id);
          
          // Skrytie interných Root kategórií, ktoré v UI nedávajú zmysel
          if (!cat || cat.name === 'Catalogue' || cat.name === 'Root') return null; 
          
          return {
            name: cat.translated?.name || cat.name,
            path: cat.seoUrls?.[0]?.seoPathInfo || `navigation/${cat.id}`
          };
        }).filter(Boolean);

      } catch (err) {
        console.error("[SLICKLY Breadcrumb] Failed to fetch category tree", err);
      }
    }

    return {
      productResponse: { product: productData, configurator: productData.configuratorSettings },
      breadcrumbs: dynamicBreadcrumbs,
      customFieldsMediaMap,
      deepestCategoryId: targetCategory?.id || null,
    };
  },
  {
    watch: [currentLanguageId, () => route.query.variant]
  }
);

// ✅ CRITICAL: We only process the following logic once data is actually present.
// Since it's now lazy, this runs on mount and every time data resolves.
watch(data, (newData) => {
  if (!newData) return;

  if (newData.breadcrumbs && newData.breadcrumbs.length > 0) {
    buildDynamicBreadcrumbs(newData.breadcrumbs);
  }

  const productResponse = newData.productResponse;
  
  if (productResponse && productResponse.product) {
    useProductJsonLD(productResponse.product, newData.breadcrumbs ?? []);
    pushBreadcrumb({
      name: getProductName({ product: productResponse.product }) ?? "",
      path: `/${productResponse.product.seoUrls?.[0]?.seoPathInfo || ''}`,
    });
    
    // Thumbnails optimization logic
    const p = productResponse.product;
    if (p.cover?.media) p.cover.media.thumbnails = [];
    if (p.media) p.media.forEach((m: any) => { if (m.media) m.media.thumbnails = []; });
  }
}, { immediate: true });

// Safely initialize the product composable with a reactive ref and an empty fallback
const productSource = computed(() => data.value?.productResponse?.product || {} as any);
const configuratorSource = computed(() => data.value?.productResponse?.configurator || [] as any);
const { product } = useProduct(productSource, configuratorSource);

// ─── Image Preloading (REMOVED) ───────────────────────────────
// We no longer manually inject useHead preload for images here because it often mismatches
// with the actual image rendered in ProductGallery, causing browser warnings.
// Native fetchpriority="high" on the main product image is sufficient.
// ─────────────────────────────────────────────────────────────

// Build the adapter object that ProductDetail.vue and its children expect.
// ProductDetail uses our own loose Product type (with [key:string]:any) so
// we can pass the raw Shopware ComputedRef product directly.
const adaptedProduct = computed<any>(() => {
  if (!data.value?.productResponse?.product) return null;
  
  // ✅ CRITICAL: Read directly from the original server response (before useProduct transforms it)
  // useProduct() destroys option mappings and calculcated nested prices during transform.
  const rawProduct = data.value.productResponse.product as any;

  // Build deduplicated gallery images from original media association
  const mediaSource = rawProduct.media || [];
  const coverUrl = rawProduct.cover?.media?.url || '';

  const galleryImages: string[] = Array.from(
    new Set(
      [
        coverUrl,
        ...mediaSource.map((m: any) => m.media?.url).filter(Boolean)
      ]
    )
  ).filter(Boolean) as string[];

  return {
    // Identity
    id:          rawProduct.id,
    parentId:    rawProduct.parentId,
    name:        rawProduct.translated?.name || rawProduct.name || "",
    description: rawProduct.translated?.description || rawProduct.description || "",
    category:    rawProduct.categories?.[0]?.translated?.name || rawProduct.categories?.[0]?.name || "",
    // Najhlbšia kategória — rovnaká logika ako breadcrumb (seoCategory → path depth)
    deepestCategoryId: data.value?.deepestCategoryId || null,
    breadcrumbs: data.value?.breadcrumbs || [],
    brand:       rawProduct.manufacturer?.translated?.name || rawProduct.manufacturer?.name || "",
    // Pricing
    price:           rawProduct.calculatedPrice?.unitPrice           ?? 0,
    oldPrice:        rawProduct.calculatedPrice?.listPrice?.price    ?? null,
    calculatedPrice: rawProduct.calculatedPrice,
    // Images
    image:      coverUrl || galleryImages[0] || "",
    images:     galleryImages,
    media:      rawProduct.media || [],
    childCount: rawProduct.childCount,
    children:   rawProduct.children,
    isCloseout: rawProduct.isCloseout === true,
    // Whether this is a parent 
    isParentProduct: (rawProduct.childCount ?? 0) > 0 && !rawProduct.parentId,
    // Configurator settings
    configuratorSettings: rawProduct.configuratorSettings || [],

    // Variants loop for legacy size selector
    // NOTE: rawProduct.children was already merged from parent in SSR logic above (lines 127-131)
    variants: (rawProduct.children || []).map((child: any) => {
      const optionLabel = child.options
        ?.map((o: any) => (o.translated?.name || o.name || "").split("(")[0].trim())
        .filter(Boolean)
        .join(" / ") || "";
      // Shopware property inheritance: child.isCloseout may be null when inherited from parent
      const isCloseout = (child.isCloseout ?? rawProduct.isCloseout) === true;
      const stock = child.availableStock ?? child.stock ?? 0;
      
      return {
        id:          child.id,
        size:        optionLabel || child.productNumber || child.id,
        sku:         child.productNumber,
        ean:         child.ean || "",
        name:        child.translated?.name || child.name || "",
        isCloseout:  isCloseout,
        stockStatus: stock > 0 ? "in_stock" :
                     (isCloseout ? "unavailable" : "on_order"),
        stockCount:  stock,
        optionIds:   child.optionIds || (child.options?.map((o: any) => o.id) || []),
      };
    }),
    categoryIds:       rawProduct.categories?.map((c: any) => c.id) || [],
    customFieldsMedia: data.value?.customFieldsMediaMap || {},
    reviewsCount:  rawProduct.productReviewsCount || 0,
    rating:        rawProduct.ratingAverage || 0,
    _raw:          rawProduct,
    // customFields je prekladateľné — reálne hodnoty (MOC/PMOC) sú v translated.customFields;
    // top-level customFields býva {}. Zlúč oboje, translated má prioritu.
    customFields:  { ...(rawProduct.customFields || {}), ...(rawProduct.translated?.customFields || {}) },
    manufacturer:   rawProduct.manufacturer,
    manufacturerId: rawProduct.manufacturerId ?? rawProduct.manufacturer?.id ?? null,
    createdAt:      rawProduct.createdAt,
    tagIds:         rawProduct.tagIds ?? [],
    categoryTree:   rawProduct.categoryTree ?? [],
    options:       rawProduct.options,
    optionIds:     rawProduct.optionIds,
    properties:    rawProduct.properties || [],
    seoUrls:       rawProduct.seoUrls,
  };
});

// ─── SEAMLESS TRANSITION logic (no loader, no flicker) ──────────────────
const stableAdaptedProduct = shallowRef<any>(null);
watch(adaptedProduct, (newP) => {
  if (newP) stableAdaptedProduct.value = newP;
}, { immediate: true });

// ✅ REFINEMENT: Clear stable product only when the BASE product (navigationId) changes.
// This allows the skeleton to show for NEW products, but keeps the UI stable for VARIANT switches.
watch(() => props.navigationId, () => {
    stableAdaptedProduct.value = null;
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── SEO and Metadata ────────────────────────────────────────────────────────
// useSeoMeta na top-level setup() — reaktívne cez getter funkcie, nie cez watch.
// Predchádzajúci prístup (useCmsHead inside watch) spôsoboval prázdny <title>:
//   - useHead nesmie byť volaný v watch callbacku
//   - computed(() => p) kde p je snapshot nie je reaktívny
const _rawProduct = computed(() => data.value?.productResponse?.product as any);

const _seoUrl    = computed(() => _rawProduct.value?.seoUrls?.[0]?.seoPathInfo || '');
const _seoName   = computed(() => _rawProduct.value?.translated?.name || _rawProduct.value?.name || '');
const _seoDesc   = computed(() => (_rawProduct.value?.translated?.metaDescription || '').replace(/<[^>]*>/g, '').substring(0, 160));
const _seoImage  = computed(() => _rawProduct.value?.cover?.media?.url || '');
const _siteUrl   = (useRuntimeConfig().public.siteUrl as string) || 'https://mtsport.store';
const _canonical = computed(() => _seoUrl.value ? `${_siteUrl}/${_seoUrl.value}` : '');

const { locale: _locale } = useI18n();
const _ogLocaleMap: Record<string, string> = {
  sk: 'sk_SK', cz: 'cs_CZ', de: 'de_DE', hu: 'hu_HU', en: 'en_GB', pl: 'pl_PL',
};

useSeoMeta({
  title:              () => _seoName.value ? `${_seoName.value} | MT Sport` : 'MT Sport',
  ogTitle:            () => _seoName.value || 'MT Sport',
  description:        () => _seoDesc.value,
  ogDescription:      () => _seoDesc.value,
  ogImage:            () => _seoImage.value,
  ogType:             'product',
  ogLocale:           () => _ogLocaleMap[_locale.value] || 'sk_SK',
  ogUrl:              () => _canonical.value,
  twitterCard:        'summary_large_image',
  twitterTitle:       () => _seoName.value || 'MT Sport',
  twitterDescription: () => _seoDesc.value,
  twitterImage:       () => _seoImage.value,
});

useHead({
  link: [{ rel: 'canonical', href: () => _canonical.value }],
});

// ─── RECENTLY VIEWED (localStorage — IDs only, limit 12) ─────────────────────
// Ukladá ID SYNCHRONNE pri watchi na stableAdaptedProduct — pred mountom children,
// aby ProductDetail.vue mohol hneď čítať aktuálne dáta pri onMounted.
watch(stableAdaptedProduct, (p) => {
    if (!p?.id || !import.meta.client) return;
    try {
        const raw = localStorage.getItem('mtsport_recently_viewed');
        let ids: string[] = [];
        try { ids = JSON.parse(raw || '[]'); } catch { ids = []; }
        if (!Array.isArray(ids)) ids = [];
        // Ukladaj vždy parentId (ak je variant) — zobrazujú sa len parenty
        const saveId = p.parentId || p.id;
        ids = [saveId, ...ids.filter((id: string) => id !== saveId)].slice(0, 12);
        localStorage.setItem('mtsport_recently_viewed', JSON.stringify(ids));
    } catch (e) {
        console.error("Failed to update mtsport_recently_viewed in localStorage", e);
    }
}, { immediate: true });

onMounted(() => {
    if (stableAdaptedProduct.value?.id) {
        try {
            const raw = localStorage.getItem('mtsport_recently_viewed');
            let ids: string[] = [];
            try { ids = JSON.parse(raw || '[]'); } catch { ids = []; }
            if (!Array.isArray(ids)) ids = [];
            const saveId = stableAdaptedProduct.value.parentId || stableAdaptedProduct.value.id;
            ids = [saveId, ...ids.filter((id: string) => id !== saveId)].slice(0, 12);
            localStorage.setItem('mtsport_recently_viewed', JSON.stringify(ids));
        } catch (e) {
            console.error("Failed to update mtsport_recently_viewed in localStorage", e);
        }
    }
});
// ─────────────────────────────────────────────────────────────────────────────

</script>

<template>
  <div id="SLICKLY-CUSTOM-PDP-MARKER" class="sr-only" aria-hidden="true" />

  <div class="relative">
    <!-- Component-based conditional rendering -->
    <!-- We show ProductDetail if we have a stable product (even if pending/fetching new variant) -->
    <template v-if="stableAdaptedProduct">
      <ProductDetail :product="stableAdaptedProduct" />
    </template>
    <ClientOnly v-else>
      <ProductDetailSkeleton />
    </ClientOnly>
  </div>
</template>

<style scoped>
</style>