import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { d as useRoute, b as useLocalePath, M as useInternationalization } from './server.mjs';
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
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "CheckoutSuccessUnpaidPage"
  },
  __name: "unpaid",
  __ssrInlineRender: true,
  setup(__props) {
    const { params } = useRoute();
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto w-1/2 mb-24 mt-24 text-center" }, _attrs))}><h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-surface-on-surface md:text-5xl lg:text-6xl dark:text-white">${ssrInterpolate(_ctx.$t("checkout.yourOrder"))} <span class="underline underline-offset-3 decoration-8 decoration-red-400 dark:decoration-red-600">${ssrInterpolate(_ctx.$t("checkout.orderUnpaid"))}</span></h1><p class="text-lg font-normal text-secondary-500y-500y-500y-500y-500y-500y-500y-500 lg:text-xl dark:text-surface-on-surface-400y-400y-400">${ssrInterpolate(_ctx.$t("checkout.unpaidStatus"))}</p><div class="mt-12 text-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(formatLink)(`/checkout/success/${unref(params).id}`),
        class: "inline-flex justify-center items-center py-2 px-4 text-base font-medium text-center text-white bg-primary rounded-lg hover:bg-secondary-400 focus:ring-4 focus:ring-primary dark:focus:ring-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("checkout.checkOrderDetails"))} <div class="i-carbon-undo ml-2"${_scopeId}></div>`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$t("checkout.checkOrderDetails")) + " ", 1),
              createVNode("div", { class: "i-carbon-undo ml-2" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/pages/checkout/success/[id]/unpaid.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
