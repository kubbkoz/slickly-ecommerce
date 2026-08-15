import __nuxt_component_0$1 from './ChevronIcon-Aj1t6zS4.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { buildUrlPrefix, getCategoryRoute, urlIsAbsolute, getTranslatedProperty } from '@shopware/helpers';
import { RouterLink } from 'vue-router';
import { u as useUrlResolver } from './useUrlResolver-CibZ14y1.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
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
import 'node:url';
import '@iconify/utils';
import 'consola';
import './server.mjs';
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
  __name: "SwCategoryNavigationLink",
  __ssrInlineRender: true,
  props: {
    navigationElement: {},
    isActive: { type: Boolean },
    isExpanded: { type: Boolean },
    level: {}
  },
  emits: ["toggle"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { getUrlPrefix } = useUrlResolver();
    const url = computed(() => {
      return buildUrlPrefix(
        getCategoryRoute(props.navigationElement),
        getUrlPrefix()
      );
    });
    const hasChildren = computed(() => {
      return props.navigationElement.children && props.navigationElement.children.length > 0;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwChevronIcon = __nuxt_component_0$1;
      if (props.level === 0) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "self-stretch flex flex-col justify-center items-center" }, _attrs))}><div class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-start items-center gap-1"><div class="flex-1 flex justify-start items-center gap-2.5">`);
        if (!unref(urlIsAbsolute)(url.value.path)) {
          _push(ssrRenderComponent(unref(RouterLink), {
            to: url.value,
            class: [
              "flex-1 justify-start text-surface-on-surface text-base leading-normal font-bold"
            ]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(getTranslatedProperty)(__props.navigationElement, "name"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(getTranslatedProperty)(__props.navigationElement, "name")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<a${ssrRenderAttr("href", url.value.path)} class="${ssrRenderClass([
            "flex-1 justify-start text-surface-on-surface text-base leading-normal font-bold"
          ])}"${ssrRenderAttr(
            "target",
            __props.navigationElement.externalLink || __props.navigationElement.linkNewTab ? "_blank" : ""
          )}>${ssrInterpolate(unref(getTranslatedProperty)(__props.navigationElement, "name"))}</a>`);
        }
        _push(`</div>`);
        if (hasChildren.value) {
          _push(`<button class="w-6 h-6 relative flex items-center justify-center bg-transparent cursor-pointer focus:outline-none" type="button"${ssrRenderAttr("aria-label", props.isExpanded ? "Collapse" : "Expand")}>`);
          _push(ssrRenderComponent(_component_SwChevronIcon, {
            direction: props.isExpanded ? "up" : "down",
            size: 20
          }, null, _parent));
          _push(`</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "self-stretch flex flex-col justify-center items-center" }, _attrs))}><div class="self-stretch pl-4 py-1.5 inline-flex justify-start items-center gap-2"><div class="py-0.5 flex-1 flex justify-start items-center gap-2.5">`);
        if (!unref(urlIsAbsolute)(url.value.path)) {
          _push(ssrRenderComponent(unref(RouterLink), {
            to: url.value,
            class: [
              "justify-start text-surface-on-surface text-base leading-normal",
              props.isActive ? "font-bold" : "font-normal"
            ]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(getTranslatedProperty)(__props.navigationElement, "name"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(getTranslatedProperty)(__props.navigationElement, "name")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<a${ssrRenderAttr("href", url.value.path)} class="${ssrRenderClass([
            "justify-start text-surface-on-surface text-base leading-normal",
            props.isActive ? "font-bold" : "font-normal"
          ])}"${ssrRenderAttr(
            "target",
            __props.navigationElement.externalLink || __props.navigationElement.linkNewTab ? "_blank" : ""
          )}>${ssrInterpolate(unref(getTranslatedProperty)(__props.navigationElement, "name"))}</a>`);
        }
        _push(`</div>`);
        if (hasChildren.value) {
          _push(`<button class="w-6 h-6 relative flex items-center justify-center bg-transparent cursor-pointer focus:outline-none" type="button"${ssrRenderAttr("aria-label", props.isExpanded ? "Collapse" : "Expand")}>`);
          _push(ssrRenderComponent(_component_SwChevronIcon, {
            direction: props.isExpanded ? "up" : "down",
            size: 20
          }, null, _parent));
          _push(`</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwCategoryNavigationLink.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "SwCategoryNavigationLink" });

export { __nuxt_component_0 as default };
