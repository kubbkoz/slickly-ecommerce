import { defineComponent, ref, watchEffect, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { ChevronDown } from 'lucide-vue-next';
import { e as useShopwareContext, h as useAsyncData, u as useHead, i as useRuntimeConfig } from './server.mjs';
import { u as useScrollReveal } from './useScrollReveal-hir-7v74.mjs';
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
  __name: "BlogGrid",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const { apiClient } = useShopwareContext();
    const FAQ_CAT_ID = config.public.shopware.ids.categories.faq;
    const { data: faqData, pending } = useAsyncData("homepage-faq", async () => {
      if (!FAQ_CAT_ID) return [];
      try {
        const res = await apiClient.invoke("readCategory post /category/{categoryId}", {
          pathParams: { categoryId: FAQ_CAT_ID }
        });
        const cat = res?.data ?? res;
        const cf = {
          ...cat?.customFields ?? {},
          ...cat?.translated?.customFields ?? {}
        };
        return Array.from({ length: 10 }, (_, i) => ({
          q: cf[`mts_faq_q${i + 1}`] || "",
          a: cf[`mts_faq_a${i + 1}`] || ""
        })).filter((item) => item.q && item.a);
      } catch {
        return [];
      }
    });
    const openIndex = ref(null);
    watchEffect(() => {
      if (!faqData.value?.length) return;
      useHead({
        script: [{
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.value.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a }
            }))
          })
        }]
      });
    });
    const { target, isVisible } = useScrollReveal();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(pending) || unref(faqData) && unref(faqData).length > 0) {
        _push(`<section${ssrRenderAttrs(mergeProps({
          ref_key: "target",
          ref: target,
          class: "py-24 bg-gray-50 border-t border-gray-100"
        }, _attrs))}><div class="container mx-auto px-4 lg:px-8"><div class="${ssrRenderClass([unref(isVisible) ? "reveal-visible" : "reveal", "reveal-base flex flex-col md:flex-row justify-between items-end mb-12 gap-6"])}"><div><h2 class="section-h2 mb-4"> Často kladené <span class="text-brand">otázky</span></h2><div class="section-decorator mb-6"></div></div><p class="hidden md:block text-gray-500 font-medium font-sans max-w-sm text-right"> Odpovede na otázky, ktoré dostávame najčastejšie od zákazníkov. </p></div>`);
        if (unref(pending)) {
          _push(`<div class="max-w-3xl mx-auto space-y-3"><!--[-->`);
          ssrRenderList(5, (i) => {
            _push(`<div class="card-surface px-5 md:px-6 py-5 flex justify-between items-center gap-4"><div class="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div><div class="w-5 h-5 bg-gray-200 animate-pulse rounded flex-shrink-0"></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="max-w-3xl mx-auto space-y-3"><!--[-->`);
          ssrRenderList(unref(faqData), (item, idx) => {
            _push(`<div class="card-surface px-5 md:px-6"><button type="button" class="w-full flex items-center justify-between py-5 text-left gap-4 group"${ssrRenderAttr("aria-expanded", unref(openIndex) === idx)}><span class="font-tech font-bold uppercase text-base md:text-lg tracking-wide text-black group-hover:text-brand transition-colors leading-snug">${ssrInterpolate(item.q)}</span>`);
            _push(ssrRenderComponent(unref(ChevronDown), {
              class: ["w-5 h-5 text-brand flex-shrink-0 transition-transform duration-300", unref(openIndex) === idx ? "rotate-180" : ""],
              "aria-hidden": "true"
            }, null, _parent));
            _push(`</button><div class="overflow-hidden transition-all duration-300 ease-in-out" style="${ssrRenderStyle(unref(openIndex) === idx ? "max-height: 500px; opacity: 1;" : "max-height: 0; opacity: 0;")}"><p class="pb-5 text-sm text-gray-600 font-sans leading-relaxed">${ssrInterpolate(item.a)}</p></div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/BlogGrid.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BlogGrid = Object.assign(_sfc_main, { __name: "BlogGrid" });

export { BlogGrid as default };
