import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { b as useLocalePath, d as useRoute, c as useRouter, g as useState, C as useSeoMeta, I as __nuxt_component_0$1, i as useRuntimeConfig, m as useI18n, u as useHead } from './server.mjs';
import { defineComponent, ref, computed, watch, nextTick, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _imports_0 } from './MTShape-DBVD8rjd.mjs';
import { Home, X } from 'lucide-vue-next';
import { s as sanitizeHtml } from './sanitize-DKvwg8Vq.mjs';
import StickyToolbar from './StickyToolbar-B4NF0glf.mjs';
import OffcanvasFilter from './OffcanvasFilter-w0NP4PVv.mjs';
import QuickViewModal from './QuickViewModal-Bss3Rog_.mjs';
import ProductCard from './ProductCard-F91lCt7x.mjs';
import { u as useCategory } from './useCategory-DZrTDjvY.mjs';
import { u as useCategoryFilters } from './useCategoryFilters-DPqBwycR.mjs';
import { u as useCategoryListing } from './useCategoryListing-BIkms3Qx.mjs';
import { u as useProductHelpers } from './useProductHelpers-Ch_jrkwO.mjs';
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
import './ProductFilters-CjCB-Ex6.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';
import './BaseButton-BJMOoNbK.mjs';
import './AddToCartButton-B8hFUbWd.mjs';
import './useUiState-BTlUPkrr.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import './format-tV37I8C6.mjs';
import './useCustomerWishlist-CccY2iyd.mjs';
import './useProductBadges-BvF7DSTC.mjs';
import './useProductComparison-BXlqQWLK.mjs';
import './useCountrySelector-Cujau6dz.mjs';

function useCategoryBreadcrumbJsonLD(breadcrumbsRef, currentNameRef, currentUrlRef, collectionRef) {
  const { t } = useI18n();
  const config = useRuntimeConfig();
  const baseUrl = config.public.siteUrl || "https://mtsport.store";
  const toAbsolute = (url) => url.startsWith("http") ? url : `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  useHead(
    computed(() => {
      const breadcrumbs = unref(breadcrumbsRef);
      const currentName = unref(currentNameRef);
      const currentUrl = unref(currentUrlRef);
      const collection = unref(collectionRef);
      if (!currentName) return {};
      const absoluteCurrent = toAbsolute(currentUrl);
      const crumbs = [
        { name: t("home"), url: baseUrl },
        ...breadcrumbs.map((b) => ({ name: b.name, url: toAbsolute(b.url) })),
        { name: currentName, url: absoluteCurrent }
      ];
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: crumb.name,
          item: crumb.url
        }))
      };
      const schemas = [breadcrumbSchema];
      if (collection) {
        const collectionSchema = {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: currentName,
          url: absoluteCurrent,
          ...collection.description && { description: collection.description }
        };
        if (collection.products?.length) {
          collectionSchema.mainEntity = {
            "@type": "ItemList",
            numberOfItems: collection.products.length,
            itemListElement: collection.products.slice(0, 20).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.name,
              url: toAbsolute(p.url),
              ...p.image && { image: p.image },
              ...p.price && {
                offers: { "@type": "Offer", price: p.price, priceCurrency: "EUR" }
              }
            }))
          };
        }
        schemas.push(collectionSchema);
      }
      return {
        script: schemas.map((s) => ({
          type: "application/ld+json",
          children: JSON.stringify(s)
        }))
      };
    })
  );
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "FrontendNavigationPage" },
  __name: "FrontendNavigationPage",
  __ssrInlineRender: true,
  props: {
    navigationId: {}
  },
  setup(__props) {
    const props = __props;
    const localePath = useLocalePath();
    const route = useRoute();
    const router = useRouter();
    ref("grid");
    const isFilterOpen = ref(false);
    const selectedProduct = ref(null);
    const runtimeConfig = useRuntimeConfig();
    const _bikeCatIds = [
      runtimeConfig.public.shopware?.ids?.categories?.bikes,
      runtimeConfig.public.shopware?.ids?.categories?.ebikes
    ].filter(Boolean);
    const mobileColumns = useState(
      "categoryMobileColumns",
      () => _bikeCatIds.includes(props.navigationId) ? 1 : 2
    );
    computed(() => `mtsport_grid_cols_${props.navigationId}`);
    watch(mobileColumns, (val) => {
    });
    ref(null);
    const isCategoryPage = useState("isPageCategory", () => false);
    useState("categoryPageCount", () => 0);
    isCategoryPage.value = true;
    const {
      categoryStatus,
      categoryName,
      categoryDescription,
      categoryImage,
      categoryMetaTitle,
      categoryMetaDescription,
      categoryKeywords,
      breadcrumbChain,
      currentCategoryUrl,
      subcategories
    } = useCategory(props.navigationId);
    useSeoMeta({
      title: () => categoryMetaTitle.value || `${categoryName.value} | SLICKLY`,
      description: () => categoryMetaDescription.value || categoryDescription.value || void 0,
      keywords: () => categoryKeywords.value || void 0,
      ogTitle: () => categoryMetaTitle.value || `${categoryName.value} | SLICKLY`,
      ogDescription: () => categoryMetaDescription.value || categoryDescription.value || void 0,
      ogImage: () => categoryImage.value || void 0
    });
    const {
      selectedBrands,
      selectedProperties,
      selectedColors,
      priceRange,
      inStockOnly,
      onDemandOnly,
      isPromotion,
      isFeatured,
      searchQuery,
      sortBy,
      riderHeight,
      selectedWheelsNorm,
      selectedForkNorm,
      selectedBrakesNorm,
      selectedGearsNorm,
      selectedMotorNorm,
      selectedBatteryNorm,
      activeFilterCount,
      clearAllFilters
    } = useCategoryFilters();
    useSeoMeta({ robots: () => activeFilterCount.value > 0 ? "noindex,follow" : "index,follow" });
    const {
      listingData,
      listingStatus,
      products,
      total,
      isLoadingMore,
      isPrefetchRunning,
      prefetchSubcategory,
      availableBrands,
      availableSizes,
      availableColors,
      availableGenders,
      availableWheelSizes,
      categoryMinPrice,
      categoryMaxPrice,
      availableWheelsNorm,
      availableForkNorm,
      availableBrakesNorm,
      availableGearsNorm,
      availableMotorNorm,
      availableBatteryNorm,
      availableColorsNorm
    } = useCategoryListing(props.navigationId, {
      sortBy,
      selectedBrands,
      selectedProperties,
      selectedColors,
      priceRange,
      inStockOnly,
      onDemandOnly,
      isPromotion,
      isFeatured,
      searchQuery,
      riderHeight,
      selectedWheelsNorm,
      selectedForkNorm,
      selectedBrakesNorm,
      selectedGearsNorm,
      selectedMotorNorm,
      selectedBatteryNorm
    });
    useCategoryBreadcrumbJsonLD(
      breadcrumbChain,
      categoryName,
      currentCategoryUrl,
      computed(
        () => categoryName.value ? {
          description: categoryDescription.value || void 0,
          products: (products.value || []).slice(0, 20).map((p) => ({
            id: p.id,
            name: p.translated?.name || p.name || "",
            url: p.seoUrls?.[0]?.seoPathInfo ? `/${p.seoUrls[0].seoPathInfo}` : `/detail/${p.id}`,
            image: p.cover?.media?.url || "",
            price: p.calculatedPrice?.unitPrice
          }))
        } : void 0
      )
    );
    const {
      navigateToProduct
    } = useProductHelpers();
    const isClient = ref(false);
    watch(availableBrands, (brands) => {
      const searchBrandParam = Array.isArray(route.query.searchBrand) ? route.query.searchBrand[0] : route.query.searchBrand;
      if (searchBrandParam && brands && brands.length > 0) {
        const queryName = searchBrandParam.toLowerCase();
        const foundBrand = brands.find(
          (b) => b.name?.toLowerCase() === queryName || b.name?.toLowerCase().includes(queryName)
        );
        if (foundBrand) {
          clearAllFilters();
          nextTick(() => {
            selectedBrands.value = [foundBrand.id];
          });
          const q = { ...route.query };
          delete q.searchBrand;
          router.replace({ query: q });
        }
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white min-h-screen animate-fade-in font-sans" }, _attrs))}><div class="relative bg-[#f4f5f6] overflow-hidden overflow-x-clip"><div class="absolute -right-20 -bottom-20 md:-right-32 md:-bottom-32 lg:-right-40 w-[300px] md:w-[600px] lg:w-[800px] aspect-square pointer-events-none z-0 overflow-hidden"><img${ssrRenderAttr("src", _imports_0)} alt="Background Shape" class="w-full h-full object-contain opacity-50"></div><div class="container mx-auto px-4 pt-6 md:pt-10 pb-8 md:pb-12 relative z-10 w-full"><nav class="flex items-center text-xs md:text-sm text-gray-600 mb-6 gap-2 whitespace-nowrap overflow-hidden text-ellipsis">`);
      if (unref(categoryStatus) !== "pending") {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)("/"),
          class: "hover:text-brand transition-colors flex items-center",
          "aria-label": "Domov"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Home), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Home), { class: "w-4 h-4" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--[-->`);
        ssrRenderList(unref(breadcrumbChain), (crumb) => {
          _push(`<!--[--><span class="text-gray-400">›</span>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: unref(localePath)(crumb.url),
            class: "hover:text-brand transition-colors truncate max-w-[100px] md:max-w-xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(crumb.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(crumb.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<!--]-->`);
        });
        _push(`<!--]--><span class="text-gray-400">›</span><span class="text-gray-800 font-medium truncate max-w-[150px] md:max-w-sm">${ssrInterpolate(unref(categoryName))}</span><!--]-->`);
      } else {
        _push(`<div class="h-4 bg-gray-200 animate-pulse w-48 rounded"></div>`);
      }
      _push(`</nav>`);
      if (unref(categoryStatus) === "pending") {
        _push(`<!--[--><div class="h-10 md:h-12 bg-gray-200 w-1/3 mb-4 rounded"></div><div class="h-4 bg-gray-200 w-2/3 mb-10 rounded"></div><!--]-->`);
      } else {
        _push(`<!--[--><h1 class="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 font-tech uppercase italic">${ssrInterpolate(unref(categoryName) || "Načítavam...")}</h1>`);
        if (unref(categoryDescription)) {
          _push(`<div class="text-sm md:text-base text-gray-700 max-w-4xl mb-10 leading-relaxed font-sans">${unref(sanitizeHtml)(unref(categoryDescription)) ?? ""}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      if (unref(subcategories) && unref(subcategories).length > 0) {
        _push(`<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1.5 md:gap-2 pb-6"><!--[-->`);
        ssrRenderList(unref(subcategories), (sub, subIdx) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: sub.id,
            to: unref(localePath)(sub.url),
            onMouseenter: ($event) => unref(prefetchSubcategory)(sub.id),
            class: "group rounded-sm border border-gray-100 hover:border-brand bg-white transition-colors duration-150 active:bg-gray-50 flex items-center gap-2.5 px-2.5 py-2 md:flex-col md:items-center md:gap-1 md:px-2 md:py-2"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="w-10 h-10 flex-shrink-0 overflow-hidden flex items-center justify-center md:w-full md:h-auto md:aspect-[2/1] md:flex-shrink md:mb-0"${_scopeId}>`);
                if (sub.image) {
                  _push2(`<img${ssrRenderAttr("src", sub.image)} alt=""${ssrRenderAttr("loading", subIdx < 4 ? "eager" : "lazy")}${ssrRenderAttr("fetchpriority", subIdx === 0 ? "high" : "auto")} class="w-full h-full object-contain mix-blend-multiply"${_scopeId}>`);
                } else {
                  _push2(`<div class="w-full h-full flex items-center justify-center bg-gray-50"${_scopeId}><span class="text-[8px] font-bold uppercase text-gray-300"${_scopeId}>N/A</span></div>`);
                }
                _push2(`</div><span class="font-bold text-[11px] text-gray-900 leading-tight group-hover:text-brand transition-colors line-clamp-2 text-left md:text-center font-tech uppercase tracking-wide"${_scopeId}>${ssrInterpolate(sub.name)}</span>`);
              } else {
                return [
                  createVNode("div", { class: "w-10 h-10 flex-shrink-0 overflow-hidden flex items-center justify-center md:w-full md:h-auto md:aspect-[2/1] md:flex-shrink md:mb-0" }, [
                    sub.image ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: sub.image,
                      alt: "",
                      loading: subIdx < 4 ? "eager" : "lazy",
                      fetchpriority: subIdx === 0 ? "high" : "auto",
                      class: "w-full h-full object-contain mix-blend-multiply"
                    }, null, 8, ["src", "loading", "fetchpriority"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "w-full h-full flex items-center justify-center bg-gray-50"
                    }, [
                      createVNode("span", { class: "text-[8px] font-bold uppercase text-gray-300" }, "N/A")
                    ]))
                  ]),
                  createVNode("span", { class: "font-bold text-[11px] text-gray-900 leading-tight group-hover:text-brand transition-colors line-clamp-2 text-left md:text-center font-tech uppercase tracking-wide" }, toDisplayString(sub.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(StickyToolbar, {
        aggregations: (unref(listingData)?.data?.aggregations || unref(listingData)?.aggregations) ?? null,
        total: unref(total),
        onToggleFilter: ($event) => isFilterOpen.value = true
      }, null, _parent));
      _push(ssrRenderComponent(OffcanvasFilter, {
        "is-open": unref(isFilterOpen),
        "navigation-id": __props.navigationId,
        "category-name": unref(categoryName),
        aggregations: (unref(listingData)?.data?.aggregations || unref(listingData)?.aggregations) ?? null,
        brands: unref(availableBrands),
        sizes: unref(availableSizes),
        genders: unref(availableGenders),
        colors: unref(availableColors),
        "wheel-sizes": unref(availableWheelSizes),
        "wheels-norm": unref(availableWheelsNorm),
        "fork-norm": unref(availableForkNorm),
        "brakes-norm": unref(availableBrakesNorm),
        "gears-norm": unref(availableGearsNorm),
        "motor-norm": unref(availableMotorNorm),
        "battery-norm": unref(availableBatteryNorm),
        "colors-norm": unref(availableColorsNorm),
        "min-price": unref(categoryMinPrice),
        "max-price": unref(categoryMaxPrice),
        onClose: ($event) => isFilterOpen.value = false
      }, null, _parent));
      _push(`<div class="container mx-auto px-0 md:px-4 py-4 md:py-8"><main>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      if (unref(listingStatus) === "pending" && unref(products).length === 0) {
        _push(`<div class="${ssrRenderClass(unref(mobileColumns) === 1 ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 md:gap-4 bg-white md:bg-transparent" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-8 md:gap-4 bg-white md:bg-transparent")}"><!--[-->`);
        ssrRenderList(8, (i) => {
          _push(`<div class="group bg-white overflow-hidden flex flex-col relative md:border md:border-gray-100 p-2 md:p-4"><div class="relative w-full aspect-square bg-gray-100 animate-pulse mb-4"></div><div class="h-4 bg-gray-200 animate-pulse w-1/4 mb-2"></div><div class="h-3 bg-gray-200 animate-pulse w-3/4 mb-1"></div><div class="h-3 bg-gray-200 animate-pulse w-1/2"></div><div class="mt-auto pt-4 flex items-end"><div class="h-4 bg-gray-200 animate-pulse w-16"></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(products).length > 0) {
        _push(`<div class="${ssrRenderClass([
          unref(mobileColumns) === 1 ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 md:gap-4 bg-white md:bg-transparent" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-8 md:gap-4 bg-white md:bg-transparent",
          "transition-opacity duration-300",
          unref(isClient) && unref(listingStatus) === "pending" ? "opacity-50 pointer-events-none" : ""
        ])}"><!--[-->`);
        ssrRenderList(unref(products), (product) => {
          _push(ssrRenderComponent(ProductCard, {
            key: product.id,
            product
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else if (unref(listingStatus) !== "pending") {
        _push(`<div class="text-center py-32 bg-gray-50"><p class="text-2xl font-bold text-gray-400 font-tech uppercase mb-2">Nenašli sa žiadne produkty</p><p class="text-gray-500 mb-8 font-sans">Skúste zmeniť nastavenia filtrov alebo hľadajte niečo iné.</p>`);
        if (unref(activeFilterCount) > 0) {
          _push(`<button class="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors">`);
          _push(ssrRenderComponent(unref(X), {
            class: "w-3.5 h-3.5",
            "aria-hidden": "true"
          }, null, _parent));
          _push(` Vymazať všetky filtre </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isLoadingMore)) {
        _push(`<div class="${ssrRenderClass(unref(mobileColumns) === 1 ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 md:gap-4 bg-white md:bg-transparent mt-1" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-8 md:gap-4 bg-white md:bg-transparent mt-1")}" aria-label="Načítavam ďalšie produkty"><!--[-->`);
        ssrRenderList(8, (i) => {
          _push(`<div class="bg-white border-0 md:border md:border-gray-100 flex flex-col"><div class="relative w-full aspect-square bg-gray-100 animate-pulse"></div><div class="p-2 md:p-4 flex flex-col gap-2 min-h-[120px]"><div class="h-3 bg-gray-100 animate-pulse w-1/3 rounded"></div><div class="h-3 bg-gray-200 animate-pulse w-full rounded"></div><div class="h-3 bg-gray-200 animate-pulse w-3/4 rounded"></div><div class="mt-auto h-5 bg-gray-200 animate-pulse w-1/2 rounded"></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(products).length < unref(total) && !unref(isLoadingMore)) {
        _push(`<div class="h-1 w-full mt-4" aria-hidden="true"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(products).length < unref(total) && !unref(isLoadingMore)) {
        _push(`<div class="mt-8 md:mt-12 text-center pb-8"><p class="text-gray-400 text-[10px] md:text-xs mb-4 font-bold uppercase tracking-widest font-sans"> Zobrazených ${ssrInterpolate(unref(products).length)} z ${ssrInterpolate(unref(total))} produktov </p><div class="w-48 md:w-64 h-1 bg-gray-100 mx-auto mb-6 md:mb-8 rounded-full overflow-hidden"><div class="h-full bg-brand transition-all duration-700" style="${ssrRenderStyle({ width: `${unref(products).length / unref(total) * 100}%` })}"></div></div><button${ssrIncludeBooleanAttr(unref(isLoadingMore)) ? " disabled" : ""} class="relative bg-black text-white hover:bg-gray-800 px-6 py-3 md:px-10 md:py-4 uppercase tracking-widest text-xs md:text-sm font-bold min-w-[200px] md:min-w-[240px] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed rounded-default" aria-label="Načítať viac produktov"><span class="flex items-center justify-center gap-2">`);
        if (unref(isPrefetchRunning)) {
          _push(`<span class="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" title="Produkty sa načítavajú na pozadí"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` Načítať ďalšie produkty </span></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main></div>`);
      _push(ssrRenderComponent(QuickViewModal, {
        "is-open": !!unref(selectedProduct),
        product: unref(selectedProduct),
        onClose: ($event) => selectedProduct.value = null,
        onViewDetails: ($event) => unref(selectedProduct) && unref(navigateToProduct)(unref(selectedProduct))
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/frontend/navigation/FrontendNavigationPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FrontendNavigationPage = Object.assign(_sfc_main, { __name: "FrontendNavigationPage" });

export { FrontendNavigationPage as default };
