import __nuxt_component_0 from './element-B__dpnqL.mjs';
import __nuxt_component_10 from './LinkButton-CTjOSiub.mjs';
import { defineComponent, useTemplateRef, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { o as onClickOutside } from './index-B6MI764M.mjs';
import { f as useUser, c as useRouter, b as useLocalePath, M as useInternationalization } from './server.mjs';
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
  __name: "AccountMenu",
  __ssrInlineRender: true,
  emits: ["closeAccountMenu"],
  setup(__props, { emit: __emit }) {
    const { logout } = useUser();
    const router = useRouter();
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    const emit = __emit;
    const accountMenuContainer = useTemplateRef("accountMenuContainer");
    function handleCloseAccountMenu() {
      emit("closeAccountMenu");
    }
    function handleLogout() {
      logout();
      router.push(formatLink("/"));
      handleCloseAccountMenu();
    }
    onClickOutside(accountMenuContainer, () => {
      handleCloseAccountMenu();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AccountMenuElement = __nuxt_component_0;
      const _component_FormLinkButton = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "accountMenuContainer",
        ref: accountMenuContainer,
        class: "z-20"
      }, _attrs))}><div class="px-6 py-4 border bg-surface-surface flex flex-col gap-3">`);
      _push(ssrRenderComponent(_component_AccountMenuElement, {
        class: "text-nowrap",
        link: unref(formatLink)("/account"),
        label: _ctx.$t("account.menu.overview"),
        onClick: handleCloseAccountMenu
      }, null, _parent));
      _push(ssrRenderComponent(_component_AccountMenuElement, {
        class: "text-nowrap",
        link: unref(formatLink)("/account/profile"),
        label: _ctx.$t("account.menu.yourProfile"),
        onClick: handleCloseAccountMenu
      }, null, _parent));
      _push(ssrRenderComponent(_component_AccountMenuElement, {
        class: "text-nowrap",
        link: unref(formatLink)("/account/address"),
        label: _ctx.$t("account.menu.addresses"),
        onClick: handleCloseAccountMenu
      }, null, _parent));
      _push(ssrRenderComponent(_component_AccountMenuElement, {
        class: "text-nowrap",
        link: unref(formatLink)("/account/order"),
        label: _ctx.$t("account.menu.orders"),
        onClick: handleCloseAccountMenu
      }, null, _parent));
      _push(ssrRenderComponent(_component_FormLinkButton, {
        class: "text-other-sale text-normal hover:border-b hover:border-other-sale text-left",
        onClick: handleLogout,
        label: _ctx.$t("account.menu.logout")
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/AccountMenu.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AccountMenu = Object.assign(_sfc_main, { __name: "LayoutAccountMenu" });

export { AccountMenu as default };
