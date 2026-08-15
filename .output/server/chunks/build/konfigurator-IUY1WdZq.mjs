import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Sparkles, ChevronRight, Loader2, Send, RotateCcw } from 'lucide-vue-next';
import { s as sanitizeHtml } from './sanitize-DKvwg8Vq.mjs';
import { C as useSeoMeta, b as useLocalePath } from './server.mjs';
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
  __name: "konfigurator",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Konfigurátor bicykla | SLICKLY",
      description: "Nájdi ideálny bicykel s pomocou AI. Odpov na niekoľko otázok a my ti odporučíme ten správny model."
    });
    const WELCOME_MESSAGE = {
      role: "assistant",
      text: "Ahoj! Pomôžem ti nájsť ideálny bicykel. Povedz mi — na čo ho primárne plánuješ využívať? (Terén, mesto, cestovanie, šport...)"
    };
    const BIKE_SEARCH_QUERIES = {
      "horský MTB hardtail": "MTB hardtail",
      "horský MTB full-suspension": "MTB full suspension",
      "silničný bicykel": "silničný bicykel",
      "gravel": "gravel bicykel",
      "trekking": "trekking bicykel",
      "e-bike MTB": "e-bike horský",
      "e-bike trekking": "e-bike trekking",
      "e-bike road": "e-bike silničný",
      "detský bicykel": "detský bicykel"
    };
    const messages = ref([WELCOME_MESSAGE]);
    const input = ref("");
    const isLoading = ref(false);
    ref(null);
    ref(null);
    computed(
      () => messages.value.filter((m) => m.role !== "assistant" || !m.recommendations).map((m) => ({ role: m.role, content: m.text }))
    );
    const localePath = useLocalePath();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-zinc-950" }, _attrs))}><div class="bg-black border-b border-zinc-800 py-14"><div class="container mx-auto px-4"><div class="flex items-center gap-3 mb-4">`);
      _push(ssrRenderComponent(unref(Sparkles), { class: "w-5 h-5 text-brand" }, null, _parent));
      _push(`<span class="text-brand font-tech font-bold uppercase tracking-widest text-xs">AI Sprievodca</span></div><h1 class="text-2xl md:text-4xl font-black text-white leading-[0.95] font-tech uppercase tracking-wide mb-4"> Konfigurátor <span class="text-brand">bicykla</span></h1><div class="w-24 h-1.5 bg-brand -skew-x-[20deg] mb-6"></div><p class="text-gray-400 font-sans text-base max-w-lg"> Odpov na niekoľko otázok a náš AI asistent ti odporučí ideálny typ bicykla. </p></div></div><div class="container mx-auto px-4 py-10"><div class="max-w-2xl mx-auto"><div class="space-y-4 mb-6 min-h-[300px]"><!--[-->`);
      ssrRenderList(unref(messages), (msg, i) => {
        _push(`<div class="${ssrRenderClass([msg.role === "user" ? "justify-end" : "justify-start", "flex"])}"><div class="${ssrRenderClass([msg.role === "user" ? "bg-brand text-white px-5 py-3" : "bg-zinc-900 border border-zinc-700 text-gray-200 px-5 py-4", "max-w-[85%]"])}">`);
        if (msg.role === "assistant") {
          _push(`<div class="flex items-center gap-2 mb-2">`);
          _push(ssrRenderComponent(unref(Sparkles), { class: "w-3 h-3 text-brand" }, null, _parent));
          _push(`<span class="text-brand font-tech text-[10px] uppercase tracking-widest">MT AI</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="font-sans text-sm leading-relaxed">${unref(sanitizeHtml)(msg.text) ?? ""}</p>`);
        if (msg.recommendations?.length) {
          _push(`<div class="mt-5 pt-4 border-t border-zinc-700"><p class="text-brand font-tech text-xs uppercase tracking-widest mb-3">Odporúčané typy bicyklov</p><div class="space-y-2"><!--[-->`);
          ssrRenderList(msg.recommendations, (rec) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: rec,
              to: unref(localePath)(`/search?q=${encodeURIComponent(BIKE_SEARCH_QUERIES[rec] || rec)}`),
              class: "flex items-center justify-between px-4 py-3 bg-zinc-800 hover:bg-brand hover:text-white text-gray-200 transition-colors group"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="font-sans text-sm font-medium capitalize"${_scopeId}>${ssrInterpolate(rec)}</span>`);
                  _push2(ssrRenderComponent(unref(ChevronRight), { class: "w-4 h-4 text-brand group-hover:text-white transition-colors" }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode("span", { class: "font-sans text-sm font-medium capitalize" }, toDisplayString(rec), 1),
                    createVNode(unref(ChevronRight), { class: "w-4 h-4 text-brand group-hover:text-white transition-colors" })
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]-->`);
      if (unref(isLoading)) {
        _push(`<div class="flex justify-start"><div class="bg-zinc-900 border border-zinc-700 px-5 py-4 flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 text-brand animate-spin" }, null, _parent));
        _push(`<span class="text-gray-400 font-sans text-sm">MT AI premýšľa...</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div></div></div><div class="flex gap-2 items-stretch mb-4"><input${ssrRenderAttr("value", unref(input))} type="text" placeholder="Odpovedz tu..." maxlength="500" class="flex-1 bg-zinc-900 border border-zinc-700 text-white font-sans text-sm px-4 py-3 focus:outline-none focus:border-brand transition-colors placeholder:text-gray-500"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""}><button class="bg-brand hover:bg-red-700 text-white px-5 py-3 font-tech font-bold uppercase text-xs tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(unref(isLoading) || !unref(input).trim()) ? " disabled" : ""}>`);
      if (unref(isLoading)) {
        _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Send), { class: "w-4 h-4" }, null, _parent));
      }
      _push(`</button></div><button class="flex items-center gap-2 text-gray-500 hover:text-white font-sans text-xs uppercase tracking-widest transition-colors">`);
      _push(ssrRenderComponent(unref(RotateCcw), { class: "w-3 h-3" }, null, _parent));
      _push(` Začať odznova </button></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/konfigurator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
