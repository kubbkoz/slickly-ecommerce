import __nuxt_component_0 from './RadioButton-Bx0xOWZ0.mjs';
import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, useModel, mergeProps, unref, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { getPaymentMethodIcon } from '@shopware/helpers';
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
import './server.mjs';
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
  __name: "PaymentMethods",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    paymentMethods: {}
  }, {
    "selectedPaymentMethod": {
      required: true
    },
    "selectedPaymentMethodModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["change"], ["update:selectedPaymentMethod"]),
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const selectedPaymentMethod = useModel(
      __props,
      "selectedPaymentMethod"
    );
    function handleChange(id) {
      emit("change", id);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormRadioButton = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "border border-outline-outline divide-y-1 divide-outline-outline" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.paymentMethods, (paymentMethod) => {
        _push(`<div class="p-4"><label${ssrRenderAttr("for", paymentMethod.id)} class="flex items-center gap-4"><div>`);
        _push(ssrRenderComponent(_component_FormRadioButton, {
          selected: selectedPaymentMethod.value === paymentMethod.id,
          id: paymentMethod.id,
          value: paymentMethod.id,
          name: "payment-method",
          modelValue: selectedPaymentMethod.value,
          "onUpdate:modelValue": ($event) => selectedPaymentMethod.value = $event,
          onChange: ($event) => handleChange(paymentMethod.id)
        }, null, _parent));
        _push(`</div><div><div class="text-surface-on-surface">${ssrInterpolate(paymentMethod.translated.name)}</div>`);
        if (paymentMethod.description) {
          _push(`<div class="self-stretch text-surface-on-surface-variant text-sm leading-[21px]">${ssrInterpolate(paymentMethod.description)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="ml-auto">`);
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: unref(getPaymentMethodIcon)(paymentMethod),
          height: "32"
        }, null, _parent));
        _push(`</div></label></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/checkout/PaymentMethods.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PaymentMethods = Object.assign(_sfc_main, { __name: "CheckoutPaymentMethods" });

export { PaymentMethods as default };
