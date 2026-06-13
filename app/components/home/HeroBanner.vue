<script setup lang="ts">
const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAI8N-dfsByjce2Dl-vav0-QgPBBhmacpaNSRluOPskO-O3r55efCUmVjquZr_LtOSJkXrZhlUUuT15Hxj4_0vkLVGIOHygbmfDXbkA-cjm6RRTYd_706Ji-jSBbBAOeDQQZ-KEPELBVMtWn4NwqtNhL3tsbFUk_hoQbaLwXFN-ltZBSNHnG3VJI1jyoXO6DOxtZrBtsQhXJJbijIuU5v9nxwWgfZP8k9bxLyErqzWrfF_5Ra9Ok8Y817xctq5K2BIycgsITFTx6VGh'
</script>

<template>
  <section class="relative w-full overflow-hidden">
    <!-- Mobile hero -->
    <div class="md:hidden relative h-[560px] w-full overflow-hidden">
      <div class="absolute inset-0 bg-primary/40 z-10"></div>
      <img class="absolute inset-0 w-full h-full object-cover" :src="heroImage" alt="Detail karosérie vozidla s keramickou ochranou" />
      <div class="relative z-20 h-full flex flex-col justify-end p-gutter pb-stack-lg">
        <span class="text-secondary-container font-badge-label text-badge-label uppercase tracking-widest mb-stack-sm">Novinka: V2 Séria</span>
        <h2 class="font-headline-lg text-headline-lg text-on-primary max-w-[280px] leading-tight mb-stack-md">
          TECHNICKÁ <br />DOKONALOSŤ <br />PRE VAŠE AUTO
        </h2>
        <NuxtLink
          to="/produkty"
          class="bg-secondary-container text-on-secondary-container px-stack-lg py-3 rounded font-bold transition-all duration-200 active:scale-95 w-fit cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container"
        >
          PRESKÚMAŤ KOLEKCIU
        </NuxtLink>
      </div>
    </div>

    <!-- Desktop hero -->
    <div class="hidden md:block bg-surface-container-low py-10">
      <div class="max-w-[1536px] mx-auto px-grid-margin">
        <div class="relative bg-on-background h-[450px] flex items-center overflow-hidden">
          <div class="absolute inset-0 opacity-40 bg-cover bg-center" :style="{ backgroundImage: `url('${heroImage}')` }"></div>
          <div class="relative z-10 p-12 flex flex-col gap-4">
            <span class="bg-secondary-container text-on-background px-3 py-1 text-[10px] w-fit font-bold uppercase">Limitovaná ponuka</span>
            <h2 class="text-surface text-headline-xl uppercase">ŠPECIÁLNA ZĽAVA -20%</h2>
            <p class="text-surface-variant font-body-md max-w-md">
              Získajte exkluzívny prístup k našej prémiovej rade keramickej ochrany za zvýhodnenú cenu.
            </p>
            <NuxtLink
              to="/produkty"
              class="mt-4 border border-surface text-surface px-6 py-2 w-fit uppercase font-label-sm cursor-pointer hover:bg-surface hover:text-on-background transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container"
            >
              Kúpiť teraz
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
