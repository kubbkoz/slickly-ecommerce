import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { Clock, TrendingUp, Star } from 'lucide-vue-next';
import { f as formatRating } from './format-tV37I8C6.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "SearchDropdownEmpty" },
  __name: "SearchDropdownEmpty",
  __ssrInlineRender: true,
  props: {
    recentSearches: {},
    trendingSearches: {},
    featuredProducts: {},
    getFormattedPrice: { type: Function },
    getProductImageUrl: { type: Function }
  },
  emits: ["pickTerm", "removeTerm", "clearAll", "navigateTerm", "productClick"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-5 space-y-5" }, _attrs))}><div><div class="flex items-center justify-between mb-3"><span class="flex items-center gap-1.5">`);
      _push(ssrRenderComponent(unref(Clock), { class: "w-3.5 h-3.5 text-blue-500" }, null, _parent));
      _push(`<span class="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 font-montserrat"> Nedávne hľadania </span></span>`);
      if (__props.recentSearches.length > 0) {
        _push(`<button class="text-[10px] text-gray-400 hover:text-brand transition-colors uppercase tracking-wider font-montserrat" type="button"> Zmazať </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.recentSearches.length > 0) {
        _push(`<div class="flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(__props.recentSearches, (term) => {
          _push(`<button class="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 border border-gray-200 bg-white text-[11px] font-medium text-gray-700 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all group font-sans" type="button">`);
          _push(ssrRenderComponent(unref(Clock), { class: "w-3 h-3 text-gray-300 flex-shrink-0" }, null, _parent));
          _push(`<span>${ssrInterpolate(term)}</span><span class="w-4 h-4 flex items-center justify-center text-gray-300 hover:text-brand hover:bg-red-50 transition-colors ml-0.5 text-xs leading-none" role="button" aria-label="Odstrániť">✕</span></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p class="text-xs text-gray-400 italic font-sans">Žiadne nedávne hľadania</p>`);
      }
      _push(`</div><div class="h-px bg-gray-100"></div><div><div class="flex items-center gap-1.5 mb-3">`);
      _push(ssrRenderComponent(unref(TrendingUp), { class: "w-3.5 h-3.5 text-success" }, null, _parent));
      _push(`<span class="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 font-montserrat"> Populárne hľadania </span></div><div class="flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(__props.trendingSearches, (term) => {
        _push(`<button class="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border border-gray-200 text-gray-600 hover:border-black hover:text-black hover:bg-gray-50 transition-all font-montserrat" type="button">${ssrInterpolate(term)}</button>`);
      });
      _push(`<!--]--></div></div>`);
      if (__props.featuredProducts.length > 0) {
        _push(`<!--[--><div class="h-px bg-gray-100"></div><div><div class="flex items-center gap-1.5 mb-3">`);
        _push(ssrRenderComponent(unref(Star), { class: "w-3.5 h-3.5 text-amber-400 fill-current" }, null, _parent));
        _push(`<span class="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 font-montserrat"> Populárne produkty </span></div><div class="grid grid-cols-6 gap-2"><!--[-->`);
        ssrRenderList(__props.featuredProducts.slice(0, 6), (product) => {
          _push(`<button class="group bg-white border border-gray-100 hover:border-black hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200 text-left flex flex-col cursor-pointer" type="button"><div class="relative w-full aspect-square bg-[#f7f9fa] overflow-hidden flex-shrink-0"><img${ssrRenderAttr("src", __props.getProductImageUrl(product))}${ssrRenderAttr("alt", product.translated?.name || product.name)} class="absolute inset-0 w-full h-full object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300" loading="lazy"></div><div class="p-2 flex flex-col flex-1"><div class="h-[18px] flex items-center gap-1 mb-1 text-xs font-tech text-gray-900">`);
          if ((product.ratingAverage || 0) > 0) {
            _push(`<!--[-->`);
            _push(ssrRenderComponent(unref(Star), { class: "w-3 h-3 fill-[#ffc107] text-[#ffc107]" }, null, _parent));
            _push(`<span class="font-bold text-[10px]">${ssrInterpolate(unref(formatRating)(product.ratingAverage))}</span><span class="text-[10px] text-gray-500 ml-0.5"> (${ssrInterpolate(product.productReviewsCount || product.reviewCount || product.customFields?.mtsport_review_count || 0)}) </span><!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="font-sans text-[11px] font-medium text-gray-900 leading-tight line-clamp-2 mb-1.5 flex-1">${ssrInterpolate(product.translated?.name || product.name)}</p><span class="text-[13px] font-bold font-tech text-black leading-none">${ssrInterpolate(__props.getFormattedPrice(product.calculatedPrice?.unitPrice))}</span></div></button>`);
        });
        _push(`<!--]--></div></div><!--]-->`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/navbar/search/SearchDropdownEmpty.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SearchDropdownEmpty = Object.assign(_sfc_main, { __name: "SearchDropdownEmpty" });

export { SearchDropdownEmpty as default };
