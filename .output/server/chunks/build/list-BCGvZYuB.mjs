import __nuxt_component_0$1 from './element-B__dpnqL.mjs';
import __nuxt_component_10 from './LinkButton-CTjOSiub.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { b as useLocalePath, M as useInternationalization } from './server.mjs';
import './nuxt-link-B7B0pxEe.mjs';
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
  __name: "list",
  __ssrInlineRender: true,
  emits: ["logout"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    function handleLogout() {
      emit("logout");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AccountMenuElement = __nuxt_component_0$1;
      const _component_FormLinkButton = __nuxt_component_10;
      _push(`<menu${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-3" }, _attrs))}><li>`);
      _push(ssrRenderComponent(_component_AccountMenuElement, {
        link: unref(formatLink)("/account"),
        label: _ctx.$t("account.menu.overview")
      }, null, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_AccountMenuElement, {
        link: unref(formatLink)("/account/profile"),
        label: _ctx.$t("account.menu.yourProfile")
      }, null, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_AccountMenuElement, {
        link: unref(formatLink)("/account/address"),
        label: _ctx.$t("account.menu.addresses")
      }, null, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_AccountMenuElement, {
        link: unref(formatLink)("/account/order"),
        label: _ctx.$t("account.menu.orders")
      }, null, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_FormLinkButton, {
        class: "text-other-sale text-normal hover:border-b hover:border-other-sale",
        onClick: handleLogout,
        label: _ctx.$t("account.menu.logout")
      }, null, _parent));
      _push(`</li></menu>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/menu/list.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "AccountMenuList" });

export { __nuxt_component_0 as default };
