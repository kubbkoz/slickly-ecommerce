<script setup lang="ts">
import { Cog, Truck, Wallet, Headset } from 'lucide-vue-next';
import Newsletter from '~/components/home/Newsletter.vue';

const BADGES = [
  {
    icon: Cog,
    title: 'Overená kvalita',
    desc: 'Vyberáme len overené produkty od kvalitných značiek pre starostlivosť o vaše auto.',
  },
  {
    icon: Truck,
    title: 'Doručenie zadarmo',
    desc: 'Pri nákupe nad stanovenú sumu Vám objednávku doručíme úplne zadarmo.',
  },
  {
    icon: Wallet,
    title: 'Výhodné ceny',
    desc: 'Našu ponuku neustále rozširujeme o nové produkty a značky. Výhodné ceny sú u nás samozrejmosťou.',
  },
  {
    icon: Headset,
    title: 'Online podpora',
    desc: 'Sme tu pre vás online — poradíme s výberom a vybavíme objednávku rýchlo a bez starostí.',
  },
];

</script>

<template>
  <!-- ── Trust Badges ── -->
  <section class="bg-amber relative overflow-hidden">
    <!-- Dekoratívny SLICKLY text v pozadí -->
    <div class="absolute inset-0 flex items-center justify-end pointer-events-none select-none overflow-hidden" aria-hidden="true">
      <span class="font-tech font-black italic uppercase text-white/20 mix-blend-overlay text-[18vw] leading-none tracking-tighter whitespace-nowrap pr-8">
        SLICKLY
      </span>
    </div>

    <div class="container mx-auto px-4 lg:px-8 py-10 relative z-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
        <div v-for="badge in BADGES" :key="badge.title" class="flex items-start gap-4">
          <component
            :is="badge.icon"
            class="w-8 h-8 text-black flex-shrink-0 mt-0.5"
            :stroke-width="1.5"
            aria-hidden="true"
          />
          <div>
            <p class="font-tech font-bold uppercase text-black text-base leading-tight mb-1.5">
              {{ badge.title }}
            </p>
            <p class="text-black/70 text-xs font-sans leading-relaxed">
              {{ badge.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Newsletter ── -->
  <Newsletter />
</template>
