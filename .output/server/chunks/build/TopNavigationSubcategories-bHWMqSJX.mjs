import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import __nuxt_component_1 from './index-DKA3nfTy.mjs';
import { defineComponent, useModel, computed, unref, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { getCategoryRoute } from '@shopware/helpers';
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
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'pinia';
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
  __name: "TopNavigationSubcategories",
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
    const subcategories = computed(() => {
      return navigationElements.value?.find(
        (element) => element.id === currentMenuPosition.value
      )?.children ?? [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      if (unref(subcategories).length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-6 items-start columns-3" }, _attrs))}><!--[-->`);
        ssrRenderList(unref(subcategories), (subcategory) => {
          _push(`<div class="mb-8 break-inside-avoid-column">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            class: "mb-3 block",
            role: "menuitem",
            target: subcategory.externalLink || subcategory.linkNewTab ? "_blank" : "",
            to: unref(formatLink)(unref(getCategoryRoute)(subcategory)),
            onClick: ($event) => currentMenuPosition.value = void 0
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="text-brand-primary font-bold flex items-center gap-1"${_scopeId}>${ssrInterpolate(subcategory.name)} `);
                if (subcategory.children.length) {
                  _push2(ssrRenderComponent(_component_Icon, {
                    name: "shopware:chevron-right-xxs",
                    class: "w-1.5"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                return [
                  createVNode("div", { class: "text-brand-primary font-bold flex items-center gap-1" }, [
                    createTextVNode(toDisplayString(subcategory.name) + " ", 1),
                    subcategory.children.length ? (openBlock(), createBlock(_component_Icon, {
                      key: 0,
                      name: "shopware:chevron-right-xxs",
                      class: "w-1.5"
                    })) : createCommentVNode("", true)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
          if (subcategory.children.length) {
            _push(`<ul class="gap-3 flex flex-col"><!--[-->`);
            ssrRenderList(subcategory.children, (child) => {
              _push(`<li>`);
              _push(ssrRenderComponent(_component_NuxtLink, {
                role: "menuitem",
                target: child.externalLink || child.linkNewTab ? "_blank" : "",
                to: unref(formatLink)(unref(getCategoryRoute)(child)),
                onClick: ($event) => currentMenuPosition.value = void 0
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<div${_scopeId}>${ssrInterpolate(child.name)}</div>`);
                  } else {
                    return [
                      createVNode("div", null, toDisplayString(child.name), 1)
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
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/header/TopNavigationSubcategories.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TopNavigationSubcategories = Object.assign(_sfc_main, { __name: "LayoutHeaderTopNavigationSubcategories" });

export { TopNavigationSubcategories as default };
