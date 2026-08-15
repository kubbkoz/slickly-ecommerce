import { c as useRouter, d as useRoute, b as useLocalePath, m as useI18n, D as useAppConfig, e as useShopwareContext, f as useUser, l as useSessionContext, M as useInternationalization, g as useState, h as useAsyncData, j as useNuxtApp, I as __nuxt_component_0$1, G as getCategoryUrl, i as useRuntimeConfig } from './server.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, ref, computed, unref, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderClass, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { X, User, ChevronDown, ChevronRight, BookOpen, Phone, Info, Mail, Check } from 'lucide-vue-next';
import { u as useLanguageSwitcher } from './useLanguageSwitcher-Ben6yRb4.mjs';
import Logo from './Logo-DVDlVLTg.mjs';
import CountrySwitcher from './CountrySwitcher-C4x3_VgU.mjs';
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
import './index-B6MI764M.mjs';
import './useCountrySelector-Cujau6dz.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MobileMenu",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean }
  },
  emits: ["close", "navigate"],
  setup(__props, { emit: __emit }) {
    useRouter();
    useRoute();
    const config = useRuntimeConfig();
    const localePath = useLocalePath();
    const { t, locale: currentLocale } = useI18n();
    const contact = useAppConfig().contact;
    const { apiClient } = useShopwareContext();
    const { currentLanguageId } = useShopwareLanguage();
    useUser();
    const { currency, currencies } = useSessionContext();
    const { languages } = useInternationalization();
    useLanguageSwitcher();
    useState("loginModalOpen", () => false);
    const mobileExpandedCategory = ref(null);
    ref(null);
    const expandedSubcategories = ref(/* @__PURE__ */ new Set());
    ref(false);
    const isCurrencyOpen = ref(false);
    const rootCategoryId = config.public.shopware.ids.rootCategory;
    const emit = __emit;
    const { data: navigationElements } = useAsyncData(
      `mobile-nav-v5-${currentLanguageId.value}`,
      async () => {
        if (!rootCategoryId) return [];
        try {
          const response = await apiClient.invoke("readNavigation post /navigation/{activeId}/{rootId}", {
            pathParams: { activeId: rootCategoryId, rootId: rootCategoryId },
            body: { depth: 3 },
            headers: {
              "sw-language-id": currentLanguageId.value
            }
          });
          return response.data || [];
        } catch (e) {
          return [];
        }
      },
      {
        lazy: true,
        watch: [currentLanguageId],
        default: () => [],
        getCachedData(key) {
          const nuxtApp = useNuxtApp();
          return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        }
      }
    );
    const buildChildUrl = (parent, child) => {
      const parentSlug = getCategoryUrl(parent).replace(/^\//, "");
      const childSlug = getCategoryUrl(child).replace(/^\//, "");
      if (parentSlug && !parentSlug.startsWith("navigation/") && childSlug && !childSlug.startsWith("navigation/")) {
        return `/${parentSlug}/${childSlug}`;
      }
      return `/${childSlug}`;
    };
    const onClose = () => emit("close");
    const getFlagAndLabel = (code) => {
      const short = code?.split("-")[0]?.toLowerCase();
      const map = {
        "sk": { flag: "sk", label: "SK" },
        "cs": { flag: "cz", label: "CZ" },
        "cz": { flag: "cz", label: "CZ" },
        "en": { flag: "gb", label: "EN" },
        "gb": { flag: "gb", label: "EN" },
        "hu": { flag: "hu", label: "HU" },
        "pl": { flag: "pl", label: "PL" },
        "de": { flag: "de", label: "DE" }
      };
      const match = map[short || ""];
      const flagCode = match?.flag ?? "xx";
      return {
        flagUrl: `https://flagcdn.com/w40/${flagCode}.png`,
        label: match?.label ?? short?.substring(0, 2).toUpperCase() ?? "??"
      };
    };
    computed(() => {
      const ORDER = ["SK", "CZ", "PL", "EN", "DE", "HU"];
      let list = (languages.value || []).map((language) => {
        const translationCode = language.translationCode?.code || "";
        const mapping = getFlagAndLabel(translationCode);
        return {
          id: language.id,
          ...mapping,
          code: translationCode
        };
      });
      if (list.length === 0) {
        const ids = config.public.shopware.ids;
        list = [
          { id: ids.languages.sk, label: "SK", code: "sk-SK", flagUrl: "https://flagcdn.com/w40/sk.png" },
          { id: ids.languages.cz, label: "CZ", code: "cs-CZ", flagUrl: "https://flagcdn.com/w40/cz.png" },
          { id: ids.languages.pl, label: "PL", code: "pl-PL", flagUrl: "https://flagcdn.com/w40/pl.png" },
          { id: ids.languages.en, label: "EN", code: "en-GB", flagUrl: "https://flagcdn.com/w40/gb.png" },
          { id: ids.languages.de, label: "DE", code: "de-DE", flagUrl: "https://flagcdn.com/w40/de.png" },
          { id: ids.languages.hu, label: "HU", code: "hu-HU", flagUrl: "https://flagcdn.com/w40/hu.png" }
        ];
      }
      return list.sort((a, b) => {
        const ai = ORDER.indexOf(a.label);
        const bi = ORDER.indexOf(b.label);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      });
    });
    const safeCurrencies = computed(() => {
      if (currencies?.value && currencies.value.length > 0) return currencies.value;
      return [{ id: config.public.shopware.ids.currencies.eur, symbol: "€" }];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      const _component_NuxtLink = __nuxt_component_0;
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="${ssrRenderClass([__props.isOpen ? "translate-x-0" : "translate-x-full", "fixed inset-0 w-full h-[100dvh] z-[120] transition-transform duration-300 transform lg:hidden flex flex-col gpu-boost bg-white overflow-hidden shadow-2xl"])}" style="${ssrRenderStyle({ "left": "0 !important", "right": "0 !important", "top": "0 !important", "bottom": "0 !important" })}"><div class="w-full min-w-full h-[var(--navbar-height-unscrolled,72px)] flex items-center justify-between p-6 bg-black sticky top-0 z-10 shrink-0" style="${ssrRenderStyle({ "background-color": "#000000 !important", "width": "100% !important" })}">`);
        _push2(ssrRenderComponent(Logo, null, null, _parent));
        _push2(`<div class="flex items-center gap-4"><button class="w-10 h-10 flex items-center justify-center bg-zinc-800 text-white group active:scale-95 transition-transform" aria-label="Zatvoriť menu">`);
        _push2(ssrRenderComponent(unref(X), { class: "w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" }, null, _parent));
        _push2(`</button></div></div><div class="w-full flex-1 overflow-y-auto scrollbar-hide bg-white p-6 pb-32"><div class="grid grid-cols-2 gap-4 mb-8"><button class="bg-gray-50 p-4 shrink-0 flex flex-col items-center justify-center rounded-default active:scale-95 transition-transform group gpu-boost border border-gray-100">`);
        _push2(ssrRenderComponent(_component_ClientOnly, null, {
          fallback: withCtx((_, _push3, _parent2, _scopeId) => {
            if (_push3) {
              _push3(ssrRenderComponent(unref(User), { class: "w-6 h-6 mb-2 text-zinc-400" }, null, _parent2, _scopeId));
              _push3(`<span class="text-xs font-bold text-black uppercase tracking-wider"${_scopeId}>${ssrInterpolate(unref(t)("prihlasit"))}</span>`);
            } else {
              return [
                createVNode(unref(User), { class: "w-6 h-6 mb-2 text-zinc-400" }),
                createVNode("span", { class: "text-xs font-bold text-black uppercase tracking-wider" }, toDisplayString(unref(t)("prihlasit")), 1)
              ];
            }
          })
        }, _parent));
        _push2(`</button></div><div class="mb-8"><h3 class="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 border-b border-zinc-100 pb-2">${ssrInterpolate(unref(t)("prechadzat_kategorie"))}</h3><div class="space-y-0.5"><!--[-->`);
        ssrRenderList(unref(navigationElements), (link) => {
          _push2(`<div class="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition-colors"><div class="flex items-center justify-between py-4">`);
          _push2(ssrRenderComponent(_component_NuxtLink, {
            to: unref(localePath)(unref(getCategoryUrl)(link)),
            class: ["flex-1 text-lg font-black font-tech uppercase tracking-wide transition-colors text-left leading-none", unref(mobileExpandedCategory) === link.id ? "text-brand" : "text-black"],
            onClick: onClose
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`${ssrInterpolate(link.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(link.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          if (link.children && link.children.length > 0) {
            _push2(`<button class="${ssrRenderClass([unref(mobileExpandedCategory) === link.id ? "bg-zinc-100 border-zinc-200" : "", "w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-100 transition-colors"])}"${ssrRenderAttr("aria-label", unref(mobileExpandedCategory) === link.id ? "Zbaliť kategóriu" : "Rozbaliť kategóriu")}>`);
            _push2(ssrRenderComponent(unref(ChevronDown), {
              class: ["w-5 h-5 transition-transform duration-300", unref(mobileExpandedCategory) === link.id ? "rotate-180 text-brand" : "text-zinc-400"]
            }, null, _parent));
            _push2(`</button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="${ssrRenderClass([unref(mobileExpandedCategory) === link.id && link.children && link.children.length > 0 ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0", "overflow-hidden transition-all duration-300 ease-in-out"])}"><div class="bg-gray-50 p-4 space-y-1 mb-4 rounded-default border-l-2 border-brand/50">`);
          _push2(ssrRenderComponent(_component_NuxtLink, {
            to: unref(localePath)(unref(getCategoryUrl)(link), unref(currentLocale)),
            onClick: onClose,
            class: "block w-full text-left py-2 px-2 text-sm font-bold text-black uppercase tracking-wider hover:bg-white rounded-default border border-transparent hover:border-zinc-100"
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(` Všetky ${ssrInterpolate(link.name)}`);
              } else {
                return [
                  createTextVNode(" Všetky " + toDisplayString(link.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push2(`<!--[-->`);
          ssrRenderList(link.children, (sub) => {
            _push2(`<div><div class="flex items-center">`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: unref(localePath)(unref(getCategoryUrl)(sub), unref(currentLocale)),
              onClick: onClose,
              class: ["flex-1 py-2 px-2 text-sm font-medium uppercase tracking-wide transition-colors", unref(expandedSubcategories).has(sub.id) ? "text-brand" : "text-zinc-500 hover:text-brand"]
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(sub.name)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(sub.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            if (sub.children && sub.children.length > 0) {
              _push2(`<button class="w-8 h-8 flex items-center justify-center flex-shrink-0"${ssrRenderAttr("aria-label", unref(expandedSubcategories).has(sub.id) ? "Zbaliť" : "Rozbaliť")}>`);
              _push2(ssrRenderComponent(unref(ChevronRight), {
                class: ["w-4 h-4 transition-transform duration-200", unref(expandedSubcategories).has(sub.id) ? "rotate-90 text-brand" : "text-zinc-300"]
              }, null, _parent));
              _push2(`</button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (sub.children && sub.children.length > 0) {
              _push2(`<div class="${ssrRenderClass([unref(expandedSubcategories).has(sub.id) ? "max-h-[600px]" : "max-h-0", "overflow-hidden transition-all duration-200"])}"><div class="pl-4 pb-1 space-y-0.5 border-l border-brand/30 ml-2"><!--[-->`);
              ssrRenderList(sub.children, (child) => {
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  key: child.id,
                  to: unref(localePath)(buildChildUrl(sub, child), unref(currentLocale)),
                  onClick: onClose,
                  class: "block py-1.5 px-2 text-xs font-medium text-zinc-400 uppercase tracking-wide hover:text-brand transition-colors"
                }, {
                  default: withCtx((_, _push3, _parent2, _scopeId) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(child.name)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(child.name), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          });
          _push2(`<!--]--></div></div></div>`);
        });
        _push2(`<!--]--></div></div><button class="w-full mb-8 p-4 bg-gray-50 border border-zinc-100 flex items-center justify-between group active:scale-[0.98] transition-all rounded-default gpu-boost"><div class="flex items-center"><div class="w-10 h-10 bg-brand flex items-center justify-center mr-4">`);
        _push2(ssrRenderComponent(unref(BookOpen), { class: "w-5 h-5 text-white" }, null, _parent));
        _push2(`</div><div class="text-left"><span class="block text-black font-black font-tech text-lg uppercase leading-none mb-1 group-hover:text-brand transition-colors">${ssrInterpolate(unref(t)("magazin"))}</span><span class="block text-[10px] text-zinc-400 font-bold uppercase tracking-widest">${ssrInterpolate(unref(t)("testy_recenzie_novinky"))}</span></div></div>`);
        _push2(ssrRenderComponent(unref(ChevronRight), { class: "w-5 h-5 text-zinc-300 group-hover:text-brand group-hover:translate-x-1 transition-all" }, null, _parent));
        _push2(`</button><div class="space-y-4 text-black text-sm font-bold uppercase tracking-widest font-sans"><button class="flex items-center hover:text-brand py-2 transition-colors w-full text-left bg-transparent appearance-none border-none">`);
        _push2(ssrRenderComponent(unref(Phone), { class: "w-4 h-4 mr-3 text-brand" }, null, _parent));
        _push2(` ${ssrInterpolate(unref(t)("kontakty"))}</button><button class="flex items-center hover:text-brand py-2 transition-colors w-full text-left bg-transparent appearance-none border-none">`);
        _push2(ssrRenderComponent(unref(Info), { class: "w-4 h-4 mr-3 text-brand" }, null, _parent));
        _push2(` ${ssrInterpolate(unref(t)("vsetko_o_nakupe"))}</button><button class="flex items-center hover:text-brand py-2 transition-colors w-full text-left bg-transparent appearance-none border-none">`);
        _push2(ssrRenderComponent(unref(User), { class: "w-4 h-4 mr-3 text-brand" }, null, _parent));
        _push2(` ${ssrInterpolate(unref(t)("o_nas"))}</button><div class="border-t border-zinc-100 pt-8 mt-6 space-y-6"><a${ssrRenderAttr("href", unref(contact).phone.mainHref)} class="flex items-center hover:text-brand py-1 text-black text-base font-black font-tech tracking-wider transition-colors">`);
        _push2(ssrRenderComponent(unref(Phone), { class: "w-5 h-5 mr-4 text-brand" }, null, _parent));
        _push2(` ${ssrInterpolate(unref(contact).phone.mainDisplay)}</a><a${ssrRenderAttr("href", unref(contact).email.infoHref)} class="flex items-center hover:text-brand py-1 text-zinc-600 font-bold transition-colors">`);
        _push2(ssrRenderComponent(unref(Mail), { class: "w-5 h-5 mr-4 text-brand" }, null, _parent));
        _push2(` ${ssrInterpolate(unref(contact).email.info)}</a></div></div></div><div class="w-full border-t border-zinc-100 bg-gray-50 p-6 sticky bottom-0 z-20 flex justify-end items-center gap-4 font-sans shrink-0">`);
        _push2(ssrRenderComponent(CountrySwitcher, { variant: "light" }, null, _parent));
        if (unref(safeCurrencies)?.length > 1) {
          _push2(`<div class="h-4 w-px bg-zinc-200"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(safeCurrencies)?.length > 1) {
          _push2(`<div class="relative"><button class="flex items-center gap-2 bg-white py-2 px-4 border border-zinc-200 text-black text-xs font-bold uppercase tracking-widest"><span>${ssrInterpolate(unref(currency)?.symbol || "€")}</span>`);
          _push2(ssrRenderComponent(unref(ChevronDown), {
            class: ["w-4 h-4 text-zinc-400 transition-transform", { "rotate-180": unref(isCurrencyOpen) }]
          }, null, _parent));
          _push2(`</button>`);
          if (unref(isCurrencyOpen)) {
            _push2(`<div class="absolute bottom-full right-0 mb-2 w-32 bg-white border border-zinc-200 shadow-2xl overflow-hidden z-30 rounded-default"><!--[-->`);
            ssrRenderList(unref(safeCurrencies), (curr) => {
              _push2(`<button class="${ssrRenderClass([{ "text-brand": curr.id === unref(currency)?.id }, "w-full text-left px-4 py-3 hover:bg-black hover:text-white text-xs font-bold uppercase text-black flex justify-between items-center border-b border-gray-100 last:border-0 transition-colors tracking-widest"])}"><span>${ssrInterpolate(curr.symbol)}</span>`);
              if (curr.id === unref(currency)?.id) {
                _push2(ssrRenderComponent(unref(Check), { class: "w-4 h-4 text-brand" }, null, _parent));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</button>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`</div></div>`);
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/navbar/MobileMenu.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const MobileMenu = Object.assign(_sfc_main, { __name: "MobileMenu" });

export { MobileMenu as default };
