import { defineComponent, computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { ChevronDown } from 'lucide-vue-next';
import RatingStars from './RatingStars-CZsf46JE.mjs';
import DescriptionTab from './DescriptionTab-D8HoIiln.mjs';
import SpecsTab from './SpecsTab-Bl4q2Y0e.mjs';
import ReviewsTab from './ReviewsTab-BNH7kirM.mjs';
import DownloadsTab from './DownloadsTab-CHj4wAVb.mjs';
import DistributorTab from './DistributorTab-CqvcHcqV.mjs';
import { _ as _export_sfc } from './server.mjs';
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
import '@shopware/helpers';
import 'js-cookie';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './sanitize-DKvwg8Vq.mjs';
import './media-BNPyNy3v.mjs';
import './AppModal-CMHCLJuP.mjs';
import './ProductReviewForm-DO_Xeltg.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';
import './BaseButton-BJMOoNbK.mjs';
import './nuxt-link-B7B0pxEe.mjs';
import './AppHoneypot-DdH0YZXD.mjs';
import './format-tV37I8C6.mjs';
import './useProductReviews-DauI5Xd2.mjs';
import './ManufacturerInfo-CWjTobFI.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductTabs",
  __ssrInlineRender: true,
  props: {
    product: {},
    availableSizes: {},
    reviewCount: {},
    ratingAverage: {}
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const sections = computed(() => [
      { key: "downloads", label: "Dokumenty a manuály na stiahnutie" },
      { key: "distributor", label: "Informácie o výrobcovi / distribútorovi" }
    ]);
    const getLabel = (key) => {
      if (key === "reviews") return `Zákaznícke hodnotenia (${props.reviewCount ?? props.product.productReviewsCount ?? 0})`;
      return sections.value.find((s) => s.key === key)?.label ?? key;
    };
    const openKey = ref(null);
    __expose({
      openTab: (key) => {
        openKey.value = key;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: "product-tabs",
        class: "mt-24 border-t border-gray-200 bg-white"
      }, _attrs))} data-v-91667e22><!--[-->`);
      ssrRenderList(unref(sections), (section) => {
        _push(`<div class="border-b border-gray-200 md:px-6" data-v-91667e22><button class="w-full flex items-center justify-between py-10 px-6 text-left group focus:outline-none bg-white"${ssrRenderAttr("aria-expanded", openKey.value === section.key)}${ssrRenderAttr("aria-controls", `acc-panel-${section.key}`)}${ssrRenderAttr("id", `acc-trigger-${section.key}`)} data-v-91667e22><span class="${ssrRenderClass([openKey.value === section.key ? "text-black" : "text-gray-900", "font-bold text-xl font-chakra"])}" data-v-91667e22>${ssrInterpolate(getLabel(section.key))}</span><div class="flex items-center gap-6" data-v-91667e22>`);
        if (section.key === "reviews") {
          _push(`<div class="flex items-center" data-v-91667e22>`);
          _push(ssrRenderComponent(RatingStars, {
            rating: props.ratingAverage ?? props.product.ratingAverage ?? 0
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(unref(ChevronDown), {
          class: ["w-5 h-5 flex-shrink-0 transition-transform duration-300 text-gray-500", openKey.value === section.key ? "rotate-180 text-black" : ""],
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</div></button>`);
        if (openKey.value === section.key) {
          _push(`<div${ssrRenderAttr("id", `acc-panel-${section.key}`)}${ssrRenderAttr("aria-labelledby", `acc-trigger-${section.key}`)} role="region" class="overflow-hidden pb-12 px-6 bg-white" data-v-91667e22>`);
          if (section.key === "description") {
            _push(ssrRenderComponent(DescriptionTab, {
              product: __props.product,
              customFieldsMedia: __props.product.customFieldsMedia
            }, null, _parent));
          } else if (section.key === "specs") {
            _push(ssrRenderComponent(SpecsTab, {
              product: __props.product,
              availableSizes: __props.availableSizes
            }, null, _parent));
          } else if (section.key === "reviews") {
            _push(ssrRenderComponent(ReviewsTab, {
              product: __props.product,
              ratingAverage: __props.ratingAverage,
              reviewCount: __props.reviewCount
            }, null, _parent));
          } else if (section.key === "downloads") {
            _push(ssrRenderComponent(DownloadsTab, { product: __props.product }, null, _parent));
          } else if (section.key === "distributor") {
            _push(ssrRenderComponent(DistributorTab, { product: __props.product }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ProductTabs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductTabs = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-91667e22"]]), { __name: "ProductTabs" });

export { ProductTabs as default };
