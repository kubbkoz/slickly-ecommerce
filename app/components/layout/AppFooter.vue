<script setup lang="ts">
const links = [
  { label: 'Ochrana súkromia', to: '/' },
  { label: 'Obchodné podmienky', to: '/' },
  { label: 'MSDS dáta', to: '/' },
  { label: 'Certifikáty', to: '/' },
]
</script>

<template>
  <footer class="bg-surface-container-highest w-full border-t border-grid-line mt-auto pb-16 md:pb-0">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-px px-gutter md:px-grid-margin py-stack-lg md:py-section-padding-lg w-full max-w-[1536px] mx-auto">
      <div class="col-span-1 md:col-span-6 flex flex-col gap-4">
        <div class="font-headline-md text-headline-md font-extrabold text-on-background tracking-tighter uppercase">
          SL<span class="logo-i">I</span>CKLY
        </div>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-sm">
          Umenie čistoty. Laboratórne kalibrované zloženia pre profesionálnu ochranu a detailing vozidiel.
        </p>
        <div class="font-label-sm text-label-sm tracking-widest text-on-surface-variant uppercase mt-auto pt-8">
          © 2026 SLICKLY R&amp;D. ALL RIGHTS RESERVED.
        </div>
      </div>
      <div class="col-span-1 md:col-span-6 flex flex-col md:items-end justify-end gap-4 mt-4 md:mt-0">
        <nav class="flex flex-wrap gap-6 md:gap-8">
          <NuxtLink
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            class="font-label-sm text-label-sm tracking-widest text-on-surface-variant hover:text-on-surface transition-opacity duration-200 uppercase"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>
    </div>
  </footer>
</template>
