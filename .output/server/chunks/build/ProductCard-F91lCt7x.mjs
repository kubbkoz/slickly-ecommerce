import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { u as useProductHelpers } from './useProductHelpers-Ch_jrkwO.mjs';
import { p as plainTextExcerpt, f as formatRating } from './format-tV37I8C6.mjs';
import { ChevronLeft, ChevronRight, Star, Heart, Scale, ArrowRight } from 'lucide-vue-next';
import AddToCartButton from './AddToCartButton-B8hFUbWd.mjs';
import { u as useCustomerWishlist } from './useCustomerWishlist-CccY2iyd.mjs';
import { u as useProductBadges, b as badgeSizeClass } from './useProductBadges-BvF7DSTC.mjs';
import { u as useProductComparison } from './useProductComparison-BXlqQWLK.mjs';
import { _ as _export_sfc, b as useLocalePath, f as useUser, g as useState } from './server.mjs';
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
import './BaseButton-BJMOoNbK.mjs';
import './nuxt-link-B7B0pxEe.mjs';
import './useUiState-BTlUPkrr.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ProductCard" },
  __name: "ProductCard",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  emits: ["addToCompare", "openWatchdog", "openPriceOffer"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const {
      getProductImageUrl,
      calculateDiscount,
      getPrice,
      getOldPrice,
      getProductUrl,
      getVariantLabel,
      getFormattedName,
      hasPriceVariance,
      sortVariants
    } = useProductHelpers();
    const localePath = useLocalePath();
    const productUrl = computed(() => localePath(getProductUrl(props.product)));
    const { isInWishlist } = useCustomerWishlist();
    const { getProductBadges } = useProductBadges();
    const { isInComparison } = useProductComparison();
    const productBadges = computed(() => getProductBadges(props.product, "card"));
    useUser();
    useState("loginModalOpen", () => false);
    useState("wishlistToast", () => ({ show: false, productName: "", action: "add" }));
    useState("comparisonToast", () => ({ show: false, productName: "", action: "add" }));
    const { adjustPrice } = useCountrySelector();
    const displayPrice = computed(() => {
      const p = getPrice(props.product);
      return p != null ? adjustPrice(p) : p;
    });
    const displayOldPrice = computed(() => {
      const p = getOldPrice(props.product);
      return p != null ? adjustPrice(p) : null;
    });
    const shortDescription = computed(() => plainTextExcerpt(props.product.description));
    const isHovered = ref(false);
    ref(1);
    const currentImageIndex = ref(0);
    ref(null);
    const productMedia = computed(() => {
      const mainImage = getProductImageUrl(props.product);
      if (!props.product?.media || !Array.isArray(props.product.media)) return [mainImage];
      const gallery = [...props.product.media].sort((a, b) => (a.position || 0) - (b.position || 0)).map((m) => {
        const url = m.media?.url;
        return url ? url : null;
      }).filter((url) => !!url && url !== mainImage);
      return [mainImage, ...gallery];
    });
    const hasMultipleImages = computed(() => productMedia.value.length > 1);
    const hasVariants = computed(() => (props.product.children?.length ?? 0) > 0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      _push(`<a${ssrRenderAttrs(mergeProps({
        href: unref(productUrl),
        class: ["group bg-white cursor-pointer relative transition-[box-shadow] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col touch-manipulation", [
          unref(isHovered) ? "z-20 shadow-[0_20px_50px_rgba(0,0,0,0.08)]" : "z-10"
        ]],
        "aria-label": `Detail produktu ${__props.product.translated?.name || __props.product.name}`
      }, _attrs))} data-v-9fd7d93f><div class="${ssrRenderClass([[
        unref(isHovered) ? "border-black" : "border-gray-100"
      ], "bg-white border transition-colors duration-200 ease-in-out flex flex-col flex-1 rounded-default overflow-hidden"])}" data-v-9fd7d93f><div class="relative w-full aspect-[3/4] overflow-hidden group/img" data-v-9fd7d93f><div class="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform bg-gray-50" style="${ssrRenderStyle({ transform: `translateX(-${unref(currentImageIndex) * 100}%)` })}" data-v-9fd7d93f><!--[-->`);
      ssrRenderList(unref(productMedia), (image, index) => {
        _push(`<div class="flex-shrink-0 w-full h-full bg-transparent" data-v-9fd7d93f>`);
        _push(ssrRenderComponent(_component_NuxtImg, {
          alt: `${__props.product.translated?.name || __props.product.name || ""} - foto ${index + 1}`,
          src: image,
          width: "300",
          height: "400",
          sizes: "50vw sm:50vw md:33vw lg:25vw",
          class: "w-full h-full object-contain p-4 mix-blend-multiply pointer-events-none",
          loading: index < 1 ? "eager" : "lazy",
          fetchpriority: index === 0 ? "high" : "low",
          decoding: "async"
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
      if (unref(hasMultipleImages)) {
        _push(`<!--[--><button class="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-transparent border-none p-0 hidden md:flex items-center justify-center text-black/40 hover:text-black transition-all opacity-0 group-hover/img:opacity-100 pointer-events-auto z-10" aria-label="Predošlý obrázok" data-v-9fd7d93f>`);
        _push(ssrRenderComponent(unref(ChevronLeft), { class: "w-6 h-6 stroke-[1.5px]" }, null, _parent));
        _push(`</button><button class="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-transparent border-none p-0 hidden md:flex items-center justify-center text-black/40 hover:text-black transition-all opacity-0 group-hover/img:opacity-100 pointer-events-auto z-10" aria-label="Ďalší obrázok" data-v-9fd7d93f>`);
        _push(ssrRenderComponent(unref(ChevronRight), { class: "w-6 h-6 stroke-[1.5px]" }, null, _parent));
        _push(`</button>`);
        if (unref(hasMultipleImages)) {
          _push(`<div class="${ssrRenderClass([[
            "md:opacity-0 md:group-hover/img:opacity-100",
            "opacity-100"
          ], "absolute bottom-0 left-0 right-0 h-[2px] bg-gray-200/50 transition-opacity duration-300 pointer-events-none"])}" data-v-9fd7d93f><div class="h-full bg-brand transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" style="${ssrRenderStyle({
            width: 100 / unref(productMedia).length + "%",
            transform: `translateX(${unref(currentImageIndex) * 100}%)`
          })}" data-v-9fd7d93f></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (unref(productBadges).length) {
        _push(`<div class="absolute top-2 left-2 flex flex-row flex-wrap gap-1 z-10 pointer-events-none max-w-[calc(100%-1rem)]" data-v-9fd7d93f><!--[-->`);
        ssrRenderList(unref(productBadges), (badge) => {
          _push(`<span class="${ssrRenderClass(["font-bold uppercase tracking-wider leading-none font-tech", unref(badgeSizeClass)(badge.size)])}" style="${ssrRenderStyle({ backgroundColor: badge.bgColor, color: badge.textColor })}" data-v-9fd7d93f>${ssrInterpolate(badge.text)}</span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if ((__props.product.ratingAverage || __props.product.rating) > 0) {
        _push(`<div class="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-sm z-10 pointer-events-none text-xs font-tech text-gray-900" data-v-9fd7d93f>`);
        _push(ssrRenderComponent(unref(Star), { class: "w-3 h-3 fill-amber-400 text-amber-400" }, null, _parent));
        _push(`<span class="font-bold" data-v-9fd7d93f>${ssrInterpolate(unref(formatRating)(__props.product.ratingAverage || __props.product.rating))}</span><span class="text-[10px] text-gray-600 font-medium"${ssrRenderAttr("aria-label", `${__props.product.productReviewsCount || 0} recenzií`)} data-v-9fd7d93f> (${ssrInterpolate(__props.product.productReviewsCount || __props.product.reviewCount || __props.product.customFields?.mtsport_review_count || 0)}) </span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="absolute top-2 right-2 w-9 h-9 flex items-center justify-center bg-white border border-gray-100 transition-colors duration-200 z-10 pointer-events-auto group/wish mt-0 rounded-default"${ssrRenderAttr("title", unref(isInWishlist)(__props.product.id) ? "Odstrániť z obľúbených" : "Pridať do obľúbených")} aria-label="Prepnúť obľúbené" data-v-9fd7d93f>`);
      _push(ssrRenderComponent(unref(Heart), {
        class: ["w-4 h-4 transition-colors duration-200", unref(isInWishlist)(__props.product.id) ? "fill-brand text-brand" : "text-gray-300 group-hover/wish:text-brand"]
      }, null, _parent));
      _push(`</button><button class="absolute top-13 right-2 w-9 h-9 flex items-center justify-center bg-white border border-gray-100 transition-colors duration-200 z-10 pointer-events-auto group/comp rounded-default"${ssrRenderAttr("title", unref(isInComparison)(__props.product.id) ? "Odobrať z porovnania" : "Pridať do porovnania")} aria-label="Prepnúť porovnanie" data-v-9fd7d93f>`);
      _push(ssrRenderComponent(unref(Scale), {
        class: ["w-4 h-4 transition-colors duration-200", unref(isInComparison)(__props.product.id) ? "text-blue-500" : "text-gray-300 group-hover/comp:text-blue-500"]
      }, null, _parent));
      _push(`</button></div><div class="p-2 md:p-4 flex flex-col flex-1" data-v-9fd7d93f>`);
      if (unref(hasVariants)) {
        _push(`<div class="flex flex-wrap gap-1.5 mb-2" data-v-9fd7d93f><!--[-->`);
        ssrRenderList(unref(sortVariants)(__props.product.children, __props.product), (child) => {
          _push(`<div${ssrRenderAttr("title", (() => {
            const label = unref(getVariantLabel)(child, __props.product);
            return label?.includes("(") ? label.split("(")[1]?.replace(")", "") : "";
          })())} class="${ssrRenderClass([[
            child.availableStock > 0 ? "border-green-400 bg-white cursor-pointer hover:bg-success-light" : child.isCloseout ?? __props.product.isCloseout ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed" : "border-amber-400 bg-white cursor-pointer hover:bg-amber-50"
          ], "relative min-w-[38px] h-7 border flex items-center justify-center text-center px-1.5 transition-colors duration-150 font-tech rounded-sm"])}" role="button"${ssrRenderAttr("aria-label", `Veľkosť ${unref(getVariantLabel)(child, __props.product)?.split("(")?.[0]?.trim()} — ${child.availableStock > 0 ? "skladom" : child.isCloseout ?? __props.product.isCloseout ? "vypredané" : "na objednávku"}`)} tabindex="0" data-v-9fd7d93f><span class="text-[13px] font-black text-black leading-none" data-v-9fd7d93f>${ssrInterpolate(unref(getVariantLabel)(child, __props.product)?.split("(")?.[0]?.trim() || "")}</span>`);
          if ((child.isCloseout ?? __props.product.isCloseout) && !(child.availableStock > 0)) {
            _push(`<div class="absolute inset-0 pointer-events-none overflow-hidden" data-v-9fd7d93f><svg class="w-full h-full" preserveAspectRatio="none" data-v-9fd7d93f><line x1="0" y1="100%" x2="100%" y2="0" stroke="#cccccc" stroke-width="1" data-v-9fd7d93f></line></svg></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<h3 class="${ssrRenderClass([unref(isHovered) ? "text-brand" : "text-gray-900", "font-sans text-[13px] md:text-sm font-medium mb-1.5 line-clamp-2 leading-tight transition-colors duration-200 h-[2.5em]"])}" data-v-9fd7d93f>${ssrInterpolate(unref(getFormattedName)(__props.product))}</h3>`);
      if (unref(shortDescription)) {
        _push(`<p class="text-[11px] text-gray-500 font-sans leading-snug line-clamp-2 mb-3" data-v-9fd7d93f>${ssrInterpolate(unref(shortDescription))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(hasVariants)) {
        _push(`<div class="flex flex-wrap gap-1.5 mb-5" data-v-9fd7d93f><div class="${ssrRenderClass([[
          (__props.product.availableStock || __props.product.stock || 0) > 0 ? "border-green-400 bg-white stock-pulse-green" : __props.product.isCloseout || __props.product._raw?.isCloseout ? "border-gray-200 bg-gray-50 opacity-60" : "border-amber-400 bg-white stock-pulse-amber"
        ], "relative min-w-[38px] h-7 border flex items-center justify-center text-center px-2 font-tech rounded-sm"])}" data-v-9fd7d93f><span class="text-[11px] font-bold text-black leading-none uppercase tracking-tight whitespace-nowrap" data-v-9fd7d93f>`);
        if ((__props.product.availableStock || __props.product.stock || 0) > 0) {
          _push(`<!--[--> Skladom <!--]-->`);
        } else if (__props.product.isCloseout || __props.product._raw?.isCloseout) {
          _push(`<!--[--> Vypredané <!--]-->`);
        } else {
          _push(`<!--[--> U nás do ${ssrInterpolate(__props.product.restockTime || __props.product._raw?.restockTime || 4)} dní <!--]-->`);
        }
        _push(`</span>`);
        if ((__props.product.isCloseout || __props.product._raw?.isCloseout) && !((__props.product.availableStock || __props.product.stock || 0) > 0)) {
          _push(`<div class="absolute inset-0 pointer-events-none overflow-hidden" data-v-9fd7d93f><svg class="w-full h-full" preserveAspectRatio="none" data-v-9fd7d93f><line x1="0" y1="100%" x2="100%" y2="0" stroke="#cccccc" stroke-width="1" data-v-9fd7d93f></line></svg></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-auto flex items-end justify-between gap-2" data-v-9fd7d93f><div class="flex flex-col min-w-0" data-v-9fd7d93f>`);
      if (unref(calculateDiscount)(__props.product) > 0) {
        _push(`<span class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-black uppercase tracking-wider bg-amber leading-none w-fit mb-1 rounded-sm" data-v-9fd7d93f> -${ssrInterpolate(unref(calculateDiscount)(__props.product))}% </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="text-lg md:text-xl font-bold font-tech text-black leading-none" data-v-9fd7d93f>`);
      if (unref(hasPriceVariance)(__props.product)) {
        _push(`<!--[-->Od <!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`${ssrInterpolate(unref(displayPrice))} € </span>`);
      if (unref(displayOldPrice)) {
        _push(`<span class="text-gray-500 line-through text-sm font-tech leading-none mt-0.5" data-v-9fd7d93f>${ssrInterpolate(unref(displayOldPrice))} €</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(hasVariants)) {
        _push(`<button type="button" class="inline-flex items-center justify-center shrink-0 bg-gray-100 hover:bg-gray-200 text-black transition-colors w-10 h-10 md:w-auto md:h-10 md:gap-1.5 md:px-3 md:font-tech md:font-bold md:uppercase md:tracking-widest md:text-[11px] md:whitespace-nowrap rounded-default" data-v-9fd7d93f><span class="hidden md:inline" data-v-9fd7d93f>Zobraziť produkt</span>`);
        _push(ssrRenderComponent(unref(ArrowRight), { class: "w-4 h-4 md:w-3.5 md:h-3.5" }, null, _parent));
        _push(`</button>`);
      } else {
        _push(ssrRenderComponent(AddToCartButton, {
          product: __props.product,
          quantity: 1,
          variant: "primary",
          class: "!h-10 shrink-0 !w-10 !px-0 !py-0 md:!w-auto md:!px-3 !text-[11px] font-tech whitespace-nowrap [&>span]:hidden [&>span]:md:inline",
          "show-text": true,
          "icon-right": true,
          label: "Pridať do košíka"
        }, null, _parent));
      }
      _push(`</div></div></div></a>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/frontend/product/ProductCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductCard = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-9fd7d93f"]]), { __name: "ProductCard" });

export { ProductCard as default };
