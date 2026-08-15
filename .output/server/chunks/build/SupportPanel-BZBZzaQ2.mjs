import { h as useAsyncData, I as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { MessageCircle, PhoneCall, Mail, Clock } from 'lucide-vue-next';
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
  __name: "SupportPanel",
  __ssrInlineRender: true,
  setup(__props) {
    const { data: hours } = useAsyncData(
      "store-hours-section",
      () => $fetch("/api/store/hours"),
      { getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key] }
    );
    const SK_DAYS = ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"];
    const isMounted = ref(false);
    const isDovolenka = computed(() => !!hours.value?.dovolenka);
    function isToday(val) {
      const now = /* @__PURE__ */ new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const ymd = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const dmy = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
      return val === ymd || val === dmy;
    }
    computed(() => {
      if (!isMounted.value || !hours.value) return false;
      if (isDovolenka.value) return false;
      const h = hours.value;
      const now = /* @__PURE__ */ new Date();
      const today = SK_DAYS[now.getDay()];
      const z = String(h.zatvorene ?? "").trim();
      if (z && (today === z || isToday(z))) return false;
      const parse = (t) => {
        const [hh, mm] = (t || "").split(":").map(Number);
        return (hh || 0) * 60 + (mm || 0);
      };
      const nowMin = now.getHours() * 60 + now.getMinutes();
      return nowMin >= parse(h.od) && nowMin < parse(h.do);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-black text-white" }, _attrs))}><div class="max-w-[1536px] mx-auto px-4 lg:px-8 py-16"><div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"><div><h2 class="font-tech font-black uppercase text-2xl tracking-wide text-white mb-4"> Potrebujete pomôcť s výberom? </h2><div class="section-decorator mb-8"></div><p class="font-sans text-base text-gray-400 font-normal leading-relaxed mb-8 max-w-xl"> V prípade akýchkoľvek otázok ohľadom výberu produktu, jeho špecifikácie, alebo ak chcete iba doladiť správne príslušenstvo, neváhajte nás kontaktovať. </p><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div class="relative overflow-hidden bg-zinc-900 p-6">`);
      _push(ssrRenderComponent(unref(MessageCircle), { class: "absolute top-5 right-5 w-12 h-12 text-brand opacity-30 pointer-events-none" }, null, _parent));
      _push(`<div class="relative z-10"><h3 class="font-tech font-black uppercase tracking-wide text-white text-lg mb-4">Kontakt</h3><a href="tel:+421918564238" class="flex items-center gap-2 font-sans text-sm text-gray-400 hover:text-brand transition-colors mb-2">`);
      _push(ssrRenderComponent(unref(PhoneCall), { class: "w-4 h-4 text-brand flex-shrink-0" }, null, _parent));
      _push(`<span>E-shop: <strong class="text-white font-bold">+421 918 564 238</strong></span></a><a href="mailto:info@slickly.sk" class="flex items-center gap-2 font-sans text-sm text-gray-400 hover:text-brand transition-colors">`);
      _push(ssrRenderComponent(unref(Mail), { class: "w-4 h-4 text-brand flex-shrink-0" }, null, _parent));
      _push(`<span><strong class="text-white font-bold">info@slickly.sk</strong></span></a></div></div><div class="relative overflow-hidden bg-zinc-900 p-6">`);
      _push(ssrRenderComponent(unref(Clock), { class: "absolute top-5 right-5 w-12 h-12 text-brand opacity-30 pointer-events-none" }, null, _parent));
      _push(`<div class="relative z-10"><h3 class="font-tech font-black uppercase tracking-wide text-white text-lg mb-4">Online podpora</h3><div class="font-sans text-sm text-gray-400 leading-relaxed space-y-1"><p>${ssrInterpolate(unref(hours)?.denOd)} – ${ssrInterpolate(unref(hours)?.denDo)}: <strong class="text-white font-bold">${ssrInterpolate(unref(hours)?.od)} – ${ssrInterpolate(unref(hours)?.do)}</strong></p>`);
      if (unref(hours)?.zatvorene && String(unref(hours).zatvorene).trim() && unref(hours).zatvorene !== "false") {
        _push(`<p>${ssrInterpolate(unref(hours).zatvorene)}: <span class="text-gray-500">Nedostupné</span></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div></div></div></div><div class="flex flex-col items-start lg:items-end justify-center lg:pt-16 gap-4"><a href="tel:+421918564238" class="inline-flex items-center gap-3 bg-brand hover:bg-red-700 text-white font-tech font-bold uppercase tracking-widest text-sm px-8 py-4 transition-colors w-full sm:w-auto justify-center">`);
      _push(ssrRenderComponent(unref(PhoneCall), { class: "w-5 h-5" }, null, _parent));
      _push(` Zavolajte nám </a><a href="mailto:info@mtsport.sk" class="inline-flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-tech font-bold uppercase tracking-widest text-sm px-8 py-4 transition-colors w-full sm:w-auto justify-center">`);
      _push(ssrRenderComponent(unref(Mail), { class: "w-5 h-5" }, null, _parent));
      _push(` Napíšte nám </a></div></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/SupportPanel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SupportPanel = Object.assign(_sfc_main, { __name: "SupportPanel" });

export { SupportPanel as default };
