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
    <CategoryGrid />
    <LazyTestimonialsSection hydrate-on-visible />
    <LazyUsageCategories hydrate-on-visible />
    <LazyCleanlinessSection hydrate-on-visible />
    <LazyPerformancePortfolio hydrate-on-visible />
    <LazyWhySlickly hydrate-on-visible />
    <LazyNewsletterSection hydrate-on-visible />
    <LazyVideoTestsSection hydrate-on-visible />
    <LazyBlogSection hydrate-on-visible />
  </div>
</template>
