import { m as useI18n, d as useRoute, b as useLocalePath, M as useInternationalization, K as useNotifications, e as useShopwareContext, L as __nuxt_component_0 } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-B7B0pxEe.mjs';
import __nuxt_component_0$2 from './PageHeader-CHrO2U4n.mjs';
import __nuxt_component_3 from './Status-BPwYdPy_.mjs';
import __nuxt_component_3$1 from './Price-D7PucwgC.mjs';
import __nuxt_component_1 from './Downloads-Ds3QIgv9.mjs';
import { defineComponent, ref, withAsyncContext, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, withDirectives, vModelRadio, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseEqual } from 'vue/server-renderer';
import { getSmallestThumbnailUrl, getMedia, downloadFile } from '@shopware/helpers';
import { u as useOrderDetails } from './useOrderDetails-CE2XJ7gX.mjs';
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
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './usePrice-CDJKOx8c.mjs';
import './useDefaultOrderAssociations-WycTFxJ-.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { t: $t } = useI18n();
    const route = useRoute();
    const paymentMethods = ref([]);
    const isLoading = ref(false);
    const loadingPaymentMethods = ref(false);
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    const {
      loadOrderDetails,
      order,
      hasDocuments,
      documents,
      paymentMethod,
      paymentChangeable,
      getPaymentMethods,
      changePaymentMethod,
      shippingMethod,
      subtotal,
      total,
      shippingCosts,
      billingAddress,
      shippingAddress,
      statusTechnicalName,
      getMediaFile
    } = ([__temp, __restore] = withAsyncContext(() => useOrderDetails(route.params.id)), __temp = await __temp, __restore(), __temp);
    const { pushSuccess, pushError } = useNotifications();
    const { t } = useI18n();
    const lineItems = computed(
      () => order.value?.lineItems || []
    );
    const { browserLocale } = useShopwareContext();
    const formatDate = (date) => {
      return new Intl.DateTimeFormat(browserLocale, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      }).format(new Date(date));
    };
    const isChangePaymentModalOpen = ref(false);
    const selectedPaymentMethod = computed({
      get() {
        return paymentMethod.value?.id || "";
      },
      async set(paymentMethodId) {
        isLoading.value = true;
        try {
          await changePaymentMethod(paymentMethodId);
          pushSuccess(t("account.messages.paymentMethodChanged"));
          closeChangePaymentModal();
        } catch (error) {
          pushError(t("messages.error"));
        } finally {
          isLoading.value = false;
        }
      }
    });
    const paymentMethodUI = ref("");
    const openChangePaymentModal = async () => {
      isChangePaymentModalOpen.value = true;
      try {
        loadingPaymentMethods.value = true;
        const payments = await getPaymentMethods();
        paymentMethods.value = payments;
        paymentMethodUI.value = paymentMethod.value?.id || "";
      } catch (error) {
      } finally {
        loadingPaymentMethods.value = false;
      }
    };
    const closeChangePaymentModal = () => {
      isChangePaymentModalOpen.value = false;
    };
    const confirmChangePaymentModal = () => {
      selectedPaymentMethod.value = paymentMethodUI.value;
      isChangePaymentModalOpen.value = false;
    };
    const getMediaFileHandler = async (mediaId, fileName) => {
      const response = await getMediaFile(mediaId);
      downloadFile(response, fileName);
    };
    const generateBackLink = () => {
      if ((void 0).referrer) {
        const url = new URL((void 0).referrer);
        if (url.pathname.includes("/account/order")) {
          return `${url.pathname}${url.search}`;
        }
      }
      return "/account/order";
    };
    const pageTitle = computed(
      () => `${$t("account.orderDetails.order")} #${order.value?.orderNumber}`
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_AccountPageHeader = __nuxt_component_0$2;
      const _component_AccountOrderStatus = __nuxt_component_3;
      const _component_SharedPrice = __nuxt_component_3$1;
      const _component_AccountOrderDownloads = __nuxt_component_1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "account" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(order)) {
              _push2(`<div class="mb-20"${_scopeId}><p class="mb-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                class: "text-sm flex flex-row gap-1 text-surface-on-surface hover:text-brand-primary",
                to: unref(formatLink)(generateBackLink())
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="w-5 h-5 i-carbon-chevron-left"${_scopeId2}></div> ${ssrInterpolate(unref($t)("account.orderDetails.backToOrdersList"))}`);
                  } else {
                    return [
                      createVNode("div", { class: "w-5 h-5 i-carbon-chevron-left" }),
                      createTextVNode(" " + toDisplayString(unref($t)("account.orderDetails.backToOrdersList")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</p>`);
              _push2(ssrRenderComponent(_component_AccountPageHeader, {
                class: "mb-14",
                title: pageTitle.value
              }, null, _parent2, _scopeId));
              _push2(`<div${_scopeId}><div class="bg-surface-surface overflow-hidden sm:rounded-lg"${_scopeId}><div class="bg-surface-surface"${_scopeId}><div class="flex flex-col sm:flex-row justify-between mb-6"${_scopeId}><div${_scopeId}><p class="text-sm text-surface-on-surface-variant"${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.placedOn", {
                d: formatDate(unref(order).orderDate)
              }))}</p></div><div class="mt-4 sm:mt-0"${_scopeId}>`);
              if (unref(order).stateMachineState) {
                _push2(ssrRenderComponent(_component_AccountOrderStatus, {
                  state: unref(order).stateMachineState
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="overflow-x-auto"${_scopeId}><table class="min-w-full divide-y divide-outline-outline-variant"${_scopeId}><thead class="bg-surface-surface-container-low"${_scopeId}><tr${_scopeId}><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-surface-on-surface-variant uppercase tracking-wider"${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.itemsHeader.item"))}</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-surface-on-surface-variant uppercase tracking-wider"${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.itemsHeader.quantity"))}</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-surface-on-surface-variant uppercase tracking-wider"${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.itemsHeader.price"))}</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-surface-on-surface-variant uppercase tracking-wider"${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.itemsHeader.total"))}</th></tr></thead><tbody class="bg-surface-surface divide-y divide-outline-outline-variant"${_scopeId}><!--[-->`);
              ssrRenderList(lineItems.value, (item) => {
                _push2(`<!--[--><tr${_scopeId}><td class="px-6 py-4 whitespace-nowrap"${_scopeId}><div class="flex items-center"${_scopeId}><div class="flex-shrink-0 h-10 w-10"${_scopeId}>`);
                if (item.type === "product") {
                  _push2(`<img class="h-10 w-10"${ssrRenderAttr("src", unref(getSmallestThumbnailUrl)(item.cover))}${ssrRenderAttr("alt", item.label)}${_scopeId}>`);
                } else if (item.type === "promotion") {
                  _push2(`<div class="h-10 w-10 i-carbon-tag text-3xl text-center"${_scopeId}></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="ml-4"${_scopeId}><div class="text-sm font-medium text-surface-on-surface"${_scopeId}>${ssrInterpolate(item.label)} `);
                if (item.type === "promotion") {
                  _push2(`<span class="bg-states-success-container text-states-on-success-container text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full"${_scopeId}>${ssrInterpolate(unref($t)("cart.promotion"))}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div></div></td><td class="px-6 py-4 whitespace-nowrap text-sm text-surface-on-surface-variant"${_scopeId}>${ssrInterpolate(item.quantity)}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-surface-on-surface-variant"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_SharedPrice, {
                  value: item.unitPrice,
                  class: "text-surface-on-surface font-normal",
                  "data-testid": "order-item-unitprice"
                }, null, _parent2, _scopeId));
                _push2(`</td><td class="px-6 py-4 whitespace-nowrap text-sm text-surface-on-surface-variant"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_SharedPrice, {
                  value: item.totalPrice,
                  class: "text-surface-on-surface font-normal",
                  "data-testid": "order-item-totalprice"
                }, null, _parent2, _scopeId));
                _push2(`</td></tr>`);
                if (item.downloads?.length) {
                  _push2(`<tr${_scopeId}><td colspan="4" class="py-3"${_scopeId}><!--[-->`);
                  ssrRenderList(unref(getMedia)(item), (media) => {
                    _push2(`<!--[-->`);
                    if (media.accessGranted) {
                      _push2(`<div class="flex gap-2 cursor-pointer pl-5 pb-3 hover:text-brand-primary"${_scopeId}><div class="w-5 h-5 i-carbon-download"${_scopeId}></div> ${ssrInterpolate(media.fileName)}</div>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`<!--]-->`);
                  });
                  _push2(`<!--]--></td></tr>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]--></tbody></table></div><div class="mt-8 flex flex-col sm:flex-row justify-between"${_scopeId}>`);
              if (unref(shippingAddress)) {
                _push2(`<div class="mb-4 sm:mb-0"${_scopeId}><h3 class="text-lg font-semibold text-surface-on-surface mb-2"${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.shippingAddress"))}</h3><address class="not-italic text-sm text-surface-on-surface-variant"${_scopeId}>${ssrInterpolate(unref(shippingAddress).street)}<br${_scopeId}> ${ssrInterpolate(unref(shippingAddress).city)} `);
                if (unref(shippingAddress).countryState) {
                  _push2(`<span${_scopeId}>, ${ssrInterpolate(unref(shippingAddress).countryState)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(` ${ssrInterpolate(unref(shippingAddress).zipcode)}<br${_scopeId}> ${ssrInterpolate(unref(shippingAddress).country)}</address></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(billingAddress)) {
                _push2(`<div class="mb-4 sm:mb-0"${_scopeId}><h3 class="text-lg font-semibold text-surface-on-surface mb-2"${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.billingAddress"))}</h3><address class="not-italic text-sm text-surface-on-surface-variant"${_scopeId}>${ssrInterpolate(unref(billingAddress).street)}<br${_scopeId}> ${ssrInterpolate(unref(billingAddress).city)} `);
                if (unref(billingAddress).countryState) {
                  _push2(`<span${_scopeId}>, ${ssrInterpolate(unref(billingAddress).countryState)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(` ${ssrInterpolate(unref(billingAddress).zipcode)}<br${_scopeId}> ${ssrInterpolate(unref(billingAddress).country)}</address></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="w-full sm:w-1/3"${_scopeId}><div class="bg-surface-surface-container-low p-4 rounded-lg"${_scopeId}><h3 class="text-lg font-semibold text-surface-on-surface mb-2"${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.orderSummary"))}</h3><div class="flex justify-between mb-2"${_scopeId}><span class="text-sm text-surface-on-surface-variant"${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.subtotal"))}</span><span class="text-sm text-surface-on-surface"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_SharedPrice, {
                value: unref(subtotal),
                class: "text-surface-on-surface font-normal",
                "data-testid": "order-subtotal"
              }, null, _parent2, _scopeId));
              _push2(`</span></div><div class="flex justify-between mb-2"${_scopeId}><span class="text-sm text-surface-on-surface-variant"${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.shipping"))}</span><span class="text-sm text-surface-on-surface"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_SharedPrice, {
                value: unref(shippingCosts),
                class: "text-surface-on-surface font-normal",
                "data-testid": "order-subtotal"
              }, null, _parent2, _scopeId));
              _push2(`</span></div><div class="border-t border-outline-outline-variant mt-2 pt-2 flex justify-between"${_scopeId}><span class="text-base font-semibold text-surface-on-surface"${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.total"))}</span><span class="text-base font-semibold text-surface-on-surface"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_SharedPrice, {
                value: unref(total),
                class: "text-surface-on-surface font-normal",
                "data-testid": "order-subtotal"
              }, null, _parent2, _scopeId));
              _push2(`</span></div></div></div></div>`);
              if (unref(hasDocuments)) {
                _push2(ssrRenderComponent(_component_AccountOrderDownloads, { documents: unref(documents) }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (unref(shippingMethod)) {
                _push2(`<div class="mt-8 bg-surface-surface p-6 rounded-lg shadow"${_scopeId}><h3 class="text-lg font-semibold text-surface-on-surface mb-4"${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.shippingMethod"))}</h3><div class="flex items-center justify-between"${_scopeId}><div class="flex items-center"${_scopeId}><div${_scopeId}><p class="text-surface-on-surface"${_scopeId}>${ssrInterpolate(unref(shippingMethod)?.translated.name)}</p>`);
                if (unref(shippingMethod)?.deliveryTime) {
                  _push2(`<p class="text-sm text-surface-on-surface-variant"${_scopeId}>${ssrInterpolate(unref($t)("checkout.takesUpTo"))} ${ssrInterpolate(unref(shippingMethod).deliveryTime?.name)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(paymentMethod)) {
                _push2(`<div class="mt-8 bg-surface-surface p-6 rounded-lg shadow"${_scopeId}><h3 class="text-lg font-semibold text-surface-on-surface mb-4"${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.paymentMethod"))}</h3>`);
                if (!isLoading.value) {
                  _push2(`<div class="flex items-center justify-between"${_scopeId}><div class="flex items-center"${_scopeId}><div${_scopeId}><p class="text-sm font-medium text-surface-on-surface"${_scopeId}>${ssrInterpolate(unref(paymentMethod)?.translated.name)}</p></div></div>`);
                  if (unref(paymentChangeable) && unref(statusTechnicalName) === "open") {
                    _push2(`<button class="px-4 py-2 bg-brand-primary text-brand-on-primary rounded hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.change"))}</button>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else {
                  _push2(`<div class="animate-pulse"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="flex items-center"${_scopeId}><div class="w-32 h-4 bg-surface-surface-container rounded"${_scopeId}></div></div><div class="w-24 h-8 bg-surface-surface-container rounded"${_scopeId}></div></div></div>`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div></div>`);
              if (isChangePaymentModalOpen.value) {
                _push2(`<div class="fixed inset-0 bg-overlay-dark overflow-y-auto h-full w-full flex items-center justify-center"${_scopeId}><div class="bg-surface-surface p-8 rounded-lg shadow-xl max-w-md w-full"${_scopeId}><h2 class="text-2xl font-bold mb-4 text-surface-on-surface"${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.changePaymentMethod"))}</h2><div class="space-y-4"${_scopeId}>`);
                if (loadingPaymentMethods.value) {
                  _push2(`<!--[-->`);
                  ssrRenderList(3, (i) => {
                    _push2(`<div class="flex items-center animate-pulse"${_scopeId}><div class="w-4 h-4 bg-surface-surface-container rounded-full mr-3"${_scopeId}></div><div class="flex-grow"${_scopeId}><div class="h-5 bg-surface-surface-container rounded w-1/3 mb-2"${_scopeId}></div><div class="h-4 bg-surface-surface-container rounded w-2/3"${_scopeId}></div></div></div>`);
                  });
                  _push2(`<!--]-->`);
                } else {
                  _push2(`<!--[-->`);
                  ssrRenderList(paymentMethods.value, (method) => {
                    _push2(`<div class="flex items-center"${_scopeId}><input type="radio"${ssrRenderAttr("id", method.id)}${ssrRenderAttr("value", method.id)}${ssrIncludeBooleanAttr(ssrLooseEqual(paymentMethodUI.value, method.id)) ? " checked" : ""} class="mr-3"${_scopeId}><label${ssrRenderAttr("for", method.id)} class="flex-grow"${_scopeId}><span class="font-medium text-surface-on-surface"${_scopeId}>${ssrInterpolate(method.name)}</span>`);
                    if (method.description) {
                      _push2(`<span class="block text-sm text-surface-on-surface-variant"${_scopeId}>${ssrInterpolate(method.description)}</span>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`</label></div>`);
                  });
                  _push2(`<!--]-->`);
                }
                _push2(`</div><div class="mt-6 flex justify-end space-x-3"${_scopeId}><button class="px-4 py-2 bg-brand-tertiary text-brand-on-tertiary rounded hover:bg-brand-tertiary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"${ssrIncludeBooleanAttr(!selectedPaymentMethod.value) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.close"))}</button><button class="px-4 py-2 bg-brand-primary text-brand-on-primary rounded hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"${ssrIncludeBooleanAttr(!selectedPaymentMethod.value) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref($t)("account.orderDetails.confirm"))}</button></div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(order) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mb-20"
              }, [
                createVNode("p", { class: "mb-2" }, [
                  createVNode(_component_NuxtLink, {
                    class: "text-sm flex flex-row gap-1 text-surface-on-surface hover:text-brand-primary",
                    to: unref(formatLink)(generateBackLink())
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "w-5 h-5 i-carbon-chevron-left" }),
                      createTextVNode(" " + toDisplayString(unref($t)("account.orderDetails.backToOrdersList")), 1)
                    ]),
                    _: 1
                  }, 8, ["to"])
                ]),
                createVNode(_component_AccountPageHeader, {
                  class: "mb-14",
                  title: pageTitle.value
                }, null, 8, ["title"]),
                createVNode("div", null, [
                  createVNode("div", { class: "bg-surface-surface overflow-hidden sm:rounded-lg" }, [
                    createVNode("div", { class: "bg-surface-surface" }, [
                      createVNode("div", { class: "flex flex-col sm:flex-row justify-between mb-6" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "text-sm text-surface-on-surface-variant" }, toDisplayString(unref($t)("account.orderDetails.placedOn", {
                            d: formatDate(unref(order).orderDate)
                          })), 1)
                        ]),
                        createVNode("div", { class: "mt-4 sm:mt-0" }, [
                          unref(order).stateMachineState ? (openBlock(), createBlock(_component_AccountOrderStatus, {
                            key: 0,
                            state: unref(order).stateMachineState
                          }, null, 8, ["state"])) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode("div", { class: "overflow-x-auto" }, [
                        createVNode("table", { class: "min-w-full divide-y divide-outline-outline-variant" }, [
                          createVNode("thead", { class: "bg-surface-surface-container-low" }, [
                            createVNode("tr", null, [
                              createVNode("th", {
                                scope: "col",
                                class: "px-6 py-3 text-left text-xs font-medium text-surface-on-surface-variant uppercase tracking-wider"
                              }, toDisplayString(unref($t)("account.orderDetails.itemsHeader.item")), 1),
                              createVNode("th", {
                                scope: "col",
                                class: "px-6 py-3 text-left text-xs font-medium text-surface-on-surface-variant uppercase tracking-wider"
                              }, toDisplayString(unref($t)("account.orderDetails.itemsHeader.quantity")), 1),
                              createVNode("th", {
                                scope: "col",
                                class: "px-6 py-3 text-left text-xs font-medium text-surface-on-surface-variant uppercase tracking-wider"
                              }, toDisplayString(unref($t)("account.orderDetails.itemsHeader.price")), 1),
                              createVNode("th", {
                                scope: "col",
                                class: "px-6 py-3 text-left text-xs font-medium text-surface-on-surface-variant uppercase tracking-wider"
                              }, toDisplayString(unref($t)("account.orderDetails.itemsHeader.total")), 1)
                            ])
                          ]),
                          createVNode("tbody", { class: "bg-surface-surface divide-y divide-outline-outline-variant" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(lineItems.value, (item) => {
                              return openBlock(), createBlock(Fragment, {
                                key: item.id
                              }, [
                                createVNode("tr", null, [
                                  createVNode("td", { class: "px-6 py-4 whitespace-nowrap" }, [
                                    createVNode("div", { class: "flex items-center" }, [
                                      createVNode("div", { class: "flex-shrink-0 h-10 w-10" }, [
                                        item.type === "product" ? (openBlock(), createBlock("img", {
                                          key: 0,
                                          class: "h-10 w-10",
                                          src: unref(getSmallestThumbnailUrl)(item.cover),
                                          alt: item.label
                                        }, null, 8, ["src", "alt"])) : item.type === "promotion" ? (openBlock(), createBlock("div", {
                                          key: 1,
                                          class: "h-10 w-10 i-carbon-tag text-3xl text-center"
                                        })) : createCommentVNode("", true)
                                      ]),
                                      createVNode("div", { class: "ml-4" }, [
                                        createVNode("div", { class: "text-sm font-medium text-surface-on-surface" }, [
                                          createTextVNode(toDisplayString(item.label) + " ", 1),
                                          item.type === "promotion" ? (openBlock(), createBlock("span", {
                                            key: 0,
                                            class: "bg-states-success-container text-states-on-success-container text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full"
                                          }, toDisplayString(unref($t)("cart.promotion")), 1)) : createCommentVNode("", true)
                                        ])
                                      ])
                                    ])
                                  ]),
                                  createVNode("td", { class: "px-6 py-4 whitespace-nowrap text-sm text-surface-on-surface-variant" }, toDisplayString(item.quantity), 1),
                                  createVNode("td", { class: "px-6 py-4 whitespace-nowrap text-sm text-surface-on-surface-variant" }, [
                                    createVNode(_component_SharedPrice, {
                                      value: item.unitPrice,
                                      class: "text-surface-on-surface font-normal",
                                      "data-testid": "order-item-unitprice"
                                    }, null, 8, ["value"])
                                  ]),
                                  createVNode("td", { class: "px-6 py-4 whitespace-nowrap text-sm text-surface-on-surface-variant" }, [
                                    createVNode(_component_SharedPrice, {
                                      value: item.totalPrice,
                                      class: "text-surface-on-surface font-normal",
                                      "data-testid": "order-item-totalprice"
                                    }, null, 8, ["value"])
                                  ])
                                ]),
                                item.downloads?.length ? (openBlock(), createBlock("tr", { key: 0 }, [
                                  createVNode("td", {
                                    colspan: "4",
                                    class: "py-3"
                                  }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(unref(getMedia)(item), (media) => {
                                      return openBlock(), createBlock(Fragment, {
                                        key: media.id
                                      }, [
                                        media.accessGranted ? (openBlock(), createBlock("div", {
                                          key: 0,
                                          class: "flex gap-2 cursor-pointer pl-5 pb-3 hover:text-brand-primary",
                                          onClick: ($event) => getMediaFileHandler(media.id, media.fileName)
                                        }, [
                                          createVNode("div", { class: "w-5 h-5 i-carbon-download" }),
                                          createTextVNode(" " + toDisplayString(media.fileName), 1)
                                        ], 8, ["onClick"])) : createCommentVNode("", true)
                                      ], 64);
                                    }), 128))
                                  ])
                                ])) : createCommentVNode("", true)
                              ], 64);
                            }), 128))
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "mt-8 flex flex-col sm:flex-row justify-between" }, [
                        unref(shippingAddress) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mb-4 sm:mb-0"
                        }, [
                          createVNode("h3", { class: "text-lg font-semibold text-surface-on-surface mb-2" }, toDisplayString(unref($t)("account.orderDetails.shippingAddress")), 1),
                          createVNode("address", { class: "not-italic text-sm text-surface-on-surface-variant" }, [
                            createTextVNode(toDisplayString(unref(shippingAddress).street), 1),
                            createVNode("br"),
                            createTextVNode(" " + toDisplayString(unref(shippingAddress).city) + " ", 1),
                            unref(shippingAddress).countryState ? (openBlock(), createBlock("span", { key: 0 }, ", " + toDisplayString(unref(shippingAddress).countryState), 1)) : createCommentVNode("", true),
                            createTextVNode(" " + toDisplayString(unref(shippingAddress).zipcode), 1),
                            createVNode("br"),
                            createTextVNode(" " + toDisplayString(unref(shippingAddress).country), 1)
                          ])
                        ])) : createCommentVNode("", true),
                        unref(billingAddress) ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "mb-4 sm:mb-0"
                        }, [
                          createVNode("h3", { class: "text-lg font-semibold text-surface-on-surface mb-2" }, toDisplayString(unref($t)("account.orderDetails.billingAddress")), 1),
                          createVNode("address", { class: "not-italic text-sm text-surface-on-surface-variant" }, [
                            createTextVNode(toDisplayString(unref(billingAddress).street), 1),
                            createVNode("br"),
                            createTextVNode(" " + toDisplayString(unref(billingAddress).city) + " ", 1),
                            unref(billingAddress).countryState ? (openBlock(), createBlock("span", { key: 0 }, ", " + toDisplayString(unref(billingAddress).countryState), 1)) : createCommentVNode("", true),
                            createTextVNode(" " + toDisplayString(unref(billingAddress).zipcode), 1),
                            createVNode("br"),
                            createTextVNode(" " + toDisplayString(unref(billingAddress).country), 1)
                          ])
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "w-full sm:w-1/3" }, [
                          createVNode("div", { class: "bg-surface-surface-container-low p-4 rounded-lg" }, [
                            createVNode("h3", { class: "text-lg font-semibold text-surface-on-surface mb-2" }, toDisplayString(unref($t)("account.orderDetails.orderSummary")), 1),
                            createVNode("div", { class: "flex justify-between mb-2" }, [
                              createVNode("span", { class: "text-sm text-surface-on-surface-variant" }, toDisplayString(unref($t)("account.orderDetails.subtotal")), 1),
                              createVNode("span", { class: "text-sm text-surface-on-surface" }, [
                                createVNode(_component_SharedPrice, {
                                  value: unref(subtotal),
                                  class: "text-surface-on-surface font-normal",
                                  "data-testid": "order-subtotal"
                                }, null, 8, ["value"])
                              ])
                            ]),
                            createVNode("div", { class: "flex justify-between mb-2" }, [
                              createVNode("span", { class: "text-sm text-surface-on-surface-variant" }, toDisplayString(unref($t)("account.orderDetails.shipping")), 1),
                              createVNode("span", { class: "text-sm text-surface-on-surface" }, [
                                createVNode(_component_SharedPrice, {
                                  value: unref(shippingCosts),
                                  class: "text-surface-on-surface font-normal",
                                  "data-testid": "order-subtotal"
                                }, null, 8, ["value"])
                              ])
                            ]),
                            createVNode("div", { class: "border-t border-outline-outline-variant mt-2 pt-2 flex justify-between" }, [
                              createVNode("span", { class: "text-base font-semibold text-surface-on-surface" }, toDisplayString(unref($t)("account.orderDetails.total")), 1),
                              createVNode("span", { class: "text-base font-semibold text-surface-on-surface" }, [
                                createVNode(_component_SharedPrice, {
                                  value: unref(total),
                                  class: "text-surface-on-surface font-normal",
                                  "data-testid": "order-subtotal"
                                }, null, 8, ["value"])
                              ])
                            ])
                          ])
                        ])
                      ]),
                      unref(hasDocuments) ? (openBlock(), createBlock(_component_AccountOrderDownloads, {
                        key: 0,
                        documents: unref(documents)
                      }, null, 8, ["documents"])) : createCommentVNode("", true),
                      unref(shippingMethod) ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "mt-8 bg-surface-surface p-6 rounded-lg shadow"
                      }, [
                        createVNode("h3", { class: "text-lg font-semibold text-surface-on-surface mb-4" }, toDisplayString(unref($t)("account.orderDetails.shippingMethod")), 1),
                        createVNode("div", { class: "flex items-center justify-between" }, [
                          createVNode("div", { class: "flex items-center" }, [
                            createVNode("div", null, [
                              createVNode("p", { class: "text-surface-on-surface" }, toDisplayString(unref(shippingMethod)?.translated.name), 1),
                              unref(shippingMethod)?.deliveryTime ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-sm text-surface-on-surface-variant"
                              }, toDisplayString(unref($t)("checkout.takesUpTo")) + " " + toDisplayString(unref(shippingMethod).deliveryTime?.name), 1)) : createCommentVNode("", true)
                            ])
                          ])
                        ])
                      ])) : createCommentVNode("", true),
                      unref(paymentMethod) ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "mt-8 bg-surface-surface p-6 rounded-lg shadow"
                      }, [
                        createVNode("h3", { class: "text-lg font-semibold text-surface-on-surface mb-4" }, toDisplayString(unref($t)("account.orderDetails.paymentMethod")), 1),
                        !isLoading.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex items-center justify-between"
                        }, [
                          createVNode("div", { class: "flex items-center" }, [
                            createVNode("div", null, [
                              createVNode("p", { class: "text-sm font-medium text-surface-on-surface" }, toDisplayString(unref(paymentMethod)?.translated.name), 1)
                            ])
                          ]),
                          unref(paymentChangeable) && unref(statusTechnicalName) === "open" ? (openBlock(), createBlock("button", {
                            key: 0,
                            onClick: openChangePaymentModal,
                            class: "px-4 py-2 bg-brand-primary text-brand-on-primary rounded hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                          }, toDisplayString(unref($t)("account.orderDetails.change")), 1)) : createCommentVNode("", true)
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "animate-pulse"
                        }, [
                          createVNode("div", { class: "flex items-center justify-between" }, [
                            createVNode("div", { class: "flex items-center" }, [
                              createVNode("div", { class: "w-32 h-4 bg-surface-surface-container rounded" })
                            ]),
                            createVNode("div", { class: "w-24 h-8 bg-surface-surface-container rounded" })
                          ])
                        ]))
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ]),
                isChangePaymentModalOpen.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "fixed inset-0 bg-overlay-dark overflow-y-auto h-full w-full flex items-center justify-center"
                }, [
                  createVNode("div", { class: "bg-surface-surface p-8 rounded-lg shadow-xl max-w-md w-full" }, [
                    createVNode("h2", { class: "text-2xl font-bold mb-4 text-surface-on-surface" }, toDisplayString(unref($t)("account.orderDetails.changePaymentMethod")), 1),
                    createVNode("div", { class: "space-y-4" }, [
                      loadingPaymentMethods.value ? (openBlock(), createBlock(Fragment, { key: 0 }, renderList(3, (i) => {
                        return createVNode("div", {
                          key: i,
                          class: "flex items-center animate-pulse"
                        }, [
                          createVNode("div", { class: "w-4 h-4 bg-surface-surface-container rounded-full mr-3" }),
                          createVNode("div", { class: "flex-grow" }, [
                            createVNode("div", { class: "h-5 bg-surface-surface-container rounded w-1/3 mb-2" }),
                            createVNode("div", { class: "h-4 bg-surface-surface-container rounded w-2/3" })
                          ])
                        ]);
                      }), 64)) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(paymentMethods.value, (method) => {
                        return openBlock(), createBlock("div", {
                          key: method.id,
                          class: "flex items-center"
                        }, [
                          withDirectives(createVNode("input", {
                            type: "radio",
                            id: method.id,
                            value: method.id,
                            "onUpdate:modelValue": ($event) => paymentMethodUI.value = $event,
                            class: "mr-3"
                          }, null, 8, ["id", "value", "onUpdate:modelValue"]), [
                            [vModelRadio, paymentMethodUI.value]
                          ]),
                          createVNode("label", {
                            for: method.id,
                            class: "flex-grow"
                          }, [
                            createVNode("span", { class: "font-medium text-surface-on-surface" }, toDisplayString(method.name), 1),
                            method.description ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "block text-sm text-surface-on-surface-variant"
                            }, toDisplayString(method.description), 1)) : createCommentVNode("", true)
                          ], 8, ["for"])
                        ]);
                      }), 128))
                    ]),
                    createVNode("div", { class: "mt-6 flex justify-end space-x-3" }, [
                      createVNode("button", {
                        onClick: closeChangePaymentModal,
                        class: "px-4 py-2 bg-brand-tertiary text-brand-on-tertiary rounded hover:bg-brand-tertiary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
                        disabled: !selectedPaymentMethod.value
                      }, toDisplayString(unref($t)("account.orderDetails.close")), 9, ["disabled"]),
                      createVNode("button", {
                        onClick: confirmChangePaymentModal,
                        class: "px-4 py-2 bg-brand-primary text-brand-on-primary rounded hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
                        disabled: !selectedPaymentMethod.value
                      }, toDisplayString(unref($t)("account.orderDetails.confirm")), 9, ["disabled"])
                    ])
                  ])
                ])) : createCommentVNode("", true)
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/pages/account/order/details/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
