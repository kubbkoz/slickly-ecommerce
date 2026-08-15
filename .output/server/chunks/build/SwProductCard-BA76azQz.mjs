import __nuxt_component_0 from './SwProductCardImage-DdEndLgG.mjs';
import __nuxt_component_1$1 from './SwProductCardDetails-BWTz-xFm.mjs';
import { defineComponent, toRef, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { ApiClientError } from '@shopware/api-client';
import { getProductFromPrice, getProductName, getProductManufacturerName, buildUrlPrefix, getProductRoute, getCmsTranslate } from '@shopware/helpers';
import { u as useAddToCart, a as useCartErrorParamsResolver } from './useCartErrorParamsResolver-QJw2wqGf.mjs';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
import { K as useNotifications } from './server.mjs';
import { u as useProductWishlist } from './useProductWishlist-oSDJlicI.mjs';
import { u as useUrlResolver } from './useUrlResolver-CibZ14y1.mjs';
import { u as useCartNotification } from './useCartNotification-Bl0gSIu9.mjs';
import { au as defu } from '../nitro/nitro.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import './index-B6MI764M.mjs';
import './useImagePlaceholder-30hLRW4O.mjs';
import './SwProductRating-CCZ84wsh.mjs';
import './StarIcon-DB6h1IBB.mjs';
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
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './SwListingProductPrice-uLKvwDX7.mjs';
import './SwSharedPrice-DrqxF5OW.mjs';
import './usePrice-CDJKOx8c.mjs';
import './useProductPrice--vjxv0K3.mjs';
import './BaseButton-D0eElC8N.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwProductCard",
  __ssrInlineRender: true,
  props: {
    product: {},
    layoutType: { default: "standard" },
    displayMode: { default: "standard" },
    isProductListing: { type: Boolean, default: false }
  },
  setup(__props) {
    const { pushSuccess, pushError } = useNotifications();
    const { getErrorsCodes } = useCartNotification();
    const { resolveCartError } = useCartErrorParamsResolver();
    let translations = {
      product: {
        addedToWishlist: "has been added to wishlist.",
        removedFromTheWishlist: "has been removed from wishlist.",
        reason: "Reason",
        cannotAddToWishlist: "cannot be added to wishlist.",
        addedToCart: "has been added to cart.",
        addToCart: "Add to cart",
        details: "Details",
        badges: {
          topseller: "Tip"
        }
      },
      errors: {
        "product-stock-reached": "The product {name} is only available {quantity} times"
      }
    };
    translations = defu(useCmsTranslations(), translations);
    const product = toRef(() => __props.product);
    const { addToCart } = useAddToCart(product);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useProductWishlist(
      product.value.id
    );
    const isLoading = ref(false);
    const toggleWishlistProduct = async () => {
      isLoading.value = true;
      try {
        if (!isInWishlist.value) {
          await addToWishlist();
          pushSuccess(
            `${product?.value.translated.name} ${translations.product.addedToWishlist}`
          );
        } else {
          await removeFromWishlist();
          pushSuccess(
            `${product?.value.translated.name} ${translations.product.removedFromTheWishlist}`
          );
        }
      } catch (error) {
        if (error instanceof ApiClientError) {
          const reason = error.details.errors?.[0]?.detail ? `${translations.product.reason}: ${error.details.errors?.[0]?.detail}` : "";
          return pushError(
            `${product?.value.translated.name} ${translations.product.cannotAddToWishlist}
${reason}`,
            {
              timeout: 5e3
            }
          );
        }
      } finally {
        isLoading.value = false;
      }
    };
    const addToCartProxy = async () => {
      await addToCart();
      const errors = getErrorsCodes();
      for (const element of errors) {
        const { messageKey, params } = resolveCartError(element);
        if (translations.errors[messageKey])
          pushError(getCmsTranslate(translations.errors[messageKey], params));
      }
      if (!errors.length)
        pushSuccess(
          `${product?.value.translated.name} ${translations.product.addedToCart}`
        );
    };
    const fromPrice = getProductFromPrice(product.value);
    const productName = computed(() => getProductName({ product: product.value }));
    const productManufacturer = computed(
      () => getProductManufacturerName(product.value)
    );
    const { getUrlPrefix } = useUrlResolver();
    const productLink = computed(
      () => buildUrlPrefix(getProductRoute(product.value), getUrlPrefix())
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwProductCardImage = __nuxt_component_0;
      const _component_SwProductCardDetails = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-px flex flex-col justify-start items-start overflow-hidden" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_SwProductCardImage, {
        product: product.value,
        translations: unref(translations),
        isInWishlist: unref(isInWishlist),
        isLoading: isLoading.value,
        toggleWishlist: toggleWishlistProduct,
        productLink: productLink.value
      }, null, _parent));
      _push(ssrRenderComponent(_component_SwProductCardDetails, {
        product: product.value,
        productName: productName.value,
        productManufacturer: productManufacturer.value,
        translations: unref(translations),
        fromPrice: unref(fromPrice),
        addToCartProxy,
        productLink: productLink.value,
        layoutType: __props.layoutType
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwProductCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "SwProductCard" });

export { __nuxt_component_1 as default };
