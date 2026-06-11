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
    <LazyCleanlinessSection hydrate-on-visible />
    <LazyPerformancePortfolio hydrate-on-visible />
    <LazyWhySlickly hydrate-on-visible />
  </div>
</template>
