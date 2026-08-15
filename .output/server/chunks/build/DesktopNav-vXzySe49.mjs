import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { ChevronDown } from 'lucide-vue-next';
import MegaMenu from './MegaMenu-DDO8AaUH.mjs';
import { b as useLocalePath, e as useShopwareContext, d as useRoute, P as getLocaleFromPath, h as useAsyncData, j as useNuxtApp, G as getCategoryUrl, i as useRuntimeConfig } from './server.mjs';
import { u as useStaticTranslations } from './useStaticTranslations-DjO9xa-s.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';
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
import './BaseButton-BJMOoNbK.mjs';
import 'pinia';
import '@iconify/vue';
import '@shopware/api-client';
import '@shopware/helpers';
import 'js-cookie';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './media-BNPyNy3v.mjs';
import './ProductCardMini-C5JVac9Q.mjs';
import './useProductHelpers-Ch_jrkwO.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DesktopNav",
  __ssrInlineRender: true,
  props: {
    isScrolled: { type: Boolean },
    isHidden: { type: Boolean }
  },
  setup(__props) {
    const localePath = useLocalePath();
    useStaticTranslations();
    const { apiClient } = useShopwareContext();
    const route = useRoute();
    const { currentLanguageId } = useShopwareLanguage();
    const currentLocale = getLocaleFromPath(route.path);
    const config = useRuntimeConfig();
    const cacheKey = `desktop-nav-${currentLanguageId.value}`;
    const { data: navigationElements } = useAsyncData(
      cacheKey,
      async () => {
        try {
          const rootId = config.public.shopware.ids.rootCategory;
          const response = await apiClient.invoke("readNavigation post /navigation/{activeId}/{rootId}", {
            pathParams: { activeId: rootId, rootId },
            body: {
              depth: 2,
              associations: {
                media: {},
                seoUrls: {}
              }
            },
            headers: {
              "sw-language-id": currentLanguageId.value
            }
          });
          return response.data || [];
        } catch (e) {
          return [];
        }
      },
      {
        // Only re-fetch when language changes (locale switch), not on every navigation
        watch: [currentLanguageId],
        // Return cached SSR payload immediately — prevents any client-side flash
        getCachedData(key) {
          const nuxtApp = useNuxtApp();
          return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        }
      }
    );
    const navItems = computed(() => {
      return navigationElements.value || [];
    });
    const activeCategory = ref(null);
    const isMegaMenuVisible = ref(false);
    let closeTimeout = null;
    function handleMouseLeave() {
      closeTimeout = setTimeout(() => {
        isMegaMenuVisible.value = false;
      }, 150);
    }
    function handleMenuEnter() {
      if (closeTimeout) clearTimeout(closeTimeout);
      isMegaMenuVisible.value = true;
    }
    function closeMegaMenu() {
      if (closeTimeout) clearTimeout(closeTimeout);
      isMegaMenuVisible.value = false;
      activeCategory.value = null;
    }
    watch(() => route.path, closeMegaMenu);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["hidden lg:block relative z-30 w-full desktop-nav-container transition-[max-height,opacity] duration-150 ease-linear", __props.isHidden ? "overflow-hidden" : "overflow-visible"],
        style: __props.isHidden ? "max-height: 0" : "max-height: 80px"
      }, _attrs))}><div class="${ssrRenderClass([{ "opacity-0 pointer-events-none": __props.isHidden, "opacity-100 pointer-events-auto": !__props.isHidden }, "bg-black border-t border-black transition-all duration-150 ease-linear w-full overflow-visible"])}"><div class="container mx-auto px-4 lg:px-8"><div class="flex items-center justify-between"><div class="flex items-center space-x-8"><!--[-->`);
      ssrRenderList(unref(navItems), (link) => {
        _push(`<div class="static py-4 px-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)(unref(getCategoryUrl)(link), unref(currentLocale)),
          class: ["flex items-center text-sm font-bold uppercase tracking-widest transition-all duration-300 font-tech text-white hover:text-amber", { "text-amber": unref(activeCategory)?.id === link.id && unref(isMegaMenuVisible) }]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.name)} `);
              if (link.children && link.children.length > 0) {
                _push2(ssrRenderComponent(unref(ChevronDown), {
                  class: ["w-3 h-3 ml-1 transition-transform duration-300", { "rotate-180": unref(activeCategory)?.id === link.id && unref(isMegaMenuVisible) }]
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createTextVNode(toDisplayString(link.name) + " ", 1),
                link.children && link.children.length > 0 ? (openBlock(), createBlock(unref(ChevronDown), {
                  key: 0,
                  class: ["w-3 h-3 ml-1 transition-transform duration-300", { "rotate-180": unref(activeCategory)?.id === link.id && unref(isMegaMenuVisible) }]
                }, null, 8, ["class"])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(MegaMenu, {
        category: unref(activeCategory),
        "is-visible": unref(isMegaMenuVisible),
        onMouseenter: handleMenuEnter,
        onMouseleave: handleMouseLeave,
        onClick: closeMegaMenu
      }, null, _parent));
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/navbar/DesktopNav.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DesktopNav = Object.assign(_sfc_main, { __name: "DesktopNav" });

export { DesktopNav as default };
