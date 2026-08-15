import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { I as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, useTemplateRef, computed, resolveComponent, mergeProps, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { getSmallestThumbnailUrl, isProductOnSale, isProductTopSeller } from '@shopware/helpers';
import { a as useElementSize } from './index-B6MI764M.mjs';
import { u as useImagePlaceholder } from './useImagePlaceholder-30hLRW4O.mjs';
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

const DEFAULT_THUMBNAIL_SIZE = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwProductCardImage",
  __ssrInlineRender: true,
  props: {
    product: {},
    translations: {},
    isInWishlist: { type: Boolean },
    isLoading: { type: Boolean },
    toggleWishlist: { type: Function },
    productLink: {}
  },
  setup(__props) {
    const props = __props;
    const containerElement = useTemplateRef("containerElement");
    const { width, height } = useElementSize(containerElement);
    function roundUp(num) {
      return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE;
    }
    const coverSrcPath = computed(() => {
      return getSmallestThumbnailUrl(props.product?.cover?.media) || props.product?.cover?.media?.url;
    });
    const imageModifiers = computed(() => {
      const containerSize = Math.max(width.value || 0, height.value || 0);
      const size = roundUp(containerSize * 2);
      return {
        width: size,
        height: size
      };
    });
    const coverAlt = computed(() => {
      return props.product?.cover?.media?.alt || props.product?.translated?.name;
    });
    const isOnSale = computed(() => isProductOnSale(props.product));
    const isTopseller = computed(() => isProductTopSeller(props.product));
    const placeholderSvg = useImagePlaceholder();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      const _component_NuxtImg = __nuxt_component_2;
      const _component_client_only = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "containerElement",
        ref: containerElement,
        class: "self-stretch min-h-[350px] relative flex flex-col justify-start items-start overflow-hidden aspect-square"
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: __props.productLink,
        class: "self-stretch h-full relative overflow-hidden"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtImg, {
              preset: "productCard",
              class: "w-full h-full absolute top-0 left-0 object-cover",
              placeholder: unref(placeholderSvg),
              src: coverSrcPath.value,
              alt: coverAlt.value,
              modifiers: imageModifiers.value,
              "data-testid": "product-box-img"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtImg, {
                preset: "productCard",
                class: "w-full h-full absolute top-0 left-0 object-cover",
                placeholder: unref(placeholderSvg),
                src: coverSrcPath.value,
                alt: coverAlt.value,
                modifiers: imageModifiers.value,
                "data-testid": "product-box-img"
              }, null, 8, ["placeholder", "src", "alt", "modifiers"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (isTopseller.value || isOnSale.value) {
        _push(`<div class="px-1.5 py-1 left-2 bottom-2 absolute bg-other-sale rounded inline-flex justify-center items-center"><div class="text-states-on-error text-xs font-bold leading-none">${ssrInterpolate(__props.translations.product.badges.topseller)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_client_only, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwProductCardImage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "SwProductCardImage" });

export { __nuxt_component_0 as default };
