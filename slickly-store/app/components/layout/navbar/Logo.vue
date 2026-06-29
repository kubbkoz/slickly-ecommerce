<script setup lang="ts">
const { t, locale: currentLocale } = useI18n();
const localePath = useLocalePath();
</script>

<template>
  <div class="flex-shrink-0 z-50">
    <NuxtLink :to="localePath('/', currentLocale)" class="block group" aria-label="SLICKLY Domov">
      <div class="flex items-baseline font-tech font-black uppercase leading-none tracking-tight">
        <span class="text-white text-[2.5rem]">SLICK</span>
        <span class="text-amber text-[2.5rem] ml-px">LY</span>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
/* Ensure font is available since Navbar might load before some CMS fonts */
.font-tech {
  font-family: 'Geist Sans', 'Arial Black', sans-serif;
}
</style>
