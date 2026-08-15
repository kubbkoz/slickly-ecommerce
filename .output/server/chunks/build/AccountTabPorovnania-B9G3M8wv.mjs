import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, ref, resolveComponent, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { Scale, Copy, ExternalLink } from 'lucide-vue-next';
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
  __name: "AccountTabPorovnania",
  __ssrInlineRender: true,
  setup(__props) {
    const comparisons = ref([]);
    const loading = ref(true);
    const copied = ref(null);
    const formatDate = (iso) => new Date(iso).toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Check = resolveComponent("Check");
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white shadow-sm p-8 animate-fade-in" }, _attrs))}><h2 class="text-xl font-black uppercase tracking-wide font-tech mb-8">Moje porovnania</h2>`);
      if (unref(loading)) {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="h-20 bg-gray-100 animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(comparisons).length) {
        _push(`<div class="text-center py-16">`);
        _push(ssrRenderComponent(unref(Scale), { class: "w-12 h-12 text-gray-200 mx-auto mb-4" }, null, _parent));
        _push(`<p class="text-gray-400 font-sans text-sm">Zatiaľ nemáte žiadne uložené porovnania.</p><p class="text-gray-400 font-sans text-xs mt-1">Na stránke produktu kliknite &quot;Porovnať&quot; a uložte porovnanie.</p></div>`);
      } else {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(comparisons), (comp) => {
          _push(`<div class="border border-gray-200 p-4 md:p-6"><div class="flex items-start justify-between gap-4 mb-4"><div><p class="text-xs text-gray-400 font-sans">${ssrInterpolate(formatDate(comp.createdAt))}</p><p class="text-sm font-bold mt-1">${ssrInterpolate(comp.items?.length || 0)} produktov</p></div><div class="flex items-center gap-2"><button class="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-gray-200 hover:border-black transition-colors">`);
          if (unref(copied) === comp.hash) {
            _push(`<!--[-->`);
            _push(ssrRenderComponent(_component_Check, { class: "w-3 h-3 text-green-600" }, null, _parent));
            _push(` Skopírované<!--]-->`);
          } else {
            _push(`<!--[-->`);
            _push(ssrRenderComponent(unref(Copy), { class: "w-3 h-3" }, null, _parent));
            _push(` Link<!--]-->`);
          }
          _push(`</button>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/porovnanie/${comp.hash}`,
            class: "flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-black text-white hover:bg-brand transition-colors"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(ExternalLink), { class: "w-3 h-3" }, null, _parent2, _scopeId));
                _push2(` Otvoriť `);
              } else {
                return [
                  createVNode(unref(ExternalLink), { class: "w-3 h-3" }),
                  createTextVNode(" Otvoriť ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div><div class="flex gap-3 overflow-x-auto"><!--[-->`);
          ssrRenderList(comp.items || [], (item) => {
            _push(`<div class="flex-shrink-0 w-20 text-center"><img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.name)} class="w-16 h-16 object-contain mx-auto mb-1"><p class="text-[10px] font-bold uppercase leading-tight line-clamp-2">${ssrInterpolate(item.name)}</p></div>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/account/AccountTabPorovnania.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main, { __name: "AccountTabPorovnania" });

export { __nuxt_component_8 as default };
