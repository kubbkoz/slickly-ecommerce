import __nuxt_component_0 from './SwSlider-CN4jIJjs.mjs';
import __nuxt_component_1 from './SwProductCard-BA76azQz.mjs';
import { defineComponent, useTemplateRef, ref, computed, mergeProps, withCtx, unref, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { u as useCmsElementConfig } from './useCmsElementConfig-DY8wkVjg.mjs';
import './ChevronIcon-Aj1t6zS4.mjs';
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
import './SwProductCardImage-DdEndLgG.mjs';
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
  __name: "CmsElementProductSlider",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { getConfigValue } = useCmsElementConfig(props.content);
    useTemplateRef("productSlider");
    const slidesToShow = ref();
    const products = computed(() => props.content?.data?.products ?? []);
    const config = computed(() => ({
      minHeight: {
        value: "450px",
        source: "static"
      },
      verticalAlign: {
        source: "static",
        value: getConfigValue("verticalAlign") || ""
      },
      displayMode: {
        value: "contain",
        source: "static"
      },
      navigationDots: {
        value: getConfigValue("navigation") === true ? "outside" : "",
        source: "static"
      },
      navigationArrows: {
        value: getConfigValue("navigation") === true ? "outside" : "",
        source: "static"
      }
    }));
    const autoplay = computed(() => getConfigValue("rotate"));
    const title = computed(() => getConfigValue("title"));
    const border = computed(() => getConfigValue("border"));
    const verticalAlignStyle = computed(() => ({
      alignContent: getConfigValue("verticalAlign")
    }));
    const hasVerticalAlignment = computed(
      () => !!verticalAlignStyle.value.alignContent
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwSlider = __nuxt_component_0;
      const _component_SwProductCard = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        style: hasVerticalAlignment.value ? verticalAlignStyle.value : void 0
      }, _attrs))}><div class="cms-element-product-slider">`);
      if (title.value) {
        _push(`<h3 class="pl-6 pb-6 text-center md:text-left text-surface-on-surface">${ssrInterpolate(title.value)}</h3>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass({ "py-5 border border-outline-outline-variant": border.value })}">`);
      _push(ssrRenderComponent(_component_SwSlider, {
        config: config.value,
        gap: "1.25rem",
        "slides-to-show": slidesToShow.value,
        "slides-to-scroll": 1,
        autoplay: autoplay.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(products.value, (product) => {
              _push2(ssrRenderComponent(_component_SwProductCard, {
                key: product.id,
                class: "h-full",
                product,
                "layout-type": unref(getConfigValue)("boxLayout"),
                "display-mode": unref(getConfigValue)("displayMode")
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(products.value, (product) => {
                return openBlock(), createBlock(_component_SwProductCard, {
                  key: product.id,
                  class: "h-full",
                  product,
                  "layout-type": unref(getConfigValue)("boxLayout"),
                  "display-mode": unref(getConfigValue)("displayMode")
                }, null, 8, ["product", "layout-type", "display-mode"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementProductSlider.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsElementProductSlider = Object.assign(_sfc_main, { __name: "CmsElementProductSlider" });

export { CmsElementProductSlider as default };
