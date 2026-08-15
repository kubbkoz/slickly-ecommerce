import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { _ as _export_sfc, f as useUser, m as useI18n, d as useRoute, c as useRouter, g as useState, I as __nuxt_component_0$1, i as useRuntimeConfig } from './server.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderTeleport } from 'vue/server-renderer';
import { Check, ChevronDown, Ruler, Heart, Scale, Zap, X } from 'lucide-vue-next';
import RatingStars from './RatingStars-CZsf46JE.mjs';
import AddToCartButton from './AddToCartButton-B8hFUbWd.mjs';
import ShareProduct from './ShareProduct-vwcTFzOy.mjs';
import __nuxt_component_2$1 from './AppModal-CMHCLJuP.mjs';
import VariantSelector from './VariantSelector-DUiZzl4P.mjs';
import __nuxt_component_1 from './QuantitySelector-B6vBeA3f.mjs';
import TrustBadges from './TrustBadges-BcdpP2yW.mjs';
import { p as plainTextExcerpt, f as formatRating } from './format-tV37I8C6.mjs';
import { u as useProductHelpers } from './useProductHelpers-Ch_jrkwO.mjs';
import { u as useCustomerWishlist } from './useCustomerWishlist-CccY2iyd.mjs';
import { u as useProductBadges, b as badgeSizeClass } from './useProductBadges-BvF7DSTC.mjs';
import BaseButton from './BaseButton-BJMOoNbK.mjs';
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
import './useUiState-BTlUPkrr.mjs';
import './nuxt-link-B7B0pxEe.mjs';
import './useShippingMetadata-C7Eoqyz6.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductInfo",
  __ssrInlineRender: true,
  props: {
    product: {},
    quantity: {},
    selectedSize: {},
    currentVariant: {},
    selectedVariant: {},
    ratingAverage: {},
    reviewCount: {}
  },
  emits: ["update:quantity", "update:selectedSize", "addToCompare", "addToWishlist", "openDescription", "openWatchdog", "openPriceOffer", "openSizeChart", "variantSelected", "openReviews"],
  setup(__props, { emit: __emit }) {
    useUser();
    const { t } = useI18n();
    const { hasPriceVariance } = useProductHelpers();
    const { isInWishlist } = useCustomerWishlist();
    const { splitPdpBadges } = useProductBadges();
    const pdpBadges = computed(() => splitPdpBadges(props.product).topBadges);
    const route = useRoute();
    const router = useRouter();
    const props = __props;
    const emit = __emit;
    ref(false);
    const isWishlistLoginModalOpen = ref(false);
    const isMobileVariantPanelOpen = useState("mobileVariantPanelOpen", () => false);
    const config = useRuntimeConfig();
    const bikeCategoryIds = computed(
      () => [config.public.shopware.ids.categories.bikes, config.public.shopware.ids.categories.ebikes].filter(Boolean)
    );
    const sizeLabel = computed(() => {
      if (props.product.customFields?.is_bike !== void 0) {
        return props.product.customFields.is_bike ? t("pdp.size_frame") : t("pdp.size_general");
      }
      const productCatIds = props.product.categoryIds || (props.product.categories?.map((c) => c.id) ?? []);
      const isBike = bikeCategoryIds.value.length > 0 && productCatIds.some((id) => bikeCategoryIds.value.includes(id));
      return isBike ? t("pdp.size_frame") : t("pdp.size_general");
    });
    const updateQuantity = (val) => {
      emit("update:quantity", val);
    };
    const sanitizedProductName = computed(() => props.product.name?.replace(/\s*\(Variant\)$/i, "") || "");
    const openGlobalLoginModal = () => {
      isWishlistLoginModalOpen.value = false;
      useState("loginModalOpen", () => false).value = true;
    };
    const goToRegister = () => {
      isWishlistLoginModalOpen.value = false;
      router.push(`/register?redirectTo=${encodeURIComponent(route.fullPath)}`);
    };
    const cartProduct = computed(() => ({
      ...props.product,
      id: props.selectedVariant?.id || props.product.id,
      name: props.selectedVariant?.name || props.product.name,
      hasVariants: (props.product.childCount ?? 0) > 0 || (props.product.children?.length ?? 0) > 0,
      _isVariantOverride: !!props.selectedVariant || !!props.product.parentId,
      isCloseout: props.selectedVariant?.isCloseout === true || props.product._raw?.isCloseout === true,
      availableStock: props.selectedVariant?.availableStock ?? props.product?.availableStock ?? props.product?._raw?.availableStock ?? 0,
      stock: props.selectedVariant?.stock ?? props.product?.stock ?? props.product?._raw?.stock ?? 0
    }));
    const isActiveVariantCloseout = computed(() => {
      const raw = props.product._raw || props.product;
      if (raw?.parentId) return raw?.isCloseout === true;
      if (props.selectedVariant) return props.selectedVariant?.isCloseout === true;
      return false;
    });
    const shortDescription = computed(() => plainTextExcerpt(props.product.description, 0));
    const { adjustPrice } = useCountrySelector();
    const _listPrice = computed(() => {
      return props.selectedVariant?.calculatedPrice?.listPrice?.price ?? props.selectedVariant?.calculatedPrices?.[0]?.listPrice?.price ?? props.product.calculatedPrice?.listPrice?.price ?? props.product.oldPrice;
    });
    const _currentPrice = computed(() => {
      return props.selectedVariant?.calculatedPrice?.unitPrice ?? props.selectedVariant?.calculatedPrices?.[0]?.unitPrice ?? props.product.calculatedPrice?.unitPrice ?? props.product.price;
    });
    const listPrice = computed(() => {
      const p = Number(_listPrice.value);
      return p ? adjustPrice(p) : _listPrice.value;
    });
    const currentPrice = computed(() => {
      const p = Number(_currentPrice.value);
      return p ? adjustPrice(p) : _currentPrice.value;
    });
    const discountPercent = computed(() => {
      const lp = Number(listPrice.value);
      const cp = Number(currentPrice.value);
      return lp && cp && lp > cp ? Math.round((lp - cp) / lp * 100) : 0;
    });
    const mocPrice = computed(() => {
      const cf = props.product.customFields || props.product._raw?.customFields;
      const v = cf?.mtsport_moc;
      return v && Number(v) > 0 ? Number(v) : null;
    });
    const pmocPrice = computed(() => {
      const cf = props.product.customFields || props.product._raw?.customFields;
      const v = cf?.mtsport_pmoc;
      return v && Number(v) > 0 ? Number(v) : null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ role: "main" }, _attrs))} data-v-d93a5896><div class="hidden lg:block" data-v-d93a5896>`);
      if (pdpBadges.value.length) {
        _push(`<div class="flex flex-row flex-wrap gap-1.5 mb-3" data-v-d93a5896><!--[-->`);
        ssrRenderList(pdpBadges.value, (badge) => {
          _push(`<span class="${ssrRenderClass(["font-bold uppercase tracking-wider leading-none font-tech", unref(badgeSizeClass)(badge.size)])}" style="${ssrRenderStyle({ backgroundColor: badge.bgColor, color: badge.textColor })}" data-v-d93a5896>${ssrInterpolate(badge.text)}</span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mb-2" data-v-d93a5896>`);
      if (__props.product.manufacturer?.media?.url) {
        _push(`<div class="opacity-90 hover:opacity-100 transition-opacity mb-2" data-v-d93a5896>`);
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: __props.product.manufacturer.media.url,
          alt: `${__props.product.brand} logo`,
          width: "100",
          height: "24",
          sizes: "100px",
          class: "h-6 w-auto object-contain mix-blend-multiply",
          format: "webp",
          loading: "lazy"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><h1 class="text-2xl lg:text-3xl xl:text-4xl font-black text-black leading-tight mt-6 mb-4 font-tech uppercase tracking-wide" data-v-d93a5896>${ssrInterpolate(sanitizedProductName.value)}</h1><div class="flex items-center gap-2 cursor-pointer group mb-4 min-h-[44px]" role="button"${ssrRenderAttr("aria-label", `Hodnotenie: ${unref(formatRating)(__props.ratingAverage ?? __props.product.ratingAverage)} z 5 hviezdičiek. Kliknutím zobrazíte recenzie.`)} data-v-d93a5896>`);
      _push(ssrRenderComponent(RatingStars, {
        rating: __props.ratingAverage ?? __props.product.ratingAverage ?? 0
      }, null, _parent));
      _push(`<span class="text-[11px] font-bold text-gray-500 group-hover:text-brand font-sans transition-colors" data-v-d93a5896>${ssrInterpolate(unref(formatRating)(__props.ratingAverage ?? __props.product.ratingAverage ?? 0))}</span><span class="text-[11px] text-gray-300 font-sans" data-v-d93a5896>|</span><span class="text-[11px] font-bold underline underline-offset-2 decoration-gray-300 group-hover:text-brand group-hover:decoration-brand text-gray-500 font-sans transition-colors" data-v-d93a5896>${ssrInterpolate(__props.reviewCount ?? __props.product.productReviewsCount ?? 0)} ${ssrInterpolate(_ctx.$t("pdp.reviews_count"))}</span>`);
      if ((__props.reviewCount ?? __props.product.productReviewsCount ?? 0) > 0) {
        _push(`<span class="hidden sm:flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5" data-v-d93a5896>`);
        _push(ssrRenderComponent(unref(Check), { class: "w-2.5 h-2.5" }, null, _parent));
        _push(` Overené </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (shortDescription.value) {
        _push(`<div class="hidden md:block mb-6 pb-6" data-v-d93a5896><div class="text-gray-600 text-sm font-sans leading-relaxed line-clamp-3 mb-3" data-v-d93a5896>${ssrInterpolate(shortDescription.value)}</div><button class="text-xs font-bold text-brand hover:text-black uppercase tracking-widest flex items-center transition-colors group bg-white border-0 p-0" data-v-d93a5896>${ssrInterpolate(_ctx.$t("pdp.read_more"))} `);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "w-4 h-4 ml-1.5 transition-transform group-hover:translate-y-0.5" }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col mb-8 relative mt-6 md:mt-8 lg:mt-6" data-v-d93a5896>`);
      if (discountPercent.value > 0) {
        _push(`<div class="absolute bottom-full left-0 mb-0.5 text-sm md:text-base text-gray-400 line-through font-tech decoration-1 pointer-events-none" data-v-d93a5896>${ssrInterpolate(listPrice.value)} € </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center gap-4" data-v-d93a5896><span class="text-2xl md:text-4xl font-black text-black font-tech leading-none" data-v-d93a5896>`);
      if (!__props.selectedVariant && unref(hasPriceVariance)(__props.product)) {
        _push(`<!--[--> Od <!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(currentPrice.value)} € </span>`);
      if (discountPercent.value > 0) {
        _push(`<div class="relative group px-3 py-1 text-sm md:text-base font-black text-black uppercase tracking-wider font-tech bg-amber shadow-sm self-stretch flex items-center cursor-help rounded-[3px]" data-v-d93a5896> -${ssrInterpolate(discountPercent.value)}% <div class="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-[10px] py-2 px-3 w-44 text-center leading-snug z-50 normal-case font-sans tracking-normal font-bold shadow-xl animate-fade-in pointer-events-none" data-v-d93a5896> Zľava vypočítaná z najnižšej ceny za 30 dní pred zľavou. <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" data-v-d93a5896></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (discountPercent.value > 0) {
        _push(`<p class="text-[10px] text-gray-400 font-sans mt-1.5 md:hidden" data-v-d93a5896> * najnižšia cena za posledných 30 dní pred zľavou </p>`);
      } else {
        _push(`<!---->`);
      }
      if (mocPrice.value || pmocPrice.value) {
        _push(`<div class="flex flex-col gap-0.5 mt-2" data-v-d93a5896>`);
        if (mocPrice.value) {
          _push(`<div class="flex items-baseline gap-1" data-v-d93a5896><span class="text-xs text-gray-500 font-sans" data-v-d93a5896>MOC: ${ssrInterpolate(unref(adjustPrice)(mocPrice.value))} €</span><span class="relative group cursor-help inline-flex self-center" data-v-d93a5896><span class="inline-flex items-center justify-center w-3.5 h-3.5 text-[8px] font-bold text-gray-400 border border-gray-300 rounded-full leading-none" data-v-d93a5896>?</span><span class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-[10px] py-2 px-3 w-52 text-center leading-snug z-50 font-sans font-medium shadow-xl pointer-events-none" data-v-d93a5896> Maloobchodná odporúčaná cena výrobcom, alebo cena, za ktorú sme produkt predávali pri zaradení do ponuky. <span class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" data-v-d93a5896></span></span></span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (pmocPrice.value) {
          _push(`<div class="flex items-baseline gap-1" data-v-d93a5896><span class="text-xs text-gray-500 font-sans" data-v-d93a5896>PMOC: ${ssrInterpolate(unref(adjustPrice)(pmocPrice.value))} €</span><span class="relative group cursor-help inline-flex self-center" data-v-d93a5896><span class="inline-flex items-center justify-center w-3.5 h-3.5 text-[8px] font-bold text-gray-400 border border-gray-300 rounded-full leading-none" data-v-d93a5896>?</span><span class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-[10px] py-2 px-3 w-52 text-center leading-snug z-50 font-sans font-medium shadow-xl pointer-events-none" data-v-d93a5896> Pôvodná maloobchodná odporúčaná cena výrobcom, alebo cena, za ktorú sme produkt predávali pri zaradení do ponuky. <span class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" data-v-d93a5896></span></span></span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (cartProduct.value.availableStock > 0 && cartProduct.value.availableStock <= 5) {
        _push(`<div class="mb-5 flex items-center gap-2.5 px-3 py-2.5 border border-amber-200 bg-amber-50" data-v-d93a5896><span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" data-v-d93a5896></span><span class="text-[11px] font-bold uppercase tracking-widest text-amber-800 font-sans" data-v-d93a5896> Zostávajú posledné ${ssrInterpolate(cartProduct.value.availableStock)} ks! </span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      if (!__props.product.configuratorSettings?.length && __props.product.variants && __props.product.variants.length > 0) {
        _push(`<div role="radiogroup"${ssrRenderAttr("aria-label", sizeLabel.value)} class="mb-6" data-v-d93a5896><div class="flex justify-between items-end mb-3" data-v-d93a5896><span class="block text-xs font-bold uppercase tracking-widest text-[#111] font-sans" id="size-label" data-v-d93a5896>Dostupné ${ssrInterpolate(sizeLabel.value.toLowerCase())}</span><button class="text-xs font-bold text-gray-500 hover:text-black underline decoration-gray-300 underline-offset-4 transition-colors flex items-center" data-v-d93a5896>`);
        _push(ssrRenderComponent(unref(Ruler), { class: "w-3 h-3 mr-1" }, null, _parent));
        _push(` Tabuľka veľkostí </button></div><div class="flex flex-wrap gap-2 items-center" data-v-d93a5896><!--[-->`);
        ssrRenderList(__props.product.variants, (variant) => {
          _push(`<button role="radio"${ssrRenderAttr("aria-checked", __props.selectedSize === variant.size)}${ssrIncludeBooleanAttr(variant.stockStatus === "unavailable") ? " disabled" : ""} class="${ssrRenderClass([[
            variant.stockStatus === "unavailable" ? "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed" : __props.selectedSize === variant.size ? "bg-black text-white border-black" : "bg-white text-black border-gray-300 hover:border-black"
          ], "min-w-[3.5rem] w-auto px-4 h-12 flex items-center justify-center font-bold text-sm transition-all border font-sans focus:outline-none focus:ring-1 focus:ring-black rounded-sm"])}" data-v-d93a5896>${ssrInterpolate(variant.size)}</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-6 mb-10" data-v-d93a5896><div class="flex flex-col pt-2" data-v-d93a5896><div id="buy-btn-sentinel" class="flex gap-2 h-14 w-full mb-3" data-v-d93a5896>`);
      _push(ssrRenderComponent(__nuxt_component_1, {
        "model-value": __props.quantity,
        "onUpdate:modelValue": updateQuantity
      }, null, _parent));
      _push(`<div class="flex-1" data-v-d93a5896>`);
      _push(ssrRenderComponent(AddToCartButton, {
        product: cartProduct.value,
        quantity: __props.quantity,
        selectedSize: __props.selectedSize,
        isCloseout: isActiveVariantCloseout.value,
        class: "h-full w-full",
        showText: true
      }, null, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(TrustBadges, {
        product: __props.product,
        onOpenWatchdog: ($event) => emit("openWatchdog", __props.product)
      }, null, _parent));
      _push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 w-full" data-v-d93a5896><button class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors group py-2" data-v-d93a5896>`);
      _push(ssrRenderComponent(unref(Heart), {
        class: ["w-4 h-4 transition-colors", unref(isInWishlist)(__props.selectedVariant?.id || __props.product.id) ? "fill-brand text-brand" : "text-gray-400 group-hover:text-brand"]
      }, null, _parent));
      _push(` Obľúbené </button><button class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors group py-2" data-v-d93a5896>`);
      _push(ssrRenderComponent(unref(Scale), { class: "w-4 h-4 text-gray-400 group-hover:text-brand transition-colors" }, null, _parent));
      _push(` Porovnať </button>`);
      _push(ssrRenderComponent(ShareProduct, { product: __props.product }, null, _parent));
      _push(`<button class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors group py-2" data-v-d93a5896>`);
      _push(ssrRenderComponent(unref(Zap), { class: "w-4 h-4 text-gray-400 group-hover:text-brand transition-colors" }, null, _parent));
      _push(` Ponuka </button></div></div></div>`);
      _push(ssrRenderComponent(__nuxt_component_2$1, {
        "is-open": isWishlistLoginModalOpen.value,
        title: "Uloženie medzi obľúbené",
        onClose: ($event) => isWishlistLoginModalOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="px-6 pt-8 pb-4 md:px-12 animate-fade-in font-sans" data-v-d93a5896${_scopeId}><div class="flex flex-col items-center text-center" data-v-d93a5896${_scopeId}><div class="w-24 h-24 bg-gray-50 flex items-center justify-center mb-8 border border-gray-100" data-v-d93a5896${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Heart), { class: "w-12 h-12 text-brand animate-heartbeat" }, null, _parent2, _scopeId));
            _push2(`</div><h4 class="text-xl font-black text-black mb-4 uppercase font-tech tracking-widest" data-v-d93a5896${_scopeId}>Položka je len kúsok od vás</h4><p class="text-gray-500 mb-8 max-w-sm font-sans text-sm leading-relaxed" data-v-d93a5896${_scopeId}> Aby ste si mohli produkty uložiť medzi obľúbené a mať k nim prístup zo všetkých zariadení, prosím, prihláste sa do svojho SLICKLY účtu. </p><div class="flex flex-col items-center gap-6 w-full" data-v-d93a5896${_scopeId}>`);
            _push2(ssrRenderComponent(BaseButton, {
              variant: "primary",
              size: "lg",
              class: "w-full md:w-auto md:min-w-[280px] uppercase font-bold tracking-widest py-5",
              onClick: openGlobalLoginModal
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Prihlásiť sa`);
                } else {
                  return [
                    createTextVNode("Prihlásiť sa")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="flex flex-col items-center gap-3 mt-4 pt-6 border-t border-gray-100 w-full text-center" data-v-d93a5896${_scopeId}><p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2" data-v-d93a5896${_scopeId}>Ešte nemáte účet?</p>`);
            _push2(ssrRenderComponent(BaseButton, {
              variant: "white",
              block: "",
              class: "border border-gray-200 uppercase font-black tracking-widest",
              onClick: goToRegister
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Zaregistrovať sa `);
                } else {
                  return [
                    createTextVNode(" Zaregistrovať sa ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "px-6 pt-8 pb-4 md:px-12 animate-fade-in font-sans" }, [
                createVNode("div", { class: "flex flex-col items-center text-center" }, [
                  createVNode("div", { class: "w-24 h-24 bg-gray-50 flex items-center justify-center mb-8 border border-gray-100" }, [
                    createVNode(unref(Heart), { class: "w-12 h-12 text-brand animate-heartbeat" })
                  ]),
                  createVNode("h4", { class: "text-xl font-black text-black mb-4 uppercase font-tech tracking-widest" }, "Položka je len kúsok od vás"),
                  createVNode("p", { class: "text-gray-500 mb-8 max-w-sm font-sans text-sm leading-relaxed" }, " Aby ste si mohli produkty uložiť medzi obľúbené a mať k nim prístup zo všetkých zariadení, prosím, prihláste sa do svojho SLICKLY účtu. "),
                  createVNode("div", { class: "flex flex-col items-center gap-6 w-full" }, [
                    createVNode(BaseButton, {
                      variant: "primary",
                      size: "lg",
                      class: "w-full md:w-auto md:min-w-[280px] uppercase font-bold tracking-widest py-5",
                      onClick: openGlobalLoginModal
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Prihlásiť sa")
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex flex-col items-center gap-3 mt-4 pt-6 border-t border-gray-100 w-full text-center" }, [
                      createVNode("p", { class: "text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2" }, "Ešte nemáte účet?"),
                      createVNode(BaseButton, {
                        variant: "white",
                        block: "",
                        class: "border border-gray-200 uppercase font-black tracking-widest",
                        onClick: goToRegister
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Zaregistrovať sa ")
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(isMobileVariantPanelOpen)) {
          _push2(`<div class="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm lg:hidden" data-v-d93a5896></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(isMobileVariantPanelOpen)) {
          _push2(`<div class="fixed bottom-0 inset-x-0 bg-white z-[110] rounded-default shadow-2xl lg:hidden flex flex-col pb-safe max-h-[85vh] overflow-hidden" data-v-d93a5896><div class="w-full flex justify-center py-3" data-v-d93a5896><div class="w-12 h-1.5 bg-gray-200 rounded-full" data-v-d93a5896></div></div><div class="px-5 pb-5 border-b border-gray-100 flex items-start justify-between relative" data-v-d93a5896><div class="flex flex-col mt-1" data-v-d93a5896><h3 class="text-[11px] font-bold font-sans uppercase tracking-widest mb-3 text-black" data-v-d93a5896>Výber variantu</h3>`);
          if (discountPercent.value > 0) {
            _push2(`<div class="text-sm text-gray-400 line-through font-tech decoration-1 mb-0.5" data-v-d93a5896>${ssrInterpolate(listPrice.value)} € </div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="flex flex-row items-center gap-3" data-v-d93a5896><span class="text-2xl font-black text-black font-tech leading-none" data-v-d93a5896>${ssrInterpolate(currentPrice.value)} € </span>`);
          if (discountPercent.value > 0) {
            _push2(`<div class="px-2 py-0.5 text-[13px] font-black text-black uppercase tracking-wider font-tech bg-amber shadow-sm flex items-center rounded-[3px]" data-v-d93a5896> -${ssrInterpolate(discountPercent.value)}% </div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div><button class="absolute top-0 right-5 p-2 bg-gray-50 rounded-sm border border-gray-100 text-black shadow-sm active:bg-gray-100 transition-colors" data-v-d93a5896>`);
          _push2(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
          _push2(`</button></div><div class="overflow-y-auto w-full px-5 py-6 scrollbar-hide relative" data-v-d93a5896>`);
          _push2(ssrRenderComponent(VariantSelector, {
            product: __props.product,
            selectedVariantId: __props.selectedVariant?.id,
            hideInfo: true,
            onVariantSelected: (payload) => emit("variantSelected", payload),
            class: "mb-2"
          }, null, _parent));
          _push2(`</div><div class="p-4 pt-3 border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] bg-white mt-auto w-full" data-v-d93a5896><div class="flex gap-2 h-14 w-full" data-v-d93a5896>`);
          _push2(ssrRenderComponent(__nuxt_component_1, {
            "model-value": __props.quantity,
            "onUpdate:modelValue": updateQuantity
          }, null, _parent));
          _push2(`<div class="flex-1" data-v-d93a5896>`);
          _push2(ssrRenderComponent(AddToCartButton, {
            product: cartProduct.value,
            quantity: __props.quantity,
            selectedSize: __props.selectedSize,
            isCloseout: isActiveVariantCloseout.value,
            class: "h-full w-full text-[12px] font-bold shadow-sm rounded-default tracking-widest",
            showText: true,
            onSuccess: ($event) => isMobileVariantPanelOpen.value = false
          }, null, _parent));
          _push2(`</div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ProductInfo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductInfo = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-d93a5896"]]), { __name: "ProductInfo" });

export { ProductInfo as default };
