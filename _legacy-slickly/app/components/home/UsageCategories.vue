<script setup lang="ts">
const useCases = [
  {
    label: 'Detailing interiéru',
    description: 'Koža, plasty a textil',
    to: '/produkty?kategoria=interier',
    image: '/images/usecases/detailing-interieru.png',
  },
  {
    label: 'Čistenie kolies',
    description: 'Disky a brzdový prach',
    to: '/produkty?kategoria=kolesa',
    image: '/images/usecases/cistenie-kolies.png',
  },
  {
    label: 'Starostlivosť o lak',
    description: 'Keramika, vosky a leštenky',
    to: '/produkty?kategoria=karoseria',
    image: '/images/usecases/starostlivost-o-lak.png',
  },
  {
    label: 'Doplnky na čistenie',
    description: 'Vysávače, handričky, štetce',
    to: '/produkty',
    image: '/images/usecases/doplnky-na-cistenie.png',
  },
]
</script>

<template>
  <section class="w-full bg-surface-container-lowest py-stack-lg md:py-section-padding-lg md:border-b md:border-grid-line">
    <div class="md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin">
      <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase mb-stack-lg md:mb-8">Nakupujte podľa použitia</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-stack-md md:gap-4">
        <NuxtLink
          v-for="useCase in useCases"
          :key="useCase.label"
          :to="useCase.to"
          class="group relative overflow-hidden aspect-[3/4] bg-on-background focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-secondary-container"
        >
          <NuxtImg
            :src="useCase.image"
            :alt="useCase.label"
            loading="lazy"
            width="450"
            height="600"
            sizes="320px md:256px"
            class="absolute inset-0 w-full h-full object-cover opacity-80 md:opacity-90 transition-transform duration-500 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

          <div class="absolute bottom-stack-sm md:bottom-6 left-stack-sm md:left-6 right-stack-sm md:right-6">
            <h3 class="text-white font-headline-sm text-headline-sm uppercase leading-tight mb-1">{{ useCase.label }}</h3>
            <p class="hidden md:block text-white/70 font-body-md text-body-md mb-2">{{ useCase.description }}</p>
            <span class="text-white/80 font-label-sm text-label-sm uppercase flex items-center gap-2 group-hover:text-secondary-container transition-colors duration-200">
              Zobraziť produkty
              <span class="material-symbols-outlined text-[14px]" aria-hidden="true">arrow_forward</span>
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
