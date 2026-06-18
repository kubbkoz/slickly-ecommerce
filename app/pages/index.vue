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
    <LazyTestimonialsSection v-reveal class="contain-section" hydrate-on-visible />
    <LazyUsageCategories v-reveal class="contain-section" hydrate-on-visible />
    <LazyCleanlinessSection v-reveal class="contain-section" hydrate-on-visible />
    <LazyPerformancePortfolio v-reveal class="contain-section" hydrate-on-visible />
    <LazyWhySlickly v-reveal class="contain-section" hydrate-on-visible />
    <LazyNewsletterSection v-reveal class="contain-section" hydrate-on-visible />
    <LazyVideoTestsSection v-reveal class="contain-section" hydrate-on-visible />
    <LazyBlogSection v-reveal class="contain-section" hydrate-on-visible />
  </div>
</template>
