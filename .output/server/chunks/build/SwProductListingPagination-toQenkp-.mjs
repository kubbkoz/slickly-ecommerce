import __nuxt_component_0 from './SwPagination-f5VMphAR.mjs';
import __nuxt_component_0$1 from './ChevronIcon-Aj1t6zS4.mjs';
import { defineComponent, useModel, mergeProps, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import './useCmsTranslations-C7n8Bwji.mjs';
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
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwProductListingPagination",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    total: {},
    current: {},
    limit: {},
    translations: {}
  }, {
    "limit": { required: true },
    "limitModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["changePage", "changeLimit"], ["update:limit"]),
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const limitModel = useModel(__props, "limit");
    const handlePageChange = (page) => {
      emit("changePage", page);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwPagination = __nuxt_component_0;
      const _component_SwChevronIcon = __nuxt_component_0$1;
      if (__props.total > 0) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-6 sm:gap-8 mt-6 sm:mt-8" }, _attrs))}><div class="flex justify-center w-full">`);
        _push(ssrRenderComponent(_component_SwPagination, {
          total: __props.total,
          current: __props.current,
          onChangePage: handlePageChange
        }, null, _parent));
        _push(`</div><div class="flex justify-center items-center gap-3 sm:gap-4"><label for="limit" class="text-sm sm:text-base text-surface-on-surface" data-testid="listing-pagination-limit-label">${ssrInterpolate(__props.translations.listing.perPage)}</label><div class="relative"><select id="limit" name="limitchoices" class="appearance-none bg-surface-surface border border-outline-outline hover:border-outline-outline-primary focus:border-outline-outline-primary focus:ring-2 focus:ring-outline-outline-primary focus:ring-opacity-20 px-4 py-2 pr-10 rounded-md text-sm sm:text-base text-surface-on-surface cursor-pointer transition-colors" data-testid="listing-pagination-limit-select"><option${ssrRenderAttr("value", 1)}${ssrIncludeBooleanAttr(Array.isArray(limitModel.value) ? ssrLooseContain(limitModel.value, 1) : ssrLooseEqual(limitModel.value, 1)) ? " selected" : ""}>1 ${ssrInterpolate(__props.translations.listing.product)}</option><option${ssrRenderAttr("value", 15)}${ssrIncludeBooleanAttr(Array.isArray(limitModel.value) ? ssrLooseContain(limitModel.value, 15) : ssrLooseEqual(limitModel.value, 15)) ? " selected" : ""}>15 ${ssrInterpolate(__props.translations.listing.products)}</option><option${ssrRenderAttr("value", 30)}${ssrIncludeBooleanAttr(Array.isArray(limitModel.value) ? ssrLooseContain(limitModel.value, 30) : ssrLooseEqual(limitModel.value, 30)) ? " selected" : ""}>30 ${ssrInterpolate(__props.translations.listing.products)}</option><option${ssrRenderAttr("value", 45)}${ssrIncludeBooleanAttr(Array.isArray(limitModel.value) ? ssrLooseContain(limitModel.value, 45) : ssrLooseEqual(limitModel.value, 45)) ? " selected" : ""}>45 ${ssrInterpolate(__props.translations.listing.products)}</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">`);
        _push(ssrRenderComponent(_component_SwChevronIcon, {
          direction: "down",
          size: 16
        }, null, _parent));
        _push(`</div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/SwProductListingPagination.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "SwProductListingPagination" });

export { __nuxt_component_2 as default };
