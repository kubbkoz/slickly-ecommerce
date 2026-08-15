import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import HeroSlider from './HeroSlider-Dyb6ghVk.mjs';
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
import './server.mjs';
import 'pinia';
import '@iconify/vue';
import '@shopware/api-client';
import '@shopware/helpers';
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './constants-Dm0Yhftm.mjs';
import './composables-x8_ENpEe.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsHeroSlider",
  __ssrInlineRender: true,
  props: {
    element: {}
  },
  setup(__props) {
    const props = __props;
    const slides = computed(() => {
      const sliderItems = props.element.data?.sliderItems || [];
      return sliderItems.map((item) => {
        const media = item.media;
        const customFields = media?.translated?.customFields || media?.customFields || {};
        return {
          id: media?.id || item.url,
          title: customFields.custom_hero_title || "",
          subtitle: customFields.custom_hero_subtitle || "",
          image: media?.url || item.url,
          cta: customFields.custom_hero_cta_label || "Zistiť viac",
          // Parse hotspots if available (JSON string or object)
          hotspots: typeof customFields.custom_hero_hotspots === "string" ? JSON.parse(customFields.custom_hero_hotspots) : customFields.custom_hero_hotspots || []
        };
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(HeroSlider, mergeProps({ slides: slides.value }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cms/CmsHeroSlider.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsHeroSlider = Object.assign(_sfc_main, { __name: "CmsHeroSlider" });

export { CmsHeroSlider as default };
