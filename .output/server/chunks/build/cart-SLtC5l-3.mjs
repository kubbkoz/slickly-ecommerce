import __nuxt_component_0 from './BaseLink-CtWKrAdk.mjs';
import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import __nuxt_component_3 from './OrderSummary-TDFgl67k.mjs';
import __nuxt_component_3$1 from './ShareCart-Du09d8kF.mjs';
import __nuxt_component_4 from './SaveCart-mMaBwBjs.mjs';
import { _ as _export_sfc, u as useHead, a as useCart, b as useLocalePath, c as useRouter, d as useRoute, e as useShopwareContext, f as useUser, g as useState, h as useAsyncData, n as navigateTo, i as useRuntimeConfig } from './server.mjs';
import { defineComponent, ref, computed, watch, withAsyncContext, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { ArrowLeft, Trash2, Minus, Plus, Tag } from 'lucide-vue-next';
import CartAdvisor from './CartAdvisor-BXn9Juax.mjs';
import { u as usePrice } from './usePrice-CDJKOx8c.mjs';
import { u as useShippingMetadata } from './useShippingMetadata-C7Eoqyz6.mjs';
import { u as useBalneSync } from './useBalneSync-DIvXhAAy.mjs';
import { u as useCountrySelector } from './useCountrySelector-Cujau6dz.mjs';
import './nuxt-link-B7B0pxEe.mjs';
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
import './index-B6MI764M.mjs';
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
import './useShopwareLanguage-CGPCneCN.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cart",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      title: "Nákupný košík | SLICKLY",
      meta: [{ name: "description", content: "Skontrolujte obsah vášho nákupného košíka a prejdite k pokladni." }]
    });
    const { cartItems, cart: cart2, addProduct, removeItem, changeProductQuantity, addPromotionCode, refreshCart, count } = useCart();
    const { getFormattedPrice } = usePrice();
    const { adjustPrice } = useCountrySelector();
    const localePath = useLocalePath();
    useRouter();
    useRoute();
    const config = useRuntimeConfig();
    useShippingMetadata();
    useBalneSync();
    const { apiClient } = useShopwareContext();
    const updatingId = ref(null);
    const cleanLabel = (label) => (label || "").replace(/\(VARIANT\)/gi, "").trim();
    const itemImage = (item) => {
      const url = item.cover?.url || item.cover?.media?.url || item.payload?.cover?.url || item.payload?.media?.[0]?.url;
      if (!url) return "https://placehold.co/200x200?text=?";
      return url;
    };
    const itemOldPrice = (item) => {
      const list = item.price?.listPrice?.price;
      return list && list > (item.price?.unitPrice || 0) ? list : null;
    };
    const discountPercent = (item) => {
      const list = itemOldPrice(item);
      if (!list) return 0;
      return Math.round((1 - (item.price?.unitPrice || 0) / list) * 100);
    };
    const virtualProductIds = computed(() => [
      config.public.shopware.ids.products?.expressShipping,
      config.public.shopware.ids.products?.dobierka,
      config.public.shopware.ids.products?.balneBike,
      config.public.shopware.ids.products?.balneEbike
    ].filter(Boolean));
    const productItems = computed(() => (cartItems.value || []).filter(
      (i) => i.type === "product" && !virtualProductIds.value.includes(i.referencedId)
    ));
    const promotionItems = computed(() => (cartItems.value || []).filter((i) => i.type !== "product"));
    const productStockData = ref({});
    const fetchStockForItems = async () => {
      const ids = cartItems.value.filter((i) => i.type === "product").map((i) => i.referencedId).filter((id) => id && !productStockData.value[id]);
      if (ids.length === 0) return;
      try {
        const res = await apiClient.invoke("readProduct post /product", {
          body: {
            filter: [{ type: "equalsAny", field: "id", value: ids }],
            includes: { product: ["id", "availableStock", "isCloseout", "stock", "restockTime", "categoryIds", "mainCategoryId", "categoryTree"] }
          }
        });
        const products = (res.data || res)?.elements || [];
        products.forEach((p) => {
          const stockValue = Math.max(0, p.availableStock ?? p.stock ?? 0);
          let stockStatus = "on_order";
          if (stockValue > 0) stockStatus = "in_stock";
          else if (p.isCloseout === true) stockStatus = "unavailable";
          productStockData.value[p.id] = {
            stockStatus,
            stock: stockValue,
            restockTime: p.restockTime ?? 0,
            isCloseout: !!p.isCloseout,
            categoryIds: p.categoryIds || [],
            mainCategoryId: p.mainCategoryId,
            categoryTree: p.categoryTree || []
          };
        });
      } catch (e) {
      }
    };
    watch(cartItems, fetchStockForItems, { immediate: true, deep: true });
    const isRestoringCart = ref(false);
    const cartAdvisorItems = computed(
      () => productItems.value.map((item) => ({
        name: cleanLabel(item.payload?.translated?.name || item.payload?.name || item.label || ""),
        category: item.payload?.categories?.[0]?.name || "",
        price: item.price?.unitPrice
      }))
    );
    useUser();
    useState("loginModalOpen", () => false);
    const expressProductId = config.public.shopware.ids.products?.expressShipping;
    const { data: expressProduct } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("express-product", async () => {
      if (!expressProductId) return null;
      try {
        const res = await apiClient.invoke("readProduct post /product", {
          body: {
            filter: [{ type: "equals", field: "id", value: expressProductId }],
            includes: {
              product: ["id", "translated", "calculatedPrice", "seoUrls", "cover"],
              product_media: ["media"],
              media: ["url", "thumbnails"]
            }
          }
        });
        return (res?.data || res)?.elements?.[0] || null;
      } catch (e) {
        return null;
      }
    })), __temp = await __temp, __restore(), __temp);
    const isExpressLoading = ref(false);
    const expressShipping = computed({
      get: () => cartItems.value.some((i) => i.referencedId === expressProductId),
      set: async (val) => {
        if (isExpressLoading.value || !expressProductId) return;
        isExpressLoading.value = true;
        try {
          const item = cartItems.value.find((i) => i.referencedId === expressProductId);
          if (val && !item) {
            await addProduct({ id: expressProductId, quantity: 1 });
          } else if (!val && item) {
            await removeItem(item);
          }
        } finally {
          isExpressLoading.value = false;
        }
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseLink = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_2;
      const _component_OrderSummary = __nuxt_component_3;
      const _component_ShareCart = __nuxt_component_3$1;
      const _component_SaveCart = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 font-sans" }, _attrs))} data-v-68f8251b><div class="container mx-auto px-4 lg:px-8 py-8 lg:py-14" data-v-68f8251b><div class="mb-8 pb-6 border-b border-gray-200" data-v-68f8251b><div class="flex flex-col md:flex-row justify-between items-start md:items-end" data-v-68f8251b><div data-v-68f8251b><h1 class="text-3xl md:text-5xl font-black uppercase font-tech tracking-wide text-black italic" data-v-68f8251b> NÁKUPNÝ <span class="text-brand" data-v-68f8251b>KOŠÍK</span></h1>`);
      if (unref(productItems).length > 0) {
        _push(`<p class="text-gray-500 text-sm mt-2 font-sans" data-v-68f8251b>${ssrInterpolate(unref(productItems).length)} ${ssrInterpolate(unref(productItems).length === 1 ? "položka" : unref(productItems).length < 5 ? "položky" : "položiek")}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      if (!unref(cartItems) || unref(cartItems).length === 0) {
        _push(`<div class="flex flex-col items-center justify-center py-24 text-center" data-v-68f8251b><div class="text-[100px] font-black font-tech uppercase text-gray-100 leading-none mb-4 select-none" data-v-68f8251b>EMPTY</div><h2 class="text-2xl font-black uppercase font-tech tracking-wide text-black mb-2" data-v-68f8251b>Košík je prázdny</h2><p class="text-gray-500 text-sm mb-8 max-w-sm font-sans" data-v-68f8251b> Pridajte produkty a vráťte sa späť. </p><div class="flex flex-wrap gap-3 justify-center mb-8" data-v-68f8251b>`);
        _push(ssrRenderComponent(_component_BaseLink, {
          to: "/exterier",
          class: "flex items-center gap-2 px-4 py-2.5 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Exteriér `);
            } else {
              return [
                createTextVNode(" Exteriér ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_BaseLink, {
          to: "/lestenie",
          class: "flex items-center gap-2 px-4 py-2.5 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Leštenie `);
            } else {
              return [
                createTextVNode(" Leštenie ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_BaseLink, {
          to: "/prislusenstvo",
          class: "flex items-center gap-2 px-4 py-2.5 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Príslušenstvo `);
            } else {
              return [
                createTextVNode(" Príslušenstvo ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(_component_BaseLink, {
          to: "/",
          class: "text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors flex items-center gap-1.5"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ArrowLeft), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
              _push2(` Späť na domovskú stránku `);
            } else {
              return [
                createVNode(unref(ArrowLeft), { class: "w-3.5 h-3.5" }),
                createTextVNode(" Späť na domovskú stránku ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div data-v-68f8251b><div class="flex flex-col lg:flex-row gap-8 items-start" data-v-68f8251b><div class="flex-1 min-w-0 space-y-1" data-v-68f8251b><!--[-->`);
        ssrRenderList(unref(productItems), (item) => {
          _push(`<div class="${ssrRenderClass([unref(updatingId) === item.id ? "opacity-50 pointer-events-none" : "", "bg-white border border-gray-200 p-4 md:p-6 flex gap-4 md:gap-6 group relative transition-opacity"])}" data-v-68f8251b>`);
          if (discountPercent(item) > 0) {
            _push(`<span class="absolute top-3 left-3 z-10 px-2 py-0.5 text-[9px] font-bold text-black uppercase bg-amber" data-v-68f8251b> -${ssrInterpolate(discountPercent(item))}% </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(ssrRenderComponent(_component_BaseLink, {
            to: item.payload,
            class: "w-24 h-24 md:w-32 md:h-32 bg-gray-50 flex-shrink-0 p-2 block overflow-hidden"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_NuxtImg, {
                  src: itemImage(item),
                  alt: cleanLabel(item.label),
                  format: "webp",
                  loading: "lazy",
                  class: "w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_NuxtImg, {
                    src: itemImage(item),
                    alt: cleanLabel(item.label),
                    format: "webp",
                    loading: "lazy",
                    class: "w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  }, null, 8, ["src", "alt"])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<div class="flex-1 min-w-0 flex flex-col justify-between" data-v-68f8251b><div data-v-68f8251b><div class="flex items-start justify-between gap-2" data-v-68f8251b>`);
          _push(ssrRenderComponent(_component_BaseLink, {
            to: item.payload,
            class: "font-bold text-sm md:text-base uppercase text-black hover:text-brand transition-colors font-tech leading-tight line-clamp-2 flex-1 min-w-0 pr-2"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(cleanLabel(item.label))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(cleanLabel(item.label)), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<button class="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-300 hover:text-brand hover:border-brand transition-all flex-shrink-0 -mr-1" aria-label="Odstrániť z košíka" data-v-68f8251b>`);
          _push(ssrRenderComponent(unref(Trash2), { class: "w-3.5 h-3.5" }, null, _parent));
          _push(`</button></div>`);
          if (item.payload?.options?.length) {
            _push(`<div class="mt-1.5 flex flex-wrap gap-2" data-v-68f8251b><!--[-->`);
            ssrRenderList(item.payload.options, (opt) => {
              _push(`<span class="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-gray-100 text-gray-600" data-v-68f8251b>${ssrInterpolate(opt.group)}: ${ssrInterpolate(opt.option)}</span>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          if (item.payload?.productNumber) {
            _push(`<div class="mt-1 text-[10px] text-gray-400 font-medium" data-v-68f8251b> SKU: ${ssrInterpolate(item.payload.productNumber)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="mt-1.5" data-v-68f8251b>`);
          if (item.referencedId && unref(productStockData)[item.referencedId]) {
            _push(`<!--[-->`);
            if (!unref(productStockData)[item.referencedId]?.isCloseout && item.quantity > (unref(productStockData)[item.referencedId]?.stock ?? 0) && (unref(productStockData)[item.referencedId]?.stock ?? 0) > 0) {
              _push(`<div class="flex items-center gap-3" data-v-68f8251b><div class="text-[10px] font-bold uppercase tracking-widest text-green-600 flex items-center gap-1" data-v-68f8251b><span class="w-1.5 h-1.5 rounded-full bg-green-600 inline-block" data-v-68f8251b></span> Skladom ${ssrInterpolate(unref(productStockData)[item.referencedId]?.stock)} ks </div><div class="text-[10px] font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1" data-v-68f8251b> Na obj. ${ssrInterpolate(item.quantity - (unref(productStockData)[item.referencedId]?.stock ?? 0))} ks </div></div>`);
            } else if (unref(productStockData)[item.referencedId]?.stockStatus === "in_stock") {
              _push(`<div class="${ssrRenderClass([(unref(productStockData)[item.referencedId]?.stock ?? 0) <= 5 ? "text-amber-600" : "text-green-600", "text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"])}" data-v-68f8251b><span class="${ssrRenderClass([(unref(productStockData)[item.referencedId]?.stock ?? 0) <= 5 ? "bg-amber-500 animate-pulse" : "bg-green-600", "w-1.5 h-1.5 rounded-full inline-block"])}" data-v-68f8251b></span>`);
              if ((unref(productStockData)[item.referencedId]?.stock ?? 0) <= 5) {
                _push(`<span data-v-68f8251b>Zostávajú len ${ssrInterpolate(unref(productStockData)[item.referencedId]?.stock)} ks!</span>`);
              } else {
                _push(`<span data-v-68f8251b>Skladom</span>`);
              }
              _push(`</div>`);
            } else if (unref(productStockData)[item.referencedId]?.stockStatus === "on_order") {
              _push(`<div class="text-[10px] font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1" data-v-68f8251b><span class="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" data-v-68f8251b></span> U nás do ${ssrInterpolate(unref(productStockData)[item.referencedId]?.restockTime || 4)} dní </div>`);
            } else {
              _push(`<div class="text-[10px] font-bold uppercase tracking-widest text-brand flex items-center gap-1" data-v-68f8251b><span class="w-1.5 h-1.5 rounded-full bg-brand inline-block" data-v-68f8251b></span> Vypredané </div>`);
            }
            _push(`<!--]-->`);
          } else {
            _push(`<div class="text-[10px] font-bold uppercase tracking-widest text-gray-300 flex items-center gap-1" data-v-68f8251b><span class="w-1.5 h-1.5 rounded-full bg-gray-200 animate-pulse inline-block" data-v-68f8251b></span> Načítavam... </div>`);
          }
          _push(`</div></div><div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mt-4" data-v-68f8251b><div class="flex items-center border border-gray-200 self-start" data-v-68f8251b><button class="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"${ssrRenderAttr("aria-label", `Znížiť množstvo ${cleanLabel(item.label)}`)} data-v-68f8251b>`);
          _push(ssrRenderComponent(unref(Minus), { class: "w-3.5 h-3.5" }, null, _parent));
          _push(`</button><span class="w-10 text-center text-sm font-black font-tech" data-v-68f8251b>${ssrInterpolate(item.quantity)}</span><button class="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"${ssrRenderAttr("aria-label", `Zvýšiť množstvo ${cleanLabel(item.label)}`)} data-v-68f8251b>`);
          _push(ssrRenderComponent(unref(Plus), { class: "w-3.5 h-3.5" }, null, _parent));
          _push(`</button></div><div class="flex flex-col items-end gap-0.5" data-v-68f8251b>`);
          if (itemOldPrice(item)) {
            _push(`<span class="text-xs text-gray-400 line-through font-tech" data-v-68f8251b>${ssrInterpolate(unref(getFormattedPrice)(unref(adjustPrice)((itemOldPrice(item) || 0) * item.quantity)))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="text-xl font-black font-tech text-black" data-v-68f8251b>${ssrInterpolate(unref(getFormattedPrice)(unref(adjustPrice)(item.price?.totalPrice || 0)))}</span></div></div></div></div>`);
        });
        _push(`<!--]--><!--[-->`);
        ssrRenderList(unref(promotionItems), (promo) => {
          _push(`<div class="bg-white border border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between gap-4" data-v-68f8251b><div class="flex items-center gap-2 min-w-0" data-v-68f8251b>`);
          _push(ssrRenderComponent(unref(Tag), { class: "w-4 h-4 text-brand flex-shrink-0" }, null, _parent));
          _push(`<span class="text-sm font-bold uppercase text-gray-800 truncate" data-v-68f8251b>Zľavový kód: ${ssrInterpolate(promo.label)}</span></div><span class="font-black font-tech text-lg text-brand flex-shrink-0" data-v-68f8251b>${ssrInterpolate(unref(getFormattedPrice)(unref(adjustPrice)(promo.price?.totalPrice || 0)))}</span></div>`);
        });
        _push(`<!--]--></div><aside class="w-full lg:w-[400px] flex-shrink-0 lg:sticky lg:top-28" data-v-68f8251b>`);
        _push(ssrRenderComponent(_component_OrderSummary, {
          step: 1,
          "can-action": true,
          "action-label": "Pokračovať do objednávky",
          "is-express-shipping": unref(expressShipping),
          "onUpdate:isExpressShipping": ($event) => isRef(expressShipping) ? expressShipping.value = $event : null,
          "express-product": unref(expressProduct),
          onAction: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(unref(localePath)("/checkout"))
        }, null, _parent));
        _push(`<div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 px-6" data-v-68f8251b>`);
        _push(ssrRenderComponent(_component_ShareCart, null, null, _parent));
        _push(`<div class="w-px h-4 bg-gray-200 flex-shrink-0" data-v-68f8251b></div>`);
        _push(ssrRenderComponent(_component_SaveCart, null, null, _parent));
        _push(`</div>`);
        if (unref(isRestoringCart)) {
          _push(`<div class="flex items-center gap-3 bg-brand/5 border border-brand/20 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-brand" data-v-68f8251b><span class="w-2 h-2 rounded-full bg-brand animate-pulse" data-v-68f8251b></span> Obnovovanie zdieľaného košíka... </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</aside></div><div class="mt-14" data-v-68f8251b>`);
        _push(ssrRenderComponent(CartAdvisor, { "cart-items": unref(cartAdvisorItems) }, null, _parent));
        _push(`</div></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cart = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-68f8251b"]]);

export { cart as default };
