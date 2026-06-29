<script setup lang="ts">
import { proxyMediaUrl } from '~~/app/utils/media';
import { sanitizeHtml } from '~~/app/utils/sanitize';

const props = defineProps<{
  page: {
    id: string;
    title: string;
    teaser?: string;
    content?: string;
    coverUrl?: string | null;
    heroCoverUrl?: string | null;
    metaTitle?: string;
    metaDescription?: string;
    cmsPage?: any | null;
  };
}>();

useSeoMeta({
  title: () => props.page.metaTitle || props.page.title,
  description: () => props.page.metaDescription || props.page.teaser || '',
  ogTitle: () => props.page.title,
});
</script>

<template>
  <article class="min-h-screen bg-white">

    <!-- Hero -->
    <div class="relative bg-black overflow-hidden py-20">
      <div v-if="page.heroCoverUrl || page.coverUrl" class="absolute inset-0">
        <NuxtImg
          :src="proxyMediaUrl((page.heroCoverUrl || page.coverUrl)!)"
          :alt="page.title"
          class="w-full h-full object-cover opacity-30"
          format="webp"
          loading="eager"
          sizes="100vw"
        />
      </div>
      <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-70"></div>
      <div class="container mx-auto px-4 lg:px-8 relative z-10">
        <h1 class="text-3xl md:text-5xl font-tech font-black uppercase italic text-white leading-none max-w-4xl">
          {{ page.title }}
        </h1>
        <div class="section-decorator mt-6"></div>
        <p v-if="page.teaser" class="mt-6 text-gray-300 font-sans text-lg leading-relaxed max-w-2xl">
          {{ page.teaser }}
        </p>
      </div>
    </div>

    <!-- Obsah -->
    <div class="container mx-auto px-4 lg:px-8 py-16">
      <div class="max-w-5xl mx-auto">
        <div class="mtsport-blog-content">
          <CmsPage v-if="page.cmsPage?.sections?.length" :content="page.cmsPage" />
          <div
            v-else-if="page.content"
            v-html="sanitizeHtml(page.content)"
          ></div>
        </div>
      </div>
    </div>

  </article>
</template>
