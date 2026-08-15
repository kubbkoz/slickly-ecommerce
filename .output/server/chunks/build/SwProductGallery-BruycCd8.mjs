import __nuxt_component_0 from './CmsElementImageGallery-DeIRHxqJ.mjs';
import { defineComponent, ref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import './server.mjs';
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
import './CmsElementImageGallery3dPlaceholder-oJCEVX_7.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import './ChevronIcon-Aj1t6zS4.mjs';
import './isSpatial-B7iPo9RI.mjs';
import './useCmsElementConfig-DY8wkVjg.mjs';
import './useImagePlaceholder-30hLRW4O.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwProductGallery",
  __ssrInlineRender: true,
  props: {
    product: {},
    config: { default: () => ({}) }
  },
  setup(__props) {
    const defaultConfig = {
      minHeight: { value: "300px", source: "static" },
      navigationArrows: { value: "inside", source: "static" },
      navigationDots: { value: "inside", source: "static" }
    };
    const content = ref();
    watch(
      [() => __props.product, () => __props.config],
      ([currentProduct, currentConfig]) => {
        content.value = {
          config: {
            ...defaultConfig,
            ...currentConfig
          },
          data: {
            sliderItems: currentProduct.media
          }
        };
      },
      {
        immediate: true
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CmsElementImageGallery = __nuxt_component_0;
      if (content.value) {
        _push(ssrRenderComponent(_component_CmsElementImageGallery, mergeProps({ content: content.value }, _attrs), null, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwProductGallery.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SwProductGallery = Object.assign(_sfc_main, { __name: "SwProductGallery" });

export { SwProductGallery as default };
