<script setup lang="ts">
import { computed } from 'vue';
import type { Schemas } from '#shopware';
import HeroSlider from '~/components/home/HeroSlider.vue';

const props = defineProps<{
  element: any;
}>();

const slides = computed(() => {
  const sliderItems = props.element.data?.sliderItems || [];
  
  return sliderItems.map((item: any) => {
    const media = item.media;
    // Shopware 6 API often places customFields in 'translated' property
    const customFields = media?.translated?.customFields || media?.customFields || {};

    return {
      id: media?.id || item.url,
      title: customFields.custom_hero_title || '',
      subtitle: customFields.custom_hero_subtitle || '',
      image: media?.url || item.url,
      cta: customFields.custom_hero_cta_label || 'Zistiť viac',
      // Parse hotspots if available (JSON string or object)
      hotspots: typeof customFields.custom_hero_hotspots === 'string' 
        ? JSON.parse(customFields.custom_hero_hotspots) 
        : (customFields.custom_hero_hotspots || [])
    };
  });
});
</script>

<template>
  <HeroSlider :slides="slides" />
</template>
