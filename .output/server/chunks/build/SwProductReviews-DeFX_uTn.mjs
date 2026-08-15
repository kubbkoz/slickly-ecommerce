import __nuxt_component_0$1 from './SwProductRating-CCZ84wsh.mjs';
import { defineComponent, toRefs, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { au as defu } from '../nitro/nitro.mjs';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
import { u as useProductReviews } from './useProductReviews-DauI5Xd2.mjs';
import { e as useShopwareContext } from './server.mjs';
import './StarIcon-DB6h1IBB.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import '@shopware/helpers';
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
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwProductReviews",
  __ssrInlineRender: true,
  props: {
    product: {},
    reviews: {}
  },
  setup(__props) {
    const props = __props;
    let translations = {
      product: {
        noReviews: "No reviews yet.",
        reviewNotAccepted: "Your review has not been approved yet",
        reviewFeedback: "Shop feedback"
      }
    };
    translations = defu(useCmsTranslations(), translations);
    const { product, reviews } = toRefs(props);
    const shouldLoadReviews = !reviews?.value;
    const loadingReviews = ref(shouldLoadReviews);
    const { productReviews } = useProductReviews(product);
    const reviewsList = computed(
      () => reviews?.value || productReviews.value || []
    );
    const format = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    };
    const { browserLocale } = useShopwareContext();
    const formatDate = (date) => {
      return new Intl.DateTimeFormat(browserLocale, format).format(new Date(date));
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwProductRating = __nuxt_component_0$1;
      if (loadingReviews.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "absolute inset-0 flex items-center justify-center z-10 bg-surface-surface/75" }, _attrs))}><div class="h-15 w-15 i-carbon-progress-bar-round animate-spin text-outline-outline"></div></div>`);
      } else if (reviewsList.value.length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-6" }, _attrs))}><!--[-->`);
        ssrRenderList(reviewsList.value, (review, index) => {
          _push(`<div class="${ssrRenderClass([{ "border-b border-surface-surface-container-highest": index < reviewsList.value.length - 1 }, "pb-6"])}">`);
          if (review.createdAt) {
            _push(`<div class="cms-block-product-description-reviews__reviews-time text-surface-on-surface-variant text-sm">`);
            if (review.externalUser) {
              _push(`<span>${ssrInterpolate(review.externalUser)} - </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<span>${ssrInterpolate(formatDate(review.createdAt))}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (!review.status) {
            _push(`<div class="mt-2 text-3 p-2 bg-states-info-container text-states-on-info-container flex gap-2 items-center"><div class="w-6 h-6 i-carbon-warning"></div> ${ssrInterpolate(unref(translations).product.reviewNotAccepted)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="cms-block-product-description-reviews__reviews-rating inline-flex items-center mt-2">`);
          _push(ssrRenderComponent(_component_SwProductRating, {
            rating: review.points ?? 0,
            "star-size": 20,
            "show-count": false
          }, null, _parent));
          _push(`<div class="cms-block-product-description-reviews__reviews-title font-semibold ml-2"><p>${ssrInterpolate(review.title)}</p></div></div><div class="cms-block-product-description-reviews__reviews-content mt-2"><p class="break-words">${ssrInterpolate(review.content)}</p>`);
          if (review.comment) {
            _push(`<p class="text-surface-on-surface-variant mt-2"> - ${ssrInterpolate(unref(translations).product.reviewFeedback)}: ${ssrInterpolate(review.comment)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(_attrs)}>${ssrInterpolate(unref(translations).product.noReviews)}.</div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwProductReviews.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "SwProductReviews" });

export { __nuxt_component_0 as default };
