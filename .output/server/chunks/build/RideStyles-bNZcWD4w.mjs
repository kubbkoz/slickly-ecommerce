import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, resolveDynamicComponent, openBlock, createBlock, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderVNode, ssrInterpolate } from 'vue/server-renderer';
import { Cog, Wind, Zap, Mountain, ArrowRight } from 'lucide-vue-next';
import { e as useShopwareContext, b as useLocalePath, h as useAsyncData, j as useNuxtApp, G as getCategoryUrl, i as useRuntimeConfig } from './server.mjs';
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
import './composables-x8_ENpEe.mjs';
import '@shopware/helpers';
import 'pinia';
import '@iconify/vue';
import '@shopware/api-client';
import 'js-cookie';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "RideStyles",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const { apiClient } = useShopwareContext();
    const { currentLanguageId } = useShopwareLanguage();
    const localePath = useLocalePath();
    const TARGET_IDS = [
      config.public.shopware.ids.categories.bikes,
      config.public.shopware.ids.categories.ebikes,
      config.public.shopware.ids.categories.doplnky,
      config.public.shopware.ids.categories.komponenty
    ];
    const STYLE_META = {
      [config.public.shopware.ids.categories.bikes]: { icon: Mountain, subtitle: "Adrenalín v teréne" },
      [config.public.shopware.ids.categories.ebikes]: { icon: Zap, subtitle: "Čistá energia" },
      [config.public.shopware.ids.categories.doplnky]: { icon: Wind, subtitle: "Kompletná výbava" },
      [config.public.shopware.ids.categories.komponenty]: { icon: Cog, subtitle: "Vysoký výkon" }
    };
    const { data: navCategories, pending } = useAsyncData(
      `cat-navigator-${currentLanguageId.value}`,
      async () => {
        try {
          const res = await apiClient.invoke("readCategoryList post /category", {
            body: {
              limit: 10,
              filter: [
                { type: "equalsAny", field: "id", value: TARGET_IDS },
                { type: "equals", field: "active", value: true }
              ],
              associations: { media: {}, seoUrls: {} }
            },
            headers: { "sw-language-id": currentLanguageId.value }
          });
          return res.data?.elements ?? [];
        } catch {
          return [];
        }
      },
      {
        getCachedData(key) {
          const nuxtApp = useNuxtApp();
          return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        },
        watch: [currentLanguageId]
      }
    );
    const orderedCategories = computed(
      () => TARGET_IDS.map((id) => (navCategories.value ?? []).find((c) => c.id === id)).filter((c) => !!c)
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_2;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-24 bg-gray-50 border-b border-gray-100 relative overflow-hidden" }, _attrs))}><div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div><div class="absolute top-10 right-10 text-[200px] font-black text-gray-100 font-tech opacity-50 select-none pointer-events-none"> RIDE </div><div class="container mx-auto px-4 relative z-10"><div class="flex flex-col md:flex-row justify-between items-end mb-12"><div class="text-left"><h2 class="section-h2 mb-4"> Podľa štýlu <span class="text-brand">jazdy</span></h2><div class="section-decorator mb-6"></div></div><p class="hidden md:block text-gray-500 font-medium font-sans max-w-sm text-right"> Vyber si kategóriu, ktorá definuje tvoju jazdu a objav kurátorský výber produktov. </p></div>`);
      if (unref(pending) && !unref(orderedCategories).length) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="h-[500px] bg-gray-200 animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><!--[-->`);
        ssrRenderList(unref(orderedCategories), (cat) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: cat.id,
            to: unref(localePath)(unref(getCategoryUrl)(cat)),
            "aria-label": cat.translated?.name || cat.name || void 0,
            class: "group relative h-[500px] overflow-hidden border border-gray-200 bg-white block cursor-pointer"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="absolute inset-0"${_scopeId}>`);
                if (cat.media?.url) {
                  _push2(ssrRenderComponent(_component_NuxtImg, {
                    alt: cat.translated?.name || cat.name || "",
                    src: cat.media.url,
                    width: "440",
                    height: "550",
                    sizes: "100vw md:50vw lg:25vw",
                    quality: "78",
                    loading: "lazy",
                    class: "w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0 motion-reduce:transition-none motion-reduce:grayscale-0 motion-reduce:group-hover:scale-100"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<div class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"${_scopeId}></div>`);
                }
                _push2(`<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-80 transition-opacity motion-reduce:transition-none"${_scopeId}></div></div><div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none motion-reduce:hidden" aria-hidden="true"${_scopeId}><div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"${_scopeId}></div></div><div class="absolute inset-0 p-8 flex flex-col justify-end"${_scopeId}><div class="absolute top-6 right-6 w-14 h-14 bg-brand flex items-center justify-center transform rotate-45 shadow-lg group-hover:scale-110 transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100"${_scopeId}>`);
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(STYLE_META[cat.id]?.icon || unref(Mountain)), {
                  class: "w-7 h-7 text-white transform -rotate-45",
                  "aria-hidden": "true"
                }, null), _parent2, _scopeId);
                _push2(`</div><div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 motion-reduce:translate-y-0 motion-reduce:transition-none"${_scopeId}><div class="inline-block bg-brand px-3 py-1 mb-3 transform -skew-x-12"${_scopeId}><span class="block transform skew-x-12 text-white text-xs font-bold uppercase tracking-widest font-sans"${_scopeId}>${ssrInterpolate(STYLE_META[cat.id]?.subtitle || "")}</span></div><h3 class="text-4xl font-black text-white uppercase italic font-tech leading-none mb-3"${_scopeId}>${ssrInterpolate(cat.translated?.name || cat.name)}</h3><div class="flex items-center text-white font-bold uppercase tracking-wider text-sm group/btn lg:translate-y-8 lg:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 lg:delay-150 motion-reduce:transition-none motion-reduce:lg:translate-y-0 motion-reduce:lg:opacity-100"${_scopeId}><span class="border-b-2 border-brand pb-1 group-hover/btn:text-brand transition-colors"${_scopeId}>Prezrieť kolekciu</span>`);
                _push2(ssrRenderComponent(unref(ArrowRight), {
                  class: "w-5 h-5 ml-3 transform group-hover/btn:translate-x-2 transition-transform text-brand motion-reduce:transition-none",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`</div></div></div><div class="absolute bottom-0 left-0 w-16 h-1 bg-brand transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left motion-reduce:transition-none"${_scopeId}></div><div class="absolute top-0 right-0 w-16 h-1 bg-white/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right motion-reduce:transition-none"${_scopeId}></div>`);
              } else {
                return [
                  createVNode("div", { class: "absolute inset-0" }, [
                    cat.media?.url ? (openBlock(), createBlock(_component_NuxtImg, {
                      key: 0,
                      alt: cat.translated?.name || cat.name || "",
                      src: cat.media.url,
                      width: "440",
                      height: "550",
                      sizes: "100vw md:50vw lg:25vw",
                      quality: "78",
                      loading: "lazy",
                      class: "w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0 motion-reduce:transition-none motion-reduce:grayscale-0 motion-reduce:group-hover:scale-100"
                    }, null, 8, ["alt", "src"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"
                    })),
                    createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-80 transition-opacity motion-reduce:transition-none" })
                  ]),
                  createVNode("div", {
                    class: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none motion-reduce:hidden",
                    "aria-hidden": "true"
                  }, [
                    createVNode("div", { class: "absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out" })
                  ]),
                  createVNode("div", { class: "absolute inset-0 p-8 flex flex-col justify-end" }, [
                    createVNode("div", { class: "absolute top-6 right-6 w-14 h-14 bg-brand flex items-center justify-center transform rotate-45 shadow-lg group-hover:scale-110 transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100" }, [
                      (openBlock(), createBlock(resolveDynamicComponent(STYLE_META[cat.id]?.icon || unref(Mountain)), {
                        class: "w-7 h-7 text-white transform -rotate-45",
                        "aria-hidden": "true"
                      }))
                    ]),
                    createVNode("div", { class: "transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 motion-reduce:translate-y-0 motion-reduce:transition-none" }, [
                      createVNode("div", { class: "inline-block bg-brand px-3 py-1 mb-3 transform -skew-x-12" }, [
                        createVNode("span", { class: "block transform skew-x-12 text-white text-xs font-bold uppercase tracking-widest font-sans" }, toDisplayString(STYLE_META[cat.id]?.subtitle || ""), 1)
                      ]),
                      createVNode("h3", { class: "text-4xl font-black text-white uppercase italic font-tech leading-none mb-3" }, toDisplayString(cat.translated?.name || cat.name), 1),
                      createVNode("div", { class: "flex items-center text-white font-bold uppercase tracking-wider text-sm group/btn lg:translate-y-8 lg:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 lg:delay-150 motion-reduce:transition-none motion-reduce:lg:translate-y-0 motion-reduce:lg:opacity-100" }, [
                        createVNode("span", { class: "border-b-2 border-brand pb-1 group-hover/btn:text-brand transition-colors" }, "Prezrieť kolekciu"),
                        createVNode(unref(ArrowRight), {
                          class: "w-5 h-5 ml-3 transform group-hover/btn:translate-x-2 transition-transform text-brand motion-reduce:transition-none",
                          "aria-hidden": "true"
                        })
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "absolute bottom-0 left-0 w-16 h-1 bg-brand transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left motion-reduce:transition-none" }),
                  createVNode("div", { class: "absolute top-0 right-0 w-16 h-1 bg-white/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right motion-reduce:transition-none" })
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/RideStyles.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RideStyles = Object.assign(_sfc_main, { __name: "RideStyles" });

export { RideStyles as default };
