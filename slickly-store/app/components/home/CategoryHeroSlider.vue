<script setup lang="ts">
import { computed, watch } from 'vue';
import HeroSlider from '~/components/home/HeroSlider.vue';
import { getSafeMediaUrl } from '~/utils/media';
// @ts-ignore
import { useShopwareContext, useAsyncData, useRoute } from '#imports';

const props = defineProps<{
  categoryId: string;
}>();

const { apiClient } = useShopwareContext();
const route = useRoute();
const { getProductUrl } = useProductHelpers();

// Derive locale from route path (SSR-safe) instead of useI18n().locale (globally shared ref)
const getRouteLocale = () => {
  const m = route.path.match(/^\/([a-z]{2})(\/|$)/);
  return m?.[1] || 'sk';
};

// Map Nuxt locale code → Shopware language ID (from nuxt.config.ts locales array)
import { useShopwareLanguage } from '#imports';
const { currentLanguageId } = useShopwareLanguage();
const shopwareLanguageId = currentLanguageId;

const fetchSlides = async () => {
  try {
    const headers: Record<string, string> = {};
    // Pass sw-language-id so Shopware returns translated names/descriptions
    if (shopwareLanguageId.value) {
      headers['sw-language-id'] = shopwareLanguageId.value;
    }

    const response = await apiClient.invoke('readCategoryList post /category', {
      headers,
      body: {
        filter: [
          { type: "equals", field: "parentId", value: props.categoryId },
          { type: "equals", field: "active", value: true }
        ],
        associations: {
          media: {},
        }
      }
    });
    const elements = response.data.elements || [];
    // Manual JS sort by position to avoid API restriction on readCategoryList
    elements.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
    return elements;
  } catch (e) {
    console.error('Failed to fetch Category Hero Slider:', e);
    return [];
  }
};

const transformSlides = async (elements: any[]) => {
  if (!elements || elements.length === 0) return [];

  const children = elements;

  // 1. Map slides
  const mapped = children.map((item: any) => {
    const categoryCustomFields = item.translated?.customFields || item.customFields || {};

    // Prefer category media, fallback to custom field if defined manually
    let media = item.media;
    if (!media && categoryCustomFields.custom_hero_image) {
      // If ID is stored in custom field, it's already handled by associations in Shopware usually
    }

    const title = item.translated?.name || item.name || '';
    const subtitle = item.translated?.description || '';

    const imageUrl = getSafeMediaUrl(media);

    const cta = categoryCustomFields.custom_hero_cta_label || 'Zistiť viac';
    const ctaLink = categoryCustomFields.custom_hero_cta_url || '#';
    const secondaryCta = categoryCustomFields.custom_hero_secondary_cta_label || '';
    const secondaryCtaLink = categoryCustomFields.custom_hero_secondary_cta_link || '';
    const badge = categoryCustomFields.custom_hero_badge_text || '';

    const hotspotsRaw = categoryCustomFields.custom_hero_hotspots;
    let parsedHotspots: any[] = [];
    if (typeof hotspotsRaw === 'string' && hotspotsRaw.trim() !== '') {
      const spots = hotspotsRaw.split(';');
      parsedHotspots = spots.map((spotStr: string, index: number) => {
        const parts = spotStr.split(',').map((s: string) => s.trim());
        if (parts.length >= 3) {
          return {
            id: `spot-${item.id}-${index}`,
            productId: parts[0],
            x: parseFloat(parts[1] || '0'),
            y: parseFloat(parts[2] || '0'),
            label: '',
            price: ''
          };
        }
        return null;
      }).filter(Boolean);
    }

    return {
      id: item.id,
      title, subtitle,
      image: imageUrl || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2000&auto=format&fit=crop',
      cta, ctaLink, secondaryCta, secondaryCtaLink, badge,
      hotspots: parsedHotspots,
      _hasActualImage: !!imageUrl
    };
  });

  // 2. Fetch Products for Hotspots
  const productIds = new Set<string>();
  mapped.forEach((slide: any) => {
    slide.hotspots?.forEach((h: any) => {
      if (h.productId) productIds.add(h.productId);
    });
  });

  if (productIds.size > 0) {
    try {
      const productsResponse = await apiClient.invoke('readProduct post /product', {
        body: {
          ids: Array.from(productIds),
          associations: {
            seoUrls: {},
            cover: { associations: { media: {} } }
          }
        }
      });
      const products = productsResponse.data.elements || [];
      const productMap = new Map(products.map((p: any) => [p.id, p]));

      mapped.forEach((slide: any) => {
        slide.hotspots?.forEach((h: any) => {
          if (h.productId) {
            const product = productMap.get(h.productId);
            if (product) {
              h.label = product.translated?.name || product.name || h.label;
              const price = product.calculatedPrice?.unitPrice || product.price?.[0]?.gross;
              h.price = price ? `${price} €` : '';
              h.image = getSafeMediaUrl(product.cover?.media);
              h.link = getProductUrl(product);
            }
          }
        });
      });
    } catch (e) {
      console.error('Error fetching hotspot products in transform:', e);
    }
  }

  return mapped;
};

// ─── Locale-aware key: cache is per language, Nuxt refetches on locale change ─
const { data: categoryResponse, refresh } = await useAsyncData(
  // Key includes route-derived locale → separate cache entry per language, SSR-safe
  `categoryHeroSlider-${props.categoryId}-${currentLanguageId.value}`,
  async () => {
    const elements = await fetchSlides();
    return transformSlides(elements);
  },
  {
    // Watch currentLanguageId to refetch on CSR language change
    watch: [currentLanguageId],
  }
);
</script>

<template>
  <HeroSlider :slides="categoryResponse || []" />
</template>
