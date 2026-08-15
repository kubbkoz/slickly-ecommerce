import { defineComponent, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { X, Star, Check } from 'lucide-vue-next';
import BaseButton from './BaseButton-BJMOoNbK.mjs';
import AddToCartButton from './AddToCartButton-B8hFUbWd.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './useUiState-BTlUPkrr.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "QuickViewModal",
  __ssrInlineRender: true,
  props: {
    product: {},
    isOpen: { type: Boolean }
  },
  emits: ["close", "viewDetails"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const onViewDetails = () => emit("viewDetails");
    const calculateDiscount = () => {
      if (props.product?.oldPrice && props.product?.price) {
        return Math.round((props.product.oldPrice - props.product.price) / props.product.oldPrice * 100);
      }
      return 0;
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.isOpen && __props.product) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans" }, _attrs))}><div class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"></div><div class="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden animate-slide-up flex flex-col md:flex-row max-h-[90vh] md:max-h-[800px]"><button class="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white transition-colors text-black hover:text-brand">`);
        _push(ssrRenderComponent(unref(X), { class: "w-6 h-6" }, null, _parent));
        _push(`</button><div class="w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center relative">`);
        if (__props.product.oldPrice) {
          _push(`<span class="absolute top-6 left-6 z-10 px-3 py-1.5 text-lg font-black text-black uppercase tracking-wider font-tech bg-amber shadow-lg transform -rotate-2"> -${ssrInterpolate(calculateDiscount())}% </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<img${ssrRenderAttr("src", __props.product.image)}${ssrRenderAttr("alt", __props.product.name)} class="w-full h-full object-contain max-h-[400px] mix-blend-multiply"></div><div class="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto scrollbar-hide"><div class="mb-6"><span class="text-brand font-bold text-sm uppercase tracking-widest mb-2 block font-tech">${ssrInterpolate(__props.product.category)}</span><h2 class="text-3xl md:text-4xl font-black text-black leading-tight mb-4 font-tech">${ssrInterpolate(__props.product.name)}</h2><div class="flex items-center space-x-4 mb-6"><div class="flex items-center gap-1"><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(ssrRenderComponent(unref(Star), {
            key: i,
            class: ["w-4 h-4", i <= __props.product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"]
          }, null, _parent));
        });
        _push(`<!--]--><span class="text-gray-400 text-xs ml-2 font-medium font-sans">(${ssrInterpolate(__props.product.reviewsCount || 0)} recenzií)</span></div><div class="h-4 w-px bg-gray-300"></div><span class="text-green-600 text-sm font-bold flex items-center font-sans">`);
        _push(ssrRenderComponent(unref(Check), { class: "w-4 h-4 mr-1" }, null, _parent));
        _push(` Skladom </span></div><div class="flex items-baseline space-x-4 mb-8"><span class="text-4xl font-black text-black font-tech">${ssrInterpolate(__props.product.price)} €</span>`);
        if (__props.product.oldPrice) {
          _push(`<span class="text-xl text-gray-400 line-through font-tech">${ssrInterpolate(__props.product.oldPrice)} €</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><p class="text-gray-600 leading-relaxed mb-8 text-lg font-medium font-sans">${ssrInterpolate(__props.product.description || "Popis produktu.")}</p>`);
        if (__props.product.features) {
          _push(`<div class="mb-8"><h4 class="font-bold text-black mb-3 text-sm uppercase font-tech tracking-wide">Kľúčové vlastnosti:</h4><ul class="grid grid-cols-1 sm:grid-cols-2 gap-2"><!--[-->`);
          ssrRenderList(__props.product.features, (feat, idx) => {
            _push(`<li class="flex items-start text-sm text-gray-600 font-sans"><div class="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 mr-2 flex-shrink-0"></div> ${ssrInterpolate(feat)}</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-4 pt-6 border-t border-gray-100"><div class="flex flex-col sm:flex-row gap-4">`);
        _push(ssrRenderComponent(AddToCartButton, {
          product: __props.product,
          "full-width": true,
          class: "uppercase tracking-wider font-bold"
        }, null, _parent));
        _push(ssrRenderComponent(BaseButton, {
          "full-width": "",
          size: "lg",
          variant: "outline",
          class: "uppercase tracking-wide font-bold",
          onClick: onViewDetails
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Zobraziť detaily `);
            } else {
              return [
                createTextVNode(" Zobraziť detaily ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/QuickViewModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const QuickViewModal = Object.assign(_sfc_main, { __name: "QuickViewModal" });

export { QuickViewModal as default };
