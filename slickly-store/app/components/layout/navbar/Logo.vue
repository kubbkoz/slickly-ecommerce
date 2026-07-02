<script setup lang="ts">
const { t, locale: currentLocale } = useI18n();
const localePath = useLocalePath();
</script>

<template>
  <div class="flex-shrink-0 z-50">
    <NuxtLink :to="localePath('/', currentLocale)" class="block group" aria-label="SLICKLY Domov">
      <div class="flex items-baseline font-tech font-black uppercase leading-none tracking-tight text-white text-[2.5rem]">
        <span>SL</span><span class="logo-i-wrap"><span class="logo-i-dot bg-amber"></span>I</span><span>CKLY</span>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
/* Ensure font is available since Navbar might load before some CMS fonts */
.font-tech {
  font-family: 'Space Grotesk', 'Arial Black', sans-serif;
}

/* Decorative amber dot above the "I" (uppercase has no natural tittle) */
.logo-i-wrap {
  position: relative;
  display: inline-block;
}
.logo-i-dot {
  position: absolute;
  top: -0.32em;
  left: 50%;
  transform: translateX(-50%);
  width: 0.16em;
  height: 0.16em;
  border-radius: 9999px;
}
</style>
