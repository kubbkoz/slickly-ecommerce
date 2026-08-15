import __nuxt_component_0 from './ProductCardMini-C5JVac9Q.mjs';
import { defineComponent, ref, watch, nextTick, unref, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { ArrowLeft, Loader2, X, Mic, Search, Clock, TrendingUp, Star, Store } from 'lucide-vue-next';
import { u as useRecentSearches, a as useSearchSuggest } from './useSearchSuggest-CFIuPdjY.mjs';
import { u as useFeaturedProducts } from './useFeaturedProducts-BD8h0sYO.mjs';
import { f as formatRating } from './format-tV37I8C6.mjs';
import { u as useSearchIntent } from './useSearchIntent-SSB4M-IA.mjs';
import { _ as _export_sfc, c as useRouter, b as useLocalePath } from './server.mjs';
import { u as useStaticTranslations } from './useStaticTranslations-DjO9xa-s.mjs';
import { u as useProductHelpers } from './useProductHelpers-Ch_jrkwO.mjs';
import { u as usePrice } from './usePrice-CDJKOx8c.mjs';
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
import './useListing-D9PeCG7-.mjs';
import './useCategory-DZrTDjvY.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "MobileSearchOverlay" },
  __name: "MobileSearchOverlay",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    useRouter();
    useLocalePath();
    const { t } = useStaticTranslations();
    const { getFormattedPrice } = usePrice();
    const { getProductImageUrl, getFormattedName } = useProductHelpers();
    useSearchIntent();
    const searchQuery = ref("");
    const { recentSearches } = useRecentSearches();
    const {
      getProducts,
      suggestManufacturers,
      totalResults,
      isLoading,
      showEmpty,
      showResults,
      searchTerm
    } = useSearchSuggest(searchQuery);
    const { featuredProducts, fetch: fetchFeatured } = useFeaturedProducts();
    const isListening = ref(false);
    ref(null);
    const inputRef = ref(null);
    const trendingSearches = [
      "Exteriér",
      "Leštenie",
      "Ochrana karosérie",
      "Interiér",
      "Príslušenstvo",
      "Špeciálna ponuka"
    ];
    watch(() => props.isOpen, (opened) => {
      if (opened) {
        fetchFeatured();
        nextTick(() => inputRef.value?.focus());
        (void 0).body.style.overflow = "hidden";
      } else {
        (void 0).body.style.overflow = "";
        searchQuery.value = "";
        searchTerm.value = "";
      }
    });
    const onClose = () => {
      emit("close");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ProductCardMini = __nuxt_component_0;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.isOpen) {
          _push2(`<div class="fixed inset-0 z-[110] flex flex-col bg-white font-sans" role="dialog" aria-modal="true" aria-label="Vyhľadávanie" data-v-86d341c7><div class="bg-gray-50 border-b border-gray-200 flex items-center gap-3 px-3 py-3 flex-shrink-0" data-v-86d341c7><button class="p-2 text-black hover:text-brand transition-colors flex-shrink-0" aria-label="Zatvoriť vyhľadávanie" data-v-86d341c7>`);
          _push2(ssrRenderComponent(unref(ArrowLeft), { class: "w-6 h-6" }, null, _parent));
          _push2(`</button><div class="flex-1 relative" data-v-86d341c7><input type="text"${ssrRenderAttr("value", unref(searchQuery))}${ssrRenderAttr("placeholder", unref(isListening) ? "Počúvam…" : unref(t)("hladat_placeholder"))} class="${ssrRenderClass([{ "placeholder-brand animate-pulse": unref(isListening) }, "w-full bg-transparent text-black placeholder-gray-500 text-base font-medium focus:outline-none pr-20"])}" autocomplete="off" autocorrect="off" spellcheck="false" data-v-86d341c7><div class="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1" data-v-86d341c7>`);
          if (unref(isLoading)) {
            _push2(ssrRenderComponent(unref(Loader2), { class: "w-5 h-5 animate-spin text-brand" }, null, _parent));
          } else if (unref(searchQuery)) {
            _push2(`<button class="p-1.5 text-gray-500 hover:text-black transition-colors" data-v-86d341c7>`);
            _push2(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
            _push2(`</button>`);
          } else {
            _push2(`<button class="${ssrRenderClass([unref(isListening) ? "text-brand" : "text-gray-500", "p-1.5 transition-colors"])}" aria-label="Hlasové vyhľadávanie" data-v-86d341c7>`);
            _push2(ssrRenderComponent(unref(Mic), {
              class: ["w-5 h-5", { "animate-pulse": unref(isListening) }]
            }, null, _parent));
            _push2(`</button>`);
          }
          _push2(`</div></div><button class="bg-brand text-white px-4 py-2 text-sm font-bold uppercase tracking-wide flex-shrink-0 active:bg-red-800 transition-colors" data-v-86d341c7>`);
          _push2(ssrRenderComponent(unref(Search), { class: "w-4 h-4" }, null, _parent));
          _push2(`</button></div><div class="flex-1 overflow-y-auto scrollbar-hide" data-v-86d341c7>`);
          if (unref(showEmpty)) {
            _push2(`<div class="p-4 space-y-6" data-v-86d341c7><div data-v-86d341c7><div class="flex items-center justify-between mb-3" data-v-86d341c7><span class="flex items-center gap-1.5" data-v-86d341c7>`);
            _push2(ssrRenderComponent(unref(Clock), { class: "w-3.5 h-3.5 text-blue-500" }, null, _parent));
            _push2(`<span class="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 font-montserrat" data-v-86d341c7> Nedávne hľadania </span></span>`);
            if (unref(recentSearches).length > 0) {
              _push2(`<button class="text-[10px] text-gray-400 uppercase tracking-wider font-montserrat bg-white hover:text-brand transition-colors" type="button" data-v-86d341c7> Zmazať </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (unref(recentSearches).length > 0) {
              _push2(`<div class="flex flex-wrap gap-2" data-v-86d341c7><!--[-->`);
              ssrRenderList(unref(recentSearches), (term) => {
                _push2(`<button class="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 border border-gray-200 text-[13px] font-medium text-gray-700 active:bg-gray-100 transition-colors" type="button" data-v-86d341c7>`);
                _push2(ssrRenderComponent(unref(Clock), { class: "w-3 h-3 text-gray-300 flex-shrink-0" }, null, _parent));
                _push2(`<span data-v-86d341c7>${ssrInterpolate(term)}</span><span class="w-5 h-5 flex items-center justify-center text-gray-300 text-xs" role="button" aria-label="Odstrániť" data-v-86d341c7>✕</span></button>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<p class="text-sm text-gray-400 italic" data-v-86d341c7>Žiadne nedávne hľadania</p>`);
            }
            _push2(`</div><div class="h-px bg-gray-100" data-v-86d341c7></div><div data-v-86d341c7><div class="flex items-center gap-1.5 mb-3" data-v-86d341c7>`);
            _push2(ssrRenderComponent(unref(TrendingUp), { class: "w-3.5 h-3.5 text-success" }, null, _parent));
            _push2(`<span class="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 font-montserrat" data-v-86d341c7> Populárne hľadania </span></div><div class="flex flex-wrap gap-2" data-v-86d341c7><!--[-->`);
            ssrRenderList(trendingSearches, (term) => {
              _push2(`<button class="px-2.5 py-1.5 text-[13px] font-medium border border-gray-200 text-gray-700 active:bg-gray-50 font-sans" type="button" data-v-86d341c7>${ssrInterpolate(term)}</button>`);
            });
            _push2(`<!--]--></div></div>`);
            if (unref(featuredProducts).length > 0) {
              _push2(`<!--[--><div class="h-px bg-gray-100" data-v-86d341c7></div><div data-v-86d341c7><div class="flex items-center gap-1.5 mb-4" data-v-86d341c7>`);
              _push2(ssrRenderComponent(unref(Star), { class: "w-3.5 h-3.5 text-amber-400 fill-current" }, null, _parent));
              _push2(`<span class="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 font-montserrat" data-v-86d341c7> Populárne produkty </span></div><div class="grid grid-cols-2 gap-3" data-v-86d341c7><!--[-->`);
              ssrRenderList(unref(featuredProducts).slice(0, 6), (product) => {
                _push2(`<button class="group bg-white border border-gray-100 active:border-gray-400 transition-all text-left flex flex-col" type="button" data-v-86d341c7><div class="w-full aspect-square bg-[#f7f9fa] overflow-hidden flex-shrink-0" data-v-86d341c7><img${ssrRenderAttr("src", unref(getProductImageUrl)(product))}${ssrRenderAttr("alt", product.translated?.name || product.name)} class="w-full h-full object-contain p-3 mix-blend-multiply" loading="lazy" data-v-86d341c7></div><div class="p-2.5 flex flex-col flex-1" data-v-86d341c7><div class="h-[18px] flex items-center gap-1 mb-1" data-v-86d341c7>`);
                if ((product.ratingAverage || 0) > 0) {
                  _push2(`<!--[-->`);
                  _push2(ssrRenderComponent(unref(Star), { class: "w-3 h-3 fill-[#ffc107] text-[#ffc107]" }, null, _parent));
                  _push2(`<span class="text-[10px] font-bold font-tech" data-v-86d341c7>${ssrInterpolate(unref(formatRating)(product.ratingAverage))}</span><span class="text-[10px] text-gray-400 ml-0.5" data-v-86d341c7> (${ssrInterpolate(product.productReviewsCount || product.reviewCount || product.customFields?.mtsport_review_count || 0)}) </span><!--]-->`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><p class="text-[12px] font-medium text-gray-900 leading-tight line-clamp-2 mb-1.5 flex-1" data-v-86d341c7>${ssrInterpolate(unref(getFormattedName)(product))}</p><span class="text-[14px] font-bold font-tech text-black" data-v-86d341c7>${ssrInterpolate(unref(getFormattedPrice)(product.calculatedPrice?.unitPrice))}</span></div></button>`);
              });
              _push2(`<!--]--></div></div><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else if (unref(showResults)) {
            _push2(`<div data-v-86d341c7>`);
            if (unref(isLoading)) {
              _push2(`<div class="p-4 space-y-3" data-v-86d341c7><!--[-->`);
              ssrRenderList(4, (i) => {
                _push2(`<div class="flex gap-3 animate-pulse" data-v-86d341c7><div class="w-16 h-16 bg-gray-100 flex-shrink-0" data-v-86d341c7></div><div class="flex-1 space-y-2 py-1" data-v-86d341c7><div class="h-3 bg-gray-100 w-3/4" data-v-86d341c7></div><div class="h-3 bg-gray-100 w-1/2" data-v-86d341c7></div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!--[-->`);
              if (unref(suggestManufacturers).length > 0) {
                _push2(`<div class="px-4 pt-4 pb-2" data-v-86d341c7><div class="flex items-center gap-1.5 mb-3" data-v-86d341c7>`);
                _push2(ssrRenderComponent(unref(Store), { class: "w-3.5 h-3.5 text-violet-500" }, null, _parent));
                _push2(`<span class="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 font-montserrat" data-v-86d341c7> Výrobcovia </span></div><div class="flex gap-3 overflow-x-auto pb-1 hide-scrollbar" data-v-86d341c7><!--[-->`);
                ssrRenderList(unref(suggestManufacturers), (mfr) => {
                  _push2(`<button class="flex-shrink-0 flex flex-col items-center gap-2 p-3 border border-gray-100 active:border-gray-300 min-w-[80px] transition-colors" type="button" data-v-86d341c7><div class="w-12 h-12 border border-gray-100 flex items-center justify-center overflow-hidden bg-white" data-v-86d341c7>`);
                  if (mfr.logo) {
                    _push2(`<img${ssrRenderAttr("src", mfr.logo)}${ssrRenderAttr("alt", mfr.name)} class="w-full h-full object-contain p-1" data-v-86d341c7>`);
                  } else {
                    _push2(`<span class="text-sm font-black text-gray-600 font-tech" data-v-86d341c7>${ssrInterpolate(mfr.name.slice(0, 2).toUpperCase())}</span>`);
                  }
                  _push2(`</div><span class="text-[10px] font-bold text-gray-700 uppercase tracking-wide text-center leading-tight font-montserrat" data-v-86d341c7>${ssrInterpolate(mfr.name)}</span></button>`);
                });
                _push2(`<!--]--></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(suggestManufacturers).length > 0) {
                _push2(`<div class="h-px bg-gray-100 mx-4" data-v-86d341c7></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(getProducts)?.length > 0) {
                _push2(`<div class="p-4 space-y-2" data-v-86d341c7><!--[-->`);
                ssrRenderList(unref(getProducts), (product) => {
                  _push2(ssrRenderComponent(_component_ProductCardMini, {
                    key: product.id,
                    product,
                    onClick: onClose
                  }, null, _parent));
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<div class="flex flex-col items-center justify-center py-16 px-8 text-center" data-v-86d341c7>`);
                _push2(ssrRenderComponent(unref(Search), { class: "w-12 h-12 text-gray-200 mb-4" }, null, _parent));
                _push2(`<p class="text-gray-500 font-medium mb-1" data-v-86d341c7>Žiadne výsledky pre</p><p class="font-black text-gray-900 text-lg" data-v-86d341c7>&quot;${ssrInterpolate(unref(searchQuery))}&quot;</p></div>`);
              }
              _push2(`<!--]-->`);
            }
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
          if (!unref(showEmpty) && unref(getProducts)?.length > 0) {
            _push2(`<div class="sticky bottom-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-20 flex-shrink-0" data-v-86d341c7><button class="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest active:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg" type="button" data-v-86d341c7>`);
            _push2(ssrRenderComponent(unref(Search), { class: "w-4 h-4" }, null, _parent));
            _push2(` Hľadať &quot;${ssrInterpolate(unref(searchQuery))}&quot; — ${ssrInterpolate(unref(totalResults))} výsledkov </button></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/navbar/MobileSearchOverlay.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const MobileSearchOverlay = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-86d341c7"]]), { __name: "MobileSearchOverlay" });

export { MobileSearchOverlay as default };
