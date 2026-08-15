import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { ShoppingBag, Tag, Truck, Zap, ChevronDown, ExternalLink, Loader2, ArrowRight, ArrowLeft } from 'lucide-vue-next';
import { u as useShippingMetadata } from './useShippingMetadata-C7Eoqyz6.mjs';
import { _ as _export_sfc, a as useCart, e as useShopwareContext, h as useAsyncData, i as useRuntimeConfig } from './server.mjs';
import { u as useCountrySelector } from './useCountrySelector-Cujau6dz.mjs';
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
import './useShopwareLanguage-CGPCneCN.mjs';
import 'pinia';
import '@iconify/vue';
import '@shopware/api-client';
import 'js-cookie';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const FALLBACK_TAX_RATE = 23;
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJ1f4ccNbJFUcRUbCbvaArmfw";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "OrderSummary",
  __ssrInlineRender: true,
  props: {
    step: {},
    shippingMethodId: {},
    paymentMethodId: {},
    shippingMethods: {},
    paymentMethods: {},
    isExpressShipping: { type: Boolean },
    canAction: { type: Boolean },
    isSubmitting: { type: Boolean },
    actionLabel: {},
    expressProduct: {},
    dobierkaProduct: {},
    taxRate: {},
    countryIso: {},
    isReverseCharge: { type: Boolean },
    isCompanyPurchase: { type: Boolean },
    backLabel: {}
  },
  emits: ["action", "update:isExpressShipping", "back"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { cartItems, cart, totalPrice, addPromotionCode } = useCart();
    const config = useRuntimeConfig();
    const { balikovoMetadata, spsMetadata, toptransCzMetadata, toptransPlMetadata, isLoading: isShippingLoading, parseMethod } = useShippingMetadata();
    const { apiClient } = useShopwareContext();
    const { selectedCountryTaxRate, selectedCountryDisplay } = useCountrySelector();
    const countryIso = computed(() => (props.countryIso || selectedCountryDisplay.value.iso || "SK").toUpperCase());
    const isForeignFlat = computed(() => countryIso.value === "CZ" || countryIso.value === "PL");
    const foreignFlatMeta = computed(
      () => countryIso.value === "CZ" ? toptransCzMetadata.value : countryIso.value === "PL" ? toptransPlMetadata.value : null
    );
    const couponInput = ref("");
    const couponError = ref("");
    const couponSuccess = ref("");
    const isApplyingCoupon = ref(false);
    const selectedShipping = computed(
      () => props.shippingMethods?.find((m) => m.id === props.shippingMethodId) ?? null
    );
    computed(
      () => props.paymentMethods?.find((m) => m.id === props.paymentMethodId) ?? null
    );
    const cheapestShipping = computed(() => {
      if (isForeignFlat.value) {
        return foreignFlatMeta.value?.basePrice ?? null;
      }
      const qualifiesForFree = effectiveThreshold.value !== null && productSubtotal.value >= effectiveThreshold.value;
      if (props.shippingMethods?.length) {
        const prices = [];
        for (const m of props.shippingMethods) {
          if (!m?.id) continue;
          if (hasBikeInCart.value && m.id === balikovoMetadata.value?.id) continue;
          const meta = parseMethod(m);
          const basePrice = meta.basePrice ?? 999;
          if (basePrice === 0 && !meta.freeThreshold) continue;
          if (qualifiesForFree && meta.freeThreshold !== null && productSubtotal.value >= meta.freeThreshold) {
            prices.push(0);
          } else if (basePrice > 0) {
            prices.push(basePrice);
          }
        }
        return prices.length ? Math.min(...prices) : null;
      }
      const metaList = hasBikeInCart.value ? [spsMetadata.value] : [balikovoMetadata.value, spsMetadata.value];
      const candidates = [];
      for (const meta of metaList) {
        if (!meta) continue;
        if (qualifiesForFree && meta.freeThreshold != null && productSubtotal.value >= meta.freeThreshold) {
          candidates.push(0);
        } else if (meta.basePrice != null && meta.basePrice > 0) {
          candidates.push(meta.basePrice);
        }
      }
      return candidates.length ? Math.min(...candidates) : null;
    });
    const shippingCostFromCart = computed(() => {
      const deliveries = cart.value?.deliveries;
      if (!deliveries?.length) return 0;
      return deliveries[0]?.shippingCosts?.totalPrice ?? 0;
    });
    const dobierkaProductId = config.public.shopware.ids.products?.dobierka;
    const dobierkaPaymentId = config.public.shopware.ids.payment?.dobierka;
    const balneBikeId = config.public.shopware.ids.products?.balneBike;
    const balneEbikeId = config.public.shopware.ids.products?.balneEbike;
    const balneProductIds = computed(() => [balneBikeId, balneEbikeId].filter(Boolean));
    const osobnyOdberId = config.public.shopware.ids.shipping?.osobnyOdber;
    const isOsobnyOdber = computed(() => props.shippingMethodId === osobnyOdberId);
    const productSubtotal = computed(() => {
      const expressProductId = config.public.shopware.ids.products?.expressShipping;
      return cartItems.value.filter(
        (i) => i.type === "product" && i.referencedId !== expressProductId && i.referencedId !== dobierkaProductId && !balneProductIds.value.includes(i.referencedId)
      ).reduce((sum, i) => sum + (i.price?.totalPrice ?? 0), 0);
    });
    const balneBikeItem = computed(
      () => cartItems.value.find((i) => i.referencedId === balneBikeId)
    );
    const balneEbikeItem = computed(
      () => cartItems.value.find((i) => i.referencedId === balneEbikeId)
    );
    const balneBikeCost = computed(() => isOsobnyOdber.value ? 0 : balneBikeItem.value?.price?.totalPrice ?? 0);
    const balneEbikeCost = computed(() => isOsobnyOdber.value ? 0 : balneEbikeItem.value?.price?.totalPrice ?? 0);
    const balneCost = computed(() => balneBikeCost.value + balneEbikeCost.value);
    const adjustedBalneBikeCost = computed(() => adjustItemPrice(balneBikeCost.value));
    const adjustedBalneEbikeCost = computed(() => adjustItemPrice(balneEbikeCost.value));
    const isDobierkaSelected = computed(() => props.paymentMethodId === dobierkaPaymentId);
    const dobirjaCost = computed(() => {
      if (props.step < 3 || !isDobierkaSelected.value) return 0;
      const item = cartItems.value.find((i) => i.referencedId === dobierkaProductId);
      return item?.price?.totalPrice ?? (props.dobierkaProduct?.calculatedPrice?.unitPrice ?? 0);
    });
    const adjustedDobirjaCost = computed(() => adjustItemPrice(dobirjaCost.value));
    const shippingPriceToDisplay = computed(() => {
      if (!props.shippingMethodId || !selectedShipping.value) return 0;
      const meta = parseMethod(selectedShipping.value);
      if (!isForeignFlat.value && meta.freeThreshold !== null && productSubtotal.value >= meta.freeThreshold) {
        return 0;
      }
      return shippingCostFromCart.value;
    });
    const paidMethodCount = computed(() => {
      if (isForeignFlat.value) return 1;
      const metas = hasBikeInCart.value ? [spsMetadata.value, balikovoMetadata.value] : [balikovoMetadata.value, spsMetadata.value];
      return metas.filter((m) => (m?.basePrice ?? 0) > 0).length || 1;
    });
    const expressCost = computed(() => {
      if (!props.isExpressShipping) return 0;
      return props.expressProduct?.calculatedPrice?.unitPrice ?? 12.9;
    });
    const displayTotal = computed(() => {
      const promos = cartItems.value.filter((i) => i.type !== "product").reduce((sum, i) => sum + (i.price?.totalPrice ?? 0), 0);
      const shipping = props.step <= 2 ? cheapestShipping.value && cheapestShipping.value > 0 ? cheapestShipping.value : 0 : shippingPriceToDisplay.value;
      return productSubtotal.value + shipping + expressCost.value + dobirjaCost.value + balneCost.value + promos;
    });
    computed(
      () => cart.value?.price?.calculatedTaxes
    );
    const effectiveTaxRate = computed(() => {
      if (props.isReverseCharge) return 0;
      if (props.taxRate != null) return props.taxRate;
      return selectedCountryTaxRate.value;
    });
    const netDisplayTotal = computed(() => displayTotal.value / (1 + FALLBACK_TAX_RATE / 100));
    const adjustedDisplayTotal = computed(() => {
      if (props.isReverseCharge) return netDisplayTotal.value;
      return netDisplayTotal.value * (1 + effectiveTaxRate.value / 100);
    });
    const taxDisplayAmount = computed(() => props.isReverseCharge ? 0 : netDisplayTotal.value * (effectiveTaxRate.value / 100));
    const adjustedProductSubtotal = computed(() => {
      const net = productSubtotal.value / (1 + FALLBACK_TAX_RATE / 100);
      if (props.isReverseCharge) return Math.round(net * 100) / 100;
      return Math.round(net * (1 + effectiveTaxRate.value / 100) * 100) / 100;
    });
    const adjustItemPrice = (skGross) => {
      if (!skGross) return 0;
      const net = skGross / (1 + FALLBACK_TAX_RATE / 100);
      if (props.isReverseCharge) return Math.round(net * 100) / 100;
      return Math.round(net * (1 + effectiveTaxRate.value / 100) * 100) / 100;
    };
    const BIKE_CATEGORY_IDS = computed(() => [
      config.public.shopware.ids.categories.bikes,
      config.public.shopware.ids.categories.ebikes
    ].filter(Boolean));
    const hasBikeInCart = computed(
      () => cartItems.value.some(
        (i) => i.payload?.categoryTree?.some((id) => BIKE_CATEGORY_IDS.value.includes(id)) || i.payload?.categoryIds?.some((id) => BIKE_CATEGORY_IDS.value.includes(id))
      )
    );
    const effectiveThreshold = computed(() => {
      if (isShippingLoading.value) return null;
      if (isForeignFlat.value) return null;
      if (hasBikeInCart.value) {
        const t = spsMetadata.value?.freeThreshold;
        return typeof t === "number" && t > 1 ? t : null;
      }
      const candidates = [balikovoMetadata.value?.freeThreshold, spsMetadata.value?.freeThreshold].filter((v) => typeof v === "number" && v > 1);
      return candidates.length > 0 ? Math.min(...candidates) : null;
    });
    const amountToFree = computed(
      () => effectiveThreshold.value === null ? null : Math.max(0, effectiveThreshold.value - productSubtotal.value)
    );
    const freePercent = computed(
      () => effectiveThreshold.value ? Math.min(100, productSubtotal.value / effectiveThreshold.value * 100) : 0
    );
    const productMediaMap = ref({});
    const fetchMediaForItems = async () => {
      const ids = cartItems.value.filter((i) => i.type === "product").map((i) => i.referencedId).filter((id) => id && !productMediaMap.value[id]);
      if (ids.length === 0) return;
      try {
        const res = await apiClient.invoke("readProduct post /product", {
          body: {
            filter: [{ type: "equalsAny", field: "id", value: ids }],
            includes: {
              product: ["id", "cover"],
              product_media: ["media"],
              media: ["url", "thumbnails"]
            }
          }
        });
        const products = (res.data || res)?.elements || [];
        products.forEach((p) => {
          const url = p.cover?.media?.url || p.cover?.url || p.cover?.media?.thumbnails?.[0]?.url;
          if (url) productMediaMap.value[p.id] = url;
        });
      } catch (e) {
      }
    };
    watch(cartItems, fetchMediaForItems, { immediate: true, deep: true });
    const { data: reviewsData } = useAsyncData(
      "google-reviews",
      () => $fetch("/api/google/reviews").catch(() => ({ rating: 4.8, totalReviews: 0 }))
    );
    const googleRating = computed(() => reviewsData.value?.rating ?? 4.8);
    const googleTotal = computed(() => reviewsData.value?.totalReviews ?? 0);
    const ratingStars = computed(() => {
      const r = Math.round(googleRating.value);
      return "★".repeat(r) + "☆".repeat(5 - r);
    });
    const activePromos = computed(() => cartItems.value.filter((i) => i.type !== "product"));
    const hasActivePromo = computed(() => activePromos.value.length > 0);
    const formatPrice = (price) => new Intl.NumberFormat("sk-SK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
    const resolveImageUrl = (item) => {
      let url = productMediaMap.value[item.referencedId] || item.cover?.url || item.cover?.media?.url || item.payload?.media?.[0]?.url;
      if (!url) return "https://placehold.co/160x160";
      return url;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white border border-gray-200 font-sans overflow-hidden transition-all duration-300" }, _attrs))} data-v-d394bf68><div class="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-gray-100 bg-white" data-v-d394bf68>`);
      _push(ssrRenderComponent(unref(ShoppingBag), {
        class: "w-4 h-4 text-gray-900",
        "stroke-width": 1.8
      }, null, _parent));
      _push(`<h2 class="text-xs font-bold tracking-[0.2em] text-gray-900 font-sans uppercase leading-none" data-v-d394bf68> Súhrn objednávky </h2></div>`);
      if (__props.step > 1) {
        _push(`<div class="px-5 py-5 max-h-72 overflow-y-auto border-b border-gray-50 space-y-5 custom-scrollbar bg-white" data-v-d394bf68><!--[-->`);
        ssrRenderList(unref(cartItems).filter((i) => i.type === "product" && i.referencedId !== unref(config).public.shopware.ids.products?.expressShipping && (__props.step >= 3 || i.referencedId !== unref(config).public.shopware.ids.products?.dobierka) && !unref(balneProductIds).includes(i.referencedId)), (item) => {
          _push(`<div class="flex gap-4 items-center" data-v-d394bf68><div class="w-16 h-16 bg-gray-50 border border-gray-100 flex-shrink-0 relative overflow-hidden" data-v-d394bf68>`);
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: resolveImageUrl(item),
            alt: item.label,
            format: "webp",
            loading: "lazy",
            class: "w-full h-full object-contain mix-blend-multiply"
          }, null, _parent));
          _push(`</div><div class="flex-1 min-w-0" data-v-d394bf68><p class="text-[11px] font-black uppercase truncate font-tech leading-tight text-gray-900"${ssrRenderAttr("title", item.referencedId === unref(dobierkaProductId) ? "Dobierka" : item.label)} data-v-d394bf68>${ssrInterpolate(item.referencedId === unref(dobierkaProductId) ? "Dobierka" : item.label)}</p><div class="flex items-center justify-between mt-1" data-v-d394bf68><p class="text-[10px] text-gray-400 font-medium font-sans" data-v-d394bf68>${ssrInterpolate(item.quantity)} ks × ${ssrInterpolate(formatPrice(adjustItemPrice(item.price?.unitPrice ?? 0)))} € </p><p class="font-black font-tech text-[13px] text-black" data-v-d394bf68>${ssrInterpolate(formatPrice(adjustItemPrice(item.price?.totalPrice ?? 0)))} € </p></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="px-6 py-6 space-y-4 text-sm border-b border-gray-50 bg-white" data-v-d394bf68><div class="flex justify-between items-baseline text-gray-500" data-v-d394bf68><span class="font-sans font-medium text-[13px]" data-v-d394bf68>Hodnota tovaru</span><span class="font-tech font-black text-black text-base" data-v-d394bf68>${ssrInterpolate(formatPrice(unref(adjustedProductSubtotal)))} €</span></div><!--[-->`);
      ssrRenderList(unref(cartItems).filter((i) => i.type !== "product"), (promo) => {
        _push(`<div class="flex justify-between items-baseline text-gray-500" data-v-d394bf68><span class="font-sans font-medium text-[13px] flex items-center gap-1.5" data-v-d394bf68>`);
        _push(ssrRenderComponent(unref(Tag), { class: "w-3 h-3 text-brand flex-shrink-0" }, null, _parent));
        _push(` ${ssrInterpolate(promo.label)}</span><span class="font-tech font-black text-sm text-brand" data-v-d394bf68>${ssrInterpolate(formatPrice(adjustItemPrice(promo.price?.totalPrice ?? 0)))} €</span></div>`);
      });
      _push(`<!--]-->`);
      if (unref(adjustedBalneBikeCost) > 0) {
        _push(`<div class="flex justify-between items-baseline text-gray-500" data-v-d394bf68><span class="font-sans font-medium text-[13px]" data-v-d394bf68>Balné bicykel <span class="text-[11px] text-gray-400" data-v-d394bf68>×${ssrInterpolate(unref(balneBikeItem)?.quantity ?? 1)}</span></span><span class="font-tech font-black text-sm text-black" data-v-d394bf68>${ssrInterpolate(formatPrice(unref(adjustedBalneBikeCost)))} €</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(adjustedBalneEbikeCost) > 0) {
        _push(`<div class="flex justify-between items-baseline text-gray-500" data-v-d394bf68><span class="font-sans font-medium text-[13px]" data-v-d394bf68>Balné elektrobicykel <span class="text-[11px] text-gray-400" data-v-d394bf68>×${ssrInterpolate(unref(balneEbikeItem)?.quantity ?? 1)}</span></span><span class="font-tech font-black text-sm text-black" data-v-d394bf68>${ssrInterpolate(formatPrice(unref(adjustedBalneEbikeCost)))} €</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-between items-baseline text-gray-500" data-v-d394bf68><span class="font-sans font-medium text-[13px]" data-v-d394bf68>Doprava</span>`);
      if (__props.step <= 2) {
        _push(`<!--[-->`);
        if (unref(isShippingLoading)) {
          _push(`<span class="text-[11px] italic font-sans text-gray-400" data-v-d394bf68>Načítava sa...</span>`);
        } else if (unref(cheapestShipping) === 0) {
          _push(`<span class="font-tech font-black text-sm text-green-600" data-v-d394bf68>ZADARMO</span>`);
        } else if (unref(cheapestShipping) !== null) {
          _push(`<span class="font-tech font-black text-sm text-black" data-v-d394bf68>${ssrInterpolate(unref(paidMethodCount) > 1 ? "od " : "")}${ssrInterpolate(formatPrice(unref(cheapestShipping)))} €</span>`);
        } else {
          _push(`<span class="text-[11px] italic font-sans text-gray-400" data-v-d394bf68>Vypočíta sa v pokladni</span>`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<span class="${ssrRenderClass([unref(shippingPriceToDisplay) === 0 ? "text-green-600" : "text-black", "font-tech font-black"])}" data-v-d394bf68>${ssrInterpolate(unref(shippingPriceToDisplay) === 0 ? "ZADARMO" : `${formatPrice(unref(shippingPriceToDisplay))} €`)}</span>`);
      }
      _push(`</div><div class="flex justify-between items-baseline text-gray-500" data-v-d394bf68><span class="font-sans font-medium text-[13px]" data-v-d394bf68>Platba</span>`);
      if (__props.step <= 2) {
        _push(`<span class="font-tech font-black text-sm text-green-600" data-v-d394bf68>ZADARMO</span>`);
      } else {
        _push(`<span class="${ssrRenderClass([unref(adjustedDobirjaCost) === 0 ? "text-green-600" : "text-black", "font-tech font-black"])}" data-v-d394bf68>${ssrInterpolate(unref(adjustedDobirjaCost) === 0 ? "ZADARMO" : `${formatPrice(unref(adjustedDobirjaCost))} €`)}</span>`);
      }
      _push(`</div>`);
      if (unref(amountToFree) !== null) {
        _push(`<div class="mt-[-8px]" data-v-d394bf68><div class="flex items-center justify-between mb-2" data-v-d394bf68>`);
        if (unref(amountToFree) > 0) {
          _push(`<span class="text-[12px] font-sans text-gray-500 leading-none" data-v-d394bf68> Chýba vám <span class="text-black font-bold" data-v-d394bf68>${ssrInterpolate(formatPrice(unref(amountToFree)))} €</span> do <span class="font-bold text-black uppercase tracking-tight" data-v-d394bf68>dopravy zadarmo</span></span>`);
        } else {
          _push(`<span class="text-[12px] font-bold text-green-600 font-sans uppercase tracking-tight leading-none flex items-center gap-1" data-v-d394bf68>`);
          _push(ssrRenderComponent(unref(Truck), { class: "w-3.5 h-3.5" }, null, _parent));
          _push(` Dopravu máte ZADARMO </span>`);
        }
        _push(`</div><div class="w-full h-1 bg-gray-100 overflow-hidden" data-v-d394bf68><div class="${ssrRenderClass([unref(amountToFree) <= 0 ? "bg-green-600" : "bg-brand", "h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"])}" style="${ssrRenderStyle({ width: `${unref(freePercent)}%` })}" data-v-d394bf68></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.isCompanyPurchase || __props.isReverseCharge) {
        _push(`<!--[--><div class="flex justify-between text-gray-400 text-[11px] pt-1 border-t border-gray-50" data-v-d394bf68><span data-v-d394bf68>Cena bez DPH</span><span data-v-d394bf68>${ssrInterpolate(formatPrice(unref(netDisplayTotal)))} €</span></div><div class="flex justify-between text-gray-400 text-[11px]" data-v-d394bf68><span data-v-d394bf68>${ssrInterpolate(props.isReverseCharge ? "Reverse charge (0 %)" : `DPH (${unref(effectiveTaxRate)} %)`)}</span><span data-v-d394bf68>${ssrInterpolate(formatPrice(props.isReverseCharge ? 0 : unref(taxDisplayAmount)))} €</span></div><!--]-->`);
      } else {
        _push(`<div class="flex justify-end text-[10px] text-gray-400 pt-1 border-t border-gray-50" data-v-d394bf68> vrátane DPH (${ssrInterpolate(unref(effectiveTaxRate))} %) </div>`);
      }
      _push(`<div class="flex justify-between items-baseline pt-4 border-t border-gray-100" data-v-d394bf68><span class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400" data-v-d394bf68>Spolu</span><span class="text-3xl font-black font-tech text-black leading-none" data-v-d394bf68>${ssrInterpolate(formatPrice(unref(adjustedDisplayTotal)))} € </span></div></div><div class="px-6 py-4 border-b border-gray-50 bg-amber-50/20 group cursor-pointer" data-v-d394bf68><div class="flex items-center justify-between" data-v-d394bf68><div class="flex items-center gap-3" data-v-d394bf68><div class="relative flex items-center justify-center w-4 h-4 border border-gray-300 group-hover:border-black transition-colors bg-white flex-shrink-0" data-v-d394bf68><input type="checkbox"${ssrIncludeBooleanAttr(props.isExpressShipping) ? " checked" : ""} class="sr-only" data-v-d394bf68>`);
      if (props.isExpressShipping) {
        _push(`<div class="w-2.5 h-2.5 bg-brand" data-v-d394bf68></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-d394bf68><div class="text-[11px] font-black uppercase tracking-widest font-tech flex items-center gap-1.5" data-v-d394bf68>`);
      _push(ssrRenderComponent(unref(Zap), { class: "w-3 h-3 text-amber-500 fill-current flex-shrink-0" }, null, _parent));
      _push(` Expresné odoslanie </div><div class="text-[9px] text-gray-400 font-sans uppercase font-bold mt-0.5 tracking-tight" data-v-d394bf68>Expedícia dnes do 13:00</div></div></div><span class="font-tech font-black text-xs text-black flex-shrink-0" data-v-d394bf68>+ ${ssrInterpolate(formatPrice(__props.expressProduct?.calculatedPrice?.unitPrice || 12.9))} €</span></div></div><details class="border-b border-gray-50 bg-white group/coupon"${ssrIncludeBooleanAttr(unref(hasActivePromo) || void 0) ? " open" : ""} data-v-d394bf68><summary class="px-6 py-4 flex items-center gap-2 font-sans font-medium text-[13px] text-black cursor-pointer hover:text-brand transition-colors list-none select-none" data-v-d394bf68>`);
      _push(ssrRenderComponent(unref(Tag), { class: "w-3.5 h-3.5 flex-shrink-0" }, null, _parent));
      _push(` Mám zľavový kód `);
      _push(ssrRenderComponent(unref(ChevronDown), { class: "ml-auto w-4 h-4 opacity-60 group-open/coupon:rotate-180 transition-transform duration-200" }, null, _parent));
      _push(`</summary><div class="px-6 pb-5" data-v-d394bf68><!--[-->`);
      ssrRenderList(unref(cartItems).filter((i) => i.type !== "product"), (promo) => {
        _push(`<div class="flex items-center justify-between py-2 mb-2 border-b border-gray-100" data-v-d394bf68><div class="flex items-center gap-2 min-w-0" data-v-d394bf68><span class="px-1.5 py-0.5 bg-brand text-white text-[8px] font-black uppercase tracking-widest flex-shrink-0" data-v-d394bf68>KÓD</span><span class="text-xs font-bold uppercase text-gray-800 truncate" data-v-d394bf68>${ssrInterpolate(promo.label)}</span></div><span class="font-tech font-black text-sm text-brand flex-shrink-0 ml-2" data-v-d394bf68>${ssrInterpolate(formatPrice(adjustItemPrice(promo.price?.totalPrice ?? 0)))} €</span></div>`);
      });
      _push(`<!--]--><div class="flex gap-0 border border-gray-200 focus-within:border-black transition-colors" data-v-d394bf68><input${ssrRenderAttr("value", unref(couponInput))} type="text" placeholder="NAPR. MT2026" class="flex-1 uppercase text-xs py-3 px-3 rounded-default focus:outline-none font-sans" data-v-d394bf68><button class="px-5 py-3 bg-gray-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 flex-shrink-0 font-sans"${ssrIncludeBooleanAttr(!unref(couponInput).trim() || unref(isApplyingCoupon)) ? " disabled" : ""} data-v-d394bf68>${ssrInterpolate(unref(isApplyingCoupon) ? "..." : "Použiť")}</button></div>`);
      if (unref(couponError)) {
        _push(`<p class="text-[11px] text-red-500 mt-1.5" data-v-d394bf68>${ssrInterpolate(unref(couponError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(couponSuccess)) {
        _push(`<p class="text-[11px] text-green-600 mt-1.5 font-bold" data-v-d394bf68>✓ Kód ${ssrInterpolate(unref(couponSuccess))} bol aplikovaný</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></details><div class="px-6 py-6 bg-white" data-v-d394bf68><a${ssrRenderAttr("href", MAPS_URL)} target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 mb-4 p-3 bg-gray-50 border border-gray-100 hover:border-amber-300 hover:bg-amber-50/50 transition-colors group/reviews" data-v-d394bf68><div class="flex text-amber-400 text-xs gap-px leading-none flex-shrink-0" data-v-d394bf68>${ssrInterpolate(unref(ratingStars))}</div><span class="text-[10px] text-gray-500 font-sans leading-tight flex-1" data-v-d394bf68><strong class="text-black font-bold" data-v-d394bf68>${ssrInterpolate(unref(googleRating).toFixed(1).replace(".", ","))}/5</strong>`);
      if (unref(googleTotal) > 0) {
        _push(`<!--[--> · ${ssrInterpolate(unref(googleTotal))} recenzií na Google<!--]-->`);
      } else {
        _push(`<!--[--> · overené hodnotenia zákazníkov<!--]-->`);
      }
      _push(`</span>`);
      _push(ssrRenderComponent(unref(ExternalLink), { class: "w-3 h-3 text-gray-300 group-hover/reviews:text-amber-400 transition-colors flex-shrink-0" }, null, _parent));
      _push(`</a><button class="${ssrRenderClass(["!h-16", "btn-checkout !text-black !font-tech !font-bold !uppercase !tracking-[0.15em] !py-0 flex items-center justify-center group/btn shadow-md hover:shadow-lg transition-all"])}"${ssrIncludeBooleanAttr(__props.isSubmitting || !__props.canAction) ? " disabled" : ""} data-v-d394bf68>`);
      if (__props.isSubmitting) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 mr-2 animate-spin flex-shrink-0" }, null, _parent));
        _push(`<span class="text-[13px]" data-v-d394bf68>${ssrInterpolate(__props.actionLabel || (__props.step === 1 ? "Prejsť k pokladni" : "Pokračovať"))}</span><!--]-->`);
      } else if (__props.step === 1) {
        _push(`<!--[--><span class="text-[13px] !tracking-[0.08em] whitespace-nowrap" data-v-d394bf68>${ssrInterpolate(__props.actionLabel || "Prejsť k pokladni")}</span>`);
        _push(ssrRenderComponent(unref(ArrowRight), { class: "w-5 h-5 ml-2.5 flex-shrink-0" }, null, _parent));
        _push(`<!--]-->`);
      } else if (__props.step === 2) {
        _push(`<!--[--><span class="text-[13px] !tracking-[0.08em] whitespace-nowrap" data-v-d394bf68>${ssrInterpolate(__props.actionLabel || "Pokračovať")}</span>`);
        _push(ssrRenderComponent(unref(ArrowRight), { class: "w-5 h-5 ml-2.5 flex-shrink-0" }, null, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<span class="flex flex-col items-center leading-none gap-1.5" data-v-d394bf68><span class="text-sm tracking-[0.15em] font-bold uppercase" data-v-d394bf68>${ssrInterpolate(__props.actionLabel || "Záväzne objednať")}</span><span class="flex items-center gap-1.5" data-v-d394bf68><span class="w-1.5 h-1.5 rounded-full bg-red-300 flex-shrink-0" data-v-d394bf68></span><span class="font-tech font-black text-[13px] leading-none" data-v-d394bf68>${ssrInterpolate(formatPrice(unref(adjustedDisplayTotal)))} €</span></span></span>`);
      }
      _push(`</button>`);
      if (__props.step === 1) {
        _push(`<div class="mt-6 flex justify-center" data-v-d394bf68>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ArrowLeft), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
              _push2(` Späť do obchodu `);
            } else {
              return [
                createVNode(unref(ArrowLeft), { class: "w-3.5 h-3.5" }),
                createTextVNode(" Späť do obchodu ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.backLabel) {
        _push(`<div class="mt-6 flex justify-center" data-v-d394bf68><button class="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors bg-transparent border-0 cursor-pointer" data-v-d394bf68>`);
        _push(ssrRenderComponent(unref(ArrowLeft), { class: "w-3.5 h-3.5" }, null, _parent));
        _push(` ${ssrInterpolate(__props.backLabel)}</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/checkout/OrderSummary.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-d394bf68"]]), { __name: "OrderSummary" });

export { __nuxt_component_3 as default };
