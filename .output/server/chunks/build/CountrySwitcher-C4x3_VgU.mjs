import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { ChevronDown, Globe, Check } from 'lucide-vue-next';
import { o as onClickOutside } from './index-B6MI764M.mjs';
import { u as useCountrySelector } from './useCountrySelector-Cujau6dz.mjs';
import './server.mjs';
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
  __name: "CountrySwitcher",
  __ssrInlineRender: true,
  props: {
    variant: {}
  },
  setup(__props) {
    const props = __props;
    const {
      availableCountries,
      selectedCountryId,
      selectedCountryDisplay
    } = useCountrySelector();
    const isOpen = ref(false);
    const containerRef = ref(null);
    onClickOutside(containerRef, () => {
      isOpen.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative",
        ref_key: "containerRef",
        ref: containerRef
      }, _attrs))}><button class="${ssrRenderClass([
        "flex items-center gap-1.5 cursor-pointer transition-colors",
        props.variant === "light" ? "bg-white py-2 px-3 border border-zinc-200 text-black text-xs font-bold hover:border-black" : "bg-transparent border-none text-white/80 hover:text-white text-[10px] font-normal"
      ])}" aria-label="Zmeniť krajinu doručenia"><img${ssrRenderAttr("src", unref(selectedCountryDisplay).flagUrl)}${ssrRenderAttr("alt", unref(selectedCountryDisplay).iso)} class="w-5 h-3.5 rounded-[1px] object-cover flex-shrink-0"><span class="uppercase tracking-wider">${ssrInterpolate(unref(selectedCountryDisplay).iso)}</span>`);
      _push(ssrRenderComponent(unref(ChevronDown), {
        class: ["w-3 h-3 transition-transform duration-200", unref(isOpen) ? "rotate-180" : ""]
      }, null, _parent));
      _push(`</button>`);
      if (unref(isOpen) && unref(availableCountries)?.length) {
        _push(`<div class="${ssrRenderClass([
          "absolute bg-white border border-gray-200 shadow-2xl z-[210] w-[230px]",
          props.variant === "light" ? "bottom-full right-0 mb-2" : "top-full right-0 mt-2"
        ])}"><div class="px-4 py-3 border-b border-gray-100 flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Globe), { class: "w-3.5 h-3.5 text-brand flex-shrink-0" }, null, _parent));
        _push(`<span class="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 font-sans"> Krajina doručenia </span></div><div class="max-h-[260px] overflow-y-auto"><!--[-->`);
        ssrRenderList(unref(availableCountries), (country) => {
          _push(`<button class="${ssrRenderClass([
            country.id === unref(selectedCountryId) ? "bg-gray-50 text-brand" : "text-gray-800 hover:bg-black hover:text-white",
            "w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors duration-100 font-sans group"
          ])}"><span class="flex items-center gap-3"><img${ssrRenderAttr("src", `https://flagcdn.com/w40/${country.iso.toLowerCase()}.png`)}${ssrRenderAttr("alt", country.iso)} class="w-5 h-3.5 rounded-[1px] object-cover flex-shrink-0"><span class="text-[13px] font-normal leading-none">${ssrInterpolate(country.name)}</span></span>`);
          if (country.id === unref(selectedCountryId)) {
            _push(ssrRenderComponent(unref(Check), { class: "w-3.5 h-3.5 text-brand flex-shrink-0 ml-2 group-hover:text-white" }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/navbar/CountrySwitcher.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CountrySwitcher = Object.assign(_sfc_main, { __name: "CountrySwitcher" });

export { CountrySwitcher as default };
