import __nuxt_component_0 from './AccountTabPrehled-ZpQYvJ2i.mjs';
import __nuxt_component_1 from './AccountTabOblubene-PcnNkvc_.mjs';
import __nuxt_component_2 from './AccountTabObjednavky-DV_1WI0n.mjs';
import __nuxt_component_3 from './AccountTabSledovanie-ID8uO4ve.mjs';
import __nuxt_component_4 from './AccountTabAdresy-Cyn2MrOg.mjs';
import __nuxt_component_5 from './AccountTabReklamacie-BC0CdKua.mjs';
import { u as useLoyalty, _ as __nuxt_component_6 } from './AccountTabVernostne-CYj3XxAu.mjs';
import __nuxt_component_7 from './AccountTabUlozenKosik-B6CRIf_9.mjs';
import __nuxt_component_8 from './AccountTabPorovnania-B9G3M8wv.mjs';
import __nuxt_component_9 from './AccountTabProfil-DrSA__No.mjs';
import { defineComponent, withAsyncContext, ref, watch, nextTick, computed, mergeProps, unref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrRenderVNode } from 'vue/server-renderer';
import { Loader2, LogOut, Settings, Upload, User, Heart, Package, Search, MapPin, RotateCcw, Gift, Bookmark, Scale, ChevronRight } from 'lucide-vue-next';
import { u as useAddress } from './useAddress-C-wqGrYv.mjs';
import { u as useHead, f as useUser, l as useSessionContext, n as navigateTo, g as useState } from './server.mjs';
import { u as useCustomerOrders } from './useCustomerOrders-ScyFmL9F.mjs';
import { u as useCustomerWishlist } from './useCustomerWishlist-CccY2iyd.mjs';
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
import 'vue-router';
import 'node:url';
import '@iconify/utils';
import 'consola';
import '@shopware/helpers';
import './useProductHelpers-Ch_jrkwO.mjs';
import './nuxt-link-B7B0pxEe.mjs';
import './useUiState-BTlUPkrr.mjs';
import 'pinia';
import './BaseButton-BJMOoNbK.mjs';
import '@iconify/vue';
import '@shopware/api-client';
import 'js-cookie';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './AppModal-CMHCLJuP.mjs';
import './BaseLink-CtWKrAdk.mjs';
import './ReturnFormModal-DM7PpMMO.mjs';
import './useReturnForm-BPYvUkOC.mjs';
import './ReturnFormStep1-J6OeDrR0.mjs';
import './ReturnFormStep2-DMCLLvW8.mjs';
import './ReturnFormStep3-BmRowXns.mjs';
import './ReturnFormSuccess-CYofRI6H.mjs';
import './useCountries-DcMVa9Fw.mjs';
import './useSalutations-BJL9Pq5t.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "account",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      title: "Môj účet - SLICKLY"
    });
    const { user, isLoggedIn } = useUser();
    useSessionContext();
    if (!isLoggedIn.value) [__temp, __restore] = withAsyncContext(() => navigateTo("/")), await __temp, __restore();
    const { orders, loadOrders } = useCustomerOrders();
    [__temp, __restore] = withAsyncContext(() => loadOrders({
      limit: 10,
      associations: {
        lineItems: {
          associations: {
            cover: {},
            product: {
              associations: { cover: {} }
            }
          }
        },
        stateMachineState: {},
        deliveries: {
          associations: {
            shippingMethod: {},
            stateMachineState: {}
          }
        },
        transactions: {
          associations: {
            paymentMethod: {},
            stateMachineState: {}
          }
        }
      }
    })), await __temp, __restore();
    const { customerAddresses, loadCustomerAddresses } = useAddress();
    [__temp, __restore] = withAsyncContext(() => loadCustomerAddresses()), await __temp, __restore();
    const { wishlistItems, toggleWishlist } = useCustomerWishlist();
    const activeTab = ref("prehled");
    const isLoggingOut = ref(false);
    watch(activeTab, () => {
      nextTick(() => (void 0).scrollTo({ top: 0, behavior: "smooth" }));
    });
    const navItems = [
      { id: "prehled", label: "Prehľad", icon: User },
      { id: "oblubene", label: "Moje Obľúbené", icon: Heart },
      { id: "objednavky", label: "Moje objednávky", icon: Package },
      { id: "sledovanie", label: "Sledovanie objednávky", icon: Search },
      { id: "adresy", label: "Adresy", icon: MapPin },
      { id: "reklamacie", label: "Reklamácie a vrátenie", icon: RotateCcw },
      { id: "vernostne", label: "Vernostné body", icon: Gift },
      { id: "ulozeny-kosik", label: "Uložený košík", icon: Bookmark },
      { id: "porovnania", label: "Porovnania", icon: Scale },
      { id: "profil", label: "Nastavenia profilu", icon: Settings }
    ];
    const { summary: loyaltySummary } = useLoyalty();
    const loyaltyPoints = computed(() => loyaltySummary.value?.availablePoints ?? 0);
    const totalSpent = computed(() => {
      let total = 0;
      orders.value?.forEach((o) => {
        total += o.amountTotal || 0;
      });
      return total;
    });
    const recentlyViewed = ref([]);
    const handleRemoveFromWishlist = async (id, name) => {
      await toggleWishlist(id);
      const toast = useState("wishlistToast", () => ({ show: false, productName: "", action: "add" }));
      toast.value = { show: true, productName: name, action: "remove" };
    };
    const displayName = computed(() => {
      if (user.value?.firstName) return `${user.value.firstName} ${user.value.lastName || ""}`.trim();
      return user.value?.email || "Hosť";
    });
    const predefinedAvatars = [
      "https://api.dicebear.com/7.x/shapes/svg?seed=MTS1&backgroundColor=f9fafb",
      "https://api.dicebear.com/7.x/shapes/svg?seed=MTS6&backgroundColor=f9fafb",
      "https://api.dicebear.com/7.x/bottts/svg?seed=MTS2&backgroundColor=f9fafb",
      "https://api.dicebear.com/7.x/bottts/svg?seed=MTS7&backgroundColor=f9fafb",
      "https://api.dicebear.com/7.x/identicon/svg?seed=MTS3&backgroundColor=f9fafb",
      "https://api.dicebear.com/7.x/identicon/svg?seed=MTS8&backgroundColor=f9fafb",
      "https://api.dicebear.com/7.x/rings/svg?seed=MTS4&backgroundColor=f9fafb",
      "https://api.dicebear.com/7.x/rings/svg?seed=MTS9&backgroundColor=f9fafb",
      "https://api.dicebear.com/7.x/initials/svg?seed=MT&backgroundColor=f9fafb",
      "https://api.dicebear.com/7.x/initials/svg?seed=RIDE&backgroundColor=f9fafb"
    ];
    const currentAvatar = ref("");
    const showAvatarModal = ref(false);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AccountTabPrehled = __nuxt_component_0;
      const _component_AccountTabOblubene = __nuxt_component_1;
      const _component_AccountTabObjednavky = __nuxt_component_2;
      const _component_AccountTabSledovanie = __nuxt_component_3;
      const _component_AccountTabAdresy = __nuxt_component_4;
      const _component_AccountTabReklamacie = __nuxt_component_5;
      const _component_AccountTabVernostne = __nuxt_component_6;
      const _component_AccountTabUlozenKosik = __nuxt_component_7;
      const _component_AccountTabPorovnania = __nuxt_component_8;
      const _component_AccountTabProfil = __nuxt_component_9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#fafafa] font-sans" }, _attrs))}><div class="container mx-auto px-4 lg:px-8 py-10 lg:py-16"><div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6"><div><h1 class="text-3xl md:text-5xl font-black uppercase font-tech tracking-wide text-black italic"> MÔJ <span class="text-brand">ÚČET</span></h1><p class="text-gray-600 text-sm mt-2 font-sans font-medium"> Vitajte späť, <span class="font-bold text-black">${ssrInterpolate(displayName.value)}</span></p></div><button class="flex items-center gap-2 mt-4 md:mt-0 px-5 py-2.5 border border-brand text-[11px] font-bold uppercase tracking-widest text-brand hover:bg-brand hover:text-white transition-all duration-300">`);
      if (isLoggingOut.value) {
        _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(LogOut), { class: "w-4 h-4" }, null, _parent));
      }
      _push(` Odhlásiť sa </button></div><div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start"><aside class="w-full lg:w-80 flex-shrink-0 bg-white shadow-sm sticky top-24"><div class="p-6 border-b border-gray-100 flex items-center gap-4 relative"><div class="relative w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-black font-black text-xl flex-shrink-0 cursor-pointer group"><div class="w-full h-full overflow-hidden rounded-full"><img${ssrRenderAttr("src", currentAvatar.value)} alt="avatar" class="w-full h-full object-cover transition-all group-hover:brightness-75"></div><div class="absolute inset-0 hidden group-hover:flex items-center justify-center pointer-events-none rounded-full">`);
      _push(ssrRenderComponent(unref(Settings), { class: "w-5 h-5 text-white drop-shadow-md" }, null, _parent));
      _push(`</div></div><div class="min-w-0"><p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Účet</p><p class="text-xs font-bold text-black truncate">${ssrInterpolate(displayName.value)}</p></div>`);
      if (showAvatarModal.value) {
        _push(`<div class="absolute top-24 left-6 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-6 z-50 animate-fade-in flex flex-col gap-6 w-[340px] rounded-default"><div><p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Vyberte si avatara z knižnice</p><div class="grid grid-cols-5 gap-3"><!--[-->`);
        ssrRenderList(predefinedAvatars, (av) => {
          _push(`<button class="${ssrRenderClass([currentAvatar.value === av ? "border-brand shadow-lg scale-110" : "border-transparent hover:border-gray-200 hover:scale-105", "w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-[3px] transition-all"])}"><img${ssrRenderAttr("src", av)} class="w-full h-full object-cover"></button>`);
        });
        _push(`<!--]--></div></div><div class="border-t border-gray-100 pt-5"><p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Alebo nahrajte vlastnú fotku</p><input type="file" accept="image/jpeg, image/png, image/webp" class="hidden"><button class="w-full py-3 bg-gray-50 border border-gray-200 text-[11px] font-bold text-black uppercase tracking-widest hover:border-brand hover:bg-brand hover:text-white transition-colors flex items-center justify-center gap-2">`);
        _push(ssrRenderComponent(unref(Upload), { class: "w-4 h-4" }, null, _parent));
        _push(` Nahrať obrázok </button><div class="mt-4 text-[10px] text-gray-400 font-sans leading-relaxed"><p><strong>Formát:</strong> JPG, PNG, WEBP</p><p><strong>Rozmer:</strong> odporúčaný 250 x 250 px</p><p><strong>Veľkosť:</strong> max. 2 MB</p></div></div><button class="text-[10px] font-bold text-gray-400 hover:text-black uppercase self-end transition-colors mt-2">Zavrieť</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><nav class="py-2"><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(`<button class="${ssrRenderClass([activeTab.value === item.id ? "bg-black text-white px-[20px] border-l-4 border-l-brand" : "text-gray-600 hover:text-black hover:bg-gray-50", "w-full flex items-center justify-between px-6 py-[18px] text-[11px] font-bold uppercase tracking-widest transition-all duration-200 text-left"])}"><div class="flex items-center gap-4 flex-1 pr-2">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), {
          class: ["w-4 h-4 flex-shrink-0 transition-colors", activeTab.value === item.id ? "text-brand" : "text-gray-400"]
        }, null), _parent);
        _push(`<span class="leading-tight">${ssrInterpolate(item.label)}</span></div>`);
        _push(ssrRenderComponent(unref(ChevronRight), {
          class: ["w-3.5 h-3.5 flex-shrink-0 transition-transform", activeTab.value === item.id ? "translate-x-1 text-white" : "text-gray-300"]
        }, null, _parent));
        _push(`</button>`);
      });
      _push(`<!--]--></nav></aside><main class="flex-1 min-w-0 w-full">`);
      if (activeTab.value === "prehled") {
        _push(ssrRenderComponent(_component_AccountTabPrehled, {
          user: unref(user),
          orders: unref(orders) || [],
          "recently-viewed": recentlyViewed.value,
          "loyalty-points": loyaltyPoints.value,
          "total-spent": totalSpent.value,
          onChangeTab: ($event) => activeTab.value = $event
        }, null, _parent));
      } else if (activeTab.value === "oblubene") {
        _push(ssrRenderComponent(_component_AccountTabOblubene, {
          "wishlist-items": unref(wishlistItems) || [],
          onRemove: handleRemoveFromWishlist
        }, null, _parent));
      } else if (activeTab.value === "objednavky") {
        _push(ssrRenderComponent(_component_AccountTabObjednavky, {
          orders: unref(orders) || []
        }, null, _parent));
      } else if (activeTab.value === "sledovanie") {
        _push(ssrRenderComponent(_component_AccountTabSledovanie, null, null, _parent));
      } else if (activeTab.value === "adresy") {
        _push(ssrRenderComponent(_component_AccountTabAdresy, {
          "customer-addresses": unref(customerAddresses) || [],
          user: unref(user),
          onRefresh: unref(loadCustomerAddresses)
        }, null, _parent));
      } else if (activeTab.value === "reklamacie") {
        _push(ssrRenderComponent(_component_AccountTabReklamacie, null, null, _parent));
      } else if (activeTab.value === "vernostne") {
        _push(ssrRenderComponent(_component_AccountTabVernostne, null, null, _parent));
      } else if (activeTab.value === "ulozeny-kosik") {
        _push(ssrRenderComponent(_component_AccountTabUlozenKosik, null, null, _parent));
      } else if (activeTab.value === "porovnania") {
        _push(ssrRenderComponent(_component_AccountTabPorovnania, null, null, _parent));
      } else if (activeTab.value === "profil") {
        _push(ssrRenderComponent(_component_AccountTabProfil, {
          user: unref(user),
          "current-avatar": currentAvatar.value,
          onOpenAvatarModal: ($event) => showAvatarModal.value = true
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</main></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/account.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
