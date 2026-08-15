import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
import { CheckCircle, Mail, AlertCircle } from 'lucide-vue-next';
import AppHoneypot from './AppHoneypot-DdH0YZXD.mjs';
import { e as useShopwareContext } from './server.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';
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
  __name: "Newsletter",
  __ssrInlineRender: true,
  setup(__props) {
    useShopwareContext();
    useShopwareLanguage();
    const email = ref("");
    const shopware_honeypot = ref("");
    const isSubmitting = ref(false);
    const success = ref(false);
    const error = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-16 md:py-24 bg-white" }, _attrs))}><div class="container mx-auto px-4 lg:px-8"><div class="relative overflow-hidden text-white rounded-default" style="${ssrRenderStyle({ "background-image": "url('https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=2000&auto=format&fit=crop')", "background-size": "cover", "background-position": "center" })}"><div class="absolute inset-0 bg-black/75 pointer-events-none"></div><div class="relative z-10 p-8 sm:p-10 md:p-16"><div class="flex flex-col lg:flex-row items-center gap-10 lg:gap-20"><div class="lg:w-[45%] flex-shrink-0"><h2 class="text-2xl md:text-3xl font-black uppercase font-tech tracking-tight leading-tight mb-3"> Nezmeškajte žiadnu <span class="text-amber">ponuku</span></h2><p class="text-gray-300 text-sm font-sans leading-relaxed"> Zostaňte v obraze a prihláste sa na odber našich noviniek.<br> Ako darček Vám dáme <span class="font-bold text-white">zľavový kód v hodnote 10 €</span> na nákup. </p></div><div class="flex-1 w-full">`);
      if (success.value) {
        _push(`<div class="flex items-center gap-3 text-green-400 font-sans font-medium">`);
        _push(ssrRenderComponent(unref(CheckCircle), { class: "w-6 h-6 flex-shrink-0" }, null, _parent));
        _push(` Ďakujeme! Skontrolujte si e-mailovú schránku. </div>`);
      } else {
        _push(`<!--[--><form class="flex flex-col gap-3 max-w-sm ml-auto">`);
        _push(ssrRenderComponent(AppHoneypot, {
          modelValue: shopware_honeypot.value,
          "onUpdate:modelValue": ($event) => shopware_honeypot.value = $event
        }, null, _parent));
        _push(`<input${ssrRenderAttr("value", email.value)} type="email" required placeholder="Váš e-mail" class="form-input bg-white text-gray-900 placeholder-gray-400"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""}><p class="text-gray-500 text-xs font-sans -mt-1"> *Neposielame žiadne spamy, iba novonaskladnené produkty :) </p><button type="submit"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} class="btn-checkout flex items-center justify-center gap-2">`);
        _push(ssrRenderComponent(unref(Mail), {
          class: "w-4 h-4",
          "aria-hidden": "true"
        }, null, _parent));
        _push(` ${ssrInterpolate(isSubmitting.value ? "Odosielam…" : "Odoberať newsletter")}</button></form>`);
        if (error.value) {
          _push(`<div class="mt-3 text-red-400 text-xs font-sans flex items-center gap-1.5">`);
          _push(ssrRenderComponent(unref(AlertCircle), { class: "w-3.5 h-3.5" }, null, _parent));
          _push(`${ssrInterpolate(error.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div></div></div></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/Newsletter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Newsletter = Object.assign(_sfc_main, { __name: "Newsletter" });

export { Newsletter as default };
