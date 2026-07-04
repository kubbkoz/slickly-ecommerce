<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next';
import { useLocalePath, useAsyncData } from '#imports';
import { FEATURED_BRAND_SLUGS } from '~/utils/constants';

interface ManufacturerItem {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  link: string | null;
  productCount: number;
}

const localePath = useLocalePath();
const { t } = useStaticTranslations();

const { data: allBrands } = await useAsyncData('home-brands', () =>
    $fetch<ManufacturerItem[]>('/api/manufacturers')
);

// Featured výber — prvých 5 nájdených v poradí konštanty, chýbajúce ticho preskoč.
const featured = computed(() => {
    const list = allBrands.value || [];
    const bySlug = new Map(list.map((m) => [m.slug, m]));
    return FEATURED_BRAND_SLUGS
        .map((slug) => bySlug.get(slug))
        .filter((m): m is ManufacturerItem => !!m)
        .slice(0, 5);
});
</script>

<template>
  <section
    class="pt-3 pb-3 md:pt-3 md:pb-3 bg-gray-50 border-b border-gray-100"
  >
    <div class="container mx-auto px-4 lg:px-8">
      <div class="grid grid-cols-3 lg:grid-cols-6 gap-1 md:gap-4">

        <!-- Brand tiles — logo priamo na šedom pozadí, jednotná väčšia veľkosť -->
        <NuxtLink
          v-for="brand in featured"
          :key="brand.id"
          :to="localePath('/znacka/' + brand.slug)"
          class="group flex items-center justify-center p-4 md:p-6 h-20 md:h-28 transition-colors"
          :aria-label="brand.name"
        >
          <NuxtImg
            v-if="brand.logoUrl"
            :src="brand.logoUrl"
            :alt="brand.name"
            class="h-7 md:h-9 w-auto max-w-full object-contain mix-blend-multiply grayscale opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
          />
          <span
            v-else
            class="font-tech font-black uppercase text-base md:text-lg text-gray-400 group-hover:text-black transition-colors text-center leading-none"
          >
            {{ brand.name }}
          </span>
        </NuxtLink>

        <!-- "Všetky značky" tile — šípka nad textom -->
        <NuxtLink
          :to="localePath('/znacky')"
          class="group bg-black hover:bg-brand flex flex-col items-center justify-center gap-1.5 p-4 h-20 md:h-28 transition-colors rounded-default"
        >
          <ArrowUpRight class="w-5 h-5 md:w-6 md:h-6 text-white transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          <span class="font-tech font-bold uppercase text-[10px] md:text-xs tracking-widest text-white text-center leading-tight">
            {{ t('vsetky_znacky') }}
          </span>
        </NuxtLink>

      </div>
    </div>
  </section>
</template>
