import __nuxt_component_0$1 from './StarIcon-DB6h1IBB.mjs';
import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
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
import '@shopware/helpers';
import './server.mjs';
import 'pinia';
import '@iconify/vue';
import '@shopware/api-client';
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwProductRating",
  __ssrInlineRender: true,
  props: {
    rating: { default: 0 },
    reviewCount: { default: 0 },
    starSize: { default: 16 },
    showCount: { type: Boolean, default: true }
  },
  setup(__props) {
    const filledStars = computed(() => Math.round(__props.rating));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwStarIcon = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center" }, _attrs))}><div class="flex items-center gap-1.5" role="img"${ssrRenderAttr("aria-label", `${__props.rating} out of 5 stars`)}><!--[-->`);
      ssrRenderList(5, (i) => {
        _push(ssrRenderComponent(_component_SwStarIcon, {
          key: `star-${i}`,
          filled: i <= filledStars.value,
          size: __props.starSize
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      if (__props.showCount && __props.reviewCount > 0) {
        _push(`<span class="ml-1 text-surface-on-surface-variant text-base leading-normal"> (${ssrInterpolate(__props.reviewCount)}) </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwProductRating.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "SwProductRating" });

export { __nuxt_component_0 as default };
