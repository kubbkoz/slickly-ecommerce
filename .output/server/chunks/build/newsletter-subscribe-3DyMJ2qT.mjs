import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { d as useRoute, e as useShopwareContext } from './server.mjs';
import { u as useApiErrorsResolver } from './useApiErrorsResolver-BfHgRTVy.mjs';
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
  __name: "newsletter-subscribe",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useShopwareContext();
    const error = ref(false);
    const errorMessage = ref("");
    const loading = ref(true);
    useApiErrorsResolver(
      "newsletter_subscribe_confirmation"
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto px-6 sm:px-4 py-10" }, _attrs))}><div class="max-w-2xl mx-auto"><h1 class="text-3xl md:text-4xl font-bold mb-6">${ssrInterpolate(_ctx.$t("newsletter.subscriptionHeader"))}</h1>`);
      if (unref(loading)) {
        _push(`<div class="flex flex-row items-center gap-3 justify-center py-10"><p class="text-base text-surface-on-surface">${ssrInterpolate(_ctx.$t("newsletter.messages.loading"))}</p><div class="size-5 i-carbon-circle-dash animate-spin animate-count-infinite animate-duration-2000 text-brand-primary"></div></div>`);
      } else {
        _push(`<div class="${ssrRenderClass([{
          "bg-states-error-container border-states-error text-states-on-error-container": unref(error),
          "bg-states-success-container border-states-success text-states-on-success-container": !unref(error)
        }, "p-6 rounded-lg border-2"])}"><p class="text-lg font-medium">${ssrInterpolate(unref(error) ? unref(errorMessage) || _ctx.$t("errors.message-default") : _ctx.$t("newsletter.messages.newsletterSubscribed"))}</p>`);
        if (!unref(error)) {
          _push(`<p class="mt-4 text-base text-states-on-success-container opacity-80">${ssrInterpolate(_ctx.$t("newsletter.subscriptionInfo"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(error)) {
          _push(`<div class="mt-6">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/",
            class: "inline-flex items-center gap-2 px-4 py-2 bg-states-error text-states-on-error rounded-lg hover:opacity-90 transition-opacity font-medium"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(_ctx.$t("newsletter.backToHomepage"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(_ctx.$t("newsletter.backToHomepage")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/pages/newsletter-subscribe.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
