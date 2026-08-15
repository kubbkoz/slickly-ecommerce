import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, computed, withAsyncContext, ref, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { ArrowLeft, Building2 } from 'lucide-vue-next';
import ProductCard from './ProductCard-F91lCt7x.mjs';
import ManufacturerInfo from './ManufacturerInfo-CWjTobFI.mjs';
import { d as useRoute, b as useLocalePath, e as useShopwareContext, h as useAsyncData, Q as createError, C as useSeoMeta, i as useRuntimeConfig } from './server.mjs';
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
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
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
import './sanitize-DKvwg8Vq.mjs';

const PAGE_SIZE = 24;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const config = useRuntimeConfig();
    const localePath = useLocalePath();
    const { apiClient } = useShopwareContext();
    const { currentLanguageId } = useShopwareLanguage();
    const slug = computed(() => String(route.params.slug || ""));
    const ROOT_CATEGORY_ID = config.public.shopware.ids.rootCategory;
    const { data: manufacturer } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      () => `brand-meta-${slug.value}`,
      async () => {
        const list = await $fetch("/api/manufacturers");
        return (list || []).find((m) => m.slug === slug.value) || null;
      },
      { watch: [slug] }
    )), __temp = await __temp, __restore(), __temp);
    if (!manufacturer.value) {
      throw createError({ statusCode: 404, message: `Značka nenájdená: ${slug.value}`, fatal: true });
    }
    const SORT_OPTIONS = [
      { value: "name-asc", label: "Názov A–Z" },
      { value: "name-desc", label: "Názov Z–A" },
      { value: "price-asc", label: "Najlacnejšie" },
      { value: "price-desc", label: "Najdrahšie" }
    ];
    const sortBy = ref("name-asc");
    const buildBody = (p) => ({
      limit: PAGE_SIZE,
      p,
      order: sortBy.value,
      manufacturer: manufacturer.value.id,
      associations: {
        cover: { associations: { media: {} } },
        manufacturer: { associations: { media: {} } },
        options: { associations: { group: {} } },
        media: { associations: { media: {} } },
        seoUrls: {},
        children: {
          associations: {
            options: { associations: { group: {} } },
            properties: { associations: { group: {} } }
          }
        },
        productReviews: {}
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
          "categoryIds",
          "createdAt",
          "tagIds",
          "manufacturerId"
        ],
        product_media: ["media"],
        media: ["url", "thumbnails", "fileName", "mimeType"],
        media_thumbnail: ["url", "width"],
        // Rozšírené pre ManufacturerInfo panel — description + custom fields (rovnaké ako PDP DistributorTab)
        product_manufacturer: ["id", "name", "translated", "link", "description", "customFields", "media"],
        property_group_option: ["id", "name", "translated", "group"],
        property_group: ["id", "name", "translated"],
        seo_url: ["seoPathInfo", "isCanonical"]
      }
    });
    const fetchPage = async (p) => {
      const res = await apiClient.invoke(
        "readProductListing post /product-listing/{categoryId}",
        {
          pathParams: { categoryId: ROOT_CATEGORY_ID },
          headers: { "sw-language-id": currentLanguageId.value },
          body: buildBody(p)
        }
      );
      return {
        elements: res.data?.elements || [],
        total: res.data?.total ?? 0
      };
    };
    const { data, pending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      () => `brand-products-${slug.value}-${sortBy.value}`,
      () => fetchPage(1),
      { watch: [sortBy, slug] }
    )), __temp = await __temp, __restore(), __temp);
    const extraPages = ref([]);
    const page = ref(1);
    const loadingMore = ref(false);
    watch([sortBy, slug], () => {
      extraPages.value = [];
      page.value = 1;
    });
    const products = computed(() => [...data.value?.elements || [], ...extraPages.value]);
    const total = computed(() => data.value?.total ?? 0);
    const panelManufacturer = computed(() => {
      const full = products.value[0]?.manufacturer;
      if (full) return full;
      const b = manufacturer.value;
      return b ? { name: b.name, media: { url: b.logoUrl }, link: b.link } : null;
    });
    useSeoMeta({
      title: () => `${manufacturer.value?.name} — všetky produkty`,
      description: () => `Všetky produkty značky ${manufacturer.value?.name} v ponuke SLICKLY.`
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white min-h-screen" }, _attrs))}><div class="container mx-auto px-4 lg:px-8 py-12 md:py-16"><div class="mb-10 md:mb-12">`);
      _push(ssrRenderComponent(ManufacturerInfo, {
        manufacturer: unref(panelManufacturer),
        heading: "",
        "products-link": null
      }, null, _parent));
      _push(`</div><div class="flex items-center justify-between gap-4 mb-6 border-t border-gray-100 pt-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/znacky"),
        class: "inline-flex items-center gap-2 font-tech text-xs md:text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-brand transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` Späť na všetky značky `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "w-4 h-4" }),
              createTextVNode(" Späť na všetky značky ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(products).length) {
        _push(`<select class="form-input !w-auto text-sm font-tech uppercase tracking-wide cursor-pointer" aria-label="Zoradiť"><!--[-->`);
        ssrRenderList(SORT_OPTIONS, (opt) => {
          _push(`<option${ssrRenderAttr("value", opt.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(sortBy)) ? ssrLooseContain(unref(sortBy), opt.value) : ssrLooseEqual(unref(sortBy), opt.value)) ? " selected" : ""}>${ssrInterpolate(opt.label)}</option>`);
        });
        _push(`<!--]--></select>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(pending) && !unref(products).length) {
        _push(`<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4"><!--[-->`);
        ssrRenderList(8, (i) => {
          _push(`<div class="bg-white border border-gray-100"><div class="aspect-square bg-gray-100 animate-pulse"></div><div class="p-4 space-y-2"><div class="h-3 bg-gray-200 animate-pulse w-1/3"></div><div class="h-3 bg-gray-200 animate-pulse w-3/4"></div><div class="h-5 bg-gray-200 animate-pulse w-2/5 mt-2"></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(products).length) {
        _push(`<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4"><!--[-->`);
        ssrRenderList(unref(products), (product) => {
          _push(ssrRenderComponent(ProductCard, {
            key: product.id,
            product
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="py-20 text-center">`);
        _push(ssrRenderComponent(unref(Building2), { class: "w-12 h-12 text-gray-300 mx-auto mb-4" }, null, _parent));
        _push(`<p class="text-gray-400 font-bold uppercase text-sm tracking-widest"> Pre túto značku momentálne nie sú produkty </p></div>`);
      }
      if (unref(products).length < unref(total)) {
        _push(`<div class="mt-8 md:mt-12 text-center pb-8"><p class="text-gray-400 text-[10px] md:text-xs mb-4 font-bold uppercase tracking-widest font-sans"> Zobrazených ${ssrInterpolate(unref(products).length)} z ${ssrInterpolate(unref(total))} produktov </p><div class="w-48 md:w-64 h-1 bg-gray-100 mx-auto mb-6 md:mb-8 rounded-full overflow-hidden"><div class="h-full bg-brand transition-all duration-700" style="${ssrRenderStyle({ width: `${unref(products).length / unref(total) * 100}%` })}"></div></div><button${ssrIncludeBooleanAttr(unref(loadingMore)) ? " disabled" : ""} class="relative bg-black text-white hover:bg-gray-800 px-6 py-3 md:px-10 md:py-4 uppercase tracking-widest text-xs md:text-sm font-bold min-w-[200px] md:min-w-[240px] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed" aria-label="Načítať viac produktov"><span class="flex items-center justify-center gap-2">`);
        if (unref(loadingMore)) {
          _push(`<span class="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` Načítať ďalšie produkty </span></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/znacka/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
