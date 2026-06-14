<script setup lang="ts">
const figureImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAOw3lcJ-AW0k4WJ8N4g4_VB8pU10OCmDputy-CLuk2mBkMaDK_qhDpSZ7Q-pMcsb78ykOvxV4ejEjcoMPVNeJBvF_5Gk7Qb5ndRTPF9XBAMcLXXtnDdKskLjMKFm_XFVk1XRvfkUTaPGyKbG6LcULbKIEa70zN2NjmWfdqvsJoKkWHNcTTX8xOkfLVHSkZTq7VEsoShRn41t2ipTpzn9ao8g0xtHmZHD9Ey65uYxPSasbgL9KjsJ7LejJDgXq_Z2yfhiU1V4vWVvhX'

const certifications = [
  { label: 'ISO 9001:2015', icon: 'verified', style: 'filled' },
  { label: 'pH Neutrálne', style: 'outline' },
  { label: 'SiO2 Infusion', style: 'tonal' },
  { label: 'REACH Compliant', style: 'outline' },
]
</script>

<template>
  <section id="umenie-cistoty" class="w-full relative py-stack-lg md:py-section-padding-lg border-b border-grid-line bg-surface scroll-mt-16">
    <div class="absolute inset-0 pointer-events-none opacity-20 bg-blueprint hidden md:block"></div>
    <div class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-stack-lg md:gap-y-12">
        <div class="md:col-span-5 flex flex-col gap-stack-md md:gap-8">
          <h2 class="font-headline-lg text-headline-lg md:text-headline-xl text-on-surface uppercase">Umenie Čistoty</h2>
          <p class="font-body-md md:font-body-lg text-body-md md:text-body-lg text-on-surface-variant border-l-2 border-secondary-container pl-4">
            Odmietame kompromisy. Každá zlúčenina je kalibrovaná s mikroskopickou presnosťou pre dosiahnutie zrkadlového lesku a nepriestrelnej
            ochrany proti environmentálnym kontaminantom.
          </p>
          <div class="flex flex-wrap gap-3 mt-2 md:mt-4">
            <span
              v-for="cert in certifications"
              :key="cert.label"
              class="font-technical-data text-technical-data px-3 py-1 flex items-center gap-2 uppercase"
              :class="{
                'bg-on-background text-secondary-container': cert.style === 'filled',
                'border border-on-background text-on-background': cert.style === 'outline',
                'bg-surface-container-high text-on-surface': cert.style === 'tonal',
              }"
            >
              <span v-if="cert.icon" class="material-symbols-outlined text-[16px]" aria-hidden="true">{{ cert.icon }}</span>
              {{ cert.label }}
            </span>
          </div>
        </div>
        <div class="md:col-span-6 md:col-start-7 relative">
          <div class="border border-grid-line p-1 relative bg-surface">
            <div class="absolute top-2 left-2 text-on-surface-variant font-technical-data text-[10px] z-10">FIG 1.0</div>
            <div class="w-full aspect-video bg-surface-container-high relative overflow-hidden flex items-center justify-center">
              <img
                :src="figureImage"
                alt="Makro detail karosérie po aplikácii keramickej ochrany s odpudzovanými kapkami vody"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply"
              />
            </div>
            <div class="flex justify-between items-center p-4 border-t border-grid-line bg-surface-container-lowest">
              <span class="font-label-sm text-label-sm text-on-surface uppercase">Analýza odpudzovania vody</span>
              <span class="font-technical-data text-technical-data text-secondary">99.8% EFEKTIVITA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
