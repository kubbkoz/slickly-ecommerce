import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, useModel, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { getCategoryRoute, getTranslatedProperty } from '@shopware/helpers';
import { u as useNavigation } from './useNavigation-CF5ohcDB.mjs';
import { b as useLocalePath, M as useInternationalization, d as useRoute } from './server.mjs';
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
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TopNavigation",
  __ssrInlineRender: true,
  props: {
    "currentMenuPosition": {},
    "currentMenuPositionModifiers": {}
  },
  emits: ["update:currentMenuPosition"],
  setup(__props) {
    const currentMenuPosition = useModel(
      __props,
      "currentMenuPosition"
    );
    const { navigationElements } = useNavigation();
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    useRoute();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<nav${ssrRenderAttrs(mergeProps({
        "aria-label": _ctx.$t("layout.ariaLabels.mainNavigation")
      }, _attrs))}><ul role="menubar" class="flex gap-8"><!--[-->`);
      ssrRenderList(unref(navigationElements), (navigationElement, index) => {
        _push(`<li role="none" class="text-surface-on-surface border-b hover:border-surface-on-surface border-transparent has-[.router-link-active]:border-surface-on-surface">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          role: "menuitem",
          "aria-haspopup": navigationElement.children?.length ? "true" : void 0,
          "aria-expanded": navigationElement.children?.length ? currentMenuPosition.value === navigationElement.id : void 0,
          target: navigationElement.externalLink || navigationElement.linkNewTab ? "_blank" : "",
          to: unref(formatLink)(unref(getCategoryRoute)(navigationElement)),
          onClick: ($event) => currentMenuPosition.value = void 0
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(getTranslatedProperty)(navigationElement, "name"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(getTranslatedProperty)(navigationElement, "name")), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></nav>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/header/TopNavigation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_11 = Object.assign(_sfc_main, { __name: "LayoutHeaderTopNavigation" });

export { __nuxt_component_11 as default };
