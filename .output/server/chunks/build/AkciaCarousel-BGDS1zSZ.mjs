import { defineComponent, ref, withAsyncContext, computed, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { s as sanitizeHtml } from './sanitize-DKvwg8Vq.mjs';
import ProductCard from './ProductCard-F91lCt7x.mjs';
import BackendErrorState from './BackendErrorState-P5VtA7Me.mjs';
import { _ as _export_sfc, b as useLocalePath, e as useShopwareContext, h as useAsyncData, i as useRuntimeConfig } from './server.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';
import { u as useScrollReveal } from './useScrollReveal-hir-7v74.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
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
import '@shopware/helpers';
import './useProductHelpers-Ch_jrkwO.mjs';
import './format-tV37I8C6.mjs';
import './AddToCartButton-B8hFUbWd.mjs';
import './BaseButton-BJMOoNbK.mjs';
import './nuxt-link-B7B0pxEe.mjs';
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
import './useUiState-BTlUPkrr.mjs';
import './useCustomerWishlist-CccY2iyd.mjs';
import './useProductBadges-BvF7DSTC.mjs';
import './useProductComparison-BXlqQWLK.mjs';
import './useCountrySelector-Cujau6dz.mjs';
import './MTShape-DBVD8rjd.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AkciaCarousel",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = useRuntimeConfig();
    const SUPER_PONUKA_CATEGORY_ID = config.public.shopware.ids.categories.flashSales;
    ref(null);
    ref(false);
    useLocalePath();
    const { apiClient } = useShopwareContext();
    const { currentLanguageId } = useShopwareLanguage();
    const { data, pending, refresh } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      `super-ponuka-${currentLanguageId.value}`,
      async () => {
        let sectionTitle2 = "";
        let sectionSubtitle2 = "";
        try {
          const catRes = await apiClient.invoke("readCategoryList post /category", {
            headers: { "sw-language-id": currentLanguageId.value },
            body: {
              filter: [{ type: "equals", field: "id", value: SUPER_PONUKA_CATEGORY_ID }],
              limit: 1
            }
          });
          const cat = catRes.data?.elements?.[0];
          sectionTitle2 = cat?.translated?.name || cat?.name || "";
          sectionSubtitle2 = cat?.translated?.description || cat?.description || "";
        } catch {
        }
        let products2 = [];
        try {
          const res = await apiClient.invoke(
            `readProductListing post /product-listing/{categoryId}`,
            {
              pathParams: { categoryId: SUPER_PONUKA_CATEGORY_ID },
              body: {
                // PERF: karusel — 12 stačí (predtým 24). Menší inline SSR payload.
                limit: 12,
                associations: {
                  cover: { associations: { media: {} } },
                  // PERF: ProductCard číta len manufacturer.translated.name → media netreba.
                  manufacturer: {},
                  options: { associations: { group: {} } },
                  media: { associations: { media: {} } },
                  seoUrls: {},
                  children: {
                    associations: {
                      options: { associations: { group: {} } },
                      properties: { associations: { group: {} } }
                    }
                  }
                  // PERF: `productReviews` odstránené — karta číta len skalár
                  // `productReviewsCount`/`ratingAverage`, nie samotné recenzie.
                },
                includes: {
                  product: [
                    "id",
                    "name",
                    "description",
                    "translated",
                    "cover",
                    "manufacturer",
                    "options",
                    "seoUrls",
                    "calculatedPrice",
                    "childCount",
                    "children",
                    "media",
                    "ratingAverage",
                    "productReviewsCount",
                    "reviewCount",
                    "customFields",
                    "availableStock",
                    "isCloseout",
                    "categoryTree",
                    "categoryIds"
                  ],
                  product_media: ["media"],
                  media: ["url", "thumbnails", "fileName", "mimeType"],
                  media_thumbnail: ["url", "width"],
                  product_manufacturer: ["id", "name", "translated"],
                  property_group_option: ["id", "name", "translated", "group"],
                  property_group: ["id", "name", "translated"],
                  seo_url: ["seoPathInfo", "isCanonical"]
                }
              }
            }
          );
          products2 = res.data?.elements || [];
        } catch (e) {
          throw e;
        }
        return { sectionTitle: sectionTitle2, sectionSubtitle: sectionSubtitle2, products: products2 };
      },
      { watch: [currentLanguageId] }
    )), __temp = await __temp, __restore(), __temp);
    const sectionTitle = computed(() => data.value?.sectionTitle || "");
    const sectionSubtitle = computed(() => data.value?.sectionSubtitle || "");
    const products = computed(() => data.value?.products || []);
    const { target, isVisible } = useScrollReveal();
    return (_ctx, _push, _parent, _attrs) => {
      if (!unref(data) && !unref(pending)) {
        _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-12 bg-gray-50 border-b border-gray-100" }, _attrs))} data-v-631befdd><div class="container mx-auto px-4 lg:px-8" data-v-631befdd>`);
        _push(ssrRenderComponent(BackendErrorState, {
          title: "AKCIA DOČASNE NEDOSTUPNÁ",
          onRetry: unref(refresh)
        }, null, _parent));
        _push(`</div></section>`);
      } else if (unref(products).length || unref(pending)) {
        _push(`<section${ssrRenderAttrs(mergeProps({
          ref_key: "target",
          ref: target,
          class: "py-20 md:py-24 bg-white border-b border-gray-100"
        }, _attrs))} data-v-631befdd><div class="container mx-auto px-4 lg:px-8" data-v-631befdd><div class="${ssrRenderClass([unref(isVisible) ? "reveal-visible" : "reveal", "reveal-base flex flex-col lg:flex-row justify-between items-end mb-10 gap-6"])}" data-v-631befdd><div class="text-left w-full lg:w-auto" data-v-631befdd><h2 class="section-h2 mb-4" data-v-631befdd>`);
        if (unref(sectionTitle)) {
          _push(`<!--[-->${ssrInterpolate(unref(sectionTitle).split(" ").slice(0, -1).join(" "))} <span class="text-brand" data-v-631befdd>${ssrInterpolate(unref(sectionTitle).split(" ").at(-1))}</span><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</h2><div class="section-decorator mb-6" data-v-631befdd></div>`);
        if (unref(sectionSubtitle)) {
          _push(`<div class="text-gray-600 text-sm md:text-base lg:text-lg max-w-3xl font-normal leading-relaxed font-sans" data-v-631befdd>${unref(sanitizeHtml)(unref(sectionSubtitle)) ?? ""}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="hidden lg:flex gap-3 pb-1" data-v-631befdd><button class="btn-nav-arrow" aria-label="Posunúť doľava" data-v-631befdd>`);
        _push(ssrRenderComponent(unref(ChevronLeft), {
          class: "w-6 h-6",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button><button class="btn-nav-arrow" aria-label="Posunúť doprava" data-v-631befdd>`);
        _push(ssrRenderComponent(unref(ChevronRight), {
          class: "w-6 h-6",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button></div></div><div class="flex gap-4 overflow-x-auto pb-16 -mx-4 px-4 md:px-0 scroll-smooth snap-x snap-mandatory hide-scrollbar" data-v-631befdd>`);
        if (unref(pending) && unref(products).length === 0) {
          _push(`<!--[-->`);
          ssrRenderList(6, (i) => {
            _push(`<div class="min-w-[280px] sm:min-w-[300px] lg:min-w-[320px] card-surface flex-shrink-0 snap-center overflow-hidden" data-v-631befdd><div class="aspect-square bg-gray-100 animate-pulse" data-v-631befdd></div><div class="p-4 space-y-2" data-v-631befdd><div class="h-3 bg-gray-200 animate-pulse w-1/3 rounded-default" data-v-631befdd></div><div class="h-3 bg-gray-200 animate-pulse w-3/4 rounded-default" data-v-631befdd></div><div class="h-5 bg-gray-200 animate-pulse w-2/5 mt-2 rounded-default" data-v-631befdd></div></div></div>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!--[-->`);
          ssrRenderList(unref(products), (product) => {
            _push(ssrRenderComponent(ProductCard, {
              key: product.id,
              product,
              class: "min-w-[280px] sm:min-w-[300px] lg:min-w-[320px] snap-center animate-fade-in"
            }, null, _parent));
          });
          _push(`<!--]-->`);
        }
        _push(`</div></div></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/AkciaCarousel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AkciaCarousel = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-631befdd"]]), { __name: "AkciaCarousel" });

export { AkciaCarousel as default };
