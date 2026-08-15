import __nuxt_component_0 from './SwProductRating-CCZ84wsh.mjs';
import __nuxt_component_1$1 from './SwListingProductPrice-uLKvwDX7.mjs';
import __nuxt_component_2 from './BaseButton-D0eElC8N.mjs';
import { defineComponent, computed, resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import './StarIcon-DB6h1IBB.mjs';
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
import './server.mjs';
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
import './SwSharedPrice-DrqxF5OW.mjs';
import './usePrice-CDJKOx8c.mjs';
import './useCmsTranslations-C7n8Bwji.mjs';
import './useProductPrice--vjxv0K3.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwProductCardDetails",
  __ssrInlineRender: true,
  props: {
    product: {},
    productName: {},
    productManufacturer: {},
    translations: {},
    fromPrice: {},
    addToCartProxy: { type: Function },
    productLink: {},
    layoutType: {}
  },
  setup(__props) {
    const props = __props;
    const isMinimalLayout = computed(() => props.layoutType === "minimal");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      const _component_SwProductRating = __nuxt_component_0;
      const _component_SwListingProductPrice = __nuxt_component_1$1;
      const _component_SwBaseButton = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "self-stretch p-2 flex flex-col justify-between items-start gap-4 flex-1" }, _attrs))}><div class="self-stretch flex flex-col justify-start items-start gap-4"><div class="self-stretch flex flex-col justify-start items-start gap-2"><div class="self-stretch flex flex-col justify-start items-start gap-1">`);
      if (__props.productManufacturer) {
        _push(`<div class="self-stretch text-surface-on-surface text-sm font-bold leading-tight">${ssrInterpolate(__props.productManufacturer)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_RouterLink, {
        to: __props.productLink,
        class: "self-stretch text-surface-on-surface text-2xl font-normal font-serif leading-9 overflow-hidden line-clamp-2 break-words min-h-[4.5rem]",
        "data-testid": "product-box-product-name-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.productName)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.productName), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (isMinimalLayout.value) {
        _push(ssrRenderComponent(_component_SwProductRating, {
          rating: __props.product?.ratingAverage ?? 0,
          "review-count": __props.product?.productReviews?.length ?? 0,
          class: "mt-4"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_SwListingProductPrice, {
          product: __props.product,
          "data-testid": "product-box-product-price"
        }, null, _parent));
      }
      _push(`</div>`);
      if (!isMinimalLayout.value) {
        _push(`<!--[-->`);
        if (!__props.fromPrice) {
          _push(ssrRenderComponent(_component_SwBaseButton, {
            variant: "primary",
            size: "medium",
            disabled: !__props.product?.available,
            block: "",
            "data-testid": "add-to-cart-button",
            onClick: __props.addToCartProxy
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(__props.translations.product.addToCart)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(__props.translations.product.addToCart), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(ssrRenderComponent(_component_RouterLink, {
            to: __props.productLink,
            class: "self-stretch"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_SwBaseButton, { block: "" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(__props.translations.product.details)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(__props.translations.product.details), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_SwBaseButton, { block: "" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.translations.product.details), 1)
                    ]),
                    _: 1
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`<!--]-->`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwProductCardDetails.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "SwProductCardDetails" });

export { __nuxt_component_1 as default };
