<script setup lang="ts">
import type { CmsElementText } from "@shopware/composables";
defineProps<{ content: CmsElementText; }>();
</script>
<template>
  <div class="cms-center-text text-center">
    <CmsElementText :content="content" />
  </div>
</template>
<style scoped>
.cms-center-text :deep(h1),.cms-center-text :deep(h2) { font-family: 'Space Grotesk',sans-serif; font-weight:900; text-transform:uppercase; font-style:italic; font-size:2rem; line-height:1.1; color:#000; margin-bottom:0.75rem; }
.cms-center-text :deep(h3) { font-family: 'Space Grotesk',sans-serif; font-weight:700; text-transform:uppercase; font-style:italic; font-size:1.375rem; color:#111; }
.cms-center-text :deep(p) { font-family: 'Space Grotesk',sans-serif; color:#4B5563; line-height:1.8; }
</style>
