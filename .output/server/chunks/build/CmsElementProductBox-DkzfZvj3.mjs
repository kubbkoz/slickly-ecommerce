import __nuxt_component_1 from './SwProductCard-BA76azQz.mjs';
import __nuxt_component_1$1 from './SwProductCardSkeleton-DYKDZIx0.mjs';
import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { u as useCmsElementConfig } from './useCmsElementConfig-DY8wkVjg.mjs';
import './SwProductCardImage-DdEndLgG.mjs';
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
import './index-B6MI764M.mjs';
import './useImagePlaceholder-30hLRW4O.mjs';
import './SwProductCardDetails-BWTz-xFm.mjs';
import './SwProductRating-CCZ84wsh.mjs';
import './StarIcon-DB6h1IBB.mjs';
import './SwListingProductPrice-uLKvwDX7.mjs';
import './SwSharedPrice-DrqxF5OW.mjs';
import './usePrice-CDJKOx8c.mjs';
import './useCmsTranslations-C7n8Bwji.mjs';
import './useProductPrice--vjxv0K3.mjs';
import './BaseButton-D0eElC8N.mjs';
import './useCartErrorParamsResolver-QJw2wqGf.mjs';
import './useProductWishlist-oSDJlicI.mjs';
import './useUrlResolver-CibZ14y1.mjs';
import './useCartNotification-Bl0gSIu9.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsElementProductBox",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { getConfigValue } = useCmsElementConfig(props.content);
    const product = computed(() => props.content.data?.product || {});
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwProductCard = __nuxt_component_1;
      const _component_SwProductCardSkeleton = __nuxt_component_1$1;
      if (product.value?.id) {
        _push(ssrRenderComponent(_component_SwProductCard, mergeProps({
          product: product.value,
          "layout-type": unref(getConfigValue)("boxLayout")
        }, _attrs), null, _parent));
      } else {
        _push(ssrRenderComponent(_component_SwProductCardSkeleton, _attrs, null, _parent));
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementProductBox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsElementProductBox = Object.assign(_sfc_main, { __name: "CmsElementProductBox" });

export { CmsElementProductBox as default };
