<script setup lang="ts">
import { ArrowLeft, Building2 } from 'lucide-vue-next';
import {
  useRoute, useAsyncData, useRuntimeConfig, useSeoMeta, createError, useLocalePath,
  useShopwareContext, useShopwareLanguage,
} from '#imports';
import ProductCard from '~/components/frontend/product/ProductCard.vue';
import ManufacturerInfo from '~/components/product/ManufacturerInfo.vue';

interface ManufacturerItem {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  link: string | null;
  productCount: number;
}

const route = useRoute();
const config = useRuntimeConfig();
const localePath = useLocalePath();
const { apiClient } = useShopwareContext();
const { currentLanguageId } = useShopwareLanguage();

const slug = computed(() => String(route.params.slug || ''));
const ROOT_CATEGORY_ID = config.public.shopware.ids.rootCategory as string;
const PAGE_SIZE = 24;

// ─── Výrobca podľa slugu (cached zoznam) ──────────────────────────────────────
const { data: manufacturer } = await useAsyncData(
  () => `brand-meta-${slug.value}`,
  async () => {
    const list = await $fetch<ManufacturerItem[]>('/api/manufacturers');
    return (list || []).find((m) => m.slug === slug.value) || null;
  },
  { watch: [slug] }
);

if (!manufacturer.value) {
  throw createError({ statusCode: 404, message: `Značka nenájdená: ${slug.value}`, fatal: true });
}

// ─── Sort ─────────────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'name-asc',   label: 'Názov A–Z' },
  { value: 'name-desc',  label: 'Názov Z–A' },
  { value: 'price-asc',  label: 'Najlacnejšie' },
  { value: 'price-desc', label: 'Najdrahšie' },
];
const sortBy = ref('name-asc');

// ─── Build product-listing body ───────────────────────────────────────────────
const buildBody = (p: number) => ({
  limit: PAGE_SIZE,
  p,
  order: sortBy.value,
  manufacturer: manufacturer.value!.id,
  associations: {
    cover: { associations: { media: {} } },
    manufacturer: { associations: { media: {} } },
    options: { associations: { group: {} } },
    media: { associations: { media: {} } },
    seoUrls: {},
    children: {
      associations: {
        options: { associations: { group: {} } },
        properties: { associations: { group: {} } },
      },
    },
    productReviews: {},
  },
  includes: {
    product: [
      'id', 'name', 'description', 'translated', 'cover', 'manufacturer', 'options',
      'seoUrls', 'calculatedPrice', 'childCount', 'children', 'media',
      'ratingAverage', 'productReviewsCount', 'reviewCount', 'customFields',
      'availableStock', 'isCloseout', 'categoryTree', 'categoryIds',
      'createdAt', 'tagIds', 'manufacturerId',
    ],
    product_media: ['media'],
    media: ['url', 'thumbnails', 'fileName', 'mimeType'],
    media_thumbnail: ['url', 'width'],
    // Rozšírené pre ManufacturerInfo panel — description + custom fields (rovnaké ako PDP DistributorTab)
    product_manufacturer: ['id', 'name', 'translated', 'link', 'description', 'customFields', 'media'],
    property_group_option: ['id', 'name', 'translated', 'group'],
    property_group: ['id', 'name', 'translated'],
    seo_url: ['seoPathInfo', 'isCanonical'],
  },
});

const fetchPage = async (p: number) => {
  const res: any = await apiClient.invoke(
    'readProductListing post /product-listing/{categoryId}' as any,
    {
      pathParams: { categoryId: ROOT_CATEGORY_ID },
      headers: { 'sw-language-id': currentLanguageId.value },
      body: buildBody(p),
    }
  );
  return {
    elements: (res.data?.elements || []) as any[],
    total: (res.data?.total ?? 0) as number,
  };
};

// ─── Initial fetch (SSR, refetch pri zmene sortu) ─────────────────────────────
const { data, pending } = await useAsyncData(
  () => `brand-products-${slug.value}-${sortBy.value}`,
  () => fetchPage(1),
  { watch: [sortBy, slug] }
);

// ─── Load-more (client append) ────────────────────────────────────────────────
const extraPages = ref<any[]>([]);
const page = ref(1);
const loadingMore = ref(false);

watch([sortBy, slug], () => { extraPages.value = []; page.value = 1; });

const products = computed(() => [...(data.value?.elements || []), ...extraPages.value]);
const total = computed(() => data.value?.total ?? 0);

const loadMore = async () => {
  if (loadingMore.value || products.value.length >= total.value) return;
  loadingMore.value = true;
  try {
    page.value += 1;
    const res = await fetchPage(page.value);
    extraPages.value.push(...res.elements);
  } catch (e) {
    console.error('[znacka] loadMore failed:', e);
    page.value -= 1;
  } finally {
    loadingMore.value = false;
  }
};

// ─── Manufacturer panel data — rich z produktu (description + customFields),
//     fallback na basic zo zoznamu ak značka nemá produkty ──────────────────────
const panelManufacturer = computed(() => {
  const full = products.value[0]?.manufacturer;
  if (full) return full;
  const b = manufacturer.value;
  return b ? { name: b.name, media: { url: b.logoUrl }, link: b.link } : null;
});

// ─── SEO ──────────────────────────────────────────────────────────────────────
useSeoMeta({
  title: () => `${manufacturer.value?.name} — všetky produkty`,
  description: () => `Všetky produkty značky ${manufacturer.value?.name} v ponuke SLICKLY.`,
});
</script>

<template>
  <div class="bg-white min-h-screen">
    <div class="container mx-auto px-4 lg:px-8 py-12 md:py-16">

      <!-- Manufacturer info panel (header) -->
      <div class="mb-10 md:mb-12">
        <ManufacturerInfo :manufacturer="panelManufacturer" heading :products-link="null" />
      </div>

      <!-- Toolbar: späť (vľavo) + sort (vpravo) -->
      <div class="flex items-center justify-between gap-4 mb-6 border-t border-gray-100 pt-6">
        <NuxtLink
          :to="localePath('/znacky')"
          class="inline-flex items-center gap-2 font-tech text-xs md:text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-brand transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          Späť na všetky značky
        </NuxtLink>

        <select
          v-if="products.length"
          v-model="sortBy"
          class="form-input !w-auto text-sm font-tech uppercase tracking-wide cursor-pointer"
          aria-label="Zoradiť"
        >
          <option v-for="opt in SORT_OPTIONS" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <!-- Skeleton -->
      <div
        v-if="pending && !products.length"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4"
      >
        <div v-for="i in 8" :key="`sk-${i}`" class="bg-white border border-gray-100">
          <div class="aspect-square bg-gray-100 animate-pulse" />
          <div class="p-4 space-y-2">
            <div class="h-3 bg-gray-200 animate-pulse w-1/3" />
            <div class="h-3 bg-gray-200 animate-pulse w-3/4" />
            <div class="h-5 bg-gray-200 animate-pulse w-2/5 mt-2" />
          </div>
        </div>
      </div>

      <!-- Product grid -->
      <div
        v-else-if="products.length"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4"
      >
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="py-20 text-center">
        <Building2 class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-400 font-bold uppercase text-sm tracking-widest">
          Pre túto značku momentálne nie sú produkty
        </p>
      </div>

      <!-- Load More — design totožný s category listing -->
      <div v-if="products.length < total" class="mt-8 md:mt-12 text-center pb-8">
        <p class="text-gray-400 text-[10px] md:text-xs mb-4 font-bold uppercase tracking-widest font-sans">
          Zobrazených {{ products.length }} z {{ total }} produktov
        </p>
        <div class="w-48 md:w-64 h-1 bg-gray-100 mx-auto mb-6 md:mb-8 rounded-full overflow-hidden">
          <div class="h-full bg-brand transition-all duration-700" :style="{ width: `${(products.length / total) * 100}%` }"></div>
        </div>
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="relative bg-black text-white hover:bg-gray-800 px-6 py-3 md:px-10 md:py-4 uppercase tracking-widest text-xs md:text-sm font-bold min-w-[200px] md:min-w-[240px] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Načítať viac produktov"
        >
          <span class="flex items-center justify-center gap-2">
            <span v-if="loadingMore" class="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse"></span>
            Načítať ďalšie produkty
          </span>
        </button>
      </div>

    </div>
  </div>
</template>
