<script setup lang="ts">
// Above-fold sekcie — eager import (potrebné okamžite pri prvom rendere / LCP)
import CategoryHeroSlider from '../components/home/CategoryHeroSlider.vue';
import Features from '../components/home/Features.vue';
// Ostatné sekcie (AkciaCarousel/Znacky/CategoryGrid/FeaturedCollection) sa hydratujú
// lazy cez globálne Lazy* komponenty s `hydrate-on-visible` (nižšie v template) — SSR
// HTML ostáva (SEO OK), ale hydratácia 28+ ProductCards sa odloží až do viewportu.
// (<LazyReviewsWall hydrate-on-visible /> — rovnaký vzor.)
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
    description:   () => t('home_seo.description'),
    keywords:      () => t('home_seo.keywords'),
    ogTitle:       () => t('home_seo.title'),
    ogDescription: () => t('home_seo.description'),
    ogType:        'website',
    ogLocale:      () => _ogLocaleMap[locale.value] || 'sk_SK',
    ogUrl:         'https://slickly.sk/',
});

// Front page browser tab title — bypasses the global `titleTemplate: '%s | SLICKLY'`
// (nuxt.config.ts) so this route alone renders "SLICKLY | <home_seo.title>" (brand
// first) instead of the site-wide "<title> | SLICKLY" order used on every other page.
useHead({
    title: () => t('home_seo.title'),
    titleTemplate: (title) => `SLICKLY | ${title}`,
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
    <!-- Lazy hydration (INP/TBT optimalizácia) — SSR HTML ostáva, hydratácia až vo viewporte -->
    <LazyAkciaCarousel hydrate-on-visible />
    <LazyZnacky hydrate-on-visible />
    <LazyCategoryGrid hydrate-on-visible />
    <LazyFeaturedCollection hydrate-on-visible />
    <!-- Below-fold: lazy hydration (INP/TBT optimalizácia, audit P0 #2) -->
    <!-- Dočasne vypnuté na frontpage (žiadosť: sekcia sa zapne neskôr) — komponent
         ostáva v kóde nedotknutý, len sa nerenderuje na tejto stránke. -->
    <!-- <LazyReviewsWall hydrate-on-visible /> -->
    <LazyNewProducts hydrate-on-visible />
    <LazyHomeBlogSection hydrate-on-visible />
    <LazyBlogGrid hydrate-on-visible />
  </div>
</template>
