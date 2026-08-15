import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import __nuxt_component_1 from './index-DKA3nfTy.mjs';
import { defineComponent, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { b as useLocalePath, M as useInternationalization } from './server.mjs';
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
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'pinia';
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
  __name: "LoginData",
  __ssrInlineRender: true,
  props: {
    email: {}
  },
  setup(__props) {
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex-col lg:flex-row flex gap-4" }, _attrs))}><div class="flex-grow">${ssrInterpolate(__props.email)}</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(formatLink)("/account/profile/change-email"),
        class: "leading-0 border-b-1 border-b-solid border-b-brand-primary hover:border-transparent transition-all duration-200 h-6 w-fit inline-flex items-center gap-1 text-brand-primary bg-none bg-transparent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, { name: "shopware:envelope" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(_ctx.$t("account.profile.changeEmailButton"))}`);
          } else {
            return [
              createVNode(_component_Icon, { name: "shopware:envelope" }),
              createTextVNode(" " + toDisplayString(_ctx.$t("account.profile.changeEmailButton")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(formatLink)("/account/profile/change-password"),
        class: "leading-0 border-b-1 border-b-solid border-b-brand-primary hover:border-transparent transition-all duration-200 h-6 w-fit inline-flex items-center gap-1 text-brand-primary bg-none bg-transparent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, { name: "shopware:key" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(_ctx.$t("account.profile.changePasswordButton"))}`);
          } else {
            return [
              createVNode(_component_Icon, { name: "shopware:key" }),
              createTextVNode(" " + toDisplayString(_ctx.$t("account.profile.changePasswordButton")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/personal/LoginData.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main, { __name: "AccountPersonalLoginData" });

export { __nuxt_component_4 as default };
