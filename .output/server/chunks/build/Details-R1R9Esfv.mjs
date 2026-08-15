import __nuxt_component_0 from './LineItem-B5SzDP68.mjs';
import __nuxt_component_1 from './Downloads-Ds3QIgv9.mjs';
import { defineComponent, ref, withAsyncContext, computed, unref, useSSRContext } from 'vue';
import { ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderComponent } from 'vue/server-renderer';
import { u as useCartNotification } from './useCartNotification-Bl0gSIu9.mjs';
import { K as useNotifications, m as useI18n, a as useCart } from './server.mjs';
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
import '@shopware/helpers';
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './useDefaultOrderAssociations-WycTFxJ-.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AccountOrderDetails"
  },
  __name: "Details",
  __ssrInlineRender: true,
  props: {
    orderId: {}
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const isLoading = ref(false);
    useCartNotification();
    const { pushSuccess, pushError } = useNotifications();
    const { t } = useI18n();
    const {
      order,
      hasDocuments,
      documents,
      paymentMethod,
      paymentChangeable,
      getPaymentMethods,
      changePaymentMethod,
      statusTechnicalName
    } = ([__temp, __restore] = withAsyncContext(() => useOrderDetails(props.orderId)), __temp = await __temp, __restore(), __temp);
    const { addProducts, count } = useCart();
    const addingProducts = ref(false);
    const lineItems = computed(
      () => order.value?.lineItems || []
    );
    const selectedPaymentMethod = computed({
      get() {
        return paymentMethod.value?.id || "";
      },
      async set(paymentMethodId) {
        isLoading.value = true;
        try {
          await changePaymentMethod(paymentMethodId);
          pushSuccess(t("account.messages.paymentMethodChanged"));
        } catch (error) {
          pushError(t("messages.error"));
        } finally {
          isLoading.value = false;
        }
      }
    });
    const paymentMethods = ([__temp, __restore] = withAsyncContext(() => getPaymentMethods()), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AccountOrderLineItem = __nuxt_component_0;
      const _component_AccountOrderDownloads = __nuxt_component_1;
      _push(`<!--[-->`);
      if (unref(paymentChangeable) && unref(statusTechnicalName) === "open") {
        _push(`<div class="px-2 py-4"><h3 class="mb-5 text-surface-on-surface text-base">${ssrInterpolate(_ctx.$t("account.order.paymentMethod"))}</h3><ul class="pl-2"><!--[-->`);
        ssrRenderList(unref(paymentMethods), (singlePaymentMethod) => {
          _push(`<li class="flex mb-3"><input${ssrRenderAttr("id", singlePaymentMethod.id)}${ssrIncludeBooleanAttr(ssrLooseEqual(unref(selectedPaymentMethod), singlePaymentMethod.id)) ? " checked" : ""}${ssrRenderAttr("value", singlePaymentMethod.id)} name="payment-method" type="radio" class="focus:ring-primary h-4 w-4 border-outline-outline"${ssrRenderAttr("data-testid", `checkout-payment-method-${singlePaymentMethod.id}`)}${ssrIncludeBooleanAttr(unref(selectedPaymentMethod) === singlePaymentMethod.id) ? " checked" : ""}${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""}><label${ssrRenderAttr("for", singlePaymentMethod.id)} class="ml-2 block text-sm font-medium text-secondary-700 w-full"><div class="flex justify-between"><div><span>${ssrInterpolate(singlePaymentMethod.translated.name)}</span>`);
          if (singlePaymentMethod.translated.description) {
            _push(`<span class="italic text-sm text-secondary-500 block">${ssrInterpolate(singlePaymentMethod.translated.description)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></label></li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(lineItems).length) {
        _push(`<div class="px-2 py-4"><div class="hidden sm:grid grid-cols-5 gap-y-10 gap-x-6 pb-4 text-surface-on-surface"><div class="col-span-2">${ssrInterpolate(_ctx.$t("account.order.product"))}</div><div>${ssrInterpolate(_ctx.$t("account.order.quantity"))}</div><div>${ssrInterpolate(_ctx.$t("account.order.price"))}</div><div class="justify-self-end">${ssrInterpolate(_ctx.$t("account.order.subtotal"))}</div></div><!--[-->`);
        ssrRenderList(unref(lineItems), (lineItem) => {
          _push(ssrRenderComponent(_component_AccountOrderLineItem, {
            key: lineItem.identifier,
            "line-item": lineItem
          }, null, _parent));
        });
        _push(`<!--]-->`);
        if (unref(hasDocuments)) {
          _push(ssrRenderComponent(_component_AccountOrderDownloads, { documents: unref(documents) }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="mt-10 p-3" data-testid="order-repeat-button"${ssrIncludeBooleanAttr(unref(addingProducts)) ? " disabled" : ""}>${ssrInterpolate(_ctx.$t("account.order.repeatOrder"))}</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/order/Details.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Details = Object.assign(_sfc_main, { __name: "AccountOrderDetails" });

export { Details as default };
