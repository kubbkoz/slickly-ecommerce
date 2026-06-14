<script setup lang="ts">
useSeo({
  title: 'Ochrana súkromia | SLICKLY',
  description: 'Zásady ochrany osobných údajov SLICKLY.',
  noindex: true,
})
</script>

<template>
  <div class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin py-stack-lg md:py-12">
    <!-- Breadcrumb -->
    <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant block mb-stack-lg md:mb-8">
      <NuxtLink to="/" class="hover:text-on-background">Domov</NuxtLink> / Ochrana súkromia
    </span>

    <div class="flex flex-col items-center text-center gap-stack-md py-stack-lg md:py-section-padding-lg">
      <span class="material-symbols-outlined text-[64px] text-on-surface-variant opacity-30">privacy_tip</span>
      <h1 class="font-headline-lg text-headline-lg md:text-headline-xl uppercase">Ochrana súkromia</h1>
      <p class="font-body-md text-body-md text-on-surface-variant max-w-md">
        Naše zásady ochrany osobných údajov v súlade s GDPR pripravujeme. V prípade otázok k spracovaniu vašich
        osobných údajov nás kontaktujte na
        <a href="mailto:info@slickly.sk" class="text-primary underline hover:text-secondary rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">info@slickly.sk</a>.
      </p>
      <NuxtLink
        to="/produkty"
        class="h-12 px-8 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default mt-stack-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Prejsť do obchodu
      </NuxtLink>
    </div>
  </div>
</template>
