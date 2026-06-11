<script setup lang="ts">
useSeoMeta({
  title: 'Účet | SLICKLY',
  description: 'Spravujte svoj účet SLICKLY.',
})
</script>

<template>
  <div class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin py-stack-lg md:py-12">
    <!-- Breadcrumb -->
    <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant block mb-stack-lg md:mb-8">
      <NuxtLink to="/" class="hover:text-on-background">Domov</NuxtLink> / Účet
    </span>

    <div class="flex flex-col items-center text-center gap-stack-md py-stack-lg md:py-section-padding-lg">
      <span class="material-symbols-outlined text-[64px] text-on-surface-variant opacity-30">person</span>
      <h1 class="font-headline-lg text-headline-lg md:text-headline-xl uppercase">Váš účet</h1>
      <p class="font-body-md text-body-md text-on-surface-variant max-w-md">
        Prihlásenie a správa účtu budú čoskoro dostupné. Sledujte svoje objednávky, uložené adresy a obľúbené produkty na jednom mieste.
      </p>
      <NuxtLink
        to="/produkty"
        class="h-12 px-8 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.99] rounded-default mt-stack-sm"
      >
        Prejsť do obchodu
      </NuxtLink>
    </div>
  </div>
</template>
