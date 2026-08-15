import { defineComponent, computed, ref, withAsyncContext, watch, unref, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, b as useLocalePath, a as useCart, h as useAsyncData, e as useShopwareContext, n as navigateTo, i as useRuntimeConfig, G as getCategoryUrl } from './server.mjs';
import { u as useUiState } from './useUiState-BTlUPkrr.mjs';
import { ChevronRight, ChevronLeft } from 'lucide-vue-next';
import { u as useFeaturedProducts } from './useFeaturedProducts-BD8h0sYO.mjs';
import { u as useProductHelpers } from './useProductHelpers-Ch_jrkwO.mjs';
import { u as useShippingMetadata } from './useShippingMetadata-C7Eoqyz6.mjs';
import CartHeader from './CartHeader-DVeKpaGw.mjs';
import CartShippingBar from './CartShippingBar-C9uHFeOa.mjs';
import CartEmptyState from './CartEmptyState-BvK2BhPx.mjs';
import CartItem from './CartItem-D792LrjW.mjs';
import CartCrossSellPanel from './CartCrossSellPanel-Mdkp8Ko-.mjs';
import CartFooter from './CartFooter-B49wk9wz.mjs';
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
import './useShopwareLanguage-CGPCneCN.mjs';
import './BaseButton-BJMOoNbK.mjs';
import './nuxt-link-B7B0pxEe.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import './QuantitySelector-B6vBeA3f.mjs';
import './BaseLink-CtWKrAdk.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CartSidebar",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useLocalePath();
    const config = useRuntimeConfig();
    const { cartItems, cart, removeItem, changeProductQuantity, addPromotionCode, refreshCart, addProduct } = useCart();
    const { adjustPrice, selectedCountryDisplay } = useCountrySelector();
    const { isCartSidebarOpen, toggleCartSidebar } = useUiState();
    const { featuredProducts, fetch: fetchFeatured } = useFeaturedProducts();
    const { getProductImageUrl, getPrice, navigateToProduct } = useProductHelpers();
    const { balikovoMetadata, spsMetadata, isLoading: isShippingLoading, isFreeShippingCountry } = useShippingMetadata();
    const BIKE_CATEGORY_IDS = computed(() => [
      config.public.shopware.ids.categories.bikes,
      config.public.shopware.ids.categories.ebikes
    ].filter(Boolean));
    const productItemCount = computed(
      () => (cartItems.value || []).filter((i) => i.type === "product" && !virtualProductIds.value.includes(i.referencedId)).length
    );
    const computedSubtotal = computed(
      () => cartItems.value.filter((i) => !virtualProductIds.value.includes(i.referencedId)).reduce((acc, item) => acc + (item.price?.totalPrice || 0), 0)
    );
    const cartPositionPrice = computed(() => cart.value?.price?.positionPrice ?? 0);
    const hasBikeInCart = computed(
      () => Object.values(productStockData.value).some(
        (p) => p.categoryTree?.some((id) => BIKE_CATEGORY_IDS.value.includes(id)) || p.categoryIds?.some((id) => BIKE_CATEGORY_IDS.value.includes(id))
      )
    );
    const effectiveThreshold = computed(() => {
      if (isShippingLoading.value) return null;
      if (!isFreeShippingCountry(selectedCountryDisplay.value.iso)) return null;
      if (hasBikeInCart.value) {
        const t = spsMetadata.value.freeThreshold;
        return typeof t === "number" && t > 1 ? t : null;
      }
      const candidates = [
        balikovoMetadata.value.freeThreshold,
        spsMetadata.value.freeThreshold
      ].filter((v) => typeof v === "number" && v > 1);
      return candidates.length > 0 ? Math.min(...candidates) : null;
    });
    const amountToFreeShipping = computed(() => {
      if (effectiveThreshold.value === null) return null;
      return Math.max(0, effectiveThreshold.value - cartPositionPrice.value);
    });
    const freeShippingPercent = computed(() => {
      if (!effectiveThreshold.value) return 0;
      return Math.min(100, cartPositionPrice.value / effectiveThreshold.value * 100);
    });
    const orderNote = ref("");
    const isCrossSellManuallyClosed = ref(false);
    const expressProductId = config.public.shopware.ids.products?.expressShipping;
    const dobierkaProductId = config.public.shopware.ids.products?.dobierka;
    const balneBikeProductId = config.public.shopware.ids.products?.balneBike;
    const balneEbikeProductId = config.public.shopware.ids.products?.balneEbike;
    const virtualProductIds = computed(() => [expressProductId, dobierkaProductId, balneBikeProductId, balneEbikeProductId].filter(Boolean));
    const { data: expressProduct } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("sidebar-express-product", async () => {
      if (!expressProductId) return null;
      try {
        const res = await apiClient.invoke("readProduct post /product", {
          body: { filter: [{ type: "equals", field: "id", value: expressProductId }], includes: { product: ["id", "translated", "calculatedPrice", "seoUrls"], seo_url: ["seoPathInfo"] } }
        });
        return (res?.data || res)?.elements?.[0] || null;
      } catch (e) {
        return null;
      }
    })), __temp = await __temp, __restore(), __temp);
    const isExpressInCart = computed(() => cartItems.value.some((i) => i.referencedId === expressProductId));
    const isExpressLoading = ref(false);
    const handleExpressDelivery = async (val) => {
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
    };
    const crossSells = ref([]);
    const isCrossSellLoading = ref(false);
    const { apiClient } = useShopwareContext();
    const fetchCrossSells = async () => {
      isCrossSellLoading.value = true;
      crossSells.value = [];
      const itemIds = cartItems.value.filter((i) => i.type === "product").map((i) => i.referencedId).filter(Boolean);
      if (!itemIds.length) {
        await fetchFeaturedFallback();
        return;
      }
      try {
        const nativeGroups = [];
        for (const id of itemIds) {
          const res = await apiClient.invoke(`readProductCrossSelling get /product/${id}/cross-selling`);
          const elements = res?.data || res;
          const itemCrossSells = [];
          if (Array.isArray(elements)) {
            for (const cross of elements) {
              if (cross.products?.length > 0) {
                itemCrossSells.push(...cross.products);
              }
            }
          }
          if (itemCrossSells.length) {
            const uniqueItemPool = itemCrossSells.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
            nativeGroups.push(uniqueItemPool);
          }
        }
        let pool = interleave(nativeGroups);
        pool = pool.filter((p) => !itemIds.includes(p.id));
        if (pool.length < 10) {
          const categoryGroups = [];
          const processedCategories = /* @__PURE__ */ new Set();
          for (const id of itemIds) {
            const info = productStockData.value[id];
            const targetCatId = info?.mainCategoryId || info?.categoryTree?.at(-1);
            if (targetCatId && !processedCategories.has(targetCatId)) {
              processedCategories.add(targetCatId);
              try {
                const categoryRes = await apiClient.invoke("readProduct post /product", {
                  body: {
                    limit: 10,
                    filter: [
                      { type: "equals", field: "categoryIds", value: targetCatId },
                      { type: "not", queries: [{ type: "equalsAny", field: "id", value: itemIds }] }
                    ],
                    includes: {
                      product: ["id", "name", "translated", "media", "cover", "cheapestPrice", "calculatedPrice", "productNumber", "seoUrls"],
                      seo_url: ["seoPathInfo"]
                    }
                  }
                });
                const related = (categoryRes.data || categoryRes)?.elements || [];
                if (related.length) categoryGroups.push(related);
              } catch (e) {
              }
            }
          }
          const relatedInterleaved = interleave(categoryGroups);
          relatedInterleaved.forEach((item) => {
            if (!pool.some((p) => p.id === item.id)) {
              pool.push(item);
            }
          });
        }
        if (pool.length === 0) {
          await fetchFeaturedFallback();
          return;
        }
        crossSells.value = pool.slice(0, 10);
      } catch (e) {
        await fetchFeaturedFallback();
      } finally {
        isCrossSellLoading.value = false;
      }
    };
    function interleave(arrays) {
      const result = [];
      const maxLength = Math.max(...arrays.map((a) => a.length));
      for (let i = 0; i < maxLength; i++) {
        for (const array of arrays) {
          if (i < array.length) {
            result.push(array[i]);
          }
        }
      }
      return result.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
    }
    const fetchFeaturedFallback = async () => {
      await fetchFeatured();
      crossSells.value = featuredProducts.value?.slice(0, 10) || [];
      isCrossSellLoading.value = false;
    };
    const emptyCartCategories = ref([]);
    const parseAndPrefetchCategoriesForEmptyCart = async () => {
      if (emptyCartCategories.value.length > 0 || cartItems.value.length > 0) return;
      const ids = [
        config.public.shopware.ids.categories.bikes,
        config.public.shopware.ids.categories.ebikes,
        config.public.shopware.ids.categories.doplnky,
        config.public.shopware.ids.categories.komponenty,
        config.public.shopware.ids.categories.oblecenie
      ].filter((id) => Boolean(id));
      try {
        const res = await apiClient.invoke("readCategoryList post /category", {
          body: { filter: [{ type: "equalsAny", field: "id", value: ids }] }
        });
        if (res?.data?.elements) {
          emptyCartCategories.value = res.data.elements.map((c) => ({
            id: c.id,
            name: c.translated?.name || c.name,
            url: getCategoryUrl(c)
          }));
        }
      } catch (e) {
      }
    };
    watch(isCartSidebarOpen, (isOpen) => {
      if (isOpen) {
        (void 0).body.style.overflow = "hidden";
        isCrossSellManuallyClosed.value = false;
        fetchCrossSells();
        if (cartItems.value.length === 0) parseAndPrefetchCategoriesForEmptyCart();
      } else {
        (void 0).body.style.overflow = "";
      }
    });
    const updatingItems = ref(/* @__PURE__ */ new Set());
    const updateQuantity = async (item, delta) => {
      if (updatingItems.value.has(item.id)) return;
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        await handleRemove(item);
        return;
      }
      try {
        updatingItems.value.add(item.id);
        await changeProductQuantity({
          id: item.id,
          quantity: newQty
        });
        if (typeof refreshCart === "function") {
          await refreshCart();
        }
      } catch (e) {
      } finally {
        updatingItems.value.delete(item.id);
      }
    };
    const handleRemove = async (item) => {
      await removeItem(item);
      if (cartItems.value.length === 0) {
        await parseAndPrefetchCategoriesForEmptyCart();
      }
    };
    const formatPrice = (price) => {
      return new Intl.NumberFormat("sk-SK", { style: "currency", currency: "EUR" }).format(adjustPrice(price));
    };
    const getProductImage = (item) => {
      const url = item.cover?.url || item.payload?.cover?.url || item.payload?.media?.[0]?.url;
      if (!url) return "https://placehold.co/200x200?text=Product";
      return url;
    };
    const productStockData = ref({});
    const fetchStockForItems = async () => {
      const ids = cartItems.value.filter((i) => i.type === "product").map((i) => i.referencedId).filter((id) => id && !productStockData.value[id]);
      if (ids.length === 0) return;
      try {
        const res = await apiClient.invoke("readProduct post /product", {
          body: {
            filter: [{ type: "equalsAny", field: "id", value: ids }],
            includes: {
              product: ["id", "availableStock", "isCloseout", "stock", "restockTime", "seoUrls", "productNumber", "translated", "categoryIds", "mainCategoryId", "categoryTree"],
              seo_url: ["seoPathInfo"]
            }
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
            productNumber: p.productNumber,
            translated: p.translated,
            seoUrls: p.seoUrls,
            categoryIds: p.categoryIds || [],
            mainCategoryId: p.mainCategoryId,
            categoryTree: p.categoryTree || []
          };
        });
      } catch (e) {
      }
    };
    watch(cartItems, async () => {
      await fetchStockForItems();
      if (isCartSidebarOpen.value) {
        await fetchCrossSells();
      }
    }, { immediate: true, deep: true });
    const getStockInfo = (item) => {
      if (!item?.referencedId) return null;
      return productStockData.value[item.referencedId] || null;
    };
    const handleCoupon = async (code) => {
      await addPromotionCode(code);
    };
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(isCartSidebarOpen)) {
          _push2(`<div class="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]" data-v-72f8506a></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(isCartSidebarOpen)) {
          _push2(`<aside class="fixed z-[101] flex flex-col will-change-transform md:top-4 md:bottom-4 md:right-4 md:left-auto md:w-[440px] bottom-0 left-0 right-0 h-full top-0 md:h-auto md:max-h-none" data-v-72f8506a>`);
          _push2(ssrRenderComponent(CartCrossSellPanel, {
            "is-open": unref(isCartSidebarOpen) && !isCrossSellManuallyClosed.value,
            "is-loading": isCrossSellLoading.value,
            "cross-sells": crossSells.value,
            "get-product-image-url": unref(getProductImageUrl),
            "get-price": unref(getPrice),
            "format-price": formatPrice,
            onNavigate: (p) => {
              unref(toggleCartSidebar)(false);
              unref(navigateToProduct)(p);
            }
          }, null, _parent));
          if (crossSells.value.length > 0) {
            _push2(`<button class="${ssrRenderClass([[
              !isCrossSellManuallyClosed.value ? "left-[-280px] border-l" : "left-0 border-r bg-gray-50"
            ], "hidden md:flex absolute top-1/2 -translate-y-1/2 w-6 h-16 bg-white border-y border-gray-100 shadow-md items-center justify-center text-gray-400 hover:text-brand transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] z-[11]"])}" data-v-72f8506a>`);
            if (!isCrossSellManuallyClosed.value) {
              _push2(ssrRenderComponent(unref(ChevronRight), { class: "w-4 h-4" }, null, _parent));
            } else {
              _push2(ssrRenderComponent(unref(ChevronLeft), { class: "w-4 h-4" }, null, _parent));
            }
            _push2(`</button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="relative z-10 flex flex-col h-full bg-white border border-gray-100 shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden rounded-default" data-v-72f8506a>`);
          _push2(ssrRenderComponent(CartHeader, {
            count: productItemCount.value,
            onClose: ($event) => unref(toggleCartSidebar)(false)
          }, null, _parent));
          if (unref(cartItems).length > 0) {
            _push2(ssrRenderComponent(CartShippingBar, {
              variant: "sidebar",
              "amount-to-free-shipping": amountToFreeShipping.value,
              "free-shipping-percent": freeShippingPercent.value,
              "free-threshold": effectiveThreshold.value,
              "format-price": formatPrice
            }, null, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="flex-1 overflow-y-auto px-5 md:px-8 pb-56 no-scrollbar custom-content-fade" data-v-72f8506a>`);
          if (unref(cartItems).length === 0) {
            _push2(ssrRenderComponent(CartEmptyState, {
              categories: emptyCartCategories.value,
              onClose: ($event) => unref(toggleCartSidebar)(false)
            }, null, _parent));
          } else {
            _push2(`<div class="space-y-6 pt-4" data-v-72f8506a><!--[-->`);
            ssrRenderList(unref(cartItems).filter((i) => !virtualProductIds.value.includes(i.referencedId)), (item) => {
              _push2(`<!--[-->`);
              if (item.type === "product") {
                _push2(ssrRenderComponent(CartItem, {
                  item,
                  "is-updating": updatingItems.value.has(item.id),
                  "stock-info": getStockInfo(item),
                  "get-product-image": getProductImage,
                  "format-price": formatPrice,
                  onRemove: handleRemove,
                  onUpdateQty: updateQuantity,
                  onClickProduct: (item2) => {
                    unref(toggleCartSidebar)(false);
                    const stockInfo = productStockData.value[item2.referencedId];
                    const productData = {
                      ...item2.payload,
                      id: item2.referencedId,
                      label: item2.label,
                      productNumber: stockInfo?.productNumber || item2.payload?.productNumber,
                      translated: stockInfo?.translated || item2.payload?.translated,
                      seoUrls: stockInfo?.seoUrls
                    };
                    unref(navigateToProduct)(productData);
                  }
                }, null, _parent));
              } else {
                _push2(`<div class="flex items-center justify-between gap-3 py-2 border-t border-dashed border-gray-100" data-v-72f8506a><div class="flex items-center gap-2 min-w-0" data-v-72f8506a><div class="flex-shrink-0 px-1.5 py-0.5 bg-brand text-white text-[9px] font-black uppercase tracking-widest" data-v-72f8506a> KÓD </div><span class="text-xs font-bold uppercase tracking-widest text-gray-700 truncate" data-v-72f8506a>${ssrInterpolate(item.label)}</span>`);
                if (item.payload?.code) {
                  _push2(`<span class="text-[9px] font-mono text-gray-400 uppercase hidden sm:block flex-shrink-0" data-v-72f8506a>${ssrInterpolate(item.payload.code)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><span class="font-black font-tech text-sm text-brand flex-shrink-0" data-v-72f8506a>${ssrInterpolate(formatPrice(item.price?.totalPrice || 0))}</span></div>`);
              }
              _push2(`<!--]-->`);
            });
            _push2(`<!--]--></div>`);
          }
          _push2(`</div>`);
          if (unref(cartItems).length > 0) {
            _push2(ssrRenderComponent(CartFooter, {
              "checkout-total": computedSubtotal.value,
              "format-price": formatPrice,
              "express-product": unref(expressProduct),
              "is-express-in-cart": isExpressInCart.value,
              "is-express-loading": isExpressLoading.value,
              onCheckout: () => {
                unref(toggleCartSidebar)(false);
                unref(navigateTo)("/checkout");
              },
              onViewCart: () => {
                unref(toggleCartSidebar)(false);
                unref(navigateTo)("/cart");
              },
              onCoupon: handleCoupon,
              onOrderNote: (val) => orderNote.value = val,
              onExpress: handleExpressDelivery
            }, null, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></aside>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/CartSidebar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CartSidebar = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-72f8506a"]]), { __name: "CartSidebar" });

export { CartSidebar as default };
