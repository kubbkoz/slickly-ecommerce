<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next';
import { useLocalePath, useNavigation, useSessionContext, useAsyncData } from '#imports';
import { getCategoryUrl } from '~/utils/url';

// ─── Composables ─────────────────────────────────────────────────────────────
const localePath = useLocalePath();
const { t } = useStaticTranslations();
const { apiClient } = useShopwareContext();
const { languageIdChain } = useSessionContext();
const { currentLanguageId } = useShopwareLanguage();
const config = useRuntimeConfig();

// ─── Fetch Categories Directly from Tree via SWR ─────────────────────────────
// We fetch the main navigation tree (same as DesktopNav) and extract:
// 1. Top 5 main categories
// 2. One hardcoded extra category (6th tile)

const HARDCODED_EXTRA_CATEGORY_ID = '019ed47a4c19746f8ab0a7bb6747dc2d';
const ROOT_CATEGORY_ID = config.public.shopware.ids.rootCategory;

const { data: categories } = await useAsyncData(
    `category-grid-dynamic-${languageIdChain.value}`, 
    async () => {
        try {
            const response = await apiClient.invoke("readCategoryList post /category", {
              headers: { "sw-language-id": currentLanguageId.value }, // FIX-LANG: ensure SK translations
              body: {
                limit: 100,
                filter: [
                  { type: "equals", field: "parentId", value: ROOT_CATEGORY_ID },
                  { type: "equals", field: "active", value: true },
                  { type: "equals", field: "visible", value: true }
                ],
                associations: {
                  children: {
                    filter: [
                      { type: "equals", field: "active", value: true },
                      { type: "equals", field: "visible", value: true }
                    ]
                  },
                  media: {} // Important for category grid images!
                },
              }
            });
            const navItems = response.data.elements || [];
            
            if (!navItems.length) return [];

            // Helper to format category for the grid
            const formatCategory = (cat: any) => ({
                id: cat.id,
                name: cat.translated?.name || cat.name || '',
                image: cat.media?.url || null,
                url: getCategoryUrl(cat)
            });

            // 1. Take up to 5 top-level categories
            const displayList = navItems.slice(0, 5).map(formatCategory);

            // 2. Fetch one hardcoded extra category directly by ID (6th tile).
            // Isolated try/catch — top-5 tiles still render if this fails.
            let extraCategory = null;
            try {
                const extraRes = await apiClient.invoke('readCategory post /category/{categoryId}' as any, {
                    headers: { "sw-language-id": currentLanguageId.value },
                    pathParams: { categoryId: HARDCODED_EXTRA_CATEGORY_ID },
                    body: { associations: { media: {} } },
                });
                extraCategory = extraRes.data;
            } catch (e) {
                console.error('[CategoryGrid] Failed to fetch hardcoded extra category', e);
            }

            // 3. Append the extra category if fetched
            if (extraCategory) {
                displayList.push(formatCategory(extraCategory));
            }

            return displayList;
        } catch (error) {
            console.error('[CategoryGrid] Failed to parse navigation elements', error);
            return [];
        }
    }, 
    { 
        watch: [languageIdChain],
    }
);
</script>

<template>
  <section class="py-10 md:pt-24 bg-white">
    <div class="container mx-auto px-4 lg:px-8">

      <!-- Header row -->
      <div class="mb-10 md:mb-16">
        <div class="text-left w-full">
          <h2 class="section-h2 mb-4">
            {{ t('vyber_si') }} <span class="text-brand">{{ t('kategoriu') }}</span>
          </h2>
          <div class="section-decorator mb-6" />
          <p class="text-gray-500 text-sm md:text-base lg:text-lg max-w-3xl font-light leading-relaxed font-sans">
            {{ t('category_grid_subtext') }}
          </p>
        </div>
      </div>

      <!-- Grid — asymetrický: 4 stĺpce, vybrané karty cez 2 stĺpce
           (6 kategórií → riadok1 [wide][1][1], riadok2 [1][wide][1]) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 md:gap-4">
        <NuxtLink
          v-for="(cat, i) in categories"
          :key="cat.id"
          :to="localePath(cat.url)"
          class="cat-card group relative h-[200px] md:h-[260px] overflow-hidden block bg-gray-900"
          :class="{ 'lg:col-span-2': i % 6 === 0 || i % 6 === 4 }"
        >
          <!-- Background image or placeholder -->
          <div class="absolute inset-0">
            <img
              v-if="cat.image"
              :src="cat.image"
              :alt="cat.name"
              loading="lazy"
              class="w-full h-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-105 brightness-75 group-hover:brightness-50 grayscale group-hover:grayscale-0"
            />
            <!-- Placeholder for categories without image -->
            <div v-else class="w-full h-full bg-gray-800 grayscale group-hover:grayscale-0 transition-[filter] duration-700" />
            <!-- gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          </div>

          <!-- Bottom Red border sliding in from left -->
          <div class="cat-border absolute bottom-0 left-0 w-full h-[4px] bg-brand origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-20" />

          <!-- Content: title + button -->
          <div class="absolute bottom-0 left-0 w-full z-10 p-5 md:p-6 pb-5 md:pb-6 flex flex-col items-start justify-end pointer-events-none">
              <!-- Title -->
              <h3 class="cat-title font-tech font-black text-white text-2xl md:text-3xl uppercase italic leading-none tracking-wide transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] drop-shadow-md">
                {{ cat.name }}
              </h3>

              <!-- Button wrapper (no overflow hidden, allowing skew to render fully) -->
              <div class="cat-btn relative mt-3 inline-flex items-center justify-center px-4 py-1.5 pointer-events-auto transform -translate-x-[150%] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
                <!-- Skewed background layer -->
                <div class="absolute inset-0 bg-amber -skew-x-[15deg] origin-bottom-left shadow-lg"></div>
                <!-- Text layer -->
                <span class="relative z-10 flex items-center gap-1.5 text-black font-tech text-[11px] md:text-xs font-bold uppercase tracking-widest leading-none">
                  {{ t('prezriet').toUpperCase() }} <ArrowUpRight class="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
          </div>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Hover structure for smooth animations */
.cat-card .cat-title {
  transform: translateY(32px);
}

.cat-card:hover .cat-title {
  transform: translateY(0);
}

.cat-card:hover .cat-btn {
  transform: translateX(0);
}

.cat-card:hover .cat-border {
  transform: scaleX(1);
}
</style>
