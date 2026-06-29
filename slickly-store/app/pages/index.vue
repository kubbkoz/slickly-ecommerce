<script setup lang="ts">
// Above-fold sekcie — eager import (potrebné okamžite pri prvom rendere)
import CategoryHeroSlider from '../components/home/CategoryHeroSlider.vue';
import Features from '../components/home/Features.vue';
import CategoryGrid from '../components/home/CategoryGrid.vue';
import AkciaCarousel from '../components/home/AkciaCarousel.vue';
import Znacky from '../components/home/Znacky.vue';
import FeaturedCollection from '../components/home/FeaturedCollection.vue';
// Below-fold sekcie — lazy hydration cez globálne Lazy* komponenty
// (<LazyReviewsWall hydrate-on-visible /> v template — SSR ostáva, hydratuje až vo viewporte)
// @ts-ignore
import { useShopwareContext, useAsyncData, useState, useI18n, useRuntimeConfig } from '#imports';
import { onMounted, onUnmounted } from 'vue';

const { t } = useI18n();
const config = useRuntimeConfig();
const CATEGORY_HOME_SLIDER = config.public.shopware.ids.categories.homeSlider;

// ─── Homepage SEO (hardcoded, locale-aware) ────────────────────────────────
// LocalBusiness obsahuje Organization + fyzickú predajňu — kritické pre AI Mode
useOrganizationJsonLD();
useLocalBusinessJsonLD();

const { locale } = useI18n();
const _ogLocaleMap: Record<string, string> = {
  sk: 'sk_SK', cz: 'cs_CZ', de: 'de_DE', hu: 'hu_HU', en: 'en_GB', pl: 'pl_PL',
};

useSeoMeta({
    title:         () => t('home_seo.title'),
    description:   () => t('home_seo.description'),
    keywords:      () => t('home_seo.keywords'),
    ogTitle:       () => t('home_seo.title'),
    ogDescription: () => t('home_seo.description'),
    ogType:        'website',
    ogLocale:      () => _ogLocaleMap[locale.value] || 'sk_SK',
    ogUrl:         'https://mtsport.store/',
});

const isHomePage = useState('isPageHome', () => false);
const homePageCount = useState('homePageCount', () => 0);
onMounted(() => { homePageCount.value++; isHomePage.value = true; });
onUnmounted(() => {
    homePageCount.value--;
    if (homePageCount.value <= 0) { isHomePage.value = false; homePageCount.value = 0; }
});
</script>

<template>
  <div class="font-sans antialiased relative">
    <h1 class="sr-only">{{ t('home_seo.title') }}</h1>
    <CategoryHeroSlider :categoryId="CATEGORY_HOME_SLIDER" />
    <Features />
    <AkciaCarousel />
    <Znacky />
    <CategoryGrid />
    <FeaturedCollection />
    <!-- Below-fold: lazy hydration (INP/TBT optimalizácia, audit P0 #2) -->
    <LazyReviewsWall hydrate-on-visible />
    <LazyStoreLocation hydrate-on-visible />
    <LazyNewProducts hydrate-on-visible />
    <LazyHomeBlogSection hydrate-on-visible />
    <LazyBlogGrid hydrate-on-visible />
  </div>
</template>
