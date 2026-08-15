import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './MTShape-DBVD8rjd.mjs';
import { AlertTriangle, RefreshCcw, MessageSquare } from 'lucide-vue-next';
import { _ as _export_sfc, D as useAppConfig } from './server.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BackendErrorState",
  __ssrInlineRender: true,
  props: {
    title: { default: "REŽIM ÚDRŽBY SYSTÉMU" },
    message: { default: "Naše vyhľadávacie servery momentálne prechádzajú optimalizáciou. Ostatné časti webu sú plne funkčné." },
    retryAction: {}
  },
  emits: ["retry"],
  setup(__props, { emit: __emit }) {
    const contact = useAppConfig().contact;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative w-full py-16 md:py-24 bg-gray-50 overflow-hidden border border-gray-100 group" }, _attrs))} data-v-086d68f2><div class="absolute -right-10 -bottom-10 w-64 h-64 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-700" data-v-086d68f2><img${ssrRenderAttr("src", _imports_0)} alt="" class="w-full h-full object-contain" data-v-086d68f2></div><div class="tech-corner-tl group-hover:scale-125 transition-transform" data-v-086d68f2></div><div class="tech-corner-br group-hover:scale-125 transition-transform" data-v-086d68f2></div><div class="container mx-auto px-4 flex flex-col items-center text-center relative z-10" data-v-086d68f2><div class="mb-8 relative" data-v-086d68f2><div class="absolute inset-0 bg-brand/10 blur-3xl rounded-full scale-150 animate-pulse-slow" data-v-086d68f2></div><div class="w-20 h-20 bg-white border border-gray-100 flex items-center justify-center relative shadow-xl transform rotate-3" data-v-086d68f2>`);
      _push(ssrRenderComponent(unref(AlertTriangle), {
        class: "w-10 h-10 text-brand",
        "stroke-width": 1.5
      }, null, _parent));
      _push(`</div></div><h3 class="text-3xl md:text-4xl font-black italic uppercase font-tech tracking-wider text-gray-900 mb-6 underline decoration-brand/30 decoration-8 underline-offset-4" data-v-086d68f2>${ssrInterpolate(__props.title)}</h3><p class="max-w-xl text-gray-500 font-sans text-sm md:text-base leading-relaxed mb-10 px-4" data-v-086d68f2>${ssrInterpolate(__props.message)}</p><div class="flex flex-wrap items-center justify-center gap-4" data-v-086d68f2><button class="btn-tab-active flex items-center gap-3 group/retry" data-v-086d68f2>`);
      _push(ssrRenderComponent(unref(RefreshCcw), { class: "w-4 h-4 group-hover/retry:rotate-180 transition-transform duration-500" }, null, _parent));
      _push(`<span data-v-086d68f2>SKÚSIŤ ZNOVA</span></button><a${ssrRenderAttr("href", unref(contact).phone.mainHref)} class="btn-secondary h-[42px] px-6 flex items-center gap-3 border border-gray-200" data-v-086d68f2>`);
      _push(ssrRenderComponent(unref(MessageSquare), { class: "w-4 h-4" }, null, _parent));
      _push(`<span data-v-086d68f2>PODPORA</span></a></div><div class="mt-12 flex items-center gap-2" data-v-086d68f2><div class="w-1 h-1 bg-brand animate-ping" data-v-086d68f2></div><span class="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400" data-v-086d68f2>System Monitoring Active</span></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/BackendErrorState.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BackendErrorState = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-086d68f2"]]), { __name: "BackendErrorState" });

export { BackendErrorState as default };
