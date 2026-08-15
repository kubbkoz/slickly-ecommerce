import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, withAsyncContext, computed, ref, unref, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-vue-next';
import { s as sanitizeHtml } from './sanitize-DKvwg8Vq.mjs';
import ProductCard from './ProductCard-F91lCt7x.mjs';
import BackendErrorState from './BackendErrorState-P5VtA7Me.mjs';
import { _ as _export_sfc, e as useShopwareContext, b as useLocalePath, h as useAsyncData, i as useRuntimeConfig } from './server.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';
import { u as useStaticTranslations } from './useStaticTranslations-DjO9xa-s.mjs';
import { p as proxyMediaUrl } from './media-BNPyNy3v.mjs';
import { u as useScrollReveal } from './useScrollReveal-hir-7v74.mjs';
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
  __name: "FeaturedCollection",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { apiClient } = useShopwareContext();
    const { currentLanguageId } = useShopwareLanguage();
    const localePath = useLocalePath();
    const { t } = useStaticTranslations();
    const config = useRuntimeConfig();
    const CATEGORY_ID = config.public.shopware.ids.categories.featured;
    const { data: collectionData, pending, refresh } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      `featured-collection-${currentLanguageId.value}`,
      async () => {
        try {
          const catRes = await apiClient.invoke("readCategory post /category/{categoryId}", {
            headers: { "sw-language-id": currentLanguageId.value },
            pathParams: { categoryId: CATEGORY_ID },
            body: {
              associations: {
                media: {}
              }
            }
          });
          const cat = catRes.data;
          const customFields = cat?.translated?.customFields || cat?.customFields || {};
          const prodRes = await apiClient.invoke("readProductListing post /product-listing/{categoryId}", {
            headers: { "sw-language-id": currentLanguageId.value },
            pathParams: { categoryId: CATEGORY_ID },
            body: {
              limit: 4,
              sort: [
                {
                  field: "releaseDate",
                  order: "desc"
                }
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
                // ProductCard ich nerenderuje (rating je skalár `ratingAverage`/
                // `productReviewsCount`, varianty čerpá z `children`).
              }
            }
          });
          const heroData = {
            title: cat?.translated?.name || cat?.name || "",
            description: cat?.translated?.description || cat?.description || "",
            image: proxyMediaUrl(cat?.media?.url || ""),
            badge: customFields.custom_hero_badge_text || "",
            buttonText: customFields.custom_hero_secondary_cta_label || customFields.custom_hero_cta_label || t("objavit_kolekciu") || "Objaviť kolekciu",
            buttonLink: customFields.custom_hero_secondary_cta_link || customFields.custom_hero_cta_url || "#"
          };
          const products2 = prodRes.data?.elements || [];
          return { heroData, products: products2 };
        } catch (e) {
          throw e;
        }
      },
      { watch: [currentLanguageId] }
    )), __temp = await __temp, __restore(), __temp);
    const hero = computed(() => collectionData.value?.heroData);
    const products = computed(() => collectionData.value?.products || []);
    const { target, isVisible } = useScrollReveal();
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      if (!unref(collectionData) && !unref(pending)) {
        _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-16 bg-white" }, _attrs))} data-v-dc333a6d><div class="container mx-auto px-4 lg:px-8" data-v-dc333a6d>`);
        _push(ssrRenderComponent(BackendErrorState, {
          title: "KOLEKCIA NEDOSTUPNÁ",
          onRetry: unref(refresh)
        }, null, _parent));
        _push(`</div></section>`);
      } else if (unref(hero) || unref(pending)) {
        _push(`<section${ssrRenderAttrs(mergeProps({
          ref_key: "target",
          ref: target,
          class: "py-20 md:py-28 bg-white border-b border-gray-100"
        }, _attrs))} data-v-dc333a6d><div class="container mx-auto px-4 lg:px-8" data-v-dc333a6d><div class="${ssrRenderClass([unref(isVisible) ? "reveal-visible" : "reveal", "reveal-base flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10"])}" data-v-dc333a6d><div data-v-dc333a6d><span class="section-eyebrow" data-v-dc333a6d>Výber redakcie</span><h2 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase font-tech tracking-tight leading-[0.95]" data-v-dc333a6d> Vybrané <span class="text-brand" data-v-dc333a6d>produkty</span></h2></div><div class="hidden lg:flex gap-3" data-v-dc333a6d><button class="btn-nav-arrow" aria-label="Posunúť doľava" data-v-dc333a6d>`);
        _push(ssrRenderComponent(unref(ChevronLeft), {
          class: "w-6 h-6",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button><button class="btn-nav-arrow" aria-label="Posunúť doprava" data-v-dc333a6d>`);
        _push(ssrRenderComponent(unref(ChevronRight), {
          class: "w-6 h-6",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button></div></div><div class="relative group overflow-hidden w-full aspect-[21/9] md:aspect-[3/1] mb-8 rounded-default" data-v-dc333a6d>`);
        if (unref(hero)?.image) {
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: unref(hero).image,
            alt: unref(hero).title || "Featured Collection",
            width: "1600",
            height: "600",
            sizes: "100vw",
            quality: "78",
            loading: "lazy",
            class: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" data-v-dc333a6d></div><div class="absolute bottom-0 left-0 p-6 sm:p-8 md:p-12 w-full" data-v-dc333a6d>`);
        if (unref(hero)?.badge) {
          _push(`<div class="inline-block bg-amber rounded-sm px-3 py-1 md:px-4 md:py-1.5 mb-3 md:mb-4" data-v-dc333a6d><span class="block text-black text-[10px] md:text-xs font-bold uppercase tracking-widest font-tech" data-v-dc333a6d>${ssrInterpolate(unref(hero).badge)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<h3 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase font-tech leading-[0.95] mb-3 md:mb-4 whitespace-pre-line text-shadow-lg" data-v-dc333a6d>${ssrInterpolate(unref(hero)?.title)}</h3>`);
        if (unref(hero)?.description) {
          _push(`<div class="text-gray-100 font-sans mb-6 md:mb-8 max-w-md line-clamp-2 prose prose-invert prose-sm drop-shadow-md" data-v-dc333a6d>${unref(sanitizeHtml)(unref(hero).description) ?? ""}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(hero)?.buttonText) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: unref(localePath)(unref(hero).buttonLink || "#"),
            class: "btn-cta-motion w-full sm:w-auto"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(hero).buttonText)} `);
                _push2(ssrRenderComponent(unref(ArrowRight), { class: "w-5 h-5" }, null, _parent2, _scopeId));
              } else {
                return [
                  createTextVNode(toDisplayString(unref(hero).buttonText) + " ", 1),
                  createVNode(unref(ArrowRight), { class: "w-5 h-5" })
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:px-0 scroll-smooth snap-x snap-mandatory hide-scrollbar" data-v-dc333a6d>`);
        if (unref(pending) && unref(products).length === 0) {
          _push(`<!--[-->`);
          ssrRenderList(4, (i) => {
            _push(`<div class="min-w-[240px] sm:min-w-[280px] card-surface overflow-hidden flex flex-col relative p-4 flex-shrink-0 snap-center" data-v-dc333a6d><div class="relative w-full aspect-square bg-gray-100 animate-pulse mb-4 rounded-default" data-v-dc333a6d></div><div class="h-4 bg-gray-200 animate-pulse w-1/4 mb-2" data-v-dc333a6d></div><div class="h-3 bg-gray-200 animate-pulse w-3/4 mb-1" data-v-dc333a6d></div><div class="h-3 bg-gray-200 animate-pulse w-1/2" data-v-dc333a6d></div></div>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!--[-->`);
          ssrRenderList(unref(products), (product) => {
            _push(ssrRenderComponent(ProductCard, {
              key: product.id,
              product,
              class: "min-w-[240px] sm:min-w-[280px] flex-shrink-0 snap-center"
            }, null, _parent));
          });
          _push(`<!--]-->`);
        }
        if (unref(products).length === 0 && !unref(pending)) {
          _push(`<div class="min-w-full bg-gray-100/50 border border-dashed border-gray-200 flex items-center justify-center p-6 text-gray-400 italic text-[10px] uppercase font-bold tracking-widest text-center min-h-[200px] rounded-default" data-v-dc333a6d> Doplňte produkt v admine </div>`);
        } else {
          _push(`<!---->`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/FeaturedCollection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FeaturedCollection = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-dc333a6d"]]), { __name: "FeaturedCollection" });

export { FeaturedCollection as default };
