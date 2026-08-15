import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, withAsyncContext, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { Building2 } from 'lucide-vue-next';
import { u as useStaticTranslations } from './useStaticTranslations-DjO9xa-s.mjs';
import { b as useLocalePath, h as useAsyncData, C as useSeoMeta } from './server.mjs';
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
  __name: "znacky",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const localePath = useLocalePath();
    const { t } = useStaticTranslations();
    const { data: brands } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "all-brands",
      () => $fetch("/api/manufacturers")
    )), __temp = await __temp, __restore(), __temp);
    const seoTitle = t("znacky");
    const seoDescription = t("znacky_subtext");
    useSeoMeta({
      title: seoTitle,
      description: seoDescription
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white min-h-screen" }, _attrs))}><div class="container mx-auto px-4 lg:px-8 py-12 md:py-16"><div class="mb-10 md:mb-14"><h1 class="section-h2 mb-4">${ssrInterpolate(unref(t)("znacky"))}</h1><div class="section-decorator mb-6"></div><p class="text-gray-500 text-sm md:text-base lg:text-lg max-w-3xl font-normal leading-relaxed font-sans">${ssrInterpolate(unref(t)("znacky_subtext"))}</p></div>`);
      if (unref(brands) && unref(brands).length) {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 md:gap-4"><!--[-->`);
        ssrRenderList(unref(brands), (brand) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: brand.id,
            to: unref(localePath)("/znacka/" + brand.slug),
            class: "group bg-white border border-gray-100 hover:border-gray-200 flex flex-col items-center justify-between p-4 md:p-6 transition-colors",
            "aria-label": brand.name
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex-1 flex items-center justify-center w-full min-h-[64px] md:min-h-[80px]"${_scopeId}>`);
                if (brand.logoUrl) {
                  _push2(ssrRenderComponent(_component_NuxtImg, {
                    src: brand.logoUrl,
                    alt: brand.name,
                    class: "max-h-12 md:max-h-16 w-auto max-w-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300",
                    loading: "lazy"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(unref(Building2), { class: "w-10 h-10 text-gray-300 group-hover:text-gray-400 transition-colors" }, null, _parent2, _scopeId));
                }
                _push2(`</div><span class="mt-3 font-tech font-bold uppercase text-[11px] md:text-xs tracking-wide text-gray-600 group-hover:text-black transition-colors text-center leading-tight"${_scopeId}>${ssrInterpolate(brand.name)}</span>`);
              } else {
                return [
                  createVNode("div", { class: "flex-1 flex items-center justify-center w-full min-h-[64px] md:min-h-[80px]" }, [
                    brand.logoUrl ? (openBlock(), createBlock(_component_NuxtImg, {
                      key: 0,
                      src: brand.logoUrl,
                      alt: brand.name,
                      class: "max-h-12 md:max-h-16 w-auto max-w-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300",
                      loading: "lazy"
                    }, null, 8, ["src", "alt"])) : (openBlock(), createBlock(unref(Building2), {
                      key: 1,
                      class: "w-10 h-10 text-gray-300 group-hover:text-gray-400 transition-colors"
                    }))
                  ]),
                  createVNode("span", { class: "mt-3 font-tech font-bold uppercase text-[11px] md:text-xs tracking-wide text-gray-600 group-hover:text-black transition-colors text-center leading-tight" }, toDisplayString(brand.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="py-20 text-center">`);
        _push(ssrRenderComponent(unref(Building2), { class: "w-12 h-12 text-gray-300 mx-auto mb-4" }, null, _parent));
        _push(`<p class="text-gray-400 font-bold uppercase text-sm tracking-widest"> Značky momentálne nie sú dostupné </p></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/znacky.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
