import BaseButton from './BaseButton-BJMOoNbK.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { Frown } from 'lucide-vue-next';
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
  __name: "CartEmptyState",
  __ssrInlineRender: true,
  props: {
    categories: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseButton = BaseButton;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col items-center justify-center text-center w-full min-h-[480px] py-12" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(Frown), {
        class: "w-14 h-14 mb-5 text-gray-300",
        "stroke-width": 1.3
      }, null, _parent));
      _push(`<h3 class="text-2xl font-black uppercase tracking-widest mb-3 text-black font-tech"> Váš košík je prázdny </h3>`);
      _push(ssrRenderComponent(_component_BaseButton, {
        variant: "brand-outline",
        class: "mt-4 px-8 py-3.5",
        onClick: ($event) => emit("close")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Vybrať niečo zaujímavé `);
          } else {
            return [
              createTextVNode(" Vybrať niečo zaujímavé ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mt-10 w-full max-w-xs mx-auto"><p class="text-[10px] font-sans text-gray-400 tracking-widest mb-4">Hľadám kategóriu:</p><div class="flex flex-wrap gap-2 justify-center"><!--[-->`);
      ssrRenderList(__props.categories, (cat) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: cat.id,
          to: cat.url,
          class: "px-4 py-2 bg-gray-50 border border-gray-100 hover:bg-gray-100 text-black text-[10px] font-bold tracking-wide transition-colors font-sans",
          onClick: ($event) => emit("close")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(cat.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(cat.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/CartEmptyState.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CartEmptyState = Object.assign(_sfc_main, { __name: "CartEmptyState" });

export { CartEmptyState as default };
