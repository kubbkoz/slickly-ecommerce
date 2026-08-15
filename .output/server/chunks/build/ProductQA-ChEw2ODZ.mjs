import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Sparkles, MessageSquare, Loader2, Send } from 'lucide-vue-next';
import { s as sanitizeHtml } from './sanitize-DKvwg8Vq.mjs';
import { m as useI18n } from './server.mjs';
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
  __name: "ProductQA",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  setup(__props) {
    const props = __props;
    const { t } = useI18n();
    const question = ref("");
    const messages = ref([]);
    const isLoading = ref(false);
    ref(null);
    const QUICK_QUESTIONS = [
      "Aký je rozdiel oproti iným modelom?",
      "Je vhodný pre začiatočníkov?",
      "Aká veľkosť je pre mňa správna?",
      "Aká je záruka?"
    ];
    computed(() => ({
      name: props.product.name,
      description: props.product.description,
      price: props.product.price,
      brand: props.product.brand,
      category: props.product.category,
      properties: (props.product.properties || []).slice(0, 20).map((p) => ({
        name: p.group?.translated?.name || p.group?.name || "",
        value: p.translated?.name || p.name || ""
      }))
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-zinc-950 border-t border-zinc-800 py-14" }, _attrs))}><div class="container mx-auto px-4"><div class="mb-10"><div class="flex items-center gap-3 mb-4">`);
      _push(ssrRenderComponent(unref(Sparkles), { class: "w-5 h-5 text-brand" }, null, _parent));
      _push(`<span class="text-brand font-tech font-bold uppercase tracking-widest text-xs">AI Asistent</span></div><h2 class="text-5xl md:text-6xl font-black uppercase italic font-tech tracking-wide leading-none text-white mb-4"> Opýtaj sa na <span class="text-brand">produkt</span></h2><div class="w-24 h-1.5 bg-brand -skew-x-[20deg]"></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-10"><div class="flex flex-col gap-4">`);
      if (unref(messages).length) {
        _push(`<div class="space-y-3 mb-2"><!--[-->`);
        ssrRenderList(unref(messages), (msg, i) => {
          _push(`<div class="${ssrRenderClass([
            "p-4 font-sans text-sm leading-relaxed",
            msg.role === "user" ? "bg-brand text-white ml-8" : "bg-zinc-800 text-gray-200 mr-8 border-l-2 border-brand"
          ])}"><span>${unref(sanitizeHtml)(msg.text) ?? ""}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="flex items-center gap-3 p-5 bg-zinc-900 border border-zinc-700 text-gray-400 font-sans text-sm">`);
        _push(ssrRenderComponent(unref(MessageSquare), { class: "w-5 h-5 text-brand flex-shrink-0" }, null, _parent));
        _push(`<span>Máš otázku k <strong class="text-white">${ssrInterpolate(__props.product.name)}</strong>? Pýtaj sa.</span></div>`);
      }
      _push(`<div class="flex gap-2 items-stretch"><input${ssrRenderAttr("value", unref(question))} type="text" placeholder="Napíš svoju otázku..." maxlength="500" class="flex-1 bg-zinc-900 border border-zinc-700 text-white font-sans text-sm px-4 py-3 focus:outline-none focus:border-brand transition-colors placeholder:text-gray-500"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""}><button class="bg-brand hover:bg-brand-dark text-white px-5 py-3 font-tech font-bold uppercase text-xs tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(unref(isLoading) || !unref(question).trim()) ? " disabled" : ""}>`);
      if (unref(isLoading)) {
        _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Send), { class: "w-4 h-4" }, null, _parent));
      }
      _push(`</button></div></div><div><p class="text-gray-400 font-sans text-xs uppercase tracking-widest mb-4">Časté otázky</p><div class="grid grid-cols-1 gap-2"><!--[-->`);
      ssrRenderList(QUICK_QUESTIONS, (q) => {
        _push(`<button class="text-left px-4 py-3 bg-zinc-900 border border-zinc-700 hover:border-brand text-gray-300 hover:text-white font-sans text-sm transition-colors group"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""}><span class="text-brand mr-2 group-hover:mr-3 transition-all">›</span>${ssrInterpolate(q)}</button>`);
      });
      _push(`<!--]--></div></div></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ProductQA.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductQA = Object.assign(_sfc_main, { __name: "ProductQA" });

export { ProductQA as default };
