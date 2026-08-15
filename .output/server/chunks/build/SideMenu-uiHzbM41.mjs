import __nuxt_component_0 from './Sidebar-CUx_e7L7.mjs';
import __nuxt_component_1 from './index-DKA3nfTy.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, withModifiers, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { getCategoryRoute } from '@shopware/helpers';
import { u as useNavigation } from './useNavigation-CF5ohcDB.mjs';
import { a as useSideMenuModal } from './useModal-B6h6WyCV.mjs';
import { b as useLocalePath, M as useInternationalization } from './server.mjs';
import './index-B6MI764M.mjs';
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
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SideMenu",
  __ssrInlineRender: true,
  setup(__props) {
    const { navigationElements } = useNavigation();
    const sideMenuController = useSideMenuModal();
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    const expandedIds = ref([]);
    function isCollapsed(navigationelement) {
      return !expandedIds.value.includes(navigationelement.id);
    }
    const toggleCollapse = (navigationElement) => {
      if (!isCollapsed(navigationElement)) {
        expandedIds.value = expandedIds.value.filter(
          (el) => el !== navigationElement.id
        );
      } else {
        expandedIds.value.push(navigationElement.id);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LayoutSidebar = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_LayoutSidebar, mergeProps({
        controller: unref(sideMenuController),
        side: "left"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex px-4 py-5"${_scopeId}><button type="button" class="inline-flex items-center justify-center p-2 -m-2 text-surface-on-surface rounded-md bg-transparent"${_scopeId}><span class="sr-only"${_scopeId}>${ssrInterpolate(_ctx.$t("layout.sideMenu.close"))}</span>`);
            _push2(ssrRenderComponent(_component_Icon, { name: "shopware:times-s" }, null, _parent2, _scopeId));
            _push2(`</button></div><div class="flex-1 flex flex-row overflow-y-hidden max-w-2xl w-full"${_scopeId}><aside${ssrRenderAttr("aria-label", _ctx.$t("layout.ariaLabels.sidebar"))} class="flex flex-col overflow-y-auto w-full"${_scopeId}><div class="overflow-y-auto"${_scopeId}><ul class="flex flex-col items-start p-x-2 space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(unref(navigationElements), (navigationElement) => {
              _push2(`<li class="flex flex-col flex-1 w-full"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: unref(formatLink)(unref(getCategoryRoute)(navigationElement)),
                class: "flex items-center px-5 py-3 text-base font-normal break-all",
                onClick: unref(sideMenuController).close
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="flex"${_scopeId2}>${ssrInterpolate(navigationElement?.translated?.name)}</span><div class="flex flex-1"${_scopeId2}></div>`);
                    if (navigationElement?.children?.length) {
                      _push3(`<button class="flex items-center w-12 p-4 h-2 bg-transparent"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_Icon, {
                        class: ["text-xl transition-transform duration-300", {
                          "rotate-180": isCollapsed(navigationElement)
                        }],
                        name: "shopware:chevron-up"
                      }, null, _parent3, _scopeId2));
                      _push3(`</button>`);
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      createVNode("span", { class: "flex" }, toDisplayString(navigationElement?.translated?.name), 1),
                      createVNode("div", { class: "flex flex-1" }),
                      navigationElement?.children?.length ? (openBlock(), createBlock("button", {
                        key: 0,
                        class: "flex items-center w-12 p-4 h-2 bg-transparent",
                        onClick: withModifiers(($event) => toggleCollapse(navigationElement), ["stop", "prevent"])
                      }, [
                        createVNode(_component_Icon, {
                          class: ["text-xl transition-transform duration-300", {
                            "rotate-180": isCollapsed(navigationElement)
                          }],
                          name: "shopware:chevron-up"
                        }, null, 8, ["class"])
                      ], 8, ["onClick"])) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              if (navigationElement?.children?.length && !isCollapsed(navigationElement)) {
                _push2(`<ul class="px-0 py-2 m-0"${_scopeId}><!--[-->`);
                ssrRenderList(navigationElement.children, (childElement) => {
                  _push2(`<li${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_NuxtLink, {
                    to: unref(formatLink)(unref(getCategoryRoute)(childElement)),
                    class: "flex items-center p-3 text-base font-normal text-secondary-500 break-all hover:bg-secondary-100 pl-11",
                    onClick: unref(sideMenuController).close
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span${_scopeId2}>${ssrInterpolate(childElement?.translated?.name)}</span>`);
                      } else {
                        return [
                          createVNode("span", null, toDisplayString(childElement?.translated?.name), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</li>`);
                });
                _push2(`<!--]--></ul>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</li>`);
            });
            _push2(`<!--]--></ul></div></aside></div>`);
          } else {
            return [
              createVNode("div", { class: "flex px-4 py-5" }, [
                createVNode("button", {
                  type: "button",
                  class: "inline-flex items-center justify-center p-2 -m-2 text-surface-on-surface rounded-md bg-transparent",
                  onClick: unref(sideMenuController).close
                }, [
                  createVNode("span", { class: "sr-only" }, toDisplayString(_ctx.$t("layout.sideMenu.close")), 1),
                  createVNode(_component_Icon, { name: "shopware:times-s" })
                ], 8, ["onClick"])
              ]),
              createVNode("div", { class: "flex-1 flex flex-row overflow-y-hidden max-w-2xl w-full" }, [
                createVNode("aside", {
                  "aria-label": _ctx.$t("layout.ariaLabels.sidebar"),
                  class: "flex flex-col overflow-y-auto w-full"
                }, [
                  createVNode("div", { class: "overflow-y-auto" }, [
                    createVNode("ul", { class: "flex flex-col items-start p-x-2 space-y-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(navigationElements), (navigationElement) => {
                        return openBlock(), createBlock("li", {
                          key: navigationElement.id,
                          class: "flex flex-col flex-1 w-full"
                        }, [
                          createVNode(_component_NuxtLink, {
                            to: unref(formatLink)(unref(getCategoryRoute)(navigationElement)),
                            class: "flex items-center px-5 py-3 text-base font-normal break-all",
                            onClick: unref(sideMenuController).close
                          }, {
                            default: withCtx(() => [
                              createVNode("span", { class: "flex" }, toDisplayString(navigationElement?.translated?.name), 1),
                              createVNode("div", { class: "flex flex-1" }),
                              navigationElement?.children?.length ? (openBlock(), createBlock("button", {
                                key: 0,
                                class: "flex items-center w-12 p-4 h-2 bg-transparent",
                                onClick: withModifiers(($event) => toggleCollapse(navigationElement), ["stop", "prevent"])
                              }, [
                                createVNode(_component_Icon, {
                                  class: ["text-xl transition-transform duration-300", {
                                    "rotate-180": isCollapsed(navigationElement)
                                  }],
                                  name: "shopware:chevron-up"
                                }, null, 8, ["class"])
                              ], 8, ["onClick"])) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1032, ["to", "onClick"]),
                          navigationElement?.children?.length && !isCollapsed(navigationElement) ? (openBlock(), createBlock("ul", {
                            key: 0,
                            class: "px-0 py-2 m-0"
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(navigationElement.children, (childElement) => {
                              return openBlock(), createBlock("li", {
                                key: childElement.id
                              }, [
                                createVNode(_component_NuxtLink, {
                                  to: unref(formatLink)(unref(getCategoryRoute)(childElement)),
                                  class: "flex items-center p-3 text-base font-normal text-secondary-500 break-all hover:bg-secondary-100 pl-11",
                                  onClick: unref(sideMenuController).close
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", null, toDisplayString(childElement?.translated?.name), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["to", "onClick"])
                              ]);
                            }), 128))
                          ])) : createCommentVNode("", true)
                        ]);
                      }), 128))
                    ])
                  ])
                ], 8, ["aria-label"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/SideMenu.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SideMenu = Object.assign(_sfc_main, { __name: "LayoutSideMenu" });

export { SideMenu as default };
