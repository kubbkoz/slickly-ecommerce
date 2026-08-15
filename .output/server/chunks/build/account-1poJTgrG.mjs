import __nuxt_component_0 from './list-BCGvZYuB.mjs';
import { defineComponent, mergeProps, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { f as useUser, c as useRouter, d as useRoute, b as useLocalePath, M as useInternationalization, K as useNotifications } from './server.mjs';
import './element-B__dpnqL.mjs';
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
import './LinkButton-CTjOSiub.mjs';

function useAuthGuardRedirection(params) {
  const { isLoggedIn } = useUser();
  useRouter();
  useNotifications();
  watch(
    isLoggedIn,
    (isLoggedIn2) => {
    },
    {
      immediate: true
    }
  );
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "account",
  __ssrInlineRender: true,
  setup(__props) {
    const { logout } = useUser();
    const router = useRouter();
    const route = useRoute();
    route.query.to;
    useAuthGuardRedirection();
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    function handleLogout() {
      logout();
      router.push(formatLink("/"));
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AccountMenuList = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto px-6 sm:px-4 mt-5 md:mt-20 flex gap-20" }, _attrs))}><nav class="flex-col gap-3 hidden md:flex text-nowrap"${ssrRenderAttr("aria-label", _ctx.$t("layout.ariaLabels.accountNavigation"))}><h2 class="text-brand-primary text-base font-bold leading-normal">${ssrInterpolate(_ctx.$t("account.menu.header"))}</h2>`);
      _push(ssrRenderComponent(_component_AccountMenuList, { onLogout: handleLogout }, null, _parent));
      _push(`</nav><div class="w-full">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/layouts/account.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
