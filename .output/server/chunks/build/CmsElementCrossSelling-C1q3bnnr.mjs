import __nuxt_component_0 from './SwSlider-CN4jIJjs.mjs';
import __nuxt_component_1 from './SwProductCard-BA76azQz.mjs';
import { defineComponent, ref, useTemplateRef, computed, mergeProps, withCtx, unref, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { a as useElementSize } from './index-B6MI764M.mjs';
import { u as useCmsElementConfig } from './useCmsElementConfig-DY8wkVjg.mjs';
import { _ as _export_sfc } from './server.mjs';
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
  __name: "CmsElementCrossSelling",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { getConfigValue } = useCmsElementConfig(props.content);
    const currentTabIndex = ref(0);
    const crossSellContainer = useTemplateRef("crossSellContainer");
    const config = computed(() => ({
      minHeight: {
        value: "300px",
        source: "static"
      },
      minWidth: {
        value: "300px",
        source: "static"
      },
      displayMode: {
        value: "contain",
        source: "static"
      },
      navigationDots: {
        value: "",
        source: "static"
      },
      navigationArrows: {
        value: "outside",
        source: "static"
      }
    }));
    const crossSellCollections = computed(() => {
      return props.content?.data?.crossSellings?.filter(
        (collection) => !!collection.products.length
      ) || [];
    });
    const { width } = useElementSize(crossSellContainer);
    const slidesToShow = computed(() => {
      const minWidth = +(config.value.minWidth?.value.replace(/\D+/g, "") || 0);
      return Math.floor(width.value / (minWidth * 1.2));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwSlider = __nuxt_component_0;
      const _component_SwProductCard = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "crossSellContainer",
        ref: crossSellContainer,
        class: "cms-element-cross-selling"
      }, _attrs))} data-v-5cbac906><div class="flex gap-10 mb-5" data-v-5cbac906><!--[-->`);
      ssrRenderList(crossSellCollections.value, (collection, index) => {
        _push(`<a class="${ssrRenderClass([{
          "border-b-3 border-brand-primary text-brand-primary": currentTabIndex.value === index
        }, "transition text-lg font-semibold text-surface-on-surface-variant cursor-pointer"])}" data-v-5cbac906>${ssrInterpolate(collection.crossSelling.name)}</a>`);
      });
      _push(`<!--]--></div>`);
      if (crossSellCollections.value.length) {
        _push(ssrRenderComponent(_component_SwSlider, {
          config: config.value,
          gap: "1.25rem",
          "slides-to-show": slidesToShow.value,
          "slides-to-scroll": 1,
          autoplay: false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(crossSellCollections.value[currentTabIndex.value]?.products, (product) => {
                _push2(ssrRenderComponent(_component_SwProductCard, {
                  key: product.id,
                  class: "w-[300px]",
                  product,
                  "layout-type": unref(getConfigValue)("boxLayout"),
                  "display-mode": unref(getConfigValue)("displayMode")
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(crossSellCollections.value[currentTabIndex.value]?.products, (product) => {
                  return openBlock(), createBlock(_component_SwProductCard, {
                    key: product.id,
                    class: "w-[300px]",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementCrossSelling.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsElementCrossSelling = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-5cbac906"]]), { __name: "CmsElementCrossSelling" });

export { CmsElementCrossSelling as default };
