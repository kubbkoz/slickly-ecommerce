import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { e as useShopwareContext, l as useSessionContext, K as useNotifications, d as useRoute, c as useRouter, m as useI18n } from './server.mjs';
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
  __name: "confirm",
  __ssrInlineRender: true,
  setup(__props) {
    useShopwareContext();
    useSessionContext();
    useNotifications();
    const { query } = useRoute();
    useRouter();
    const { t } = useI18n();
    Array.isArray(query.hash) ? query.hash[0] : query.hash;
    Array.isArray(query.em) ? query.em[0] : query.em;
    const alreadyConfirmedError = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex justify-center items-center min-h-[60vh] px-4" }, _attrs))}>`);
      if (!unref(alreadyConfirmedError)) {
        _push(`<div class="flex flex-row items-center gap-3"><p class="text-base text-surface-on-surface">${ssrInterpolate(_ctx.$t("account.messages.verifying"))}</p><div class="size-5 i-carbon-circle-dash animate-spin animate-count-infinite animate-duration-2000 text-brand-primary"></div></div>`);
      } else {
        _push(`<div class="flex flex-col items-center gap-4 max-w-md text-center"><div class="size-12 i-carbon-error text-states-error"></div><p class="text-lg font-medium text-states-error">${ssrInterpolate(_ctx.$t("errors.CHECKOUT__CUSTOMER_IS_ALREADY_CONFIRMED"))}</p></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/pages/registration/confirm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
