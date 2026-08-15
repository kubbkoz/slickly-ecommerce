import { defineComponent, ref, computed, mergeProps, createVNode, resolveDynamicComponent, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrRenderVNode, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { CreditCard, Truck, Zap, Archive, MapPin, RotateCcw, ChevronDown, HandCoins, Banknote, Smartphone, Coins } from 'lucide-vue-next';
import { u as useShippingMetadata } from './useShippingMetadata-C7Eoqyz6.mjs';
import { a as useCart, e as useShopwareContext, h as useAsyncData, i as useRuntimeConfig } from './server.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';
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
  __name: "TrustBadges",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  emits: ["openWatchdog"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const openIndex = ref(null);
    const { balikovoMetadata, toptransMetadata, toptransCzMetadata, toptransPlMetadata, spsMetadata, osobnyOdberMetadata } = useShippingMetadata();
    const { cart } = useCart();
    const { selectedCountryDisplay } = useCountrySelector();
    const iso = computed(() => (selectedCountryDisplay.value.iso || "SK").toUpperCase());
    const isForeign = computed(() => iso.value === "CZ" || iso.value === "PL");
    const referencePrice = computed(() => {
      const cartTotal = cart.value?.price?.totalPrice ?? 0;
      const productPrice = props.product?.calculatedPrice?.unitPrice ?? 0;
      return cartTotal > 0 ? cartTotal : productPrice;
    });
    const displayBalikovo = computed(() => {
      const meta = balikovoMetadata.value;
      const isHealthy = meta && meta.basePrice !== null;
      return {
        name: isHealthy ? meta.name : "Balíkovo",
        price: isHealthy ? meta.basePrice : 2.99,
        delivery: isHealthy ? meta.deliveryTime : "1-3 dni",
        threshold: isHealthy && meta.freeThreshold !== null ? meta.freeThreshold : 299,
        logoUrl: isHealthy ? meta.logoUrl : null
      };
    });
    const isBalikovoFree = computed(() => referencePrice.value > displayBalikovo.value.threshold);
    const displaySps = computed(() => {
      const meta = spsMetadata.value;
      const isHealthy = meta && meta.basePrice !== null;
      return {
        name: isHealthy ? meta.name : "Kuriér SPS",
        price: isHealthy ? meta.basePrice : 3.99,
        delivery: isHealthy ? meta.deliveryTime : "1-2 dni",
        threshold: isHealthy && meta.freeThreshold !== null ? meta.freeThreshold : 299,
        logoUrl: isHealthy ? meta.logoUrl : null
      };
    });
    const isSpsFree = computed(() => referencePrice.value > displaySps.value.threshold);
    const displayToptrans = computed(() => {
      const meta = toptransMetadata.value;
      const isHealthy = meta && meta.basePrice !== null;
      return {
        name: isHealthy ? meta.name : "Expresný kuriér Toptrans",
        price: isHealthy ? meta.basePrice : 4.99,
        delivery: isHealthy ? meta.deliveryTime : "1-3 dni",
        threshold: isHealthy && meta.freeThreshold !== null ? meta.freeThreshold : 1999,
        logoUrl: isHealthy ? meta.logoUrl : null
      };
    });
    const isToptransFree = computed(() => referencePrice.value > displayToptrans.value.threshold);
    const displayOsobnyOdber = computed(() => {
      const meta = osobnyOdberMetadata.value;
      const isHealthy = meta !== void 0 && meta.name !== "";
      return {
        name: isHealthy ? meta.name : "Osobný odber v predajni SLICKLY",
        price: 0,
        // Always 0 as requested
        delivery: isHealthy ? meta.deliveryTime : null,
        logoUrl: isHealthy ? meta.logoUrl : null
      };
    });
    const displayForeign = computed(() => {
      if (!isForeign.value) return null;
      const meta = iso.value === "CZ" ? toptransCzMetadata.value : toptransPlMetadata.value;
      if (!meta || !meta.id) return null;
      return {
        name: meta.name || "Kuriér Toptrans",
        price: meta.basePrice ?? null,
        delivery: meta.deliveryTime,
        logoUrl: meta.logoUrl
      };
    });
    const config = useRuntimeConfig();
    const { apiClient } = useShopwareContext();
    const { currentLanguageId } = useShopwareLanguage();
    const paymentIds = config.public.shopware.ids.payment;
    const dobierkaProductId = config.public.shopware.ids.products?.dobierka;
    const { data: paymentMethodsData } = useAsyncData("pdp-payment-methods", async () => {
      try {
        const res = await apiClient.invoke("readPaymentMethod post /payment-method", {
          headers: { "sw-language-id": currentLanguageId.value },
          body: { onlyAvailable: true, associations: { media: {} } }
        });
        return res?.data?.elements || [];
      } catch (e) {
        return [];
      }
    }, { server: true });
    const { data: dobierkaPrice } = useAsyncData("pdp-dobierka-price", async () => {
      if (!dobierkaProductId) return null;
      try {
        const res = await apiClient.invoke("readProduct post /product", {
          body: {
            filter: [{ type: "equals", field: "id", value: dobierkaProductId }],
            includes: { product: ["id", "calculatedPrice"] }
          }
        });
        return res?.data?.elements?.[0]?.calculatedPrice?.unitPrice ?? null;
      } catch {
        return null;
      }
    }, { server: true });
    const getPaymentIcon = (name) => {
      const n = name.toLowerCase();
      if (n.includes("dobierka") || n.includes("cash") || n.includes("hotovos") || n.includes("v hotovosti")) return HandCoins;
      if (n.includes("prevod") || n.includes("transfer") || n.includes("bank")) return Banknote;
      if (n.includes("apple") || n.includes("google") || n.includes("pay")) return Smartphone;
      if (n.includes("splátk") || n.includes("quatro") || n.includes("home credit") || n.includes("splat")) return Coins;
      return CreditCard;
    };
    const paymentLines = computed(() => {
      const methods = paymentMethodsData.value || [];
      if (!methods.length) {
        return [{ label: "Platobné metódy", value: "Zadarmo", icon: CreditCard }];
      }
      return methods.map((m) => {
        const name = m.translated?.name || m.name || "";
        const isDobierka = m.id === paymentIds?.dobierka;
        const price = isDobierka && dobierkaPrice.value ? dobierkaPrice.value : 0;
        return {
          label: name,
          value: price > 0 ? `${price.toFixed(2).replace(".", ",")} €` : "Zadarmo",
          icon: m.media?.url ? void 0 : getPaymentIcon(name),
          logoUrl: m.media?.url || void 0
        };
      });
    });
    const BIKE_CATEGORY_IDS = [
      config.public.shopware.ids.categories.bikes,
      config.public.shopware.ids.categories.ebikes
    ];
    const isBike = computed(() => {
      const p = props.product;
      if (!p) return false;
      const bikeIds = BIKE_CATEGORY_IDS.filter(Boolean);
      if (p.categoryIds?.some((id) => bikeIds.includes(id))) return true;
      const cats = p._raw?.categories || p.categories || [];
      if (cats.some((c) => bikeIds.some((bid) => (c.path || "").includes(bid)))) return true;
      const name = (p.translated?.name || p.name || "").toLowerCase();
      return ["bicykel", "e-bike", "elektrobicykel", "ebajk", "bicycle"].some((k) => name.includes(k));
    });
    const items = computed(() => {
      const b = displayBalikovo.value;
      const t = displayToptrans.value;
      const s = displaySps.value;
      const o = displayOsobnyOdber.value;
      let dpName;
      let dpBadge = "";
      let dpFooter;
      let contentLines;
      if (isForeign.value) {
        const f = displayForeign.value;
        const price = f?.price ?? null;
        const priceStr = price != null ? price.toFixed(2).replace(".", ",") : null;
        dpName = priceStr ? `Doprava ${priceStr} €` : "Doprava";
        dpFooter = void 0;
        contentLines = f ? [
          {
            label: f.name,
            value: price != null ? `${price.toFixed(2).replace(".", ",")} €` : "—",
            icon: f.logoUrl ? void 0 : Truck,
            logoUrl: f.logoUrl,
            description: f.delivery ? `Doručenie: ${f.delivery}` : void 0
          }
        ] : [];
      } else {
        const sEffective = isSpsFree.value ? 0 : s.price !== null ? s.price : 3.99;
        const tEffective = isToptransFree.value ? 0 : t.price !== null ? t.price : 4.99;
        const bEffective = isBalikovoFree.value ? 0 : b.price !== null ? b.price : 2.99;
        let lowestPrice = sEffective;
        if (!isBike.value) {
          lowestPrice = Math.min(lowestPrice, bEffective);
        }
        lowestPrice = Math.min(lowestPrice, tEffective);
        const paidPrices = [sEffective, tEffective, ...isBike.value ? [] : [bEffective]];
        const paidCount = paidPrices.filter((p) => p > 0).length;
        const formattedPrice = lowestPrice.toFixed(2).replace(".", ",");
        const effectiveThreshold = isBike.value ? s.threshold : b.threshold;
        dpName = lowestPrice === 0 ? "Doprava ZADARMO" : paidCount > 1 ? `Doprava od ${formattedPrice} €` : `Doprava ${formattedPrice} €`;
        dpBadge = lowestPrice === 0 ? "" : `ZADARMO NAD ${effectiveThreshold} €`;
        dpFooter = lowestPrice === 0 ? "Pri objednávke tohto produktu máte dopravu ZADARMO." : `Pri objednávke nad ${effectiveThreshold} € máte dopravu úplne ZADARMO.`;
        contentLines = [
          {
            label: s.name,
            value: isSpsFree.value ? "Zadarmo" : `${(s.price ?? 3.99).toFixed(2).replace(".", ",")} €`,
            icon: s.logoUrl ? void 0 : Truck,
            logoUrl: s.logoUrl,
            description: s.delivery ? `Doručenie: ${s.delivery}` : void 0
          },
          {
            label: t.name,
            value: isToptransFree.value ? "Zadarmo" : `${(t.price ?? 4.99).toFixed(2).replace(".", ",")} €`,
            icon: t.logoUrl ? void 0 : Zap,
            logoUrl: t.logoUrl,
            description: t.delivery ? `Doručenie: ${t.delivery}` : void 0
          },
          ...isBike.value ? [] : [
            {
              label: b.name,
              value: isBalikovoFree.value ? "Zadarmo" : `${(b.price ?? 2.99).toFixed(2).replace(".", ",")} €`,
              icon: b.logoUrl ? void 0 : Archive,
              logoUrl: b.logoUrl,
              description: b.delivery ? `Doručenie: ${b.delivery}` : void 0
            }
          ],
          {
            label: o.name,
            value: "Zadarmo",
            icon: o.logoUrl ? void 0 : MapPin,
            logoUrl: o.logoUrl,
            description: o.delivery ? `Pripravené: ${o.delivery}` : void 0
          }
        ];
      }
      return [
        {
          id: 1,
          icon: Truck,
          title: dpName,
          badge: dpBadge,
          contentLines,
          footer: dpFooter
        },
        {
          id: 2,
          icon: CreditCard,
          title: "Platba",
          contentLines: paymentLines.value
        },
        {
          id: 3,
          icon: RotateCcw,
          title: "Vrátenie tovaru do 60 dní",
          content: "Nevyhovuje? Žiadny problém. Ponúkame predĺženú lehotu na vrátenie nepoužitého tovaru až na 60 dní bez udania dôvodu."
        }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-8 mb-8 border-t border-gray-200" }, _attrs))}><!--[-->`);
      ssrRenderList(items.value, (item, index) => {
        _push(`<div class="border-b border-gray-200 md:px-0"><button${ssrRenderAttr("aria-label", `Toggle ${item.title}`)}${ssrRenderAttr("aria-expanded", openIndex.value === index)} class="w-full flex items-center justify-between py-2.5 px-2 transition-colors text-left focus:outline-none group"><div class="flex items-center gap-4 w-full">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), {
          class: ["w-4 h-4 transition-colors duration-200", openIndex.value === index ? "text-brand" : "text-black group-hover:text-brand"]
        }, null), _parent);
        _push(`<div class="flex items-center justify-between w-full"><span class="${ssrRenderClass(openIndex.value === index ? "text-brand font-tech" : "text-black group-hover:text-brand font-tech")}">${ssrInterpolate(item.title)}</span>`);
        if (item.badge) {
          _push(`<span class="bg-gray-500 text-white text-[10px] font-normal px-2 py-1 rounded-sm uppercase tracking-wider leading-tight whitespace-nowrap ml-auto mr-4">${ssrInterpolate(item.badge)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        _push(ssrRenderComponent(unref(ChevronDown), {
          class: ["w-4 h-4 flex-shrink-0 ml-2 transition-all duration-300", [
            openIndex.value === index ? "rotate-180 text-brand" : "text-gray-400 group-hover:text-brand"
          ]]
        }, null, _parent));
        _push(`</button><div class="overflow-hidden pb-5 px-6 md:px-10 bg-white" style="${ssrRenderStyle(openIndex.value === index ? null : { display: "none" })}">`);
        if (item.contentLines) {
          _push(`<div class="divide-y divide-gray-100"><!--[-->`);
          ssrRenderList(item.contentLines, (line, lIndex) => {
            _push(`<div class="py-2.5 text-sm font-sans flex justify-between items-center group/line"><div class="flex items-center gap-3">`);
            if (line.logoUrl) {
              _push(`<img${ssrRenderAttr("src", line.logoUrl)}${ssrRenderAttr("alt", line.label)} class="w-8 h-auto object-contain max-h-6 grayscale hover:grayscale-0 transition-all duration-200">`);
            } else if (line.icon) {
              ssrRenderVNode(_push, createVNode(resolveDynamicComponent(line.icon), { class: "w-3.5 h-3.5 text-gray-400 group-hover/line:text-black transition-colors" }, null), _parent);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="flex flex-col"><span class="text-gray-500 group-hover/line:text-black transition-colors">${ssrInterpolate(line.label)}</span>`);
            if (line.description) {
              _push(`<span class="text-xs font-medium text-gray-500 leading-tight mt-0.5">${ssrInterpolate(line.description)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div><span class="${ssrRenderClass(line.value.toLowerCase().includes("0,00") || line.value.toLowerCase().includes("zadarmo") ? "text-success" : "text-black")}">${ssrInterpolate(line.value)}</span></div>`);
          });
          _push(`<!--]-->`);
          if (item.footer) {
            _push(`<p class="text-xs text-gray-400 mt-4 pt-3 text-center italic">${ssrInterpolate(item.footer)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<p class="text-sm text-gray-600 font-sans leading-relaxed py-2">${ssrInterpolate(item.content)}</p>`);
        }
        if (item.actionLabel) {
          _push(`<div class="mt-3 flex justify-center"><button${ssrRenderAttr("aria-label", item.actionLabel)} class="text-xs font-bold text-brand uppercase hover:underline transition-colors pb-1">${ssrInterpolate(item.actionLabel)}</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/TrustBadges.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TrustBadges = Object.assign(_sfc_main, { __name: "TrustBadges" });

export { TrustBadges as default };
