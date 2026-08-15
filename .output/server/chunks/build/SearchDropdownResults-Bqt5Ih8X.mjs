import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
import { ChevronRight, FolderOpen, Tag, SlidersHorizontal, Search } from 'lucide-vue-next';
import { u as useProductHelpers } from './useProductHelpers-Ch_jrkwO.mjs';
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

function stripAccents(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function escapeForRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const MARK_CLASS = "bg-yellow-100 text-yellow-900 font-semibold not-italic rounded-[2px] px-[1px]";
function highlightText(text, query) {
  if (!text) return "";
  if (!query?.trim()) return escapeHtml(text);
  const normalizedText = stripAccents(text);
  const normalizedQuery = stripAccents(query.trim());
  const escaped = escapeForRegex(normalizedQuery);
  const regex = new RegExp(escaped, "gi");
  let result = "";
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(normalizedText)) !== null) {
    result += escapeHtml(text.slice(lastIndex, match.index));
    result += `<mark class="${MARK_CLASS}">${escapeHtml(text.slice(match.index, match.index + match[0].length))}</mark>`;
    lastIndex = match.index + match[0].length;
    if (match[0].length === 0) {
      regex.lastIndex++;
    }
  }
  result += escapeHtml(text.slice(lastIndex));
  return result;
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "SearchDropdownResults" },
  __name: "SearchDropdownResults",
  __ssrInlineRender: true,
  props: {
    products: {},
    manufacturers: {},
    categories: {},
    tags: {},
    properties: {},
    totalResults: {},
    searchQuery: {},
    isLoading: { type: Boolean },
    getFormattedPrice: { type: Function },
    getProductImageUrl: { type: Function }
  },
  emits: ["productClick", "navigateSearch", "categoryClick"],
  setup(__props, { emit: __emit }) {
    const { getFormattedName } = useProductHelpers();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-4 max-h-[520px] overflow-hidden" }, _attrs))}>`);
      if (__props.isLoading && __props.products.length === 0) {
        _push(`<div class="grid grid-cols-[1fr_200px_280px] gap-0 divide-x divide-gray-100"><div class="pr-6 space-y-3"><div class="h-3 w-20 bg-gray-100 animate-pulse rounded"></div><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<div class="flex items-center gap-3"><div class="w-11 h-11 bg-gray-100 animate-pulse flex-shrink-0"></div><div class="flex-1 space-y-1.5"><div class="h-3 bg-gray-100 animate-pulse rounded w-3/4"></div><div class="h-2.5 bg-gray-100 animate-pulse rounded w-1/4"></div></div></div>`);
        });
        _push(`<!--]--></div><div class="px-6 space-y-3"><div class="h-3 w-20 bg-gray-100 animate-pulse rounded"></div><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="flex items-center gap-2"><div class="w-7 h-7 bg-gray-100 animate-pulse flex-shrink-0"></div><div class="h-3 bg-gray-100 animate-pulse rounded flex-1"></div></div>`);
        });
        _push(`<!--]--></div><div class="pl-6 space-y-3"><div class="h-3 w-20 bg-gray-100 animate-pulse rounded"></div><div class="grid grid-cols-2 gap-2"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="h-10 bg-gray-100 animate-pulse rounded"></div>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<div class="grid grid-cols-[1fr_200px_280px] gap-0 items-start divide-x divide-gray-100"><div class="pr-6"><div class="flex items-center justify-between mb-3"><span class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] font-montserrat"> Produkty </span>`);
        if (__props.totalResults > 0) {
          _push(`<span class="text-[10px] text-gray-400 font-sans">${ssrInterpolate(__props.totalResults)} výsledkov </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (!__props.isLoading && __props.products.length === 0) {
          _push(`<div class="py-5 text-center"><p class="text-sm text-gray-500 italic"> Nenašli sa žiadne produkty pre “${ssrInterpolate(__props.searchQuery)}” </p><button class="mt-2 text-xs font-bold text-brand uppercase tracking-widest hover:underline" type="button"> Skúsiť rozšírené hľadanie → </button></div>`);
        } else {
          _push(`<ul class="space-y-0.5" role="listbox"><!--[-->`);
          ssrRenderList(__props.products.slice(0, 6), (product) => {
            _push(`<li role="option" class="flex items-center gap-3 px-2 py-2 -mx-2 cursor-pointer group hover:bg-[#f7f8fa] transition-colors"><div class="w-11 h-11 flex-shrink-0 bg-gray-50 border border-gray-100 p-0.5 overflow-hidden"><img${ssrRenderAttr("src", __props.getProductImageUrl(product))}${ssrRenderAttr("alt", product.translated?.name || product.name)} class="w-full h-full object-contain mix-blend-multiply" loading="lazy"></div><div class="flex-1 min-w-0"><p class="text-[13px] font-medium text-gray-900 group-hover:text-brand transition-colors leading-tight line-clamp-1 font-sans">${unref(highlightText)(unref(getFormattedName)(product), __props.searchQuery) ?? ""}</p><p class="text-xs font-bold text-gray-400 mt-0.5 font-tech">${ssrInterpolate(__props.getFormattedPrice(product.calculatedPrice?.unitPrice))}</p></div>`);
            _push(ssrRenderComponent(unref(ChevronRight), { class: "w-3.5 h-3.5 text-gray-300 group-hover:text-brand flex-shrink-0 transition-colors" }, null, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul>`);
        }
        if (__props.products.length > 0) {
          _push(`<div class="mt-3 pt-3 border-t border-gray-100"><button class="w-full py-2.5 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand transition-colors text-center font-montserrat" type="button"> Zobraziť všetky výsledky `);
          if (__props.totalResults > 0) {
            _push(`<span>(${ssrInterpolate(__props.totalResults)})</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="px-6"><div><span class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] font-montserrat block mb-3"> Kategórie </span>`);
        if (__props.categories.length > 0) {
          _push(`<ul class="space-y-0.5"><!--[-->`);
          ssrRenderList(__props.categories, (cat) => {
            _push(`<li class="flex items-center gap-2.5 px-2 py-1.5 -mx-2 cursor-pointer group hover:bg-[#f7f8fa] transition-colors">`);
            if (cat.imageUrl) {
              _push(`<div class="w-7 h-7 flex-shrink-0 bg-gray-50 border border-gray-100 p-0.5 overflow-hidden"><img${ssrRenderAttr("src", cat.imageUrl)}${ssrRenderAttr("alt", cat.name)} class="w-full h-full object-contain mix-blend-multiply" loading="lazy"></div>`);
            } else {
              _push(`<div class="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-gray-50 border border-gray-100">`);
              _push(ssrRenderComponent(unref(FolderOpen), { class: "w-3.5 h-3.5 text-gray-300" }, null, _parent));
              _push(`</div>`);
            }
            _push(`<span class="text-[12px] font-medium text-gray-700 group-hover:text-brand transition-colors leading-tight line-clamp-1 font-sans">${unref(highlightText)(cat.name, __props.searchQuery) ?? ""}</span></li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<p class="text-[11px] text-gray-400 italic font-sans"> Žiadne kategórie </p>`);
        }
        _push(`</div>`);
        if (__props.tags.length > 0) {
          _push(`<div class="mt-4 pt-3 border-t border-gray-100"><span class="flex items-center gap-1.5 mb-2.5">`);
          _push(ssrRenderComponent(unref(Tag), { class: "w-3 h-3 text-gray-400" }, null, _parent));
          _push(`<span class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] font-montserrat"> Tagy </span></span><div class="flex flex-wrap gap-1.5"><!--[-->`);
          ssrRenderList(__props.tags, (tag) => {
            _push(`<button class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide border border-gray-200 text-gray-600 hover:border-black hover:text-black hover:bg-gray-50 transition-all font-montserrat" type="button">${ssrInterpolate(tag.name)}</button>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="pl-6">`);
        if (__props.manufacturers.length > 0) {
          _push(`<div><span class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] font-montserrat block mb-3"> Výrobca </span><ul class="grid grid-cols-2 gap-2"><!--[-->`);
          ssrRenderList(__props.manufacturers.slice(0, 4), (mfr) => {
            _push(`<li class="flex items-center gap-2 px-2.5 py-2 border border-gray-100 hover:border-gray-300 hover:bg-[#f7f8fa] cursor-pointer transition-all group">`);
            if (mfr.logo) {
              _push(`<div class="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-white border border-gray-100 p-0.5 overflow-hidden"><img${ssrRenderAttr("src", mfr.logo)}${ssrRenderAttr("alt", mfr.name)} class="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all"></div>`);
            } else {
              _push(`<div class="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-gray-100 text-[9px] font-black text-gray-500 font-tech">${ssrInterpolate(mfr.name.slice(0, 2).toUpperCase())}</div>`);
            }
            _push(`<span class="text-[11px] font-bold text-gray-700 group-hover:text-gray-900 transition-colors font-sans leading-tight line-clamp-1">${unref(highlightText)(mfr.name, __props.searchQuery) ?? ""}</span></li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.properties.length > 0) {
          _push(`<div class="${ssrRenderClass([__props.manufacturers.length > 0 ? "pt-3 border-t border-gray-100" : "", "mt-4"])}"><span class="flex items-center gap-1.5 mb-2.5">`);
          _push(ssrRenderComponent(unref(SlidersHorizontal), { class: "w-3 h-3 text-gray-400" }, null, _parent));
          _push(`<span class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] font-montserrat"> Vlastnosti </span></span><ul class="space-y-1"><!--[-->`);
          ssrRenderList(__props.properties, (prop) => {
            _push(`<li class="flex items-center gap-2 px-2 py-1.5 -mx-2 cursor-pointer group hover:bg-[#f7f8fa] transition-colors"><span class="text-[10px] text-gray-400 font-sans flex-shrink-0">${ssrInterpolate(prop.groupName)}:</span><span class="text-[12px] font-medium text-gray-700 group-hover:text-brand transition-colors font-sans line-clamp-1">${unref(highlightText)(prop.name, __props.searchQuery) ?? ""}</span></li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="${ssrRenderClass([__props.manufacturers.length > 0 || __props.properties.length > 0 ? "pt-3 border-t border-gray-100" : "", "mt-4"])}"><button class="w-full py-2 border border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-widest hover:border-black hover:text-black transition-all text-center flex items-center justify-center gap-2 font-montserrat" type="button">`);
        _push(ssrRenderComponent(unref(Search), { class: "w-3 h-3" }, null, _parent));
        _push(` Hľadať na celom webe </button></div></div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/navbar/search/SearchDropdownResults.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SearchDropdownResults = Object.assign(_sfc_main, { __name: "SearchDropdownResults" });

export { SearchDropdownResults as default };
