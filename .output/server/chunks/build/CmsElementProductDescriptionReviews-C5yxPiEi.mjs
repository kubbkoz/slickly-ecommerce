import __nuxt_component_0 from './SwProductReviews-DeFX_uTn.mjs';
import { _ as _export_sfc, e as useShopwareContext, f as useUser, I as __nuxt_component_0$1 } from './server.mjs';
import __nuxt_component_2 from './CheckmarkIcon-C1wz8qX_.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { getTranslatedProperty } from '@shopware/helpers';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
import { u as useProduct } from './useProduct-a-4w44J3.mjs';
import { au as defu } from '../nitro/nitro.mjs';
import { s as sanitizeHtml } from './sanitize-DKvwg8Vq.mjs';
import './SwProductRating-CCZ84wsh.mjs';
import './StarIcon-DB6h1IBB.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import './useProductReviews-DauI5Xd2.mjs';
import 'pinia';
import 'vue-router';
import '@iconify/vue';
import '@shopware/api-client';
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
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
import 'node:url';
import '@iconify/utils';
import 'consola';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsElementProductDescriptionReviews",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    let translations = {
      product: {
        description: "Description",
        reviews: "Reviews",
        messages: {
          reviewAdded: "Thank you for submitting your review",
          loginToReview: "Please log in to write a review"
        }
      }
    };
    translations = defu(useCmsTranslations(), translations);
    const openSections = ref(/* @__PURE__ */ new Set([1]));
    const { product } = useProduct(props.content.data?.product);
    const description = computed(() => {
      try {
        const rawDescription = getTranslatedProperty(product.value, "description") || "";
        return sanitizeHtml(rawDescription);
      } catch (e) {
        return getTranslatedProperty(product.value, "description") || "";
      }
    });
    const isSectionOpen = (sectionNumber) => {
      return openSections.value.has(sectionNumber);
    };
    const reviews = ref([]);
    useShopwareContext();
    useUser();
    const reviewAdded = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwProductReviews = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_0$1;
      const _component_SwCheckmarkIcon = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full self-stretch inline-flex flex-col justify-start items-start gap-4" }, _attrs))} data-v-0f391669><div class="self-stretch flex flex-col justify-center items-center" data-v-0f391669><div class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-start items-center gap-1 cursor-pointer hover:bg-surface-surface-variant transition-colors" data-v-0f391669><div class="flex-1 flex items-center gap-2.5" data-v-0f391669><div class="flex-1 text-surface-on-surface text-base font-bold leading-normal" data-v-0f391669>${ssrInterpolate(unref(translations).product.description)}</div></div><div class="w-6 h-6 relative" data-v-0f391669><div class="w-2.5 h-1.5 left-[7px] top-[9.50px] absolute" data-v-0f391669><div class="${ssrRenderClass([{ "rotate-180": isSectionOpen(1) }, "i-carbon-chevron-down transition-transform duration-200"])}" data-v-0f391669></div></div></div></div></div>`);
      if (isSectionOpen(1)) {
        _push(`<div class="self-stretch flex flex-col justify-center items-center gap-2.5" data-v-0f391669><div class="self-stretch text-surface-on-surface text-base font-normal leading-normal" data-v-0f391669><div data-v-0f391669>${unref(sanitizeHtml)(description.value) ?? ""}</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="self-stretch flex flex-col justify-center items-center" data-v-0f391669><div class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-start items-center gap-1 cursor-pointer hover:bg-surface-surface-variant transition-colors" data-v-0f391669><div class="flex-1 flex items-center gap-2.5" data-v-0f391669><div class="flex-1 text-surface-on-surface text-base font-bold leading-normal" data-v-0f391669>${ssrInterpolate(unref(translations).product.reviews)} (${ssrInterpolate(reviews.value.length)}) </div></div><div class="w-6 h-6 relative" data-v-0f391669><div class="w-2.5 h-1.5 left-[7px] top-[9.50px] absolute" data-v-0f391669><div class="${ssrRenderClass([{ "rotate-180": isSectionOpen(2) }, "i-carbon-chevron-down transition-transform duration-200"])}" data-v-0f391669></div></div></div></div></div>`);
      if (isSectionOpen(2)) {
        _push(`<div class="self-stretch flex flex-col justify-center items-center gap-2.5" data-v-0f391669><div class="self-stretch text-surface-on-surface text-base font-normal leading-normal" data-v-0f391669>`);
        if (unref(product)) {
          _push(ssrRenderComponent(_component_SwProductReviews, {
            product: unref(product),
            reviews: reviews.value
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
        if (reviewAdded.value) {
          _push(`<div class="mt-4 p-3 bg-surface-surface-container border border-states-success rounded-md flex gap-2 md:gap-3 items-center" data-v-0f391669><div class="w-5 h-5 text-states-success flex-shrink-0" data-v-0f391669>`);
          _push(ssrRenderComponent(_component_SwCheckmarkIcon, {
            size: 20,
            filled: true,
            alt: "Success"
          }, null, _parent));
          _push(`</div><span class="text-sm text-states-success" data-v-0f391669>${ssrInterpolate(unref(translations).product.messages.reviewAdded)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="self-stretch flex flex-col justify-center items-center" data-v-0f391669><div class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-start items-center gap-1 cursor-pointer hover:bg-surface-surface-variant transition-colors" data-v-0f391669><div class="flex-1 flex items-center gap-2.5" data-v-0f391669><div class="flex-1 text-surface-on-surface text-base font-bold leading-normal" data-v-0f391669> Category </div></div><div class="w-6 h-6 relative" data-v-0f391669><div class="w-2.5 h-1.5 left-[7px] top-[9.50px] absolute" data-v-0f391669><div class="${ssrRenderClass([{ "rotate-180": isSectionOpen(3) }, "i-carbon-chevron-down transition-transform duration-200"])}" data-v-0f391669></div></div></div></div></div>`);
      if (isSectionOpen(3)) {
        _push(`<div class="self-stretch flex flex-col justify-center items-center gap-2.5" data-v-0f391669><div class="self-stretch text-surface-on-surface text-base font-normal leading-normal" data-v-0f391669>`);
        if (unref(product)?.categories) {
          _push(`<div data-v-0f391669><!--[-->`);
          ssrRenderList(unref(product).categories, (category) => {
            _push(`<div class="mb-2" data-v-0f391669>${ssrInterpolate(category.name)}</div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div data-v-0f391669> No categories available </div>`);
        }
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/public/cms/element/CmsElementProductDescriptionReviews.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsElementProductDescriptionReviews = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-0f391669"]]), { __name: "CmsElementProductDescriptionReviews" });

export { CmsElementProductDescriptionReviews as default };
