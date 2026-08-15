import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { ArrowRight } from 'lucide-vue-next';
import { _ as _export_sfc } from './server.mjs';
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
  __name: "CartCrossSellPanel",
  __ssrInlineRender: true,
  props: {
    crossSells: {},
    isOpen: { type: Boolean },
    isLoading: { type: Boolean },
    getProductImageUrl: { type: Function },
    getPrice: { type: Function },
    formatPrice: { type: Function }
  },
  emits: ["navigate"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      if (__props.isOpen && (__props.crossSells.length > 0 || __props.isLoading)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "hidden md:flex flex-col absolute top-0 bottom-0 right-full -mr-[1px] w-[280px] bg-[#f9f9f9] border-y border-l border-gray-200 shadow-[-20px_0_40px_rgba(0,0,0,0.03)] pt-6 pb-6 overflow-hidden text-center" }, _attrs))} data-v-f0f3cf9e><h3 class="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-5 px-5 font-sans" data-v-f0f3cf9e> Mohlo by vás zaujímať </h3><div class="flex-1 w-full overflow-y-auto px-5 space-y-5 custom-content-fade custom-scrollbar" data-v-f0f3cf9e>`);
        if (__props.isLoading) {
          _push(`<!--[-->`);
          ssrRenderList(3, (i) => {
            _push(`<div class="w-full animate-pulse" data-v-f0f3cf9e><div class="w-full aspect-square bg-gray-200 border border-gray-100 mb-2" data-v-f0f3cf9e></div><div class="h-3 bg-gray-200 rounded-sm w-3/4 mx-auto mb-2" data-v-f0f3cf9e></div><div class="h-4 bg-gray-200 rounded-sm w-1/2 mx-auto" data-v-f0f3cf9e></div></div>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!--[-->`);
          ssrRenderList(__props.crossSells, (fp) => {
            _push(`<div class="w-full group cursor-pointer" data-v-f0f3cf9e><div class="w-full aspect-square bg-white border border-gray-100 mb-2 overflow-hidden flex items-center justify-center p-4" data-v-f0f3cf9e>`);
            _push(ssrRenderComponent(_component_NuxtImg, {
              src: __props.getProductImageUrl(fp),
              format: "webp",
              loading: "lazy",
              class: "w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
            }, null, _parent));
            _push(`</div><h4 class="text-[10px] font-bold text-black line-clamp-2 leading-tight font-sans mb-1" data-v-f0f3cf9e>${ssrInterpolate(fp.translated?.name || fp.name)}</h4><div class="text-[12px] font-black font-tech text-black" data-v-f0f3cf9e>${ssrInterpolate(__props.formatPrice(__props.getPrice(fp)))}</div><div class="mt-1.5 text-[9px] uppercase font-bold tracking-widest text-gray-400 group-hover:text-black transition-colors flex items-center justify-center gap-1" data-v-f0f3cf9e> Zobraziť `);
            _push(ssrRenderComponent(unref(ArrowRight), { class: "w-3 h-3" }, null, _parent));
            _push(`</div></div>`);
          });
          _push(`<!--]-->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/CartCrossSellPanel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CartCrossSellPanel = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-f0f3cf9e"]]), { __name: "CartCrossSellPanel" });

export { CartCrossSellPanel as default };
