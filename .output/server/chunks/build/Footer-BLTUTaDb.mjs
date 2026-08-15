import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { ChevronRight, Phone, Mail, RotateCcw, Facebook, Instagram, Youtube } from 'lucide-vue-next';
import { _ as _export_sfc, m as useI18n, b as useLocalePath, D as useAppConfig, e as useShopwareContext, h as useAsyncData, j as useNuxtApp, G as getCategoryUrl, i as useRuntimeConfig } from './server.mjs';
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
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale: currentLocale } = useI18n();
    const localePath = useLocalePath();
    const appConfig = useAppConfig();
    const contact = appConfig.contact;
    const config = useRuntimeConfig();
    const { apiClient } = useShopwareContext();
    const { currentLanguageId } = useShopwareLanguage();
    const navCacheKey = `footer-nav-${currentLanguageId.value}`;
    const { data: navCategories } = useAsyncData(
      navCacheKey,
      async () => {
        try {
          const res = await apiClient.invoke("readCategoryList post /category", {
            body: {
              // Only top-level categories are needed (to pick the 4 in TARGET_IDS);
              // 25 is plenty and keeps this SSR payload (inlined into the HTML because
              // payloadExtraction is off) small instead of serializing 100 categories.
              limit: 25,
              filter: [
                { type: "equals", field: "parentId", value: config.public.shopware.ids.rootCategory },
                { type: "equals", field: "active", value: true },
                { type: "equals", field: "visible", value: true }
              ],
              associations: { seoUrls: {} }
            },
            headers: { "sw-language-id": currentLanguageId.value }
          });
          return res.data?.elements ?? [];
        } catch {
          return [];
        }
      },
      {
        watch: [currentLanguageId],
        getCachedData(key) {
          const nuxtApp = useNuxtApp();
          return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        }
      }
    );
    const TARGET_IDS = [
      config.public.shopware.ids.categories.bikes,
      config.public.shopware.ids.categories.ebikes,
      config.public.shopware.ids.categories.doplnky,
      config.public.shopware.ids.categories.komponenty
    ];
    const footerCategories = computed(() => {
      const all = navCategories.value ?? [];
      return TARGET_IDS.map((id) => all.find((c) => c.id === id)).filter((c) => !!c);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-black text-white border-t border-zinc-900 font-sans relative overflow-hidden" }, _attrs))} data-v-b5930c90><div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber to-transparent opacity-70" data-v-b5930c90></div><div class="pt-20 pb-10" data-v-b5930c90><div class="container mx-auto px-4" data-v-b5930c90><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16" data-v-b5930c90><div data-v-b5930c90><h2 class="font-black font-tech text-lg mb-8 uppercase tracking-widest text-white flex items-center" data-v-b5930c90><span class="w-1 h-4 bg-amber mr-3" data-v-b5930c90></span> ${ssrInterpolate(unref(t)("footer.menu.categories"))}</h2><ul class="space-y-4 text-sm text-gray-300 font-medium" data-v-b5930c90><!--[-->`);
      ssrRenderList(unref(footerCategories), (cat) => {
        _push(`<li data-v-b5930c90>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)(unref(getCategoryUrl)(cat)),
          class: "hover:text-amber hover:pl-2 transition-all flex items-center group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ChevronRight), { class: "w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-amber" }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(cat.translated?.name || cat.name)}`);
            } else {
              return [
                createVNode(unref(ChevronRight), { class: "w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-amber" }),
                createTextVNode(" " + toDisplayString(cat.translated?.name || cat.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div data-v-b5930c90><h2 class="font-black font-tech text-lg mb-8 uppercase tracking-widest text-white flex items-center" data-v-b5930c90><span class="w-1 h-4 bg-amber mr-3" data-v-b5930c90></span> Kontakt </h2><ul class="space-y-6" data-v-b5930c90><li class="flex items-start group" data-v-b5930c90>`);
      _push(ssrRenderComponent(unref(Phone), { class: "w-5 h-5 text-amber mr-4 mt-1" }, null, _parent));
      _push(`<div data-v-b5930c90><span class="block text-[10px] text-white/60 uppercase font-normal tracking-wider mb-1" data-v-b5930c90>Infolinka</span><a${ssrRenderAttr("href", unref(contact).phone.mainHref)} class="text-xl font-bold text-white group-hover:text-amber transition-colors font-tech" data-v-b5930c90>${ssrInterpolate(unref(contact).phone.mainDisplay)}</a></div></li><li class="flex items-start group" data-v-b5930c90>`);
      _push(ssrRenderComponent(unref(Mail), { class: "w-5 h-5 text-amber mr-4 mt-1" }, null, _parent));
      _push(`<div data-v-b5930c90><span class="block text-[10px] text-white/60 uppercase font-normal tracking-wider mb-1" data-v-b5930c90>Email</span><a${ssrRenderAttr("href", unref(contact).email.infoHref)} class="text-base text-gray-300 group-hover:text-white transition-colors" data-v-b5930c90>${ssrInterpolate(unref(contact).email.info)}</a></div></li><li class="flex items-start group" data-v-b5930c90>`);
      _push(ssrRenderComponent(unref(RotateCcw), { class: "w-5 h-5 text-amber mr-4 mt-1" }, null, _parent));
      _push(`<div data-v-b5930c90><span class="block text-[10px] text-white/60 uppercase font-normal tracking-wider mb-1" data-v-b5930c90>Reklamácia / Vrátenie</span>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/odstupenie-od-zmluvy",
        class: "text-base text-gray-300 group-hover:text-amber transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Vyplniť formulár `);
          } else {
            return [
              createTextVNode(" Vyplniť formulár ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></li></ul></div><div data-v-b5930c90><h2 class="font-black font-tech text-lg mb-8 uppercase tracking-widest text-white flex items-center" data-v-b5930c90><span class="w-1 h-4 bg-amber mr-3" data-v-b5930c90></span> Zákaznícka podpora </h2><p class="text-sm text-gray-300 mb-4 leading-relaxed" data-v-b5930c90> SLICKLY je výhradne online obchod zameraný na starostlivosť o vaše auto — exteriér, interiér, leštenie aj ochranu karosérie. Sme tu pre vás každý pracovný deň a radi poradíme s výberom tých najlepších produktov. </p><a${ssrRenderAttr("href", unref(contact).email.infoHref)} class="inline-flex items-center text-sm font-bold text-amber uppercase tracking-widest hover:text-white transition-colors" data-v-b5930c90>`);
      _push(ssrRenderComponent(unref(Mail), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(` ${ssrInterpolate(unref(contact).email.info)}</a></div><div data-v-b5930c90><h2 class="font-black font-tech text-lg mb-8 uppercase tracking-widest text-white flex items-center" data-v-b5930c90><span class="w-1 h-4 bg-amber mr-3" data-v-b5930c90></span> SLICKLY </h2><p class="text-gray-300 leading-relaxed text-sm" data-v-b5930c90> U nás nájdete širokú ponuku autokozmetiky, detailing produktov a príslušenstva. Poradenstvo a vášeň pre starostlivosť o auto. </p></div></div><div class="border-t border-zinc-900 pt-12 pb-12 flex flex-col items-center gap-6" data-v-b5930c90>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/", unref(currentLocale)),
        class: "block",
        "aria-label": "SLICKLY Domov"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-baseline font-tech font-black uppercase leading-none tracking-tighter text-white text-[3rem] md:text-[4rem]" data-v-b5930c90${_scopeId}><span data-v-b5930c90${_scopeId}>SL</span><span class="logo-i-wrap" data-v-b5930c90${_scopeId}><span class="logo-i-dot bg-amber" data-v-b5930c90${_scopeId}></span>I</span><span data-v-b5930c90${_scopeId}>CKLY</span></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-baseline font-tech font-black uppercase leading-none tracking-tighter text-white text-[3rem] md:text-[4rem]" }, [
                createVNode("span", null, "SL"),
                createVNode("span", { class: "logo-i-wrap" }, [
                  createVNode("span", { class: "logo-i-dot bg-amber" }),
                  createTextVNode("I")
                ]),
                createVNode("span", null, "CKLY")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center gap-3" data-v-b5930c90><a href="#" aria-label="Sledujte nás na Facebooku" class="w-9 h-9 bg-white/5 hover:bg-amber hover:text-black flex items-center justify-center text-white transition-colors duration-200 rounded-default" data-v-b5930c90>`);
      _push(ssrRenderComponent(unref(Facebook), { class: "w-4 h-4" }, null, _parent));
      _push(`</a><a href="#" aria-label="Sledujte nás na Instagrame" class="w-9 h-9 bg-white/5 hover:bg-amber hover:text-black flex items-center justify-center text-white transition-colors duration-200 rounded-default" data-v-b5930c90>`);
      _push(ssrRenderComponent(unref(Instagram), { class: "w-4 h-4" }, null, _parent));
      _push(`</a><a href="#" aria-label="Sledujte nás na Youtube" class="w-9 h-9 bg-white/5 hover:bg-amber hover:text-black flex items-center justify-center text-white transition-colors duration-200 rounded-default" data-v-b5930c90>`);
      _push(ssrRenderComponent(unref(Youtube), { class: "w-4 h-4" }, null, _parent));
      _push(`</a></div></div><div class="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-normal uppercase tracking-wider text-white/40" data-v-b5930c90><p data-v-b5930c90>© ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} SLICKLY. Všetky práva vyhradené.</p><button type="button" class="hover:text-white/80 transition-colors cursor-pointer bg-transparent border-none p-0 text-[10px] font-normal uppercase tracking-wider text-white/40" data-v-b5930c90>Nastavenia cookies</button></div></div></div></footer>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Footer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-b5930c90"]]), { __name: "Footer" });

export { Footer as default };
