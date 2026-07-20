<script setup lang="ts">
import { ArrowRight, Mountain, Zap, Wind, Cog } from 'lucide-vue-next';
import { getCategoryUrl } from '~/utils/url';
import type { Schemas } from '#shopware';

const config = useRuntimeConfig();
const { apiClient } = useShopwareContext();
const { currentLanguageId } = useShopwareLanguage();
const localePath = useLocalePath();

const TARGET_IDS = [
  config.public.shopware.ids.categories.bikes,
  config.public.shopware.ids.categories.ebikes,
  config.public.shopware.ids.categories.doplnky,
  config.public.shopware.ids.categories.komponenty,
] as string[];

const STYLE_META: Record<string, { icon: any; subtitle: string }> = {
  [config.public.shopware.ids.categories.bikes as string]:      { icon: Mountain, subtitle: 'Adrenalín v teréne' },
  [config.public.shopware.ids.categories.ebikes as string]:     { icon: Zap,      subtitle: 'Čistá energia' },
  [config.public.shopware.ids.categories.doplnky as string]:    { icon: Wind,     subtitle: 'Kompletná výbava' },
  [config.public.shopware.ids.categories.komponenty as string]: { icon: Cog,      subtitle: 'Vysoký výkon' },
};

const { data: navCategories, pending } = useAsyncData<Schemas['Category'][]>(
  `cat-navigator-${currentLanguageId.value}`,
  async () => {
    try {
      const res = await apiClient.invoke('readCategoryList post /category', {
        body: {
          limit: 10,
          filter: [
            { type: 'equalsAny', field: 'id', value: TARGET_IDS },
            { type: 'equals', field: 'active', value: true },
          ],
          associations: { media: {}, seoUrls: {} },
        },
        headers: { 'sw-language-id': currentLanguageId.value },
      });
      return (res.data?.elements ?? []) as Schemas['Category'][];
    } catch {
      return [];
    }
  },
  {
    getCachedData(key) {
      const nuxtApp = useNuxtApp();
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
    watch: [currentLanguageId],
  }
);

const orderedCategories = computed(() =>
  TARGET_IDS
    .map(id => (navCategories.value ?? []).find((c) => c.id === id))
    .filter((c): c is Schemas['Category'] => !!c)
);
</script>

<template>
  <section class="py-24 bg-gray-50 border-b border-gray-100 relative overflow-hidden">
    <!-- Background Tech Elements -->
    <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    <div class="absolute top-10 right-10 text-[200px] font-black text-gray-100 font-tech opacity-50 select-none pointer-events-none">
      RIDE
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <div class="flex flex-col md:flex-row justify-between items-end mb-12">
        <div class="text-left">
          <h2 class="section-h2 mb-4">
            Podľa štýlu <span class="text-brand">jazdy</span>
          </h2>
          <div class="section-decorator mb-6"></div>
        </div>
        <p class="hidden md:block text-gray-500 font-medium font-sans max-w-sm text-right">
          Vyber si kategóriu, ktorá definuje tvoju jazdu a objav kurátorský výber produktov.
        </p>
      </div>

      <!-- Skeleton -->
      <div v-if="pending && !orderedCategories.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="i in 4"
          :key="`rs-skeleton-${i}`"
          class="h-[500px] bg-gray-200 animate-pulse"
        />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="cat in orderedCategories"
          :key="cat.id"
          :to="localePath(getCategoryUrl(cat))"
          :aria-label="cat.translated?.name || cat.name || undefined"
          class="group relative h-[500px] overflow-hidden border border-gray-200 bg-white block cursor-pointer"
        >
          <!-- Image Layer -->
          <div class="absolute inset-0">
            <NuxtImg
              v-if="(cat as any).media?.url"
              :alt="cat.translated?.name || cat.name || ''"
              :src="(cat as any).media.url"
              width="440"
              height="550"
              sizes="100vw md:50vw lg:25vw"
              quality="78"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0 motion-reduce:transition-none motion-reduce:grayscale-0 motion-reduce:group-hover:scale-100"
            />
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"
            ></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-80 transition-opacity motion-reduce:transition-none"></div>
          </div>

          <!-- Shine Effect (skrytý pri prefers-reduced-motion) -->
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none motion-reduce:hidden" aria-hidden="true">
            <div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></div>
          </div>

          <!-- Content -->
          <div class="absolute inset-0 p-8 flex flex-col justify-end">
            <!-- Icon Badge -->
            <div class="absolute top-6 right-6 w-14 h-14 bg-brand flex items-center justify-center transform rotate-45 shadow-lg group-hover:scale-110 transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
              <component
                :is="STYLE_META[cat.id]?.icon || Mountain"
                class="w-7 h-7 text-white transform -rotate-45"
                aria-hidden="true"
              />
            </div>

            <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 motion-reduce:translate-y-0 motion-reduce:transition-none">
              <!-- Badge -->
              <div class="inline-block bg-brand px-3 py-1 mb-3 transform -skew-x-12">
                <span class="block transform skew-x-12 text-white text-xs font-bold uppercase tracking-widest font-sans">
                  {{ STYLE_META[cat.id]?.subtitle || '' }}
                </span>
              </div>

              <h3 class="text-4xl font-black text-white uppercase italic font-tech leading-none mb-3">
                {{ cat.translated?.name || cat.name }}
              </h3>

              <!-- CTA: vždy viditeľné na mobile, hover-only na desktop -->
              <div class="flex items-center text-white font-bold uppercase tracking-wider text-sm group/btn lg:translate-y-8 lg:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 lg:delay-150 motion-reduce:transition-none motion-reduce:lg:translate-y-0 motion-reduce:lg:opacity-100">
                <span class="border-b-2 border-brand pb-1 group-hover/btn:text-brand transition-colors">Prezrieť kolekciu</span>
                <ArrowRight class="w-5 h-5 ml-3 transform group-hover/btn:translate-x-2 transition-transform text-brand motion-reduce:transition-none" aria-hidden="true" />
              </div>
            </div>
          </div>

          <!-- Tech Borders -->
          <div class="absolute bottom-0 left-0 w-16 h-1 bg-brand transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left motion-reduce:transition-none"></div>
          <div class="absolute top-0 right-0 w-16 h-1 bg-white/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right motion-reduce:transition-none"></div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
