import { defineComponent, ref, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import QuickViewModal from './QuickViewModal-Bss3Rog_.mjs';
import ProductCard from './ProductCard-F91lCt7x.mjs';
import { _ as _export_sfc, e as useShopwareContext, b as useLocalePath, h as useAsyncData, n as navigateTo } from './server.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';
import { u as useScrollReveal } from './useScrollReveal-hir-7v74.mjs';
import './BaseButton-BJMOoNbK.mjs';
import './nuxt-link-B7B0pxEe.mjs';
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
import './AddToCartButton-B8hFUbWd.mjs';
import './useUiState-BTlUPkrr.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import './useProductHelpers-Ch_jrkwO.mjs';
import './format-tV37I8C6.mjs';
import './useCustomerWishlist-CccY2iyd.mjs';
import './useProductBadges-BvF7DSTC.mjs';
import './useProductComparison-BXlqQWLK.mjs';
import './useCountrySelector-Cujau6dz.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "NewProducts",
  __ssrInlineRender: true,
  props: {
    products: {}
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const { apiClient } = useShopwareContext();
    const { currentLanguageId } = useShopwareLanguage();
    const localePath = useLocalePath();
    const selectedProduct = ref(null);
    const { data: fetchedProducts, pending } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      `new-products-${currentLanguageId.value}`,
      async () => {
        try {
          const res = await apiClient.invoke("readProductList post /product", {
            headers: { "sw-language-id": currentLanguageId.value },
            body: {
              limit: 8,
              sort: [
                { field: "createdAt", order: "desc" }
              ],
              filter: [
                { type: "equals", field: "parentId", value: null }
              ],
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
                // PERF: `configuratorSettings` a `productReviews` odstránené —
                // ProductCard ich nerenderuje (rating je skalár, varianty z `children`).
              },
              // FIX-API: Restrict payload to avoid large JSON response
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
                  "availableStock",
                  "isCloseout",
                  "createdAt",
                  "tagIds",
                  "categoryTree",
                  "manufacturerId"
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
          });
          return res.data?.elements || [];
        } catch (e) {
          return [];
        }
      },
      { watch: [currentLanguageId] }
    )), __temp = await __temp, __restore(), __temp);
    const displayProducts = computed(
      () => props.products && props.products.length > 0 ? props.products : fetchedProducts.value || []
    );
    const handleViewDetails = (product) => {
      if (product.url) navigateTo(localePath(product.url));
    };
    const { target, isVisible } = useScrollReveal();
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref_key: "target",
        ref: target,
        class: "py-24 bg-white"
      }, _attrs))} data-v-98d95d9c><div class="container mx-auto px-4 lg:px-8" data-v-98d95d9c><div class="${ssrRenderClass([unref(isVisible) ? "reveal-visible" : "reveal", "reveal-base flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10"])}" data-v-98d95d9c><div data-v-98d95d9c><span class="section-eyebrow" data-v-98d95d9c>Práve pridané</span><h2 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase font-tech tracking-tight leading-[0.95]" data-v-98d95d9c> Novinky v <span class="text-brand" data-v-98d95d9c>ponuke</span></h2></div><div class="hidden lg:flex gap-3" data-v-98d95d9c><button class="btn-nav-arrow" aria-label="Posunúť doľava" data-v-98d95d9c>`);
      _push(ssrRenderComponent(unref(ChevronLeft), {
        class: "w-6 h-6",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</button><button class="btn-nav-arrow" aria-label="Posunúť doprava" data-v-98d95d9c>`);
      _push(ssrRenderComponent(unref(ChevronRight), {
        class: "w-6 h-6",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</button></div></div><div class="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:px-0 scroll-smooth snap-x snap-mandatory hide-scrollbar" data-v-98d95d9c>`);
      if (unref(pending) && unref(displayProducts).length === 0) {
        _push(`<!--[-->`);
        ssrRenderList(8, (i) => {
          _push(`<div class="min-w-[240px] sm:min-w-[280px] card-surface overflow-hidden flex-shrink-0 snap-center" data-v-98d95d9c><div class="aspect-square bg-gray-100 animate-pulse" data-v-98d95d9c></div><div class="p-3 md:p-4 space-y-2" data-v-98d95d9c><div class="h-3 bg-gray-200 animate-pulse w-1/3 rounded-default" data-v-98d95d9c></div><div class="h-3 bg-gray-200 animate-pulse w-3/4 rounded-default" data-v-98d95d9c></div><div class="h-3 bg-gray-200 animate-pulse w-1/2 rounded-default" data-v-98d95d9c></div><div class="h-5 bg-gray-200 animate-pulse w-2/5 mt-3 rounded-default" data-v-98d95d9c></div></div></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(displayProducts), (product) => {
          _push(ssrRenderComponent(ProductCard, {
            key: product.id,
            product,
            class: "min-w-[240px] sm:min-w-[280px] flex-shrink-0 snap-center"
          }, null, _parent));
        });
        _push(`<!--]-->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(QuickViewModal, {
        "is-open": !!unref(selectedProduct),
        product: unref(selectedProduct),
        onClose: ($event) => selectedProduct.value = null,
        onViewDetails: ($event) => handleViewDetails(unref(selectedProduct))
      }, null, _parent));
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/NewProducts.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const NewProducts = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-98d95d9c"]]), { __name: "NewProducts" });

export { NewProducts as default };
