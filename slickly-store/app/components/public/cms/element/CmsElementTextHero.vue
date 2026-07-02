<script setup lang="ts">
import type { CmsElementText } from "@shopware/composables";

defineProps<{
  content: CmsElementText;
}>();
</script>

<template>
  <div class="cms-element-text-hero">
    <CmsElementText :content="content" />
  </div>
</template>

<style scoped>
.cms-element-text-hero :deep(h1),
.cms-element-text-hero :deep(h2) {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  font-style: italic;
  font-size: 2.25rem;
  line-height: 1.1;
  color: #000;
  margin-bottom: 1rem;
}
/* Red decorator po nadpise — SLICKLY section-decorator pattern */
.cms-element-text-hero :deep(h2)::after,
.cms-element-text-hero :deep(h1)::after {
  content: '';
  display: block;
  width: 6rem;
  height: 0.375rem;
  background: #000000;
  transform: skewX(-20deg);
  margin-top: 0.75rem;
}
.cms-element-text-hero :deep(p) {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.125rem;
  line-height: 1.8;
  color: #4B5563;
  margin-top: 1.25rem;
}
</style>
