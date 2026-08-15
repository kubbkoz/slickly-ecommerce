import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { l as useSessionContext, M as useInternationalization, d as useRoute, m as useI18n, b as useLocalePath, D as useAppConfig, I as __nuxt_component_0$1, i as useRuntimeConfig } from './server.mjs';
import { defineComponent, ref, computed, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderClass, ssrRenderStyle, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { Phone, Mail, ChevronDown, Check, BookOpen } from 'lucide-vue-next';
import { u as useLanguageSwitcher } from './useLanguageSwitcher-Ben6yRb4.mjs';
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
  __name: "TopBar",
  __ssrInlineRender: true,
  props: {
    isScrolled: { type: Boolean },
    isHidden: { type: Boolean }
  },
  setup(__props) {
    ref(false);
    const hours = ref(null);
    const SK_DAYS = ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"];
    function isToday(val) {
      const now = /* @__PURE__ */ new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const ymd = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const dmy = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
      const dmyShort = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
      return val === ymd || val === dmy || val === dmyShort;
    }
    const isDovolenka = computed(() => !!hours.value?.dovolenka);
    computed(() => {
      if (!isMounted.value || !hours.value) return false;
      if (isDovolenka.value) return false;
      const h = hours.value;
      const now = /* @__PURE__ */ new Date();
      const today = SK_DAYS[now.getDay()];
      const z = String(h.zatvorene ?? "").trim();
      if (z && (today === z || isToday(z))) return false;
      const parse = (t2) => {
        const [hh, mm] = (t2 || "").split(":").map(Number);
        return (hh || 0) * 60 + (mm || 0);
      };
      const nowMin = now.getHours() * 60 + now.getMinutes();
      return nowMin >= parse(h.od) && nowMin < parse(h.do);
    });
    const { sessionContext, currency, currencies } = useSessionContext();
    const { languages } = useInternationalization();
    useLanguageSwitcher();
    useRoute();
    const config = useRuntimeConfig();
    const { t, locale: currentLocale } = useI18n();
    const localePath = useLocalePath();
    const contact = useAppConfig().contact;
    const isMounted = ref(false);
    const getFlagAndLabel = (code) => {
      const short = code?.split("-")[0]?.toLowerCase() || "xx";
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
      const match = map[short];
      const flagCode = match?.flag ?? "xx";
      return {
        flagUrl: `https://flagcdn.com/w40/${flagCode}.png`,
        label: match?.label ?? short.toUpperCase().substring(0, 2)
      };
    };
    computed(() => {
      const p = useRoute().path;
      if (p.startsWith("/cz") || p === "/cz") return getFlagAndLabel("cz");
      if (p.startsWith("/de") || p === "/de") return getFlagAndLabel("de");
      if (p.startsWith("/hu") || p === "/hu") return getFlagAndLabel("hu");
      if (p.startsWith("/en") || p === "/en") return getFlagAndLabel("en");
      if (p.startsWith("/pl") || p === "/pl") return getFlagAndLabel("pl");
      if (currentLocale.value) {
        return getFlagAndLabel(currentLocale.value);
      }
      if (languages.value && languages.value.length > 0) {
        const currentLang = languages.value.find((l) => l.id === sessionContext.value?.context?.languageIdChain?.[0]);
        return getFlagAndLabel(currentLang?.translationCode?.code || "sk");
      }
      const { getLocaleForLanguageId } = useShopwareLanguage();
      const langId = sessionContext.value?.context?.languageIdChain?.[0];
      return getFlagAndLabel(langId ? getLocaleForLanguageId(langId) : "sk");
    });
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
      const ids = config.public.shopware.ids;
      if (list.length === 0) {
        list = [
          { id: ids.languages.sk, label: "SK", code: "sk-SK", flagUrl: "https://flagcdn.com/w40/sk.png" },
          { id: ids.languages.cz, label: "CZ", code: "cs-CZ", flagUrl: "https://flagcdn.com/w40/cz.png" },
          { id: ids.languages.pl, label: "PL", code: "pl-PL", flagUrl: "https://flagcdn.com/w40/pl.png" },
          { id: ids.languages.en, label: "EN", code: "en-GB", flagUrl: "https://flagcdn.com/w40/gb.png" },
          { id: ids.languages.de, label: "DE", code: "de-DE", flagUrl: "https://flagcdn.com/w40/de.png" },
          { id: ids.languages.hu, label: "HU", code: "hu-HU", flagUrl: "https://flagcdn.com/w40/hu.png" }
        ];
      }
      const hasDe = list.some((l) => l.code === "de-DE" || l.label === "DE");
      if (!hasDe && list.length > 0) {
        list.push({ id: ids.languages.de, flagUrl: "https://flagcdn.com/w40/de.png", label: "DE", code: "de-DE" });
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
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(`<!--[--><div class="${ssrRenderClass([__props.isHidden ? "max-h-0 py-0 opacity-0 overflow-hidden pointer-events-none" : "max-h-[44px] py-2 opacity-100 overflow-visible pointer-events-auto", "bg-black text-white/80 text-[10px] font-normal uppercase tracking-wider hidden xl:block transition-all duration-150 ease-linear z-50 relative"])}" style="${ssrRenderStyle({ "background-color": "#000000 !important" })}"><div class="container mx-auto px-4 lg:px-8 flex justify-between items-center h-full overflow-visible"><div class="flex items-center space-x-6"><a${ssrRenderAttr("href", unref(contact).phone.mainHref)} class="flex items-center hover:text-white transition-colors cursor-pointer">`);
      _push(ssrRenderComponent(unref(Phone), { class: "w-3 h-3 mr-2 text-amber" }, null, _parent));
      _push(` ${ssrInterpolate(unref(contact).phone.mainDisplay)}</a><a${ssrRenderAttr("href", unref(contact).email.infoHref)} class="flex items-center hover:text-white transition-colors cursor-pointer">`);
      _push(ssrRenderComponent(unref(Mail), { class: "w-3 h-3 mr-2 text-amber" }, null, _parent));
      _push(` ${ssrInterpolate(unref(contact).email.info)}</a></div><div class="flex items-center space-x-6"><div class="flex items-center space-x-4">`);
      if (unref(safeCurrencies)?.length > 1) {
        _push(`<div class="relative group"><button class="flex items-center hover:text-white transition-colors space-x-1 cursor-pointer bg-transparent border-none text-white/80 font-normal" aria-label="Zmeniť menu"><span>${ssrInterpolate(unref(currency)?.symbol || "€")}</span>`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "w-3 h-3" }, null, _parent));
        _push(`</button><div class="absolute top-full right-0 bg-white border border-gray-200 shadow-lg rounded-sm py-1 min-w-[80px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"><!--[-->`);
        ssrRenderList(unref(safeCurrencies), (curr) => {
          _push(`<button class="${ssrRenderClass([{ "text-brand": curr.id === unref(currency)?.id }, "w-full text-left px-4 py-2 hover:bg-black hover:text-white text-xs font-bold uppercase text-black flex justify-between items-center transition-colors"])}">${ssrInterpolate(curr.symbol)} `);
          if (curr.id === unref(currency)?.id) {
            _push(ssrRenderComponent(unref(Check), { class: "w-3 h-3 text-brand" }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(safeCurrencies)?.length > 1) {
        _push(`<div class="h-3 w-px bg-zinc-800"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/blog", unref(currentLocale)),
        class: "flex items-center text-white hover:text-amber transition-colors font-medium tracking-[0.1em]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(BookOpen), { class: "w-3.5 h-3.5 mr-1.5 text-amber" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("magazin"))}`);
          } else {
            return [
              createVNode(unref(BookOpen), { class: "w-3.5 h-3.5 mr-1.5 text-amber" }),
              createTextVNode(" " + toDisplayString(unref(t)("magazin")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="h-3 w-px bg-white/10"></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/kontakty",
        class: "hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("kontakty"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("kontakty")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/vsetko-o-nakupe",
        class: "hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("vsetko_o_nakupe"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("vsetko_o_nakupe")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/o-nas",
        class: "hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("o_nas"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("o_nas")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="h-3 w-px bg-white/10"></div>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div></div></div><div class="flex xl:hidden items-center justify-center bg-black text-white/70 text-[10px] uppercase tracking-wider px-4 py-2"><a${ssrRenderAttr("href", unref(contact).phone.mainHref)} class="flex items-center gap-1.5 hover:text-white transition-colors">`);
      _push(ssrRenderComponent(unref(Phone), {
        class: "w-3 h-3 text-amber",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(contact).phone.mainDisplay)}</a></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/navbar/TopBar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TopBar = Object.assign(_sfc_main, { __name: "TopBar" });

export { TopBar as default };
