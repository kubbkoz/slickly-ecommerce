import __nuxt_component_0$1 from './Element-XVWuoBtA.mjs';
import __nuxt_component_1 from './Divider-CMbfAKW7.mjs';
import { _ as __nuxt_component_0$2 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useBreadcrumbs } from './useBreadcrumbs-Dt7IBWvA.mjs';
import { b as useLocalePath, M as useInternationalization } from './server.mjs';
import './index-DKA3nfTy.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { breadcrumbs } = useBreadcrumbs();
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LayoutBreadcrumbsElement = __nuxt_component_0$1;
      const _component_LayoutBreadcrumbsDivider = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: "container hidden lg:flex mt-8 mb-8 px-4 sm:px-0 mx-auto",
        "aria-label": _ctx.$t("layout.ariaLabels.breadcrumb")
      }, _attrs))}><ol class="inline-flex items-center space-x-1 md:space-x-3"><li class="inline-flex items-center">`);
      _push(ssrRenderComponent(_component_LayoutBreadcrumbsElement, {
        to: unref(formatLink)(`/`)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}><div class="w-5 h-5 i-carbon-home mr-2"${_scopeId}></div><div${_scopeId}>${ssrInterpolate(_ctx.$t("home"))}</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                createVNode("div", { class: "w-5 h-5 i-carbon-home mr-2" }),
                createVNode("div", null, toDisplayString(_ctx.$t("home")), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_LayoutBreadcrumbsDivider, null, null, _parent));
      _push(`</li><!--[-->`);
      ssrRenderList(unref(breadcrumbs), (breadcrumb, index) => {
        _push(`<li class="inline-flex items-center">`);
        if (breadcrumb.path) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: unref(formatLink)(breadcrumb.path)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_LayoutBreadcrumbsElement, null, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(breadcrumb.name)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(breadcrumb.name), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_LayoutBreadcrumbsElement, null, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(breadcrumb.name), 1)
                    ]),
                    _: 2
                  }, 1024)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(ssrRenderComponent(_component_LayoutBreadcrumbsElement, null, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(breadcrumb.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(breadcrumb.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        }
        if (index < unref(breadcrumbs).length - 1) {
          _push(ssrRenderComponent(_component_LayoutBreadcrumbsDivider, null, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ol></nav>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/breadcrumbs/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "LayoutBreadcrumbs" });

export { __nuxt_component_0 as default };
