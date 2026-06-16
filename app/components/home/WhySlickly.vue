<script setup lang="ts">
const features = [
  {
    icon: 'storefront',
    title: 'Top Značky',
    description: 'Vyberáme výlučne overených výrobcov s najlepším pomerom kvality a výkonu na trhu.',
  },
  {
    icon: 'shield',
    title: 'Maximálna Ochrana',
    description: 'Každý produkt v sortimente chráni lak pred UV žiarením, soľou a kyslými dažďami.',
  },
  {
    icon: 'verified_user',
    title: 'Overené Expertmi',
    description: 'Každý produkt v našom sortimente prešiel testovaním a hodnotením detailingových expertov.',
  },
]
</script>

<template>
  <section id="preco-slickly" class="bg-surface-container py-stack-lg md:py-section-padding-lg px-gutter md:px-grid-margin scroll-mt-16">
    <div class="md:max-w-[1536px] md:mx-auto">
      <div class="text-center mb-stack-lg md:mb-12">
        <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase mb-2">Prečo Slickly?</h2>
        <p class="text-on-surface-variant font-body-md md:text-body-lg">Kurátorský výber. Najlepšie značky. Jeden obchod.</p>
      </div>
      <div class="space-y-stack-lg md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
        <div v-for="feature in features" :key="feature.title" class="flex items-start gap-stack-md md:flex-col md:items-start">
          <div class="p-3 bg-primary text-secondary-container shrink-0">
            <span class="material-symbols-outlined" aria-hidden="true">{{ feature.icon }}</span>
          </div>
          <div>
            <h3 class="font-headline-sm text-headline-sm mb-1">{{ feature.title }}</h3>
            <p class="font-body-md text-body-md text-on-surface-variant">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
