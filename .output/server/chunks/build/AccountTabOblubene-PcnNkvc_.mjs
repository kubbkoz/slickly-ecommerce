import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { Trash2 } from 'lucide-vue-next';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AccountTabOblubene",
  __ssrInlineRender: true,
  props: {
    wishlistItems: {}
  },
  emits: ["remove"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white shadow-sm p-8 animate-fade-in" }, _attrs))}><h2 class="text-xl font-black uppercase tracking-wide font-tech mb-8">Moje Obľúbené produkty</h2>`);
      if (__props.wishlistItems && __props.wishlistItems.length > 0) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(__props.wishlistItems, (item) => {
          _push(`<div class="group border border-gray-100 p-4 relative bg-white hover:border-black transition-colors flex flex-col h-full"><button class="absolute top-4 right-4 z-10 p-2 bg-black text-white hover:bg-brand transition-colors shadow-sm">`);
          _push(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4" }, null, _parent));
          _push(`</button>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/detail/${item.id}`,
            class: "block aspect-square w-full mb-4 bg-gray-50 flex items-center justify-center p-4"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<img${ssrRenderAttr("src", item?.cover?.media?.url || "https://placehold.co/300")} class="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"${_scopeId}>`);
              } else {
                return [
                  createVNode("img", {
                    src: item?.cover?.media?.url || "https://placehold.co/300",
                    class: "max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  }, null, 8, ["src"])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<div class="flex-1 flex flex-col"><h3 class="text-xs font-bold uppercase tracking-wider text-black group-hover:text-brand transition-colors mb-2 line-clamp-2">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/detail/${item.id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.translated?.name || item?.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item.translated?.name || item?.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</h3><div class="mt-auto pt-4 flex items-end justify-between border-t border-gray-100"><span class="font-black font-tech text-lg text-black">${ssrInterpolate(item.calculatedPrice?.unitPrice ? item.calculatedPrice.unitPrice.toFixed(2) + " €" : "")}</span></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="py-16 text-center text-sm text-gray-400 bg-gray-50 border border-gray-100"> Zatiaľ nemáte žiadne obľúbené produkty. </div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/account/AccountTabOblubene.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "AccountTabOblubene" });

export { __nuxt_component_1 as default };
