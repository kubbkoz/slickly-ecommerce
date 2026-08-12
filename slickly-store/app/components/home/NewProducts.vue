<script setup lang="ts">
import { Heart, Scale, Eye, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import AddToCartButton from '~/components/ui/AddToCartButton.vue';
import QuickViewModal from '~/components/ui/QuickViewModal.vue';
import ProductCard from '~/components/frontend/product/ProductCard.vue';

const props = defineProps<{
    products?: any[];
}>();

const { apiClient } = useShopwareContext();
// Route-stable language id — see homepage sections: keying on session-derived
// languageIdChain re-triggers the fetch after hydration and blanks the section.
const { currentLanguageId } = useShopwareLanguage();
const localePath = useLocalePath();

const selectedProduct = ref<any>(null);

// ─── Data Fetch ───────────────────────────────────────────────────────────────
const { data: fetchedProducts, pending } = await useAsyncData(
    `new-products-${currentLanguageId.value}`,
    async () => {
        try {
            const res = await apiClient.invoke('readProductList post /product' as any, {
                headers: { 'sw-language-id': currentLanguageId.value },
                body: {
                    limit: 8,
                    sort: [
                        { field: 'createdAt', order: 'desc' }
                    ],
                    filter: [
                        { type: 'equals', field: 'parentId', value: null }
                    ],
                    associations: {
                        cover: { associations: { media: {} } },
                        // PERF: ProductCard číta len manufacturer.translated.name → media netreba.
                        manufacturer: {},
                        options: { associations: { group: {} } },
                        media: { associations: { media: {} } },
                        seoUrls: {},
                        children: {
                            associations: {
                                options: { associations: { group: {} } },
                                properties: { associations: { group: {} } }
                            }
                        },
                        // PERF: `configuratorSettings` a `productReviews` odstránené —
                        // ProductCard ich nerenderuje (rating je skalár, varianty z `children`).
                    },
                    // FIX-API: Restrict payload to avoid large JSON response
                    includes: {
                        product: [
                            'id', 'name', 'description', 'translated', 'cover', 'manufacturer', 'options',
                            'seoUrls', 'calculatedPrice', 'childCount', 'children', 'media',
                            'ratingAverage', 'productReviewsCount', 'availableStock', 'isCloseout',
                            'createdAt', 'tagIds', 'categoryTree', 'manufacturerId'
                        ],
                        product_media: ['media'],
                        media: ['url', 'thumbnails', 'fileName', 'mimeType'],
                        media_thumbnail: ['url', 'width'],
                        product_manufacturer: ['id', 'name', 'translated'],
                        property_group_option: ['id', 'name', 'translated', 'group'],
                        property_group: ['id', 'name', 'translated'],
                        seo_url: ['seoPathInfo', 'isCanonical'],
                    }
                }
            });

            // ProductCard expects raw Shopware objects, so just return the elements directly
            return res.data?.elements || [];
        } catch (e) {
            console.error('[NewProducts] Failed to fetch products:', e);
            return [];
        }
    },
    { watch: [currentLanguageId] }
);

const displayProducts = computed(() => 
    (props.products && props.products.length > 0) ? props.products : (fetchedProducts.value || [])
);

// calculateDiscount removed — handled inside ProductCard

const handleProductClick = (product: any) => {
    if (product.url) navigateTo(localePath(product.url));
};

const handleViewDetails = (product: any) => {
    if (product.url) navigateTo(localePath(product.url));
};

const { target, isVisible } = useScrollReveal();

const scrollContainerRef = ref<HTMLElement | null>(null);
const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.value) return;
    const current = scrollContainerRef.value.scrollLeft;
    scrollContainerRef.value.scrollTo({
        left: direction === 'left' ? current - 350 : current + 350,
        behavior: 'smooth'
    });
};
</script>

<template>
  <section ref="target" class="py-24 bg-white">
      <div class="container mx-auto px-4 lg:px-8">
          <div class="reveal-base flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10" :class="isVisible ? 'reveal-visible' : 'reveal'">
              <div>
                  <span class="section-eyebrow">Práve pridané</span>
                  <h2 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase font-tech tracking-tight leading-[0.95]">
                      Novinky v <span class="text-brand">ponuke</span>
                  </h2>
              </div>
              <div class="hidden lg:flex gap-3">
                  <button @click="scroll('left')" class="btn-nav-arrow" aria-label="Posunúť doľava">
                      <ChevronLeft class="w-6 h-6" aria-hidden="true" />
                  </button>
                  <button @click="scroll('right')" class="btn-nav-arrow" aria-label="Posunúť doprava">
                      <ChevronRight class="w-6 h-6" aria-hidden="true" />
                  </button>
              </div>
          </div>

          <div
             ref="scrollContainerRef"
             class="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:px-0 scroll-smooth snap-x snap-mandatory hide-scrollbar"
          >
              <!-- Skeleton loaders while fetching -->
              <template v-if="pending && displayProducts.length === 0">
                  <div v-for="i in 8" :key="`skeleton-${i}`" class="min-w-[240px] sm:min-w-[280px] card-surface overflow-hidden flex-shrink-0 snap-center">
                      <div class="aspect-square bg-gray-100 animate-pulse"></div>
                      <div class="p-3 md:p-4 space-y-2">
                          <div class="h-3 bg-gray-200 animate-pulse w-1/3 rounded-default"></div>
                          <div class="h-3 bg-gray-200 animate-pulse w-3/4 rounded-default"></div>
                          <div class="h-3 bg-gray-200 animate-pulse w-1/2 rounded-default"></div>
                          <div class="h-5 bg-gray-200 animate-pulse w-2/5 mt-3 rounded-default"></div>
                      </div>
                  </div>
              </template>
              <ProductCard
                  v-else
                  v-for="product in displayProducts"
                  :key="product.id"
                  :product="product"
                  class="min-w-[240px] sm:min-w-[280px] flex-shrink-0 snap-center"
              />
          </div>

          <QuickViewModal
             :is-open="!!selectedProduct"
             :product="selectedProduct"
             @close="selectedProduct = null"
             @view-details="handleViewDetails(selectedProduct)"
          />
      </div>
  </section>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
