<script setup lang="ts">
const cart = useCartStore()
</script>

<template>
  <div class="min-h-dvh flex flex-col bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-default font-label-sm text-label-sm uppercase tracking-widest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container"
    >
      Preskočiť na obsah
    </a>

    <header class="border-b border-grid-line bg-surface-container-lowest shrink-0 safe-top" style="padding-top: env(safe-area-inset-top, 0px)">
      <div class="h-full w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin flex items-center justify-between">
        <NuxtLink
          to="/kosik"
          class="flex items-center gap-1.5 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-background cursor-pointer transition-colors duration-200 min-h-11 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span class="material-symbols-outlined text-[20px]" aria-hidden="true">arrow_back</span>
          <span class="hidden md:inline">Späť do košíka</span>
        </NuxtLink>

        <NuxtLink to="/" class="font-headline-md text-headline-md font-extrabold tracking-tighter text-on-background absolute left-1/2 -translate-x-1/2">
          SL<span class="logo-i">I</span>CKLY
        </NuxtLink>

        <div class="flex items-center gap-1.5 text-on-surface-variant">
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">lock</span>
          <span class="hidden md:inline font-technical-data text-technical-data uppercase">Bezpečná pokladňa</span>
        </div>
      </div>
    </header>

    <main id="main-content" class="flex-grow flex flex-col w-full relative">
      <slot />
    </main>
  </div>
</template>
