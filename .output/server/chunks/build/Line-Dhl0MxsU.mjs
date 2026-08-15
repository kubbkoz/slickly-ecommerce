import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import __nuxt_component_3 from './Status-BPwYdPy_.mjs';
import __nuxt_component_2$1 from './LineData-GQG9oQnE.mjs';
import __nuxt_component_3$1 from './Product-CxGE2cGw.mjs';
import __nuxt_component_3$2 from './Price-D7PucwgC.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc, b as useLocalePath, M as useInternationalization, m as useI18n } from './server.mjs';
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
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import '@shopware/helpers';
import './usePrice-CDJKOx8c.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Line",
  __ssrInlineRender: true,
  props: {
    order: {}
  },
  setup(__props) {
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    const products = computed(
      () => __props.order.lineItems?.filter((element) => element.type === "product") ?? []
    );
    const showAllProducts = ref(false);
    const { t } = useI18n();
    const displayedProducts = computed(() => {
      return showAllProducts.value ? products.value : [];
    });
    const hasProducts = computed(() => products.value.length > 0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_AccountOrderStatus = __nuxt_component_3;
      const _component_AccountOrderLineData = __nuxt_component_2$1;
      const _component_AccountOrderProduct = __nuxt_component_3$1;
      const _component_SharedPrice = __nuxt_component_3$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "border border-outline-outline p4" }, _attrs))} data-v-f3edd07e><div class="flex justify-between pb-2 border-b border-outline-outline" data-v-f3edd07e>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(formatLink)(`/account/order/details/${__props.order.id}`)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="font-bold" data-v-f3edd07e${_scopeId}>${ssrInterpolate(unref(t)("account.order.orderLabel"))}: ${ssrInterpolate(__props.order.orderNumber)}</div>`);
          } else {
            return [
              createVNode("div", { class: "font-bold" }, toDisplayString(unref(t)("account.order.orderLabel")) + ": " + toDisplayString(__props.order.orderNumber), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.order.stateMachineState) {
        _push(ssrRenderComponent(_component_AccountOrderStatus, {
          state: __props.order.stateMachineState
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-4 flex flex-row w-full" data-v-f3edd07e>`);
      if (__props.order.orderNumber) {
        _push(ssrRenderComponent(_component_AccountOrderLineData, {
          class: "flex-1",
          label: unref(t)("account.order.orderNumber"),
          value: __props.order.orderNumber
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_AccountOrderLineData, {
        class: "flex-1",
        label: unref(t)("account.order.shippingStatus"),
        value: __props.order.stateMachineState.name
      }, null, _parent));
      if (__props.order.transactions?.[0]) {
        _push(ssrRenderComponent(_component_AccountOrderLineData, {
          class: "flex-1",
          label: unref(t)("account.order.paymentMethod"),
          value: __props.order.transactions[0].paymentMethod?.translated.name ?? ""
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (__props.order.deliveries?.[0]) {
        _push(ssrRenderComponent(_component_AccountOrderLineData, {
          class: "flex-1",
          label: unref(t)("account.order.shippingMethod"),
          value: __props.order.deliveries[0].shippingMethod?.translated.name ?? ""
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(hasProducts)) {
        _push(`<div class="mt-4 mb-2" data-v-f3edd07e><button class="text-brand-primary border-b border-brand-primary inline-flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer bg-transparent text-sm" data-v-f3edd07e><span data-v-f3edd07e>${ssrInterpolate(unref(showAllProducts) ? unref(t)("account.order.seeLess") : unref(t)("account.order.seeMore"))}</span><div class="${ssrRenderClass([{ "rotate-180": unref(showAllProducts) }, "w-4 h-4 i-carbon-chevron-down transition-transform duration-300 ease-in-out"])}" data-v-f3edd07e></div></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-4 overflow-hidden" data-v-f3edd07e><div${ssrRenderAttrs({
        name: "product",
        class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full"
      })} data-v-f3edd07e>`);
      ssrRenderList(unref(displayedProducts), (lineItem, index) => {
        _push(ssrRenderComponent(_component_AccountOrderProduct, {
          key: lineItem.id,
          "line-item": lineItem,
          style: { "--index": index }
        }, null, _parent));
      });
      _push(`</div></div><div class="mt-4" data-v-f3edd07e><div class="flex justify-between" data-v-f3edd07e><div class="text-sm text-surface-on-surface-variant" data-v-f3edd07e>${ssrInterpolate(unref(t)("account.order.subtotal"))}</div><div data-v-f3edd07e>`);
      _push(ssrRenderComponent(_component_SharedPrice, {
        class: "text-surface-on-surface text-sm",
        value: __props.order.amountTotal
      }, null, _parent));
      _push(`</div></div><div class="flex justify-between" data-v-f3edd07e><div class="text-sm text-surface-on-surface-variant" data-v-f3edd07e>${ssrInterpolate(unref(t)("account.order.shipping"))}</div><div data-v-f3edd07e>`);
      _push(ssrRenderComponent(_component_SharedPrice, {
        class: "text-surface-on-surface text-sm",
        value: __props.order.shippingTotal
      }, null, _parent));
      _push(`</div></div><div class="border-t border-outline-outline-variant pt-2 mt-2 flex justify-between" data-v-f3edd07e><div class="text-surface-on-surface" data-v-f3edd07e>${ssrInterpolate(unref(t)("account.order.total"))}</div><div data-v-f3edd07e>`);
      _push(ssrRenderComponent(_component_SharedPrice, {
        class: "text-surface-on-surface",
        value: __props.order.amountTotal
      }, null, _parent));
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/order/Line.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-f3edd07e"]]), { __name: "AccountOrderLine" });

export { __nuxt_component_2 as default };
