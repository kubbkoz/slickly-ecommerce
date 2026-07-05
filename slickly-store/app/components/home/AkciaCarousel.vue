<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useLocalePath, useAsyncData } from '#imports';
import { sanitizeHtml } from '~/utils/sanitize';
import ProductCard from '~/components/frontend/product/ProductCard.vue';
import BackendErrorState from '~/components/ui/BackendErrorState.vue';

// ─── Config ──────────────────────────────────────────────────────────────────
const config = useRuntimeConfig();

// "Super ponuka" kategória — heading + popis + priradený produktový stream
const SUPER_PONUKA_CATEGORY_ID = config.public.shopware.ids.categories.flashSales as string;

// ─── UI State ─────────────────────────────────────────────────────────────────
const scrollContainerRef = ref<HTMLElement | null>(null);
const isPaused = ref(false);

// ─── Lifecycle & Auto Scroll (Registered BEFORE any await) ──────────────────
onMounted(() => {
    const scrollInterval = setInterval(() => {
        if (!isPaused.value && scrollContainerRef.value && !pending.value) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.value;
            const isEnd = scrollLeft + clientWidth >= scrollWidth - 10;
            scrollContainerRef.value.scrollTo({
                left: isEnd ? 0 : scrollLeft + 350,
                behavior: 'smooth'
            });
        }
    }, 3500);
    onUnmounted(() => clearInterval(scrollInterval));
});

// ─── Composables ─────────────────────────────────────────────────────────────
const localePath = useLocalePath();
const { apiClient } = useShopwareContext();
// Key on route-derived currentLanguageId (stable SSR→client), NOT
// session-derived languageIdChain which only resolves post-hydration and would
// change the key, re-triggering the fetch and blanking the carousel 1-3s.
const { currentLanguageId } = useShopwareLanguage();

// ─── Data Fetch (jeden fetch — produkty z priradeného streamu, filter client-side) ──
const { data, pending, refresh } = await useAsyncData(
    `super-ponuka-${currentLanguageId.value}`,
    async () => {
        // ── 1. Metadata kategórie (názov + popis, language-aware) ──
        let sectionTitle = '';
        let sectionSubtitle = '';
        try {
            const catRes = await apiClient.invoke('readCategoryList post /category' as any, {
                headers: { 'sw-language-id': currentLanguageId.value },
                body: {
                    filter: [{ type: 'equals', field: 'id', value: SUPER_PONUKA_CATEGORY_ID }],
                    limit: 1,
                }
            });
            const cat = catRes.data?.elements?.[0];
            sectionTitle    = cat?.translated?.name        || cat?.name        || '';
            sectionSubtitle = cat?.translated?.description || cat?.description || '';
        } catch {
            // Render bez headingu pri chybe
        }

        // ── 2. Produkty priradené kategórii (product-listing rešpektuje Dynamickú skupinu / stream) ──
        let products: any[] = [];
        try {
            const res = await apiClient.invoke(
                `readProductListing post /product-listing/{categoryId}` as any,
                {
                    pathParams: { categoryId: SUPER_PONUKA_CATEGORY_ID },
                    body: {
                        limit: 24,
                        associations: {
                            cover: { associations: { media: {} } },
                            manufacturer: { associations: { media: {} } },
                            options: { associations: { group: {} } },
                            media: { associations: { media: {} } },
                            seoUrls: {},
                            children: {
                                associations: {
                                    options: { associations: { group: {} } },
                                    properties: { associations: { group: {} } }
                                }
                            },
                            productReviews: {}
                        },
                        includes: {
                            product: [
                                'id', 'name', 'description', 'translated', 'cover', 'manufacturer', 'options',
                                'seoUrls', 'calculatedPrice', 'childCount', 'children', 'media',
                                'ratingAverage', 'productReviewsCount', 'reviewCount', 'customFields',
                                'availableStock', 'isCloseout', 'categoryTree', 'categoryIds',
                            ],
                            product_media: ['media'],
                            media: ['url', 'thumbnails', 'fileName', 'mimeType'],
                            media_thumbnail: ['url', 'width'],
                            product_manufacturer: ['id', 'name', 'translated', 'media'],
                            property_group_option: ['id', 'name', 'translated', 'group'],
                            property_group: ['id', 'name', 'translated'],
                            seo_url: ['seoPathInfo', 'isCanonical'],
                        }
                    }
                }
            );
            products = res.data?.elements || [];
        } catch (e) {
            console.error('[SuperPonuka] Failed to fetch product listing:', e);
            throw e;
        }

        return { sectionTitle, sectionSubtitle, products };
    },
    { watch: [currentLanguageId] }
);

const sectionTitle    = computed(() => data.value?.sectionTitle    || '');
const sectionSubtitle = computed(() => data.value?.sectionSubtitle || '');
const products = computed(() => data.value?.products || []);

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
  <section v-if="!data && !pending" class="py-12 bg-gray-50 border-b border-gray-100">
    <div class="container mx-auto px-4 lg:px-8">
      <BackendErrorState title="AKCIA DOČASNE NEDOSTUPNÁ" @retry="refresh" />
    </div>
  </section>

  <section v-else-if="products.length || pending" class="pt-24 pb-8 bg-white border-b border-gray-100">
      <div class="container mx-auto px-4 lg:px-8">

          <!-- Header -->
          <div class="flex flex-col lg:flex-row justify-between items-end mb-10 gap-6">
              <div class="text-left w-full lg:w-auto">
                   <h2 class="section-h2 mb-4">
                     <template v-if="sectionTitle">
                       {{ sectionTitle.split(' ').slice(0, -1).join(' ') }}
                       <span class="text-brand">{{ sectionTitle.split(' ').at(-1) }}</span>
                     </template>
                   </h2>

                   <div class="section-decorator mb-6"></div>
                   <div v-if="sectionSubtitle" class="text-gray-600 text-sm md:text-base lg:text-lg max-w-3xl font-normal leading-relaxed font-sans" v-html="sanitizeHtml(sectionSubtitle)"></div>
              </div>

              <!-- Navigation arrows (desktop) -->
              <div class="hidden lg:flex gap-3 pb-1">
                  <button @click="scroll('left')" class="btn-nav-arrow" aria-label="Posunúť doľava">
                      <ChevronLeft class="w-6 h-6" aria-hidden="true" />
                  </button>
                  <button @click="scroll('right')" class="btn-nav-arrow" aria-label="Posunúť doprava">
                      <ChevronRight class="w-6 h-6" aria-hidden="true" />
                  </button>
              </div>
          </div>

          <!-- Carousel -->
          <div
             ref="scrollContainerRef"
             class="flex gap-4 overflow-x-auto pb-16 -mx-4 px-4 md:px-0 scroll-smooth snap-x snap-mandatory hide-scrollbar"
             @mouseenter="isPaused = true"
             @mouseleave="isPaused = false"
             @touchstart="isPaused = true"
             @touchend="isPaused = false"
          >
             <!-- Skeleton loaders while fetching -->
             <template v-if="pending && products.length === 0">
                 <div v-for="i in 6" :key="`fs-skeleton-${i}`" class="min-w-[280px] sm:min-w-[300px] lg:min-w-[320px] bg-white border border-gray-100 flex-shrink-0 snap-center">
                     <div class="aspect-square bg-gray-100 animate-pulse"></div>
                     <div class="p-4 space-y-2">
                         <div class="h-3 bg-gray-200 animate-pulse w-1/3 rounded-default"></div>
                         <div class="h-3 bg-gray-200 animate-pulse w-3/4 rounded-default"></div>
                         <div class="h-5 bg-gray-200 animate-pulse w-2/5 mt-2 rounded-default"></div>
                     </div>
                 </div>
             </template>
             <ProductCard
                v-else
                v-for="product in products"
                :key="product.id"
                :product="product"
                class="min-w-[280px] sm:min-w-[300px] lg:min-w-[320px] snap-center animate-fade-in"
             />
          </div>
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
