<script setup lang="ts">
useSeo({
  title: 'SLICKLY | Umenie Čistoty',
  description: 'Kurátorský výber prémiových značiek pre starostlivosť o vozidlo. Keramická ochrana, detailing a autokozmetika na jednom mieste.',
  canonicalPath: '/',
})
</script>

<template>
  <div>
    <HeroBanner />
    <TrustBadges />
    <SpecialOffers />
    <CategoryGrid v-reveal />
    <LazyTestimonialsSection v-reveal hydrate-on-visible />
    <LazyUsageCategories v-reveal hydrate-on-visible />
    <LazyCleanlinessSection v-reveal hydrate-on-visible />
    <LazyPerformancePortfolio v-reveal hydrate-on-visible />
    <LazyWhySlickly v-reveal hydrate-on-visible />
    <LazyNewsletterSection v-reveal hydrate-on-visible />
    <LazyVideoTestsSection v-reveal hydrate-on-visible />
    <LazyBlogSection v-reveal hydrate-on-visible />
  </div>
</template>
