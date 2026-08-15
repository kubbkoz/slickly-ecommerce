import { f as useUser, l as useSessionContext, a as useCart, g as useState, d as useRoute, c as useRouter, J as useTimeoutFn, I as __nuxt_component_0$1, i as useRuntimeConfig } from './server.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, defineAsyncComponent, ref, watch, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { Search, Scale, Heart, User, X, Menu, Loader2, Trash2 } from 'lucide-vue-next';
import { o as onClickOutside } from './index-B6MI764M.mjs';
import { u as usePrice } from './usePrice-CDJKOx8c.mjs';
import { u as useUiState } from './useUiState-BTlUPkrr.mjs';
import __nuxt_component_2 from './AppModal-CMHCLJuP.mjs';
import { u as useCustomerWishlist } from './useCustomerWishlist-CccY2iyd.mjs';
import { u as useProductComparison } from './useProductComparison-BXlqQWLK.mjs';
import { u as useCountrySelector } from './useCountrySelector-Cujau6dz.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "NavIcons",
  __ssrInlineRender: true,
  setup(__props) {
    const LoginForm = defineAsyncComponent(() => import('./LoginForm-B-UFijii.mjs'));
    useUser();
    useSessionContext();
    const { count, cart, cartItems } = useCart();
    const { getFormattedPrice } = usePrice();
    const {
      isMobileMenuOpen
    } = useUiState();
    const isLoginModalOpen = useState("loginModalOpen", () => false);
    const oauthSuccessEmail = useState("oauthSuccessEmail", () => null);
    const oauthErrorCode = useState("oauthErrorCode", () => null);
    const oauthPrefillEmail = useState("oauthPrefillEmail", () => null);
    const isUserMenuOpen = ref(false);
    ref(false);
    const userMenuRef = ref(null);
    onClickOutside(userMenuRef, () => {
      isUserMenuOpen.value = false;
    });
    const route = useRoute();
    const router = useRouter();
    watch(
      () => [route.query.oauth_success, route.query.oauth_error, route.query.oauth_email],
      async ([success, error, prefillEmail]) => {
        if (success) {
          oauthSuccessEmail.value = decodeURIComponent(String(success));
          oauthErrorCode.value = null;
          oauthPrefillEmail.value = null;
          isLoginModalOpen.value = true;
        } else if (error) {
          oauthErrorCode.value = String(error);
          oauthSuccessEmail.value = null;
          oauthPrefillEmail.value = prefillEmail ? decodeURIComponent(String(prefillEmail)) : null;
          isLoginModalOpen.value = true;
        } else return;
        const cleanQuery = { ...route.query };
        delete cleanQuery.oauth_success;
        delete cleanQuery.oauth_error;
        delete cleanQuery.oauth_email;
        router.replace({ path: route.path, query: cleanQuery });
      },
      { immediate: true }
    );
    const { wishlistItems, isWishlistLoading, toggleWishlist } = useCustomerWishlist();
    const isWishlistModalOpen = useState("wishlistModalOpen", () => false);
    useProductComparison();
    useState("comparisonNavOpen", () => false);
    const config = useRuntimeConfig();
    const _virtualIds = computed(() => [
      config.public.shopware.ids.products?.expressShipping,
      config.public.shopware.ids.products?.dobierka,
      config.public.shopware.ids.products?.balneBike,
      config.public.shopware.ids.products?.balneEbike
    ].filter(Boolean));
    computed(
      () => (cartItems.value || []).filter(
        (i) => i.type === "product" && !_virtualIds.value.includes(i.referencedId)
      ).length
    );
    const { adjustPrice } = useCountrySelector();
    computed(() => {
      const total = (cartItems.value || []).filter((i) => !_virtualIds.value.includes(i.referencedId)).reduce((sum, i) => sum + (i.price?.totalPrice || 0), 0);
      return getFormattedPrice(adjustPrice(total));
    });
    const isCartAnimating = ref(false);
    const { start: resetAnimation } = useTimeoutFn(() => {
      isCartAnimating.value = false;
    }, 600, { immediate: false });
    watch(count, (n, o) => {
      if (n > (o || 0)) {
        isCartAnimating.value = true;
        resetAnimation();
      }
    });
    function handleLoginSuccess() {
      isLoginModalOpen.value = false;
      oauthSuccessEmail.value = null;
      oauthErrorCode.value = null;
      oauthPrefillEmail.value = null;
    }
    function handleLoginClose() {
      isLoginModalOpen.value = false;
      oauthSuccessEmail.value = null;
      oauthErrorCode.value = null;
      oauthPrefillEmail.value = null;
    }
    const handleRemoveFromWishlist = async (id, name) => {
      await toggleWishlist(id);
      const toast = useState("wishlistToast", () => ({ show: false, productName: "", action: "add" }));
      toast.value = {
        show: true,
        productName: name,
        action: "remove"
      };
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center space-x-3 text-white z-50" }, _attrs))}><button class="hidden lg:flex text-white hover:text-amber transition-all duration-300 focus:outline-none rounded-sm bg-black p-2" aria-label="Hľadať">`);
      _push(ssrRenderComponent(unref(Search), { class: "w-6 h-6" }, null, _parent));
      _push(`</button><button class="hidden md:flex text-white hover:text-amber transition-all duration-300 rounded-sm items-center bg-black p-2 relative" aria-label="Porovnanie produktov">`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Scale), { class: "w-6 h-6" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Scale), { class: "w-6 h-6" })
            ];
          }
        })
      }, _parent));
      _push(`</button><button class="hidden lg:flex text-white hover:text-amber transition-all duration-300 rounded-sm items-center bg-black p-2 relative" aria-label="Obľúbené">`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Heart), { class: "w-6 h-6" }, null, _parent2, _scopeId));
            _push2(`</span>`);
          } else {
            return [
              createVNode("span", { class: "flex items-center gap-2" }, [
                createVNode(unref(Heart), { class: "w-6 h-6" })
              ])
            ];
          }
        })
      }, _parent));
      _push(`</button><div class="relative hidden md:block"><button class="flex text-white hover:text-amber transition-colors rounded-sm items-center bg-black p-2" aria-label="Môj účet">`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(User), { class: "w-6 h-6" }, null, _parent2, _scopeId));
            _push2(`</span>`);
          } else {
            return [
              createVNode("span", { class: "flex items-center" }, [
                createVNode(unref(User), { class: "w-6 h-6" })
              ])
            ];
          }
        })
      }, _parent));
      _push(`</button></div><button class="${ssrRenderClass([{ "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto": unref(isMobileMenuOpen) }, "hidden lg:flex text-white hover:text-amber transition-all duration-300 group rounded-sm bg-black p-2 items-center gap-2"])}" aria-label="Košík">`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</button><button class="lg:hidden text-white hover:text-amber transition-colors rounded-sm bg-black p-2" aria-label="Menu">`);
      if (unref(isMobileMenuOpen)) {
        _push(ssrRenderComponent(unref(X), { class: "w-7 h-7" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Menu), { class: "w-7 h-7" }, null, _parent));
      }
      _push(`</button>`);
      _push(ssrRenderComponent(__nuxt_component_2, {
        "is-open": unref(isLoginModalOpen),
        title: unref(oauthSuccessEmail) ? "Prihlásenie úspešné" : "Prihlásenie",
        onClose: handleLoginClose
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(LoginForm), {
              "oauth-success": unref(oauthSuccessEmail) || void 0,
              "oauth-error": unref(oauthErrorCode) || void 0,
              "oauth-prefill-email": unref(oauthPrefillEmail) || void 0,
              onSuccess: handleLoginSuccess,
              onClose: handleLoginClose
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(LoginForm), {
                "oauth-success": unref(oauthSuccessEmail) || void 0,
                "oauth-error": unref(oauthErrorCode) || void 0,
                "oauth-prefill-email": unref(oauthPrefillEmail) || void 0,
                onSuccess: handleLoginSuccess,
                onClose: handleLoginClose
              }, null, 8, ["oauth-success", "oauth-error", "oauth-prefill-email"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(__nuxt_component_2, {
        "is-open": unref(isWishlistModalOpen),
        title: "Moje Obľúbené",
        onClose: ($event) => isWishlistModalOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(isWishlistLoading)) {
              _push2(`<div class="flex justify-center p-8"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Loader2), { class: "w-8 h-8 animate-spin text-brand" }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (unref(wishlistItems).length === 0) {
              _push2(`<div class="text-center p-8 text-gray-500 font-bold uppercase tracking-wider text-sm"${_scopeId}> Zatiaľ nemáte žiadne obľúbené produkty. </div>`);
            } else {
              _push2(`<div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide"${_scopeId}><!--[-->`);
              ssrRenderList(unref(wishlistItems), (item) => {
                _push2(`<div class="flex items-center gap-4 bg-zinc-900 p-3 shadow-sm border border-zinc-800 group transition-colors hover:border-zinc-700"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  to: `/detail/${item.id}`,
                  onClick: ($event) => isWishlistModalOpen.value = false,
                  class: "w-16 h-16 bg-white shrink-0 block"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<img${ssrRenderAttr("src", item?.cover?.media?.url || "https://placehold.co/100")} class="w-full h-full object-contain p-1"${_scopeId2}>`);
                    } else {
                      return [
                        createVNode("img", {
                          src: item?.cover?.media?.url || "https://placehold.co/100",
                          class: "w-full h-full object-contain p-1"
                        }, null, 8, ["src"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<div class="flex-1 min-w-0"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  to: `/detail/${item.id}`,
                  onClick: ($event) => isWishlistModalOpen.value = false,
                  class: "text-sm font-bold text-white uppercase tracking-wide group-hover:text-amber transition-colors truncate block"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(item?.translated?.name || item?.name)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(item?.translated?.name || item?.name), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                if (item.calculatedPrice) {
                  _push2(`<div class="text-xs text-gray-400 font-montserrat mt-1"${_scopeId}>${ssrInterpolate(unref(getFormattedPrice)(unref(adjustPrice)(item.calculatedPrice.unitPrice)))}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><button class="p-3 text-gray-500 hover:text-amber transition-colors bg-black rounded-sm border border-zinc-800 hover:border-brand/30" aria-label="Odstrániť z obľúbených"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Trash2), { class: "w-5 h-5" }, null, _parent2, _scopeId));
                _push2(`</button></div>`);
              });
              _push2(`<!--]--></div>`);
            }
          } else {
            return [
              unref(isWishlistLoading) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex justify-center p-8"
              }, [
                createVNode(unref(Loader2), { class: "w-8 h-8 animate-spin text-brand" })
              ])) : unref(wishlistItems).length === 0 ? (openBlock(), createBlock("div", {
                key: 1,
                class: "text-center p-8 text-gray-500 font-bold uppercase tracking-wider text-sm"
              }, " Zatiaľ nemáte žiadne obľúbené produkty. ")) : (openBlock(), createBlock("div", {
                key: 2,
                class: "space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(wishlistItems), (item) => {
                  return openBlock(), createBlock("div", {
                    key: item.id,
                    class: "flex items-center gap-4 bg-zinc-900 p-3 shadow-sm border border-zinc-800 group transition-colors hover:border-zinc-700"
                  }, [
                    createVNode(_component_NuxtLink, {
                      to: `/detail/${item.id}`,
                      onClick: ($event) => isWishlistModalOpen.value = false,
                      class: "w-16 h-16 bg-white shrink-0 block"
                    }, {
                      default: withCtx(() => [
                        createVNode("img", {
                          src: item?.cover?.media?.url || "https://placehold.co/100",
                          class: "w-full h-full object-contain p-1"
                        }, null, 8, ["src"])
                      ]),
                      _: 2
                    }, 1032, ["to", "onClick"]),
                    createVNode("div", { class: "flex-1 min-w-0" }, [
                      createVNode(_component_NuxtLink, {
                        to: `/detail/${item.id}`,
                        onClick: ($event) => isWishlistModalOpen.value = false,
                        class: "text-sm font-bold text-white uppercase tracking-wide group-hover:text-amber transition-colors truncate block"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item?.translated?.name || item?.name), 1)
                        ]),
                        _: 2
                      }, 1032, ["to", "onClick"]),
                      item.calculatedPrice ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-xs text-gray-400 font-montserrat mt-1"
                      }, toDisplayString(unref(getFormattedPrice)(unref(adjustPrice)(item.calculatedPrice.unitPrice))), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("button", {
                      onClick: ($event) => handleRemoveFromWishlist(item.id, item.translated?.name || item?.name || ""),
                      class: "p-3 text-gray-500 hover:text-amber transition-colors bg-black rounded-sm border border-zinc-800 hover:border-brand/30",
                      "aria-label": "Odstrániť z obľúbených"
                    }, [
                      createVNode(unref(Trash2), { class: "w-5 h-5" })
                    ], 8, ["onClick"])
                  ]);
                }), 128))
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/navbar/NavIcons.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const NavIcons = Object.assign(_sfc_main, { __name: "NavIcons" });

export { NavIcons as default };
