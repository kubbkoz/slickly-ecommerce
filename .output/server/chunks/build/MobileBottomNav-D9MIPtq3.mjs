import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { a as useCart, f as useUser, b as useLocalePath, g as useState, I as __nuxt_component_0$1, i as useRuntimeConfig } from './server.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-vue-next';
import { u as useUiState } from './useUiState-BTlUPkrr.mjs';
import { u as useCustomerWishlist } from './useCustomerWishlist-CccY2iyd.mjs';
import { useRoute } from 'vue-router';
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
  __name: "MobileBottomNav",
  __ssrInlineRender: true,
  setup(__props) {
    const { cartItems } = useCart();
    useUiState();
    useUser();
    useCustomerWishlist();
    const route = useRoute();
    const localePath = useLocalePath();
    const config = useRuntimeConfig();
    const isHomeActive = computed(() => route.path === localePath("/"));
    const isAccountActive = computed(() => route.path.startsWith(localePath("/account")));
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
    useState("loginModalOpen", () => false);
    useState("wishlistModalOpen", () => false);
    const isBottomNavVisible = useState("mobileBottomNavVisible", () => true);
    isBottomNavVisible.value = true;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] pb-safe",
        role: "navigation",
        "aria-label": "Spodná mobilná navigácia"
      }, _attrs))}><div class="h-[60px] flex items-center justify-between w-full">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/"),
        class: ["flex-1 flex flex-col items-center justify-center h-full min-w-0 transition-colors focus:outline-none", isHomeActive.value ? "text-amber" : "text-gray-500 hover:text-brand"],
        "aria-label": "Domov"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Home), { class: "w-5 h-5 mb-1" }, null, _parent2, _scopeId));
            _push2(`<span class="text-[9px] font-bold uppercase tracking-wider font-sans"${_scopeId}>Domov</span>`);
          } else {
            return [
              createVNode(unref(Home), { class: "w-5 h-5 mb-1" }),
              createVNode("span", { class: "text-[9px] font-bold uppercase tracking-wider font-sans" }, "Domov")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="flex-1 flex flex-col items-center justify-center h-full min-w-0 text-gray-500 bg-transparent hover:text-brand transition-colors focus:outline-none" aria-label="Hľadať">`);
      _push(ssrRenderComponent(unref(Search), { class: "w-5 h-5 mb-1" }, null, _parent));
      _push(`<span class="text-[9px] font-bold uppercase tracking-wider font-sans">Hľadať</span></button><button class="flex-1 flex flex-col items-center justify-center h-full min-w-0 text-gray-500 bg-transparent hover:text-brand transition-colors focus:outline-none relative group" aria-label="Košík"><div class="relative">`);
      _push(ssrRenderComponent(unref(ShoppingCart), { class: "w-5 h-5 mb-1" }, null, _parent));
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div><span class="text-[9px] font-bold uppercase tracking-wider font-sans">Košík</span></button><button class="flex-1 flex flex-col items-center justify-center h-full min-w-0 text-gray-500 bg-transparent hover:text-brand transition-colors focus:outline-none relative group" aria-label="Obľúbené"><div class="relative">`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Heart), { class: "w-5 h-5 mb-1" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Heart), { class: "w-5 h-5 mb-1" })
            ];
          }
        })
      }, _parent));
      _push(`</div><span class="text-[9px] font-bold uppercase tracking-wider font-sans">Obľúbené</span></button><button class="${ssrRenderClass([isAccountActive.value ? "text-amber" : "text-gray-500 hover:text-brand", "flex-1 flex flex-col items-center justify-center h-full min-w-0 transition-colors focus:outline-none"])}" aria-label="Môj účet">`);
      _push(ssrRenderComponent(unref(User), { class: "w-5 h-5 mb-1" }, null, _parent));
      _push(`<span class="text-[9px] font-bold uppercase tracking-wider font-sans">Účet</span></button></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/MobileBottomNav.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const MobileBottomNav = Object.assign(_sfc_main, { __name: "MobileBottomNav" });

export { MobileBottomNav as default };
