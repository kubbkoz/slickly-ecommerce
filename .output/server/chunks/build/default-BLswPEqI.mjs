import { Z as useLocaleHead, u as useHead, I as __nuxt_component_0$1 } from './server.mjs';
import { c as createLazyVisibleComponent } from './lazy-hydrated-component-DCe3AAtJ.mjs';
import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import Navbar from './Navbar-KxpvpSGD.mjs';
import MobileBottomNav from './MobileBottomNav-D9MIPtq3.mjs';
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
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './TopBar-6KU_rIcN.mjs';
import './nuxt-link-B7B0pxEe.mjs';
import './useLanguageSwitcher-Ben6yRb4.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';
import './Logo-DVDlVLTg.mjs';
import './NavIcons-B-wFQe5J.mjs';
import './index-B6MI764M.mjs';
import './usePrice-CDJKOx8c.mjs';
import './useUiState-BTlUPkrr.mjs';
import './AppModal-CMHCLJuP.mjs';
import './useCustomerWishlist-CccY2iyd.mjs';
import './useProductComparison-BXlqQWLK.mjs';
import './useCountrySelector-Cujau6dz.mjs';
import './SearchBar-DdxL9B3w.mjs';
import './useSearchSuggest-CFIuPdjY.mjs';
import './useListing-D9PeCG7-.mjs';
import './useCategory-DZrTDjvY.mjs';
import './useFeaturedProducts-BD8h0sYO.mjs';
import './useSearchIntent-SSB4M-IA.mjs';
import './SearchInput-DJSnmuNk.mjs';
import './SearchDropdown-DiilS_pq.mjs';
import './SearchDropdownEmpty-Drtrfsti.mjs';
import './format-tV37I8C6.mjs';
import './SearchDropdownResults-Bqt5Ih8X.mjs';
import './useProductHelpers-Ch_jrkwO.mjs';
import './useStaticTranslations-DjO9xa-s.mjs';
import './DesktopNav-vXzySe49.mjs';
import './MegaMenu-DDO8AaUH.mjs';
import './BaseButton-BJMOoNbK.mjs';
import './media-BNPyNy3v.mjs';
import './ProductCardMini-C5JVac9Q.mjs';

const __nuxt_component_1_lazy_visible = createLazyVisibleComponent("components/home/Newsletter.vue", () => import('./Newsletter-TXMf0tNh.mjs').then((c) => c.default || c));
const __nuxt_component_2_lazy_visible = createLazyVisibleComponent("components/layout/Footer.vue", () => import('./Footer-BLTUTaDb.mjs').then((c) => c.default || c));
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const i18nHead = useLocaleHead({ seo: true });
    useHead(computed(() => ({
      htmlAttrs: i18nHead.value.htmlAttrs ?? {},
      link: i18nHead.value.link ?? [],
      meta: i18nHead.value.meta ?? []
    })));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      const _component_LazyVisibleNewsletter = __nuxt_component_1_lazy_visible;
      const _component_LazyVisibleFooter = __nuxt_component_2_lazy_visible;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white font-sans antialiased relative text-gray-900 layout-wrapper pb-[calc(60px+env(safe-area-inset-bottom,0px))] lg:pb-0" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      _push(`<main id="main-content">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(_component_LazyVisibleNewsletter, { "hydrate-on-visible": "" }, null, _parent));
      _push(ssrRenderComponent(_component_LazyVisibleFooter, { "hydrate-on-visible": "" }, null, _parent));
      _push(ssrRenderComponent(MobileBottomNav, null, null, _parent));
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
