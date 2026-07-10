<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';
import { sanitizeHtml } from '~/utils/sanitize';
import BaseButton from '~/components/ui/BaseButton.vue';
import ProductCard from '~/components/frontend/product/ProductCard.vue';
import BackendErrorState from '~/components/ui/BackendErrorState.vue';

const { apiClient } = useShopwareContext();
// Route-derived language id — identical on server and client, unlike
// session-derived languageIdChain which resolves AFTER hydration and would
// otherwise change the useAsyncData key post-hydration, re-triggering the
// fetch and making the whole section blink out and refill 1-3s later.
const { currentLanguageId } = useShopwareLanguage();
const localePath = useLocalePath();
const { t } = useStaticTranslations();
const config = useRuntimeConfig();

const CATEGORY_ID = config.public.shopware.ids.categories.featured;

// ─── Data Fetch ───────────────────────────────────────────────────────────────
const { data: collectionData, pending, refresh } = await useAsyncData(
    `featured-collection-${currentLanguageId.value}`,
    async () => {
        try {
            // 1. Fetch Category Metadata
            const catRes = await apiClient.invoke('readCategory post /category/{categoryId}' as any, {
                headers: { 'sw-language-id': currentLanguageId.value },
                pathParams: { categoryId: CATEGORY_ID },
                body: {
                    associations: {
                        media: {},
                    }
                }
            });
            const cat = catRes.data;
            
            const customFields = cat?.translated?.customFields || cat?.customFields || {};

            // 2. Fetch last 4 Products from this Category with full associations for design sync
            const prodRes = await apiClient.invoke('readProductListing post /product-listing/{categoryId}' as any, {
                headers: { 'sw-language-id': currentLanguageId.value },
                pathParams: { categoryId: CATEGORY_ID },
                body: {
                    limit: 4,
                    sort: [
                        {
                            field: 'releaseDate',
                            order: 'desc'
                        }
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
                        // ProductCard ich nerenderuje (rating je skalár `ratingAverage`/
                        // `productReviewsCount`, varianty čerpá z `children`).
                    }
                }
            });

            const heroData = {
                title: cat?.translated?.name || cat?.name || '',
                description: cat?.translated?.description || cat?.description || '',
                image: proxyMediaUrl(cat?.media?.url || ''),
                badge: customFields.custom_hero_badge_text || '',
                buttonText: customFields.custom_hero_secondary_cta_label || customFields.custom_hero_cta_label || t('objavit_kolekciu') || 'Objaviť kolekciu',
                buttonLink: customFields.custom_hero_secondary_cta_link || customFields.custom_hero_cta_url || '#'
            };

            const products = prodRes.data?.elements || [];

            return { heroData, products };
        } catch (e) {
            console.error('[FeaturedCollection] Error:', e);
            throw e; // Zabezpečí, že useAsyncData prejde do stavu Error
        }
    },
    { watch: [currentLanguageId] }
);

const hero = computed(() => collectionData.value?.heroData);
const products = computed(() => collectionData.value?.products || []);

const handleHeroClick = () => {
    if (hero.value?.buttonLink) navigateTo(localePath(hero.value.buttonLink));
};
</script>

<template>
  <section v-if="!collectionData && !pending" class="py-16 bg-white">
    <div class="container mx-auto px-4 lg:px-8">
      <BackendErrorState title="KOLEKCIA NEDOSTUPNÁ" @retry="refresh" />
    </div>
  </section>

  <section v-else-if="hero || pending" class="pt-16 pb-24 bg-white border-b border-gray-100">
    <div class="container mx-auto px-4 lg:px-8">
      <!-- Header -->
      <div class="text-left mb-12">
        <h2 class="section-h2 mb-4">
          Vybrané <span class="text-brand">produkty</span>
        </h2>
        <div class="section-decorator mb-6"></div>
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
        <!-- Left Hero -->
        <div class="relative group overflow-hidden h-full min-h-[400px] rounded-default">
          <img v-if="hero?.image" :src="hero.image" :alt="hero.title || 'Featured Collection'" width="800" height="600" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-6 sm:p-8 md:p-12 w-full">
            <div v-if="hero?.badge" class="inline-block bg-amber rounded-sm px-3 py-1 md:px-4 md:py-1.5 mb-3 md:mb-4">
              <span class="block text-black text-[10px] md:text-xs font-bold uppercase tracking-widest font-tech">{{ hero.badge }}</span>
            </div>
            <h3 class="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase font-tech leading-[0.95] mb-3 md:mb-4 whitespace-pre-line text-shadow-lg">
              {{ hero?.title }}
            </h3>
            <div v-if="hero?.description" class="text-gray-100 font-sans mb-6 md:mb-8 max-w-md line-clamp-3 prose prose-invert prose-sm drop-shadow-md" v-html="sanitizeHtml(hero.description)"></div>
            <NuxtLink
              v-if="hero?.buttonText"
              :to="localePath(hero.buttonLink || '#')"
              class="inline-flex items-center justify-center gap-3 bg-brand hover:bg-brand-dark text-white font-tech font-bold uppercase tracking-widest text-sm px-8 py-4 transition-colors w-full sm:w-auto rounded-default"
            >
              {{ hero.buttonText }} <ArrowRight class="w-5 h-5" />
            </NuxtLink>
          </div>
        </div>

        <!-- Right Products Grid (2x2 on Desktop) -->
        <div class="grid grid-cols-2 gap-4 items-stretch h-full">
          <!-- Skeletons -->
          <template v-if="pending && products.length === 0">
            <div v-for="i in 4" :key="`skeleton-${i}`" class="group bg-white overflow-hidden flex flex-col relative border border-gray-100 p-4 rounded-default">
                <div class="relative w-full aspect-square bg-gray-100 animate-pulse mb-4 rounded-default"></div>
                <div class="h-4 bg-gray-200 animate-pulse w-1/4 mb-2"></div>
                <div class="h-3 bg-gray-200 animate-pulse w-3/4 mb-1"></div>
                <div class="h-3 bg-gray-200 animate-pulse w-1/2"></div>
            </div>
          </template>

          <ProductCard 
            v-else
            v-for="product in products" 
            :key="product.id"
            :product="product"
          />
          
          <!-- Empty placeholders if less than 4 products -->
          <template v-if="products.length < 4 && !pending">
            <div v-for="i in (4 - products.length)" :key="`empty-${i}`" class="bg-gray-100/50 border border-dashed border-gray-200 flex items-center justify-center p-6 text-gray-400 italic text-[10px] uppercase font-bold tracking-widest text-center min-h-[350px] rounded-default">
              Doplňte produkt v admine
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.prose-invert {
  --tw-prose-body: theme('colors.gray.100');
  --tw-prose-headings: theme('colors.white');
}
.text-shadow-lg {
  text-shadow: 0 4px 8px rgba(0,0,0,0.5);
}
</style>
