import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, withAsyncContext, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { ArrowUpRight } from 'lucide-vue-next';
import { _ as _export_sfc, b as useLocalePath, e as useShopwareContext, h as useAsyncData, G as getCategoryUrl, i as useRuntimeConfig } from './server.mjs';
import { u as useStaticTranslations } from './useStaticTranslations-DjO9xa-s.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';
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
  __name: "CategoryGrid",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const localePath = useLocalePath();
    const { t } = useStaticTranslations();
    const { apiClient } = useShopwareContext();
    const { currentLanguageId } = useShopwareLanguage();
    const config = useRuntimeConfig();
    const ROOT_CATEGORY_ID = config.public.shopware.ids.rootCategory;
    const { data: categories } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      `category-grid-dynamic-${currentLanguageId.value}`,
      async () => {
        try {
          const response = await apiClient.invoke("readNavigation post /navigation/{activeId}/{rootId}", {
            headers: { "sw-language-id": currentLanguageId.value },
            // FIX-LANG: ensure SK translations
            pathParams: { activeId: ROOT_CATEGORY_ID, rootId: ROOT_CATEGORY_ID },
            body: {
              depth: 1,
              associations: { media: {} }
              // Important for category grid images!
            }
          });
          const navItems = response.data || [];
          if (!navItems.length) return [];
          return navItems.map((cat) => ({
            id: cat.id,
            name: cat.translated?.name || cat.name || "",
            image: cat.media?.url || null,
            url: getCategoryUrl(cat)
          }));
        } catch (error) {
          return [];
        }
      },
      {
        watch: [currentLanguageId]
      }
    )), __temp = await __temp, __restore(), __temp);
    const { target, isVisible } = useScrollReveal();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref_key: "target",
        ref: target,
        class: "py-16 md:py-24 bg-white"
      }, _attrs))} data-v-52f94e7d><div class="container mx-auto px-4 lg:px-8" data-v-52f94e7d><div class="${ssrRenderClass([unref(isVisible) ? "reveal-visible" : "reveal", "reveal-base mb-10 md:mb-16"])}" data-v-52f94e7d><div class="text-left w-full" data-v-52f94e7d><span class="section-eyebrow" data-v-52f94e7d>Nákupný sprievodca</span><h2 class="section-h2 mb-4" data-v-52f94e7d>${ssrInterpolate(unref(t)("vyber_si"))} <span class="text-brand" data-v-52f94e7d>${ssrInterpolate(unref(t)("kategoriu"))}</span></h2><div class="section-decorator mb-6" data-v-52f94e7d></div><p class="text-gray-500 text-sm md:text-base lg:text-lg max-w-3xl font-normal leading-relaxed font-sans" data-v-52f94e7d>${ssrInterpolate(unref(t)("category_grid_subtext"))}</p></div></div><div class="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 min-h-[200px] md:min-h-[260px]" data-v-52f94e7d><!--[-->`);
      ssrRenderList(unref(categories), (cat, i) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: cat.id,
          to: unref(localePath)(cat.url),
          class: ["cat-card group relative h-[200px] md:h-[260px] overflow-hidden block bg-gray-900 rounded-default", [
            i % 3 === 0 ? "col-span-2" : "col-span-1",
            i % 6 === 0 || i % 6 === 4 ? "lg:col-span-2" : "lg:col-span-1"
          ]]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="absolute inset-0" data-v-52f94e7d${_scopeId}>`);
              if (cat.image) {
                _push2(`<img${ssrRenderAttr("src", cat.image)}${ssrRenderAttr("alt", cat.name)} loading="lazy" width="400" height="260" class="w-full h-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-105 brightness-75 group-hover:brightness-50 grayscale group-hover:grayscale-0" data-v-52f94e7d${_scopeId}>`);
              } else {
                _push2(`<div class="w-full h-full bg-gray-800 grayscale group-hover:grayscale-0 transition-[filter] duration-700" data-v-52f94e7d${_scopeId}></div>`);
              }
              _push2(`<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" data-v-52f94e7d${_scopeId}></div></div><div class="cat-border absolute bottom-0 left-0 w-full h-[4px] bg-brand origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-20" data-v-52f94e7d${_scopeId}></div><div class="absolute bottom-0 left-0 w-full z-10 p-5 md:p-6 pb-5 md:pb-6 flex flex-col items-start justify-end pointer-events-none" data-v-52f94e7d${_scopeId}><h3 class="cat-title font-tech font-black text-white text-base sm:text-lg md:text-3xl uppercase italic leading-tight md:leading-none tracking-wide break-words transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] drop-shadow-md" data-v-52f94e7d${_scopeId}>${ssrInterpolate(cat.name)}</h3><div class="cat-btn relative mt-3 inline-flex items-center justify-center px-4 py-1.5 pointer-events-auto transform -translate-x-[150%] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" data-v-52f94e7d${_scopeId}><div class="absolute inset-0 bg-amber rounded-default shadow-lg" data-v-52f94e7d${_scopeId}></div><span class="relative z-10 flex items-center gap-1.5 text-black font-tech text-[11px] md:text-xs font-bold uppercase tracking-widest leading-none" data-v-52f94e7d${_scopeId}>${ssrInterpolate(unref(t)("prezriet").toUpperCase())} `);
              _push2(ssrRenderComponent(unref(ArrowUpRight), { class: "w-3.5 h-3.5 ml-0.5" }, null, _parent2, _scopeId));
              _push2(`</span></div></div>`);
            } else {
              return [
                createVNode("div", { class: "absolute inset-0" }, [
                  cat.image ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: cat.image,
                    alt: cat.name,
                    loading: "lazy",
                    width: "400",
                    height: "260",
                    class: "w-full h-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-105 brightness-75 group-hover:brightness-50 grayscale group-hover:grayscale-0"
                  }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "w-full h-full bg-gray-800 grayscale group-hover:grayscale-0 transition-[filter] duration-700"
                  })),
                  createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" })
                ]),
                createVNode("div", { class: "cat-border absolute bottom-0 left-0 w-full h-[4px] bg-brand origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-20" }),
                createVNode("div", { class: "absolute bottom-0 left-0 w-full z-10 p-5 md:p-6 pb-5 md:pb-6 flex flex-col items-start justify-end pointer-events-none" }, [
                  createVNode("h3", { class: "cat-title font-tech font-black text-white text-base sm:text-lg md:text-3xl uppercase italic leading-tight md:leading-none tracking-wide break-words transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] drop-shadow-md" }, toDisplayString(cat.name), 1),
                  createVNode("div", { class: "cat-btn relative mt-3 inline-flex items-center justify-center px-4 py-1.5 pointer-events-auto transform -translate-x-[150%] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" }, [
                    createVNode("div", { class: "absolute inset-0 bg-amber rounded-default shadow-lg" }),
                    createVNode("span", { class: "relative z-10 flex items-center gap-1.5 text-black font-tech text-[11px] md:text-xs font-bold uppercase tracking-widest leading-none" }, [
                      createTextVNode(toDisplayString(unref(t)("prezriet").toUpperCase()) + " ", 1),
                      createVNode(unref(ArrowUpRight), { class: "w-3.5 h-3.5 ml-0.5" })
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/CategoryGrid.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CategoryGrid = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-52f94e7d"]]), { __name: "CategoryGrid" });

export { CategoryGrid as default };
