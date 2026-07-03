<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import ProductCard from '~/components/frontend/product/ProductCard.vue';
import BackendErrorState from '~/components/ui/BackendErrorState.vue';

const { apiClient } = useShopwareContext();
const { languageIdChain } = useSessionContext();
const config = useRuntimeConfig();

const TABS = [
  { label: 'Bicykle',  id: config.public.shopware.ids.categories.bikes   as string },
  { label: 'E-Bike',   id: config.public.shopware.ids.categories.ebikes  as string },
  { label: 'Doplnky',  id: config.public.shopware.ids.categories.doplnky as string },
];

const activeTab = ref(0);
const scrollContainerRef = ref<HTMLElement | null>(null);

const { data: products, pending, refresh } = useAsyncData(
  `bestsellery-${languageIdChain.value}-${activeTab.value}`,
  async () => {
    const catId = TABS[activeTab.value].id;
    if (!catId) return [];
    try {
      const res = await apiClient.invoke(
        'readProductListing post /product-listing/{categoryId}' as any,
        {
          pathParams: { categoryId: catId },
          body: {
            limit: 16,
            filter: [{ type: 'equals', field: 'parentId', value: null }],
            sort: [{ field: 'sales', order: 'DESC' }],
            associations: {
              cover: { associations: { media: {} } },
              manufacturer: {},
              options: { associations: { group: {} } },
              seoUrls: {},
              children: {
                associations: { options: { associations: { group: {} } } },
              },
            },
            includes: {
              product: [
                'id', 'name', 'description', 'translated', 'cover', 'manufacturer', 'options',
                'seoUrls', 'calculatedPrice', 'childCount', 'children',
                'availableStock', 'isCloseout',
              ],
              product_media: ['media'],
              media: ['url', 'thumbnails'],
              media_thumbnail: ['url', 'width'],
              product_manufacturer: ['id', 'name', 'translated'],
              property_group_option: ['id', 'name', 'translated', 'group'],
              property_group: ['id', 'name', 'translated'],
              seo_url: ['seoPathInfo', 'isCanonical'],
            },
          },
        }
      );
      return res.data?.elements || [];
    } catch (e) {
      console.error('[Bestsellery] fetch failed:', e);
      throw e;
    }
  },
  { watch: [languageIdChain, activeTab] }
);

const scroll = (direction: 'left' | 'right') => {
  if (!scrollContainerRef.value) return;
  const current = scrollContainerRef.value.scrollLeft;
  scrollContainerRef.value.scrollTo({
    left: direction === 'left' ? current - 350 : current + 350,
    behavior: 'smooth',
  });
};

const handleTabChange = (idx: number) => {
  activeTab.value = idx;
  if (scrollContainerRef.value) {
    scrollContainerRef.value.scrollTo({ left: 0, behavior: 'smooth' });
  }
  scrollProgress.value = 0;
};

const scrollProgress = ref(0);
const onCarouselScroll = () => {
  const el = scrollContainerRef.value;
  if (!el) return;
  const max = el.scrollWidth - el.clientWidth;
  scrollProgress.value = max > 0 ? el.scrollLeft / max : 0;
};
</script>

<template>
  <section v-if="!products && !pending" class="py-12 bg-gray-50 border-b border-gray-100">
    <div class="container mx-auto px-4 lg:px-8">
      <BackendErrorState title="BESTSELLERY DOČASNE NEDOSTUPNÉ" @retry="refresh" />
    </div>
  </section>

  <section v-else class="py-24 bg-gray-50 border-b border-gray-100 overflow-hidden">
    <div class="container mx-auto px-4 lg:px-8">

      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-end mb-10 gap-6">
        <div class="text-left w-full lg:w-auto">
          <h2 class="section-h2 mb-4">
            Bestsellery <span class="text-brand">sezóny</span>
          </h2>
          <div class="section-decorator mb-6"></div>
          <p class="text-gray-500 font-medium font-sans max-w-xl">
            Najpredávanejšie produkty, ktoré si zákazníci obľúbili najviac.
          </p>
        </div>

        <!-- Nav arrows (desktop) -->
        <div class="hidden lg:flex gap-3 pb-1">
          <button @click="scroll('left')" class="btn-nav-arrow" aria-label="Posunúť doľava">
            <ChevronLeft class="w-6 h-6" aria-hidden="true" />
          </button>
          <button @click="scroll('right')" class="btn-nav-arrow" aria-label="Posunúť doprava">
            <ChevronRight class="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      <!-- Tab filters -->
      <div class="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
        <button
          v-for="(tab, idx) in TABS"
          :key="tab.id"
          @click="handleTabChange(idx)"
          :class="activeTab === idx ? 'btn-tab-active' : 'btn-tab-inactive'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Carousel -->
      <div
        ref="scrollContainerRef"
        class="flex gap-1 overflow-x-auto pb-28 -mx-4 px-4 md:px-0 scroll-smooth snap-x snap-mandatory hide-scrollbar"
        @scroll.passive="onCarouselScroll"
      >
        <!-- Skeleton -->
        <template v-if="pending && (!products || products.length === 0)">
          <div
            v-for="i in 4"
            :key="`skeleton-${i}`"
            class="min-w-[280px] sm:min-w-[300px] lg:min-w-[320px] snap-center bg-white border border-gray-100"
          >
            <div class="aspect-square bg-gray-100 animate-pulse"></div>
            <div class="p-4 space-y-2">
              <div class="h-3 bg-gray-200 animate-pulse w-1/3"></div>
              <div class="h-4 bg-gray-200 animate-pulse w-3/4"></div>
              <div class="h-4 bg-gray-200 animate-pulse w-1/2"></div>
            </div>
          </div>
        </template>

        <ProductCard
          v-else
          v-for="product in products"
          :key="product.id"
          :product="product"
          class="min-w-[280px] sm:min-w-[300px] lg:min-w-[320px] snap-center"
        />
      </div>

      <!-- Scroll progress (mobile only) -->
      <div class="flex lg:hidden justify-center mt-4">
        <div class="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-brand rounded-full transition-all duration-200"
            :style="`width: ${scrollProgress * 100}%`"
          />
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
