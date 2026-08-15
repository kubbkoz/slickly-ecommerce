import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import __nuxt_component_2$1 from './NewsletterBox-DNSJZCIB.mjs';
import { defineComponent, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { getTranslatedProperty, getCategoryRoute } from '@shopware/helpers';
import { u as useNavigation } from './useNavigation-CF5ohcDB.mjs';
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
import './composables-x8_ENpEe.mjs';
import './InputField-D300m7hz.mjs';
import './BaseInput-Bd1YNFpA.mjs';
import './BaseButton-CtNN_2CK.mjs';
import '@regle/core';
import './useNewsletter-EwyUjPBW.mjs';
import './useApiErrorsResolver-BfHgRTVy.mjs';
import '@shopware/api-client';
import './i18n-validators-CFSHkMK2.mjs';
import '@regle/rules';
import 'pinia';
import '@iconify/vue';
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    const { navigationElements } = useNavigation({ type: "footer-navigation" });
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_2;
      const _component_LayoutFooterNewsletterBox = __nuxt_component_2$1;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-brand-primary" }, _attrs))}><div class="container mx-auto py-10 px-6 sm:px-0"><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "mb-4 md:mb-0",
        to: unref(formatLink)(`/`)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtImg, {
              class: "h-16 sm:h-20",
              src: "/logo-white.svg",
              alt: "logo of the shop"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtImg, {
                class: "h-16 sm:h-20",
                src: "/logo-white.svg",
                alt: "logo of the shop"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--[-->`);
      ssrRenderList(unref(navigationElements), (navigationElement) => {
        _push(`<div class="flex flex-col gap-4"><div class="text-surface-inverse-on-surface font-semibold">${ssrInterpolate(unref(getTranslatedProperty)(navigationElement, "name"))}</div>`);
        if (navigationElement.childCount > 0) {
          _push(`<ul class="list-none flex flex-col gap-2"><!--[-->`);
          ssrRenderList(navigationElement.children, (navigationChild) => {
            _push(`<li>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              target: navigationChild.externalLink || navigationChild.linkNewTab ? "_blank" : "",
              to: unref(formatLink)(unref(getCategoryRoute)(navigationChild)),
              class: "text-surface-surface-primary hover:text-surface-surface-primary-hover"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(unref(getTranslatedProperty)(navigationChild, "name"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(getTranslatedProperty)(navigationChild, "name")), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(_component_LayoutFooterNewsletterBox, { class: "col-span-1 sm:col-span-2 md:col-span-1" }, null, _parent));
      _push(`</div></div></footer>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/Footer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Footer = Object.assign(_sfc_main, { __name: "LayoutFooter" });

export { Footer as default };
