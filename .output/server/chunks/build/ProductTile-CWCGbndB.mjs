import __nuxt_component_0 from './WishlistIcon-QPEOmafG.mjs';
import { _ as __nuxt_component_2$1 } from './NuxtImg-BPLMxRzm.mjs';
import __nuxt_component_3 from './Price-D7PucwgC.mjs';
import __nuxt_component_1 from './BaseButton-CtNN_2CK.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { getSmallestThumbnailUrl } from '@shopware/helpers';
import { a as useCart, K as useNotifications, m as useI18n } from './server.mjs';
import { u as useProductWishlist } from './useProductWishlist-oSDJlicI.mjs';
import './IconButton-C-Xi6SDN.mjs';
import './index-DKA3nfTy.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
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
import '@shopware/api-client';
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './composables-x8_ENpEe.mjs';
import './usePrice-CDJKOx8c.mjs';

const ELEMENT_WIDTH = 310;
const ELEMENT_HEIGHT = 315;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductTile",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  setup(__props) {
    const { addProduct } = useCart();
    const { removeFromWishlist } = useProductWishlist(__props.product.id);
    const { pushError, pushSuccess } = useNotifications();
    const { t } = useI18n();
    const addingProducts = ref(false);
    async function handleAddToCart() {
      try {
        addingProducts.value = true;
        await addProduct({ id: __props.product.id, quantity: 1 });
        pushSuccess(t("account.messages.productsAdded"));
      } catch (error) {
        pushError(t("messages.error"));
      } finally {
        addingProducts.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ProductWishlistIcon = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_2$1;
      const _component_SharedPrice = __nuxt_component_3;
      const _component_FormBaseButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "flex flex-col gap-4 relative",
        style: `width: ${ELEMENT_WIDTH}px;`
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_ProductWishlistIcon, {
        onClick: unref(removeFromWishlist),
        isSelected: true,
        class: "!absolute top-4 right-4"
      }, null, _parent));
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: unref(getSmallestThumbnailUrl)(__props.product.cover?.media),
        alt: `${__props.product.name} item`,
        fit: "inside",
        class: "object-cover",
        style: `height: ${ELEMENT_HEIGHT}px; width: ${ELEMENT_WIDTH}px;`
      }, null, _parent));
      _push(`<div class="text-surface-on-surface text-2xl font-normal font-[&#39;Noto_Serif&#39;] leading-9">${ssrInterpolate(__props.product.name)}</div><div class="mt-auto flex flex-col gap-4">`);
      _push(ssrRenderComponent(_component_SharedPrice, {
        class: "justify-start text-surface-on-surface text-base font-bold leading-6",
        value: __props.product.calculatedPrice?.totalPrice
      }, null, _parent));
      _push(ssrRenderComponent(_component_FormBaseButton, {
        class: "mt-auto",
        label: _ctx.$t("product.addToCart"),
        onClick: handleAddToCart
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/wishlist/ProductTile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "WishlistProductTile" });

export { __nuxt_component_2 as default };
