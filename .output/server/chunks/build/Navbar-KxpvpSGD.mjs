import { g as useState, I as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, computed, ref, watch, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import TopBar from './TopBar-6KU_rIcN.mjs';
import Logo from './Logo-DVDlVLTg.mjs';
import NavIcons from './NavIcons-B-wFQe5J.mjs';
import SearchBar from './SearchBar-DdxL9B3w.mjs';
import DesktopNav from './DesktopNav-vXzySe49.mjs';
import { u as useUiState } from './useUiState-BTlUPkrr.mjs';
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
import './nuxt-link-B7B0pxEe.mjs';
import './useLanguageSwitcher-Ben6yRb4.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';
import './index-B6MI764M.mjs';
import './usePrice-CDJKOx8c.mjs';
import './AppModal-CMHCLJuP.mjs';
import './useCustomerWishlist-CccY2iyd.mjs';
import './useProductComparison-BXlqQWLK.mjs';
import './useCountrySelector-Cujau6dz.mjs';
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
import './MegaMenu-DDO8AaUH.mjs';
import './BaseButton-BJMOoNbK.mjs';
import './media-BNPyNy3v.mjs';
import './ProductCardMini-C5JVac9Q.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const { isMobileMenuOpen, isMobileSearchOpen } = useUiState();
    const isHomePage = useState("isPageHome", () => false);
    const isCategoryPage = useState("isPageCategory", () => false);
    const isProductPage = useState("isPageProduct", () => false);
    computed(() => isProductPage.value || isCategoryPage.value);
    const shouldHideTopBar = computed(() => isScrolled.value);
    const shouldHideDesktopNav = computed(() => isScrolled.value && (isCategoryPage.value || !isHomePage.value && !isProductPage.value));
    const isScrolled = ref(false);
    ref(false);
    ref(null);
    ref(null);
    watch([isMobileSearchOpen, isMobileMenuOpen], ([searchOpen, menuOpen]) => {
      if (searchOpen || menuOpen) {
        (void 0).body.style.overflow = "hidden";
      } else {
        (void 0).body.style.overflow = "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><nav class="${ssrRenderClass([unref(isScrolled) ? "translate-y-0 shadow-lg" : "translate-y-0 shadow-none", "fixed top-0 start-0 w-full z-50 flex flex-col transition-transform duration-200 ease-in-out shadow-none gpu-boost"])}"><div>`);
      _push(ssrRenderComponent(TopBar, {
        "is-hidden": unref(shouldHideTopBar),
        "is-scrolled": unref(isScrolled)
      }, null, _parent));
      _push(`<div id="navbar-main-row" class="bg-black py-4 transition-all duration-150 ease-linear z-40 relative shadow-xl" style="${ssrRenderStyle({ "background-color": "#000000 !important" })}"><div class="container mx-auto px-4 lg:px-8"><div class="flex items-center justify-between gap-8">`);
      _push(ssrRenderComponent(Logo, null, null, _parent));
      _push(ssrRenderComponent(SearchBar, null, null, _parent));
      _push(ssrRenderComponent(NavIcons, null, null, _parent));
      _push(`</div></div></div>`);
      _push(ssrRenderComponent(DesktopNav, {
        "is-scrolled": unref(isScrolled),
        "is-hidden": unref(shouldHideDesktopNav)
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</nav><div class="w-full pointer-events-none opacity-0" style="${ssrRenderStyle({ height: "var(--navbar-height-current, 169px)", willChange: "height" })}"></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Navbar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Navbar = Object.assign(_sfc_main, { __name: "Navbar" });

export { Navbar as default };
