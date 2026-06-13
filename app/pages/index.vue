<script setup lang="ts">
useSeoMeta({
  title: 'SLICKLY | Umenie Čistoty',
  description: 'Laboratórne kalibrovaná keramická ochrana, detailing a starostlivosť o vozidlo.',
})
</script>

<template>
  <div>
    <HeroBanner />
    <TrustBadges />
    <SpecialOffers />
    <CategoryGrid />
    <LazyTestimonialsSection hydrate-on-visible />
    <LazyCleanlinessSection hydrate-on-visible />
    <LazyPerformancePortfolio hydrate-on-visible />
    <LazyWhySlickly hydrate-on-visible />
    <LazyNewsletterSection hydrate-on-visible />
  </div>
</template>
