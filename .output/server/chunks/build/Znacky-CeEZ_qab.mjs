import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, withCtx, openBlock, createBlock, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { ArrowUpRight } from 'lucide-vue-next';
import { a as FEATURED_BRAND_SLUGS } from './constants-Dm0Yhftm.mjs';
import { u as useStaticTranslations } from './useStaticTranslations-DjO9xa-s.mjs';
import { u as useScrollReveal } from './useScrollReveal-hir-7v74.mjs';
import { b as useLocalePath, h as useAsyncData } from './server.mjs';
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
  __name: "Znacky",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const localePath = useLocalePath();
    const { t } = useStaticTranslations();
    const { data: allBrands } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "home-brands",
      () => $fetch("/api/manufacturers")
    )), __temp = await __temp, __restore(), __temp);
    const featured = computed(() => {
      const list = allBrands.value || [];
      const bySlug = new Map(list.map((m) => [m.slug, m]));
      return FEATURED_BRAND_SLUGS.map((slug) => bySlug.get(slug)).filter((m) => !!m).slice(0, 5);
    });
    const { target, isVisible } = useScrollReveal();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_2;
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref_key: "target",
        ref: target,
        class: "py-14 md:py-20 bg-gray-50 border-b border-gray-100"
      }, _attrs))}><div class="container mx-auto px-4 lg:px-8"><div class="${ssrRenderClass([unref(isVisible) ? "reveal-visible" : "reveal", "reveal-base mb-8 md:mb-10"])}"><span class="section-eyebrow">Overené partnerstvá</span><h2 class="section-h2 mb-4"> Značky, ktorým <span class="text-brand">dôverujeme</span></h2><div class="section-decorator"></div></div><div class="${ssrRenderClass([unref(isVisible) ? "reveal-visible" : "reveal", "reveal-base grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4"])}"><!--[-->`);
      ssrRenderList(unref(featured), (brand) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: brand.id,
          to: unref(localePath)("/znacka/" + brand.slug),
          class: "group card-surface flex items-center justify-center p-4 md:p-6 h-24 md:h-32",
          "aria-label": brand.name
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (brand.logoUrl) {
                _push2(ssrRenderComponent(_component_NuxtImg, {
                  src: brand.logoUrl,
                  alt: brand.name,
                  width: "140",
                  height: "36",
                  sizes: "140px",
                  class: "h-8 md:h-10 w-auto max-w-full object-contain mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity duration-300",
                  loading: "lazy"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<span class="font-tech font-black uppercase text-base md:text-lg text-gray-400 group-hover:text-black transition-colors text-center leading-none"${_scopeId}>${ssrInterpolate(brand.name)}</span>`);
              }
            } else {
              return [
                brand.logoUrl ? (openBlock(), createBlock(_component_NuxtImg, {
                  key: 0,
                  src: brand.logoUrl,
                  alt: brand.name,
                  width: "140",
                  height: "36",
                  sizes: "140px",
                  class: "h-8 md:h-10 w-auto max-w-full object-contain mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity duration-300",
                  loading: "lazy"
                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("span", {
                  key: 1,
                  class: "font-tech font-black uppercase text-base md:text-lg text-gray-400 group-hover:text-black transition-colors text-center leading-none"
                }, toDisplayString(brand.name), 1))
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/znacky"),
        class: "group bg-black hover:bg-brand flex flex-col items-center justify-center gap-2 p-4 h-24 md:h-32 transition-all duration-300 hover:-translate-y-1 rounded-default gpu-boost"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowUpRight), { class: "w-5 h-5 md:w-6 md:h-6 text-white transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" }, null, _parent2, _scopeId));
            _push2(`<span class="font-tech font-bold uppercase text-[10px] md:text-xs tracking-widest text-white text-center leading-tight"${_scopeId}>${ssrInterpolate(unref(t)("vsetky_znacky"))}</span>`);
          } else {
            return [
              createVNode(unref(ArrowUpRight), { class: "w-5 h-5 md:w-6 md:h-6 text-white transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" }),
              createVNode("span", { class: "font-tech font-bold uppercase text-[10px] md:text-xs tracking-widest text-white text-center leading-tight" }, toDisplayString(unref(t)("vsetky_znacky")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/Znacky.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Znacky = Object.assign(_sfc_main, { __name: "Znacky" });

export { Znacky as default };
