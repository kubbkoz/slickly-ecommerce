<script setup lang="ts">
import { sanitizeHtml } from '~~/app/utils/sanitize';
import { proxyMediaUrl } from '~~/app/utils/media';

const route = useRoute();

const { data: page } = await useAsyncData(
  `page-${route.params.slug}`,
  // `?? null` — page API môže vrátiť null (prázdne telo) → $fetch undefined;
  // useAsyncData handler nesmie vrátiť undefined.
  async () => (await $fetch(`/api/page/${route.params.slug}`).catch(() => null)) ?? null
);

if (!page.value) {
  throw createError({ statusCode: 404, message: 'Stránka nebola nájdená' });
}

useSeoMeta({
  title: () => (page.value as any)?.metaTitle || (page.value as any)?.title || 'SLICKLY',
  description: () => (page.value as any)?.metaDescription || (page.value as any)?.teaser || '',
});
</script>

<template>
  <article v-if="page" class="min-h-screen bg-white">

    <!-- Hero -->
    <div class="relative bg-black overflow-hidden py-20">
      <div v-if="(page as any).heroCoverUrl || (page as any).coverUrl" class="absolute inset-0">
        <NuxtImg
          :src="proxyMediaUrl((page as any).heroCoverUrl || (page as any).coverUrl)"
          :alt="(page as any).title"
          class="w-full h-full object-cover opacity-30"
          format="webp"
          loading="eager"
          sizes="100vw"
        />
      </div>
      <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-70"></div>
      <div class="container mx-auto px-4 lg:px-8 relative z-10">
        <h1 class="text-3xl md:text-5xl font-tech font-black uppercase italic text-white leading-none max-w-4xl">
          {{ (page as any).title }}
        </h1>
        <div class="section-decorator mt-6"></div>
        <p v-if="(page as any).teaser" class="mt-6 text-gray-300 font-sans text-lg leading-relaxed max-w-2xl">
          {{ (page as any).teaser }}
        </p>
      </div>
    </div>

    <!-- Obsah -->
    <div class="container mx-auto px-4 lg:px-8 py-16">
      <div class="max-w-5xl mx-auto">
        <div class="mtsport-blog-content">
          <CmsPage
            v-if="(page as any).cmsPage?.sections?.length"
            :content="(page as any).cmsPage"
          />
          <div
            v-else-if="(page as any).content"
            v-html="sanitizeHtml((page as any).content)"
          ></div>
        </div>
      </div>
    </div>

  </article>
</template>
