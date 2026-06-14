<script setup lang="ts">
const links = [
  { label: 'Ochrana súkromia', to: '/ochrana-sukromia' },
  { label: 'Obchodné podmienky', to: '/obchodne-podmienky' },
  { label: 'MSDS dáta', to: '/msds' },
  { label: 'Certifikáty', to: '/certifikaty' },
]

const contact = [
  { icon: 'location_on', text: 'Laboratórna 1, 851 01 Bratislava, Slovensko' },
  { icon: 'mail', text: 'info@slickly.sk', href: 'mailto:info@slickly.sk' },
  { icon: 'call', text: '+421 900 123 456', href: 'tel:+421900123456' },
  { icon: 'schedule', text: 'Po – Pia: 8:00 – 17:00' },
]
</script>

<template>
  <footer class="bg-surface-container-highest w-full border-t border-grid-line mt-auto pb-16 md:pb-0">
    <!-- Map -->
    <div class="relative w-full h-[200px] md:h-[280px] border-b border-grid-line overflow-hidden bg-surface-container">
      <div class="absolute inset-0 bg-blueprint opacity-40"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="flex flex-col items-center gap-2">
          <span class="material-symbols-outlined text-[40px] text-primary" aria-hidden="true">location_on</span>
          <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-background">SLICKLY R&amp;D Laboratórium</span>
        </div>
      </div>
      <span class="absolute top-3 left-3 font-technical-data text-technical-data text-on-surface-variant">48.1486° N, 17.1077° E</span>
      <span class="absolute bottom-3 right-3 font-technical-data text-technical-data text-on-surface-variant">MAP // BRATISLAVA, SK</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-px px-gutter md:px-grid-margin py-stack-lg md:py-section-padding-lg w-full max-w-[1536px] mx-auto">
      <div class="col-span-1 md:col-span-4 flex flex-col gap-4">
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
      <div class="col-span-1 md:col-span-4 flex flex-col gap-stack-sm mt-4 md:mt-0">
        <span class="font-label-sm text-label-sm tracking-widest text-on-surface-variant uppercase">Kontakt</span>
        <ul class="flex flex-col gap-stack-sm">
          <li v-for="item in contact" :key="item.text" class="flex items-start gap-2 font-body-md text-body-md text-on-surface-variant">
            <span class="material-symbols-outlined text-[20px] text-on-background shrink-0" aria-hidden="true">{{ item.icon }}</span>
            <a v-if="item.href" :href="item.href" class="hover:text-on-background transition-colors duration-200 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{{ item.text }}</a>
            <span v-else>{{ item.text }}</span>
          </li>
        </ul>
      </div>
      <div class="col-span-1 md:col-span-4 flex flex-col md:items-end justify-end gap-4 mt-4 md:mt-0">
        <nav class="flex flex-wrap gap-6 md:gap-8 md:justify-end" aria-label="Právne informácie">
          <NuxtLink
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            class="font-label-sm text-label-sm tracking-widest text-on-surface-variant hover:text-on-surface transition-colors duration-200 uppercase rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>
    </div>
  </footer>
</template>
