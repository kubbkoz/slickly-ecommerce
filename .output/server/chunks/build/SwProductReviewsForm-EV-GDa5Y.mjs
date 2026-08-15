import __nuxt_component_0 from './StarIcon-DB6h1IBB.mjs';
import __nuxt_component_1 from './ExclamationIcon-Dak5_-Kw.mjs';
import __nuxt_component_2 from './BaseButton-D0eElC8N.mjs';
import { defineComponent, reactive, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { e as useShopwareContext } from './server.mjs';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import { au as defu } from '../nitro/nitro.mjs';
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
import './BaseIcon-CuUpCLk5.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwProductReviewsForm",
  __ssrInlineRender: true,
  props: {
    productId: {}
  },
  emits: ["success"],
  setup(__props, { emit: __emit }) {
    let translations = {
      product: {
        addReview: "Add review",
        reviewsForm: {
          title: "Title",
          titlePlaceholder: "Enter a title for your review",
          review: "Your review",
          reviewPlaceholder: "Share your experience with this product (minimum 40 characters)",
          submit: "Submit",
          rating: "Your rating"
        },
        errors: {
          reviewAlreadyExists: "You have already submitted a review for this product"
        }
      }
    };
    translations = defu(useCmsTranslations(), translations);
    const state = reactive({
      rating: null,
      title: "",
      review: ""
    });
    const isLoading = ref(false);
    const errorMessages = ref([]);
    const rules = computed(() => ({
      rating: {
        required
      },
      title: {
        required,
        minLength: minLength(5)
      },
      review: {
        required,
        minLength: minLength(40)
      }
    }));
    useShopwareContext();
    const $v = useVuelidate(rules, state);
    const invokeRating = (value) => {
      state.rating = value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwStarIcon = __nuxt_component_0;
      const _component_SwExclamationIcon = __nuxt_component_1;
      const _component_SwBaseButton = __nuxt_component_2;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-4 md:gap-5 relative" }, _attrs))}>`);
      if (isLoading.value) {
        _push(`<div class="absolute inset-0 flex items-center justify-center z-10 bg-surface-surface/80 rounded-md"><div class="h-12 w-12 i-carbon-progress-bar-round animate-spin text-brand-primary"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div><div class="flex flex-col gap-2"><h4 class="text-lg md:text-xl font-bold text-surface-on-surface mt-3">${ssrInterpolate(unref(translations).product.addReview)}</h4><span class="text-sm text-surface-on-surface-variant">${ssrInterpolate(unref(translations).product.reviewsForm.rating)}</span><div class="flex flex-row gap-2" role="group"${ssrRenderAttr("aria-label", unref(translations).product.reviewsForm.rating)}><!--[-->`);
      ssrRenderList(state.rating || 0, (index) => {
        _push(ssrRenderComponent(_component_SwStarIcon, {
          key: `filled-${index}`,
          filled: true,
          size: 24,
          role: "button",
          "aria-label": `Rate ${index} out of 5 stars`,
          tabindex: "0",
          class: "cursor-pointer hover:opacity-80 transition-opacity active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded",
          "data-testid": "review-filled-star",
          onClick: ($event) => invokeRating(index),
          onKeydown: [($event) => invokeRating(index), ($event) => invokeRating(index)]
        }, null, _parent));
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(5 - (state.rating || 0), (index) => {
        _push(ssrRenderComponent(_component_SwStarIcon, {
          key: `empty-${index}`,
          filled: false,
          size: 24,
          role: "button",
          "aria-label": `Rate ${(state.rating || 0) + index} out of 5 stars`,
          tabindex: "0",
          class: "cursor-pointer hover:opacity-80 transition-opacity active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded",
          "data-testid": "review-empty-star",
          onClick: ($event) => invokeRating((state.rating || 0) + index),
          onKeydown: [($event) => invokeRating((state.rating || 0) + index), ($event) => invokeRating((state.rating || 0) + index)]
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      if (unref($v).rating.$error && unref($v).rating.$errors[0]?.$message) {
        _push(`<span class="pt-1 text-sm text-states-error">${ssrInterpolate(unref($v).rating.$errors[0].$message)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (errorMessages.value.length) {
        _push(`<div class="p-3 mb-4 bg-surface-surface-container border border-states-error rounded-md flex gap-2 md:gap-3 items-start"><div class="w-5 h-5 text-states-error flex-shrink-0 mt-0.5">`);
        _push(ssrRenderComponent(_component_SwExclamationIcon, { size: 20 }, null, _parent));
        _push(`</div><div class="flex-1"><!--[-->`);
        ssrRenderList(errorMessages.value, (error, index) => {
          _push(`<p class="text-sm text-states-error">${ssrInterpolate(error.detail)}</p>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div><label for="title" class="block mb-2 text-sm font-medium text-surface-on-surface">${ssrInterpolate(unref(translations).product.reviewsForm.title)}</label><input id="title"${ssrRenderAttr("value", state.title)} class="${ssrRenderClass([[
        unref($v).title.$error ? "border-states-error focus:ring-states-error" : "border-outline-outline"
      ], "block w-full px-3 py-2.5 md:py-2 border rounded-md text-base md:text-sm text-surface-on-surface bg-surface-surface placeholder-surface-on-surface-variant focus:outline-none focus:ring-2 focus:ring-outline-outline"])}" type="text"${ssrRenderAttr("placeholder", unref(translations).product.reviewsForm.titlePlaceholder)}${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-testid="review-title-input">`);
      if (unref($v).title.$error && unref($v).title.$errors[0]?.$message) {
        _push(`<span class="pt-1 text-sm text-states-error">${ssrInterpolate(unref($v).title.$errors[0].$message)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="review" class="block mb-2 text-sm font-medium text-surface-on-surface">${ssrInterpolate(unref(translations).product.reviewsForm.review)}</label><textarea id="review" class="${ssrRenderClass([[
        unref($v).review.$error ? "border-states-error focus:ring-states-error" : "border-outline-outline"
      ], "block w-full px-3 py-2.5 md:py-2 border rounded-md text-base md:text-sm text-surface-on-surface bg-surface-surface placeholder-surface-on-surface-variant focus:outline-none focus:ring-2 focus:ring-outline-outline min-h-32 md:min-h-40"])}"${ssrRenderAttr("placeholder", unref(translations).product.reviewsForm.reviewPlaceholder)}${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-testid="review-text-input">${ssrInterpolate(state.review)}</textarea>`);
      if (unref($v).review.$error && unref($v).review.$errors[0]?.$message) {
        _push(`<span class="pt-1 text-sm text-states-error">${ssrInterpolate(unref($v).review.$errors[0].$message)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_SwBaseButton, {
        type: "submit",
        variant: "primary",
        size: "medium",
        disabled: isLoading.value,
        loading: isLoading.value,
        class: "mt-4 w-full md:w-auto md:self-start",
        "data-testid": "review-submit-button"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(translations).product.reviewsForm.submit)}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(translations).product.reviewsForm.submit), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwProductReviewsForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SwProductReviewsForm = Object.assign(_sfc_main, { __name: "SwProductReviewsForm" });

export { SwProductReviewsForm as default };
