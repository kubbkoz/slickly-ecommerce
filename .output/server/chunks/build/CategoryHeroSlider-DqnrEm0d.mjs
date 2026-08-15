import { defineComponent, withAsyncContext, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import HeroSlider from './HeroSlider-Dyb6ghVk.mjs';
import { g as getSafeMediaUrl } from './media-BNPyNy3v.mjs';
import { u as useProductHelpers } from './useProductHelpers-Ch_jrkwO.mjs';
import { e as useShopwareContext, d as useRoute, h as useAsyncData } from './server.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';
import './nuxt-link-B7B0pxEe.mjs';
import '../nitro/nitro.mjs';
import 'nodemailer';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'anymatch';
import 'lru-cache';
import 'vue-router';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'lucide-vue-next';
import './constants-Dm0Yhftm.mjs';
import './composables-x8_ENpEe.mjs';
import '@shopware/helpers';
import 'pinia';
import '@iconify/vue';
import '@shopware/api-client';
import 'js-cookie';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CategoryHeroSlider",
  __ssrInlineRender: true,
  props: {
    categoryId: {}
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const { apiClient } = useShopwareContext();
    useRoute();
    const { getProductUrl } = useProductHelpers();
    const { currentLanguageId } = useShopwareLanguage();
    const shopwareLanguageId = currentLanguageId;
    const fetchSlides = async () => {
      try {
        const headers = {};
        if (shopwareLanguageId.value) {
          headers["sw-language-id"] = shopwareLanguageId.value;
        }
        const response = await apiClient.invoke("readCategoryList post /category", {
          headers,
          body: {
            filter: [
              { type: "equals", field: "parentId", value: props.categoryId },
              { type: "equals", field: "active", value: true }
            ],
            associations: {
              media: {}
            }
          }
        });
        const elements = response.data.elements || [];
        elements.sort((a, b) => (a.position || 0) - (b.position || 0));
        return elements;
      } catch (e) {
        return [];
      }
    };
    const transformSlides = async (elements) => {
      if (!elements || elements.length === 0) return [];
      const children = elements;
      const mapped = children.map((item) => {
        const categoryCustomFields = item.translated?.customFields || item.customFields || {};
        let media = item.media;
        if (!media && categoryCustomFields.custom_hero_image) ;
        const title = item.translated?.name || item.name || "";
        const subtitle = item.translated?.description || "";
        const imageUrl = getSafeMediaUrl(media);
        const cta = categoryCustomFields.custom_hero_cta_label || "Zistiť viac";
        const ctaLink = categoryCustomFields.custom_hero_cta_url || "#";
        const secondaryCta = categoryCustomFields.custom_hero_secondary_cta_label || "";
        const secondaryCtaLink = categoryCustomFields.custom_hero_secondary_cta_link || "";
        const badge = categoryCustomFields.custom_hero_badge_text || "";
        const hotspotsRaw = categoryCustomFields.custom_hero_hotspots;
        let parsedHotspots = [];
        if (typeof hotspotsRaw === "string" && hotspotsRaw.trim() !== "") {
          const spots = hotspotsRaw.split(";");
          parsedHotspots = spots.map((spotStr, index) => {
            const parts = spotStr.split(",").map((s) => s.trim());
            if (parts.length >= 3) {
              return {
                id: `spot-${item.id}-${index}`,
                productId: parts[0],
                x: parseFloat(parts[1] || "0"),
                y: parseFloat(parts[2] || "0"),
                label: "",
                price: ""
              };
            }
            return null;
          }).filter(Boolean);
        }
        return {
          id: item.id,
          title,
          subtitle,
          image: imageUrl || "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2000&auto=format&fit=crop",
          cta,
          ctaLink,
          secondaryCta,
          secondaryCtaLink,
          badge,
          hotspots: parsedHotspots,
          _hasActualImage: !!imageUrl
        };
      });
      const productIds = /* @__PURE__ */ new Set();
      mapped.forEach((slide) => {
        slide.hotspots?.forEach((h) => {
          if (h.productId) productIds.add(h.productId);
        });
      });
      if (productIds.size > 0) {
        try {
          const productsResponse = await apiClient.invoke("readProduct post /product", {
            body: {
              ids: Array.from(productIds),
              associations: {
                seoUrls: {},
                cover: { associations: { media: {} } }
              }
            }
          });
          const products = productsResponse.data.elements || [];
          const productMap = new Map(products.map((p) => [p.id, p]));
          mapped.forEach((slide) => {
            slide.hotspots?.forEach((h) => {
              if (h.productId) {
                const product = productMap.get(h.productId);
                if (product) {
                  h.label = product.translated?.name || product.name || h.label;
                  const price = product.calculatedPrice?.unitPrice || product.price?.[0]?.gross;
                  h.price = price ? `${price} €` : "";
                  h.image = getSafeMediaUrl(product.cover?.media);
                  h.link = getProductUrl(product);
                }
              }
            });
          });
        } catch (e) {
        }
      }
      return mapped;
    };
    const { data: categoryResponse, refresh } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      // Key includes route-derived locale → separate cache entry per language, SSR-safe
      `categoryHeroSlider-${props.categoryId}-${currentLanguageId.value}`,
      async () => {
        const elements = await fetchSlides();
        return transformSlides(elements);
      },
      {
        // Watch currentLanguageId to refetch on CSR language change
        watch: [currentLanguageId]
      }
    )), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(HeroSlider, mergeProps({
        slides: unref(categoryResponse) || []
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/CategoryHeroSlider.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CategoryHeroSlider = Object.assign(_sfc_main, { __name: "CategoryHeroSlider" });

export { CategoryHeroSlider as default };
