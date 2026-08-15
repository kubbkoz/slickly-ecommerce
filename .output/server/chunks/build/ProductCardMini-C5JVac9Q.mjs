import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useProductHelpers } from './useProductHelpers-Ch_jrkwO.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductCardMini",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const {
      getProductImageUrl,
      getPrice,
      getOldPrice,
      calculateDiscount,
      getFormattedName
    } = useProductHelpers();
    const imageUrl = computed(() => getProductImageUrl(props.product));
    const discount = computed(() => calculateDiscount(props.product));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex gap-4 p-3 bg-white hover:bg-gray-50 transition-all duration-300 cursor-pointer group rounded-default border border-gray-100/50 hover:border-brand/20" }, _attrs))}><div class="w-20 h-20 bg-white shrink-0 relative overflow-hidden flex items-center justify-center p-2 rounded-default border border-gray-100/50"><img${ssrRenderAttr("src", unref(imageUrl))}${ssrRenderAttr("alt", __props.product.name)} width="80" height="80" loading="lazy" class="w-full h-full object-contain transition-transform duration-500 rounded-default">`);
      if (unref(discount) > 0) {
        _push(`<div class="absolute top-0 left-0 bg-amber text-black text-[9px] font-bold px-1.5 py-0.5 z-10"> -${ssrInterpolate(unref(discount))}% </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex flex-col justify-center min-w-0"><h4 class="font-sans text-xs font-medium uppercase tracking-tight text-gray-900 group-hover:text-brand transition-colors line-clamp-2 leading-none mb-2">${ssrInterpolate(unref(getFormattedName)(__props.product))}</h4><div class="flex items-baseline gap-2"><span class="font-tech font-black text-lg text-black leading-none">${ssrInterpolate(unref(getPrice)(__props.product))} € </span>`);
      if (unref(getOldPrice)(__props.product)) {
        _push(`<span class="text-[10px] text-gray-400 line-through font-tech">${ssrInterpolate(unref(getOldPrice)(__props.product))} € </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ProductCardMini.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "ProductCardMini" });

export { __nuxt_component_0 as default };
