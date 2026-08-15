import { defineComponent, ref, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import ProductCard from './ProductCard-F91lCt7x.mjs';
import BackendErrorState from './BackendErrorState-P5VtA7Me.mjs';
import { _ as _export_sfc, e as useShopwareContext, h as useAsyncData, i as useRuntimeConfig } from './server.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';
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
  __name: "RecommendedProducts",
  __ssrInlineRender: true,
  setup(__props) {
    const { apiClient } = useShopwareContext();
    const { currentLanguageId } = useShopwareLanguage();
    const config = useRuntimeConfig();
    const TABS = [
      { label: "Bicykle", id: config.public.shopware.ids.categories.bikes },
      { label: "E-Bike", id: config.public.shopware.ids.categories.ebikes },
      { label: "Doplnky", id: config.public.shopware.ids.categories.doplnky }
    ];
    const activeTab = ref(0);
    ref(null);
    const { data: products, pending, refresh } = useAsyncData(
      `bestsellery-${currentLanguageId.value}-${activeTab.value}`,
      async () => {
        const catId = TABS[activeTab.value].id;
        if (!catId) return [];
        try {
          const res = await apiClient.invoke(
            "readProductListing post /product-listing/{categoryId}",
            {
              headers: { "sw-language-id": currentLanguageId.value },
              pathParams: { categoryId: catId },
              body: {
                limit: 16,
                filter: [{ type: "equals", field: "parentId", value: null }],
                sort: [{ field: "sales", order: "DESC" }],
                associations: {
                  cover: { associations: { media: {} } },
                  manufacturer: {},
                  options: { associations: { group: {} } },
                  seoUrls: {},
                  children: {
                    associations: { options: { associations: { group: {} } } }
                  }
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
                    "availableStock",
                    "isCloseout"
                  ],
                  product_media: ["media"],
                  media: ["url", "thumbnails"],
                  media_thumbnail: ["url", "width"],
                  product_manufacturer: ["id", "name", "translated"],
                  property_group_option: ["id", "name", "translated", "group"],
                  property_group: ["id", "name", "translated"],
                  seo_url: ["seoPathInfo", "isCanonical"]
                }
              }
            }
          );
          return res.data?.elements || [];
        } catch (e) {
          throw e;
        }
      },
      { watch: [currentLanguageId, activeTab] }
    );
    const scrollProgress = ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      if (!unref(products) && !unref(pending)) {
        _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-12 bg-gray-50 border-b border-gray-100" }, _attrs))} data-v-ca480e1f><div class="container mx-auto px-4 lg:px-8" data-v-ca480e1f>`);
        _push(ssrRenderComponent(BackendErrorState, {
          title: "BESTSELLERY DOČASNE NEDOSTUPNÉ",
          onRetry: unref(refresh)
        }, null, _parent));
        _push(`</div></section>`);
      } else {
        _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-24 bg-gray-50 border-b border-gray-100 overflow-hidden" }, _attrs))} data-v-ca480e1f><div class="container mx-auto px-4 lg:px-8" data-v-ca480e1f><div class="flex flex-col lg:flex-row justify-between items-end mb-10 gap-6" data-v-ca480e1f><div class="text-left w-full lg:w-auto" data-v-ca480e1f><h2 class="section-h2 mb-4" data-v-ca480e1f> Bestsellery <span class="text-brand" data-v-ca480e1f>sezóny</span></h2><div class="section-decorator mb-6" data-v-ca480e1f></div><p class="text-gray-500 font-medium font-sans max-w-xl" data-v-ca480e1f> Najpredávanejšie produkty, ktoré si zákazníci obľúbili najviac. </p></div><div class="hidden lg:flex gap-3 pb-1" data-v-ca480e1f><button class="btn-nav-arrow" aria-label="Posunúť doľava" data-v-ca480e1f>`);
        _push(ssrRenderComponent(unref(ChevronLeft), {
          class: "w-6 h-6",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button><button class="btn-nav-arrow" aria-label="Posunúť doprava" data-v-ca480e1f>`);
        _push(ssrRenderComponent(unref(ChevronRight), {
          class: "w-6 h-6",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button></div></div><div class="flex flex-wrap justify-center lg:justify-start gap-3 mb-10" data-v-ca480e1f><!--[-->`);
        ssrRenderList(TABS, (tab, idx) => {
          _push(`<button class="${ssrRenderClass(unref(activeTab) === idx ? "btn-tab-active" : "btn-tab-inactive")}" data-v-ca480e1f>${ssrInterpolate(tab.label)}</button>`);
        });
        _push(`<!--]--></div><div class="flex gap-1 overflow-x-auto pb-28 -mx-4 px-4 md:px-0 scroll-smooth snap-x snap-mandatory hide-scrollbar" data-v-ca480e1f>`);
        if (unref(pending) && (!unref(products) || unref(products).length === 0)) {
          _push(`<!--[-->`);
          ssrRenderList(4, (i) => {
            _push(`<div class="min-w-[280px] sm:min-w-[300px] lg:min-w-[320px] snap-center bg-white border border-gray-100" data-v-ca480e1f><div class="aspect-square bg-gray-100 animate-pulse" data-v-ca480e1f></div><div class="p-4 space-y-2" data-v-ca480e1f><div class="h-3 bg-gray-200 animate-pulse w-1/3" data-v-ca480e1f></div><div class="h-4 bg-gray-200 animate-pulse w-3/4" data-v-ca480e1f></div><div class="h-4 bg-gray-200 animate-pulse w-1/2" data-v-ca480e1f></div></div></div>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!--[-->`);
          ssrRenderList(unref(products), (product) => {
            _push(ssrRenderComponent(ProductCard, {
              key: product.id,
              product,
              class: "min-w-[280px] sm:min-w-[300px] lg:min-w-[320px] snap-center"
            }, null, _parent));
          });
          _push(`<!--]-->`);
        }
        _push(`</div><div class="flex lg:hidden justify-center mt-4" data-v-ca480e1f><div class="h-1 w-24 bg-gray-200 rounded-full overflow-hidden" data-v-ca480e1f><div class="h-full bg-brand rounded-full transition-all duration-200" style="${ssrRenderStyle(`width: ${unref(scrollProgress) * 100}%`)}" data-v-ca480e1f></div></div></div></div></section>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/RecommendedProducts.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RecommendedProducts = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-ca480e1f"]]), { __name: "RecommendedProducts" });

export { RecommendedProducts as default };
