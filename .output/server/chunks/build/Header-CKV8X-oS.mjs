import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import __nuxt_component_2$1 from './Search-CjGAmj-r.mjs';
import __nuxt_component_3 from './SearchIcon-BJe8bZvl.mjs';
import __nuxt_component_0$1 from './IconButton-C-Xi6SDN.mjs';
import __nuxt_component_5 from './MyAccountIcon-BH1fNXGS.mjs';
import { a as useCart, T as useWishlist, f as useUser, c as useRouter, b as useLocalePath, M as useInternationalization, d as useRoute, I as __nuxt_component_0$1$1 } from './server.mjs';
import __nuxt_component_7 from './WishlistIcon-DEHwQDTQ.mjs';
import __nuxt_component_8 from './CartIcon-BnUnDg2e.mjs';
import __nuxt_component_9 from './MobileMenuIcon-BOo8nFrs.mjs';
import __nuxt_component_10 from './LinkButton-CTjOSiub.mjs';
import __nuxt_component_11 from './TopNavigation-CQHBW2fA.mjs';
import { defineComponent, ref, watch, unref, withCtx, createVNode, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useModal, a as useSideMenuModal } from './useModal-B6h6WyCV.mjs';
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
import '@shopware/helpers';
import './BaseInput-Bd1YNFpA.mjs';
import './index-DKA3nfTy.mjs';
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
import './Suggest-Bki7k34l.mjs';
import './Price-D7PucwgC.mjs';
import './usePrice-CDJKOx8c.mjs';
import './useProductPrice--vjxv0K3.mjs';
import './index-B6MI764M.mjs';
import './useApiErrorsResolver-BfHgRTVy.mjs';
import './MainCounter-CRUGyARM.mjs';
import './useNavigation-CF5ohcDB.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const { count: cartCount } = useCart();
    useWishlist();
    const { isLoggedIn } = useUser();
    const { push } = useRouter();
    const loginModalController = useModal();
    const sideMenuController = useSideMenuModal();
    const currentMenuPosition = ref(void 0);
    const mobileSearchActive = ref(false);
    const searchText = ref("");
    const miniCartActive = ref(false);
    function toggleMiniCart() {
      miniCartActive.value = !miniCartActive.value;
    }
    const accountMenuActive = ref(false);
    function toggleAccountMenu() {
      accountMenuActive.value = !accountMenuActive.value;
    }
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    function toggleMobileSearch() {
      mobileSearchActive.value = !mobileSearchActive.value;
    }
    function handleMyAccountClick() {
      if (!isLoggedIn.value) {
        loginModalController.open();
      } else {
        toggleAccountMenu();
      }
    }
    const route = useRoute();
    watch(
      () => route.path,
      () => {
        miniCartActive.value = false;
        accountMenuActive.value = false;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_2;
      const _component_LayoutHeaderSearch = __nuxt_component_2$1;
      const _component_LayoutHeaderSearchIcon = __nuxt_component_3;
      const _component_FormIconButton = __nuxt_component_0$1;
      const _component_LayoutHeaderMyAccountIcon = __nuxt_component_5;
      const _component_ClientOnly = __nuxt_component_0$1$1;
      const _component_LayoutHeaderWishlistIcon = __nuxt_component_7;
      const _component_LayoutHeaderCartIcon = __nuxt_component_8;
      const _component_LayoutHeaderMobileMenuIcon = __nuxt_component_9;
      const _component_FormLinkButton = __nuxt_component_10;
      const _component_LayoutHeaderTopNavigation = __nuxt_component_11;
      const _component_client_only = __nuxt_component_0$1$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="border-b"><div class="container mx-auto flex sm:grid sm:grid-cols-3 items-center justify-between py-3.5 px-6 sm:px-0 relative">`);
      if (!unref(mobileSearchActive)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(formatLink)("/"),
          class: "flex-shrink-0 sm:justify-self-start"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_NuxtImg, {
                class: "h-20 max-sm:h-10",
                src: "/logo.svg",
                alt: "logo"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_NuxtImg, {
                  class: "h-20 max-sm:h-10",
                  src: "/logo.svg",
                  alt: "logo"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_LayoutHeaderSearch, {
          modelValue: unref(searchText),
          "onUpdate:modelValue": ($event) => isRef(searchText) ? searchText.value = $event : null,
          class: "max-sm:hidden justify-self-center w-full relative"
        }, null, _parent));
        _push(`<div class="flex gap-4 flex-shrink-0 sm:justify-self-end">`);
        _push(ssrRenderComponent(_component_LayoutHeaderSearchIcon, {
          onClick: toggleMobileSearch,
          class: "hidden max-sm:block"
        }, null, _parent));
        _push(`<div class="relative">`);
        _push(ssrRenderComponent(_component_FormIconButton, {
          type: "ghost",
          onClick: handleMyAccountClick,
          "aria-label": _ctx.$t("layout.header.myAccount")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_LayoutHeaderMyAccountIcon, null, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_LayoutHeaderMyAccountIcon)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(_component_ClientOnly, null, {
          fallback: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_LayoutHeaderWishlistIcon, { counter: 0 }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_LayoutHeaderWishlistIcon, { counter: 0 })
              ];
            }
          })
        }, _parent));
        _push(ssrRenderComponent(_component_FormIconButton, {
          type: "ghost",
          onClick: toggleMiniCart,
          "aria-label": _ctx.$t("layout.header.cart")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_ClientOnly, null, {
                fallback: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_LayoutHeaderCartIcon, { counter: 0 }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_LayoutHeaderCartIcon, { counter: 0 })
                    ];
                  }
                })
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_ClientOnly, null, {
                  fallback: withCtx(() => [
                    createVNode(_component_LayoutHeaderCartIcon, { counter: 0 })
                  ]),
                  default: withCtx(() => [
                    createVNode(_component_LayoutHeaderCartIcon, { counter: unref(cartCount) }, null, 8, ["counter"])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_LayoutHeaderMobileMenuIcon, {
          class: "hidden max-lg:block",
          onClick: unref(sideMenuController).open
        }, null, _parent));
        _push(`</div><!--]-->`);
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_LayoutHeaderSearch, {
          modelValue: unref(searchText),
          "onUpdate:modelValue": ($event) => isRef(searchText) ? searchText.value = $event : null
        }, null, _parent));
        _push(ssrRenderComponent(_component_FormLinkButton, {
          class: "text-sm border-b-1 border-b-solid border-b-brand-primary hover:border-none",
          onClick: toggleMobileSearch,
          label: "Close"
        }, null, _parent));
        _push(`<!--]-->`);
      }
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div><div class="border-b relative max-lg:hidden">`);
      _push(ssrRenderComponent(_component_LayoutHeaderTopNavigation, {
        class: "container mx-auto pt-6 pb-4 px-6 sm:px-0",
        "current-menu-position": unref(currentMenuPosition),
        "onUpdate:currentMenuPosition": ($event) => isRef(currentMenuPosition) ? currentMenuPosition.value = $event : null
      }, null, _parent));
      _push(ssrRenderComponent(_component_client_only, null, {}, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_client_only, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/Header.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Header = Object.assign(_sfc_main, { __name: "LayoutHeader" });

export { Header as default };
