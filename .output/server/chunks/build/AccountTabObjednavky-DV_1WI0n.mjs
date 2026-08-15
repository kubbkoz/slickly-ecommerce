import { _ as __nuxt_component_2$1 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, createTextVNode, Fragment, renderList, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { Package, Eye, ChevronRight, Truck, CreditCard, Loader2, RotateCcw, Undo2, ShieldAlert, Star } from 'lucide-vue-next';
import { a as useCart, f as useUser, e as useShopwareContext, g as useState } from './server.mjs';
import { u as useUiState } from './useUiState-BTlUPkrr.mjs';
import BaseButton from './BaseButton-BJMOoNbK.mjs';
import __nuxt_component_2$2 from './AppModal-CMHCLJuP.mjs';
import __nuxt_component_0 from './BaseLink-CtWKrAdk.mjs';
import ReturnFormModal from './ReturnFormModal-DM7PpMMO.mjs';
import { u as useProductHelpers } from './useProductHelpers-Ch_jrkwO.mjs';
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
import './nuxt-link-B7B0pxEe.mjs';
import './useReturnForm-BPYvUkOC.mjs';
import './ReturnFormStep1-J6OeDrR0.mjs';
import './ReturnFormStep2-DMCLLvW8.mjs';
import './ReturnFormStep3-BmRowXns.mjs';
import './ReturnFormSuccess-CYofRI6H.mjs';

const SW_OP = {
  // ── Context ──────────────────────────────────────────────────────────────
  context: {
    read: "readContext get /context",
    update: "updateContext patch /context"
  },
  // ── Products ─────────────────────────────────────────────────────────────
  product: {
    list: "readProduct post /product",
    crossSelling: (productId) => `readProductCrossSelling get /product/${productId}/cross-selling`,
    findVariant: "readProductVariant post /product/{productId}/find-variant",
    saveReview: (productId) => `saveProductReview post /product/${productId}/review`,
    listReviews: (productId) => `readProductReviews post /product/${productId}/reviews`
  },
  // ── Categories ───────────────────────────────────────────────────────────
  category: {
    list: "readCategoryList post /category",
    read: "readCategory post /category/{categoryId}",
    readById: (categoryId) => `readCategory post /category/${categoryId}`,
    productListing: "readProductListing post /product-listing/{categoryId}",
    productListingById: (categoryId) => `readProductListing post /product-listing/${categoryId}`
  },
  // ── Search ───────────────────────────────────────────────────────────────
  search: {
    page: "searchPage post /search",
    suggest: "searchSuggest post /search-suggest"
  },
  // ── Cart & Checkout ──────────────────────────────────────────────────────
  cart: {
    addLineItem: "addLineItem post /checkout/cart/line-item",
    createOrder: "createOrder post /checkout/order"
  },
  // ── Shipping ─────────────────────────────────────────────────────────────
  shipping: {
    list: "readShippingMethod post /shipping-method"
  },
  // ── Account ──────────────────────────────────────────────────────────────
  account: {
    register: "register post /account/register",
    confirmEmail: "confirmNewsletter post /account/register-confirm",
    changeEmail: "changeEmail post /account/change-email",
    changePassword: "changePassword post /account/change-password",
    listAddress: "listAddress post /account/list-address",
    updateAddress: "updateCustomerAddress patch /account/address/{addressId}",
    passwordRecovery: "sendRecoveryMail post /account/recovery-password"
  },
  // ── Wishlist ─────────────────────────────────────────────────────────────
  wishlist: {
    read: "readCustomerWishlist post /customer/wishlist",
    add: (productId) => `addToWishlist post /customer/wishlist/add/${productId}`,
    remove: (productId) => `removeWishlistProduct delete /customer/wishlist/delete/${productId}`
  },
  // ── Newsletter ───────────────────────────────────────────────────────────
  newsletter: {
    subscribe: "subscribeToNewsletter post /newsletter/subscribe",
    confirm: "confirmNewsletter post /newsletter/confirm"
  },
  // ── SEO ──────────────────────────────────────────────────────────────────
  seo: {
    url: "readSeoUrl post /seo-url",
    breadcrumb: (id) => `readBreadcrumb get /breadcrumb/${id}`
  },
  // ── Misc ─────────────────────────────────────────────────────────────────
  salutation: {
    list: "readSalutation post /salutation"
  }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AccountTabObjednavky",
  __ssrInlineRender: true,
  props: {
    orders: {}
  },
  setup(__props) {
    const isReturnModalOpen = ref(false);
    const formatAddress = (addr) => {
      if (!addr) return "";
      const parts = [];
      if (addr.street) parts.push(String(addr.street));
      const cityLine = [addr.zipcode, addr.city].filter(Boolean).join(" ");
      if (cityLine) parts.push(cityLine);
      if (addr.country?.name || addr.country?.translated?.name) {
        parts.push(addr.country?.translated?.name || addr.country?.name);
      }
      return parts.join("\n");
    };
    const returnInitialData = ref({ formType: "vratenie", orderNumber: "" });
    const canReturnOrder = (order) => {
      const orderState = order?.stateMachineState?.technicalName;
      if (orderState !== "completed") return false;
      const deliveryState = order?.deliveries?.[0]?.stateMachineState?.technicalName;
      if (deliveryState !== "shipped" && deliveryState !== "delivered") return false;
      const transactions = order?.transactions ?? [];
      const lastTx = transactions[transactions.length - 1];
      const paymentState = lastTx?.stateMachineState?.technicalName;
      if (paymentState !== "paid") return false;
      return true;
    };
    const openReturnModal = (order, type) => {
      if (!canReturnOrder(order)) return;
      const items = [];
      const lineItems = order.lineItems ?? [];
      for (const li of lineItems) {
        items.push(`${li.quantity ?? 1}× ${li.label ?? ""}`);
      }
      const u = user.value;
      const orderBilling = (order.addresses ?? []).find((a) => a.id === order.billingAddressId);
      const orderShipping = order.deliveries?.[0]?.shippingOrderAddress;
      const phone = orderBilling?.phoneNumber || orderShipping?.phoneNumber || u?.defaultBillingAddress?.phoneNumber || u?.defaultShippingAddress?.phoneNumber || "";
      const address = formatAddress(orderBilling) || formatAddress(orderShipping) || formatAddress(u?.defaultBillingAddress) || formatAddress(u?.defaultShippingAddress) || "";
      returnInitialData.value = {
        formType: type,
        orderNumber: order.orderNumber ?? "",
        orderDate: order.orderDateTime ? String(order.orderDateTime).substring(0, 10) : order.orderDate ?? void 0,
        orderId: order.id,
        email: u?.email,
        firstName: u?.firstName,
        lastName: u?.lastName,
        phone,
        address,
        itemsDescription: items.join("\n")
      };
      isReturnModalOpen.value = true;
    };
    const expandedOrderId = ref(null);
    function toggleOrder(id) {
      expandedOrderId.value = expandedOrderId.value === id ? null : id;
    }
    function orderStatusStyle(state) {
      const map = {
        open: "bg-blue-50 text-blue-700 border border-blue-200",
        in_progress: "bg-amber-50 text-amber-700 border border-amber-200",
        completed: "bg-green-50 text-green-700 border border-green-200",
        cancelled: "bg-red-50 text-red-700 border border-red-200"
      };
      return map[state] || "bg-gray-100 text-gray-600 border border-gray-200";
    }
    function orderStatusLabel(state) {
      if (!state) return "Spracováva sa";
      const map = {
        open: "Otvorená",
        in_progress: "Spracováva sa",
        completed: "Doručená",
        cancelled: "Zrušená"
      };
      return map[state] || state;
    }
    function formatProductName(name) {
      if (!name) return "";
      return name.replace(/\s*\(VARIANT\)\s*/gi, "").trim();
    }
    function getProductVariantLabel(lineItem) {
      if (!lineItem.payload?.options) return "";
      return lineItem.payload.options.map((o) => o.option).join(", ");
    }
    const { addProduct } = useCart();
    const { toggleCartSidebar } = useUiState();
    useProductHelpers();
    const { user } = useUser();
    const isOrderingAgain = ref(null);
    const orderAgainErrors = ref({});
    async function orderAgain(order) {
      if (!order.lineItems?.length) return;
      isOrderingAgain.value = order.id;
      orderAgainErrors.value[order.id] = "";
      try {
        const itemsToAdd = order.lineItems.filter((li) => li.type === "product" && li.referencedId);
        if (itemsToAdd.length > 0) {
          let successCount = 0;
          for (const li of itemsToAdd) {
            try {
              await addProduct({ id: li.referencedId, quantity: li.quantity });
              successCount++;
            } catch (e) {
            }
          }
          if (successCount > 0) {
            toggleCartSidebar(true);
          }
          if (successCount < itemsToAdd.length) {
            orderAgainErrors.value[order.id] = "Niektoré produkty sa nepodarilo pridať do košíka (môžu byť vypredané).";
          }
        } else {
          orderAgainErrors.value[order.id] = "Objednávka neobsahuje žiadne produkty, ktoré by bolo možné pridať do košíka.";
        }
      } catch (e) {
        orderAgainErrors.value[order.id] = "Nastala chyba pri spracovaní požiadavky.";
      } finally {
        isOrderingAgain.value = null;
      }
    }
    const isReviewModalOpen = ref(false);
    const reviewOrder = ref(null);
    const reviewData = ref({});
    const isSubmittingReviews = ref(false);
    const { apiClient } = useShopwareContext();
    const toast = useState("wishlistToast", () => ({ show: false, productName: "", action: "add" }));
    function openReviewModal(order) {
      reviewOrder.value = order;
      reviewData.value = {};
      order.lineItems?.forEach((li) => {
        if (li.type === "product") {
          reviewData.value[li.id] = { rating: 0, text: "" };
        }
      });
      isReviewModalOpen.value = true;
    }
    function setRating(itemId, rating) {
      if (reviewData.value[itemId]) {
        reviewData.value[itemId].rating = rating;
      }
    }
    async function submitReviews() {
      isSubmittingReviews.value = true;
      try {
        for (const [itemId, review] of Object.entries(reviewData.value)) {
          if (review.rating > 0 || review.text) {
            const lineItem = reviewOrder.value.lineItems.find((li) => li.id === itemId);
            if (lineItem?.referencedId) {
              await apiClient.invoke(SW_OP.product.saveReview(lineItem.referencedId), {
                pathParams: { productId: lineItem.referencedId },
                body: {
                  name: user.value?.firstName || "Zákazník",
                  email: user.value?.email || "",
                  points: review.rating || 5,
                  content: review.text || "Bez komentára",
                  title: "Hodnotenie k nákupu"
                }
              });
            }
          }
        }
        isReviewModalOpen.value = false;
        toast.value = { show: true, productName: "Hodnotenie odoslané. Ďakujeme!", action: "add" };
      } catch (e) {
        alert("Pri ukladaní hodnotenia nastala chyba. Možno ste tento produkt už ohodnotili.");
      } finally {
        isSubmittingReviews.value = false;
      }
    }
    function getDeliveryInfo(order) {
      const delivery = order.deliveries?.[0];
      if (!delivery) return null;
      return {
        method: delivery.shippingMethod?.name || "Štandardné doručenie",
        cost: delivery.shippingCosts?.totalPrice || 0,
        state: delivery.stateMachineState?.name || "Spracováva sa"
      };
    }
    function getPaymentInfo(order) {
      const transaction = order.transactions?.[0];
      if (!transaction) return null;
      return {
        method: transaction.paymentMethod?.name || "Štandardná platba",
        state: transaction.stateMachineState?.name || "Čaká na platbu"
      };
    }
    function resolveLineItemImage(lineItem) {
      if (lineItem.cover?.url) return lineItem.cover.url;
      if (lineItem.product?.cover?.media?.url) return lineItem.product.cover.media.url;
      if (lineItem.product?.media?.[0]?.media?.url) return lineItem.product.media[0].media.url;
      return null;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white shadow-sm p-8 animate-fade-in" }, _attrs))}><h2 class="text-xl font-black uppercase tracking-wide font-tech mb-8">História objednávok</h2>`);
      if (__props.orders && __props.orders.length > 0) {
        _push(`<div class="space-y-6"><!--[-->`);
        ssrRenderList(__props.orders, (order) => {
          _push(`<div class="border border-gray-100 bg-gray-50/30"><div class="flex flex-col md:flex-row md:items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"><div class="flex items-center gap-5 mb-4 md:mb-0"><div class="${ssrRenderClass([order.stateMachineState?.technicalName === "completed" ? "bg-green-50" : "bg-blue-50", "w-12 h-12 rounded-full flex items-center justify-center shrink-0"])}">`);
          _push(ssrRenderComponent(unref(Package), {
            class: ["w-5 h-5", order.stateMachineState?.technicalName === "completed" ? "text-green-500" : "text-blue-500"]
          }, null, _parent));
          _push(`</div><div><span class="block text-lg font-black font-tech text-black mb-1">#${ssrInterpolate(order.orderNumber)}</span><span class="flex items-center text-xs text-gray-600 font-medium">`);
          _push(ssrRenderComponent(unref(Eye), { class: "w-3 h-3 mr-1.5 opacity-50" }, null, _parent));
          _push(` ${ssrInterpolate(new Date(order.orderDateTime).toLocaleDateString("sk-SK"))}</span></div></div><div class="flex flex-col md:flex-row items-end md:items-center gap-6"><div class="text-right"><div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Celkom</div><div class="font-black font-tech text-xl text-black">${ssrInterpolate(order.amountTotal?.toFixed(2) || "0.00")} €</div></div><div class="flex items-center gap-3"><span class="${ssrRenderClass([orderStatusStyle(order.stateMachineState?.technicalName || ""), "px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-center min-w-[120px]"])}">${ssrInterpolate(orderStatusLabel(order.stateMachineState?.technicalName || ""))}</span>`);
          _push(ssrRenderComponent(unref(ChevronRight), {
            class: ["w-5 h-5 text-gray-300 transition-transform duration-200 cursor-pointer hover:text-black", expandedOrderId.value === order.id ? "rotate-90" : ""]
          }, null, _parent));
          _push(`</div></div></div>`);
          if (orderAgainErrors.value[order.id]) {
            _push(`<div class="px-6 py-3 text-red-600 text-sm bg-red-50 border-t border-red-100 font-medium">${ssrInterpolate(orderAgainErrors.value[order.id])}</div>`);
          } else {
            _push(`<!---->`);
          }
          if (expandedOrderId.value === order.id) {
            _push(`<div class="border-t border-gray-100 bg-gray-50 animate-fade-in"><div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b border-gray-200 bg-white"><div><p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center">`);
            _push(ssrRenderComponent(unref(Truck), { class: "w-3.5 h-3.5 mr-2" }, null, _parent));
            _push(` Doprava</p>`);
            if (getDeliveryInfo(order)) {
              _push(`<!--[--><p class="text-sm font-bold text-black">${ssrInterpolate(getDeliveryInfo(order)?.method)}</p><p class="text-xs text-gray-500 mt-1">Stav doručenia: ${ssrInterpolate(getDeliveryInfo(order)?.state)}</p><p class="text-xs text-gray-500 mt-1">Cena: ${ssrInterpolate(getDeliveryInfo(order)?.cost?.toFixed(2))} €</p><!--]-->`);
            } else {
              _push(`<p class="text-xs text-gray-500">Informácie o doprave nie sú dostupné.</p>`);
            }
            _push(`</div><div><p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center">`);
            _push(ssrRenderComponent(unref(CreditCard), { class: "w-3.5 h-3.5 mr-2" }, null, _parent));
            _push(` Platba</p>`);
            if (getPaymentInfo(order)) {
              _push(`<!--[--><p class="text-sm font-bold text-black">${ssrInterpolate(getPaymentInfo(order)?.method)}</p><p class="text-xs text-gray-500 mt-1">Stav platby: ${ssrInterpolate(getPaymentInfo(order)?.state)}</p><!--]-->`);
            } else {
              _push(`<p class="text-xs text-gray-500">Informácie o platbe nie sú dostupné.</p>`);
            }
            _push(`</div></div><div class="p-6 space-y-4"><h3 class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Položky objednávky</h3><!--[-->`);
            ssrRenderList(order.lineItems, (lineItem) => {
              _push(`<div class="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">`);
              _push(ssrRenderComponent(__nuxt_component_0, {
                to: lineItem,
                class: "flex items-center gap-4 group flex-1"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<div class="w-14 h-14 bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center"${_scopeId}>`);
                    if (resolveLineItemImage(lineItem)) {
                      _push2(ssrRenderComponent(_component_NuxtImg, {
                        src: resolveLineItemImage(lineItem),
                        alt: lineItem.label,
                        class: "w-full h-full object-contain p-1 mix-blend-multiply"
                      }, null, _parent2, _scopeId));
                    } else {
                      _push2(ssrRenderComponent(unref(Package), { class: "w-5 h-5 text-gray-300" }, null, _parent2, _scopeId));
                    }
                    _push2(`</div><div${_scopeId}><p class="text-sm font-bold text-black mb-1 font-tech leading-tight group-hover:text-brand transition-colors"${_scopeId}>${ssrInterpolate(formatProductName(lineItem.label))}</p><p class="text-[10px] text-gray-600 font-bold uppercase flex gap-3"${_scopeId}><span${_scopeId}>Množstvo: ${ssrInterpolate(lineItem.quantity)}</span>`);
                    if (lineItem.payload?.productNumber) {
                      _push2(`<span${_scopeId}>SKU: ${ssrInterpolate(lineItem.payload.productNumber)}</span>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    if (getProductVariantLabel(lineItem)) {
                      _push2(`<span class="text-brand"${_scopeId}>${ssrInterpolate(getProductVariantLabel(lineItem))}</span>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`</p></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "w-14 h-14 bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center" }, [
                        resolveLineItemImage(lineItem) ? (openBlock(), createBlock(_component_NuxtImg, {
                          key: 0,
                          src: resolveLineItemImage(lineItem),
                          alt: lineItem.label,
                          class: "w-full h-full object-contain p-1 mix-blend-multiply"
                        }, null, 8, ["src", "alt"])) : (openBlock(), createBlock(unref(Package), {
                          key: 1,
                          class: "w-5 h-5 text-gray-300"
                        }))
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm font-bold text-black mb-1 font-tech leading-tight group-hover:text-brand transition-colors" }, toDisplayString(formatProductName(lineItem.label)), 1),
                        createVNode("p", { class: "text-[10px] text-gray-600 font-bold uppercase flex gap-3" }, [
                          createVNode("span", null, "Množstvo: " + toDisplayString(lineItem.quantity), 1),
                          lineItem.payload?.productNumber ? (openBlock(), createBlock("span", { key: 0 }, "SKU: " + toDisplayString(lineItem.payload.productNumber), 1)) : createCommentVNode("", true),
                          getProductVariantLabel(lineItem) ? (openBlock(), createBlock("span", {
                            key: 1,
                            class: "text-brand"
                          }, toDisplayString(getProductVariantLabel(lineItem)), 1)) : createCommentVNode("", true)
                        ])
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent));
              _push(`<span class="font-black font-tech text-base text-black whitespace-nowrap ml-4">${ssrInterpolate(lineItem.totalPrice?.toFixed(2))} €</span></div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="px-6 py-4 border-t border-gray-100 bg-white flex flex-col xl:flex-row items-center gap-4 justify-between"><div class="flex flex-wrap gap-2 w-full xl:w-auto justify-center xl:justify-start">`);
          _push(ssrRenderComponent(BaseButton, {
            variant: "white",
            size: "sm",
            onClick: ($event) => toggleOrder(order.id)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Eye), { class: "w-3.5 h-3.5 mr-2" }, null, _parent2, _scopeId));
                _push2(` Detail `);
              } else {
                return [
                  createVNode(unref(Eye), { class: "w-3.5 h-3.5 mr-2" }),
                  createTextVNode(" Detail ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(BaseButton, {
            variant: "primary",
            size: "sm",
            disabled: isOrderingAgain.value === order.id,
            onClick: ($event) => orderAgain(order)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (isOrderingAgain.value === order.id) {
                  _push2(ssrRenderComponent(unref(Loader2), { class: "w-3.5 h-3.5 mr-2 animate-spin" }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(unref(RotateCcw), { class: "w-3.5 h-3.5 mr-2" }, null, _parent2, _scopeId));
                }
                _push2(` Znova `);
              } else {
                return [
                  isOrderingAgain.value === order.id ? (openBlock(), createBlock(unref(Loader2), {
                    key: 0,
                    class: "w-3.5 h-3.5 mr-2 animate-spin"
                  })) : (openBlock(), createBlock(unref(RotateCcw), {
                    key: 1,
                    class: "w-3.5 h-3.5 mr-2"
                  })),
                  createTextVNode(" Znova ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><div class="flex flex-wrap gap-2 w-full xl:w-auto justify-center xl:justify-end">`);
          _push(ssrRenderComponent(BaseButton, {
            variant: "white",
            size: "sm",
            disabled: !canReturnOrder(order),
            title: !canReturnOrder(order) ? "Vrátenie je možné len pri doručených objednávkach" : void 0,
            onClick: ($event) => openReturnModal(order, "vratenie")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Undo2), { class: "w-3.5 h-3.5 mr-2" }, null, _parent2, _scopeId));
                _push2(` Vrátiť `);
              } else {
                return [
                  createVNode(unref(Undo2), { class: "w-3.5 h-3.5 mr-2" }),
                  createTextVNode(" Vrátiť ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(BaseButton, {
            variant: "white",
            size: "sm",
            disabled: !canReturnOrder(order),
            title: !canReturnOrder(order) ? "Reklamácia je možná len pri doručených objednávkach" : void 0,
            onClick: ($event) => openReturnModal(order, "reklamacia")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(ShieldAlert), { class: "w-3.5 h-3.5 mr-2" }, null, _parent2, _scopeId));
                _push2(` Reklamovať `);
              } else {
                return [
                  createVNode(unref(ShieldAlert), { class: "w-3.5 h-3.5 mr-2" }),
                  createTextVNode(" Reklamovať ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(BaseButton, {
            variant: "white",
            size: "sm",
            class: "text-yellow-600 border-yellow-200 hover:bg-yellow-50",
            onClick: ($event) => openReviewModal(order)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Star), { class: "w-3.5 h-3.5 mr-2 fill-current" }, null, _parent2, _scopeId));
                _push2(` Ohodnotiť `);
              } else {
                return [
                  createVNode(unref(Star), { class: "w-3.5 h-3.5 mr-2 fill-current" }),
                  createTextVNode(" Ohodnotiť ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="py-16 text-center text-sm text-gray-400 bg-gray-50 border border-gray-100"> Zatiaľ nemáte žiadne objednávky. </div>`);
      }
      _push(ssrRenderComponent(__nuxt_component_2$2, {
        "is-open": isReviewModalOpen.value,
        title: "Ohodnotiť produkty",
        onClose: ($event) => isReviewModalOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (reviewOrder.value) {
              _push2(`<div class="p-2 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide pr-2"${_scopeId}><!--[-->`);
              ssrRenderList(reviewOrder.value.lineItems, (lineItem) => {
                _push2(`<div${_scopeId}>`);
                if (lineItem.type === "product") {
                  _push2(`<!--[--><div class="flex items-center gap-4 mb-4"${_scopeId}><div class="w-16 h-16 bg-gray-50 border border-gray-200 flex-shrink-0 p-1"${_scopeId}>`);
                  if (resolveLineItemImage(lineItem)) {
                    _push2(ssrRenderComponent(_component_NuxtImg, {
                      src: resolveLineItemImage(lineItem),
                      alt: lineItem.label,
                      class: "w-full h-full object-contain mix-blend-multiply"
                    }, null, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div><div${_scopeId}><p class="text-sm font-bold text-black font-tech leading-tight"${_scopeId}>${ssrInterpolate(formatProductName(lineItem.label))}</p><p class="text-xs text-gray-500 mt-1"${_scopeId}>${ssrInterpolate(lineItem.totalPrice?.toFixed(2))} €</p></div></div><div class="bg-gray-50 p-4 border border-gray-100"${_scopeId}><div class="flex items-center gap-1 mb-4"${_scopeId}><span class="text-[10px] font-bold uppercase tracking-widest text-gray-500 mr-3"${_scopeId}>Hodnotenie:</span><!--[-->`);
                  ssrRenderList(5, (i) => {
                    _push2(`<button type="button" class="p-1 focus:outline-none hover:scale-110 transition-transform"${_scopeId}>`);
                    _push2(ssrRenderComponent(unref(Star), {
                      class: ["w-6 h-6 transition-colors", i <= (reviewData.value[lineItem.id]?.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"]
                    }, null, _parent2, _scopeId));
                    _push2(`</button>`);
                  });
                  _push2(`<!--]--></div><div${_scopeId}><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2"${_scopeId}>Vaša recenzia</label><textarea rows="3" placeholder="Ako ste spokojný s týmto produktom?" class="w-full px-4 py-3 bg-white border border-gray-200 focus:border-brand transition-all outline-none text-sm font-medium font-sans resize-none"${_scopeId}>${ssrInterpolate(reviewData.value[lineItem.id].text)}</textarea></div></div><!--]-->`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(BaseButton, {
              variant: "white",
              onClick: ($event) => isReviewModalOpen.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Zrušiť`);
                } else {
                  return [
                    createTextVNode("Zrušiť")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(BaseButton, {
              variant: "primary",
              disabled: isSubmittingReviews.value,
              onClick: submitReviews
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (isSubmittingReviews.value) {
                    _push3(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 mr-2 animate-spin" }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(` Odoslať hodnotenia `);
                } else {
                  return [
                    isSubmittingReviews.value ? (openBlock(), createBlock(unref(Loader2), {
                      key: 0,
                      class: "w-4 h-4 mr-2 animate-spin"
                    })) : createCommentVNode("", true),
                    createTextVNode(" Odoslať hodnotenia ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              reviewOrder.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "p-2 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide pr-2"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(reviewOrder.value.lineItems, (lineItem) => {
                  return openBlock(), createBlock("div", {
                    key: lineItem.id
                  }, [
                    lineItem.type === "product" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createVNode("div", { class: "flex items-center gap-4 mb-4" }, [
                        createVNode("div", { class: "w-16 h-16 bg-gray-50 border border-gray-200 flex-shrink-0 p-1" }, [
                          resolveLineItemImage(lineItem) ? (openBlock(), createBlock(_component_NuxtImg, {
                            key: 0,
                            src: resolveLineItemImage(lineItem),
                            alt: lineItem.label,
                            class: "w-full h-full object-contain mix-blend-multiply"
                          }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                        ]),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-sm font-bold text-black font-tech leading-tight" }, toDisplayString(formatProductName(lineItem.label)), 1),
                          createVNode("p", { class: "text-xs text-gray-500 mt-1" }, toDisplayString(lineItem.totalPrice?.toFixed(2)) + " €", 1)
                        ])
                      ]),
                      createVNode("div", { class: "bg-gray-50 p-4 border border-gray-100" }, [
                        createVNode("div", { class: "flex items-center gap-1 mb-4" }, [
                          createVNode("span", { class: "text-[10px] font-bold uppercase tracking-widest text-gray-500 mr-3" }, "Hodnotenie:"),
                          (openBlock(), createBlock(Fragment, null, renderList(5, (i) => {
                            return createVNode("button", {
                              key: i,
                              type: "button",
                              onClick: ($event) => setRating(lineItem.id, i),
                              class: "p-1 focus:outline-none hover:scale-110 transition-transform"
                            }, [
                              createVNode(unref(Star), {
                                class: ["w-6 h-6 transition-colors", i <= (reviewData.value[lineItem.id]?.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"]
                              }, null, 8, ["class"])
                            ], 8, ["onClick"]);
                          }), 64))
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2" }, "Vaša recenzia"),
                          withDirectives(createVNode("textarea", {
                            "onUpdate:modelValue": ($event) => reviewData.value[lineItem.id].text = $event,
                            rows: "3",
                            placeholder: "Ako ste spokojný s týmto produktom?",
                            class: "w-full px-4 py-3 bg-white border border-gray-200 focus:border-brand transition-all outline-none text-sm font-medium font-sans resize-none"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, reviewData.value[lineItem.id].text]
                          ])
                        ])
                      ])
                    ], 64)) : createCommentVNode("", true)
                  ]);
                }), 128))
              ])) : createCommentVNode("", true),
              createVNode("div", { class: "mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3" }, [
                createVNode(BaseButton, {
                  variant: "white",
                  onClick: ($event) => isReviewModalOpen.value = false
                }, {
                  default: withCtx(() => [
                    createTextVNode("Zrušiť")
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(BaseButton, {
                  variant: "primary",
                  disabled: isSubmittingReviews.value,
                  onClick: submitReviews
                }, {
                  default: withCtx(() => [
                    isSubmittingReviews.value ? (openBlock(), createBlock(unref(Loader2), {
                      key: 0,
                      class: "w-4 h-4 mr-2 animate-spin"
                    })) : createCommentVNode("", true),
                    createTextVNode(" Odoslať hodnotenia ")
                  ]),
                  _: 1
                }, 8, ["disabled"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ReturnFormModal, {
        "is-open": isReturnModalOpen.value,
        "initial-form-type": returnInitialData.value.formType,
        "initial-order-number": returnInitialData.value.orderNumber,
        "initial-order-date": returnInitialData.value.orderDate,
        "initial-order-id": returnInitialData.value.orderId,
        "initial-email": returnInitialData.value.email,
        "initial-first-name": returnInitialData.value.firstName,
        "initial-last-name": returnInitialData.value.lastName,
        "initial-customer-phone": returnInitialData.value.phone,
        "initial-customer-address": returnInitialData.value.address,
        "initial-items-description": returnInitialData.value.itemsDescription,
        "skip-order-lookup": true,
        onClose: ($event) => isReturnModalOpen.value = false
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/account/AccountTabObjednavky.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "AccountTabObjednavky" });

export { __nuxt_component_2 as default };
