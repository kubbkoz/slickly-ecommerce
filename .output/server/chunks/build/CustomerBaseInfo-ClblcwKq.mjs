import __nuxt_component_0 from './InputField-D300m7hz.mjs';
import __nuxt_component_10 from './LinkButton-CTjOSiub.mjs';
import __nuxt_component_1 from './index-DKA3nfTy.mjs';
import { defineComponent, useModel, ref, unref, withCtx, createVNode, toDisplayString, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import './BaseInput-Bd1YNFpA.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CustomerBaseInfo",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    errorMessages: {}
  }, {
    "email": {
      required: true
    },
    "emailModifiers": {},
    "password": {
      required: true
    },
    "passwordModifiers": {}
  }),
  emits: ["update:email", "update:password"],
  setup(__props) {
    const email = useModel(__props, "email");
    const password = useModel(__props, "password");
    const switchAnimating = ref(false);
    const createAccountToggle = ref(false);
    function switchAnimation(e) {
      e.preventDefault();
      switchAnimating.value = true;
      setTimeout(() => {
        createAccountToggle.value = true;
        switchAnimating.value = false;
      }, 600);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormInputField = __nuxt_component_0;
      const _component_FormLinkButton = __nuxt_component_10;
      const _component_Icon = __nuxt_component_1;
      _push(`<form${ssrRenderAttrs(_attrs)} data-v-173363a0><div data-v-173363a0>`);
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "mb-4",
        modelValue: email.value,
        "onUpdate:modelValue": ($event) => email.value = $event,
        id: "email",
        label: _ctx.$t("checkout.customerBaseInfo.emailLabel"),
        placeholder: _ctx.$t("checkout.customerBaseInfo.emailPlaceholder"),
        errorMessage: __props.errorMessages?.value?.email?.$errors?.[0] ?? ""
      }, null, _parent));
      _push(`<div class="${ssrRenderClass([{
        "h-4": !unref(createAccountToggle) && !unref(switchAnimating),
        "h-15": unref(switchAnimating) || unref(createAccountToggle)
      }, "relative transition-all"])}" data-v-173363a0>`);
      if (!unref(createAccountToggle)) {
        _push(`<div class="${ssrRenderClass([{ "animate-slide-up-out": unref(switchAnimating) }, "flex items-center gap-2 absolute"])}" data-v-173363a0>`);
        _push(ssrRenderComponent(_component_FormLinkButton, {
          class: "border-b-0 text-sm",
          onClick: switchAnimation
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Icon, {
                name: "shopware:plus-xs",
                class: "color-brand-primary"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-brand-primary" data-v-173363a0${_scopeId}>${ssrInterpolate(_ctx.$t("checkout.customerBaseInfo.createAccountToggleLabel"))}</span>`);
            } else {
              return [
                createVNode(_component_Icon, {
                  name: "shopware:plus-xs",
                  class: "color-brand-primary"
                }),
                createVNode("span", { class: "text-brand-primary" }, toDisplayString(_ctx.$t("checkout.customerBaseInfo.createAccountToggleLabel")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([{
        "opacity-0": !unref(createAccountToggle) && unref(switchAnimating),
        "animate-slide-up-in": unref(switchAnimating)
      }, "absolute w-full"])}" style="${ssrRenderStyle(unref(createAccountToggle) || unref(switchAnimating) ? null : { display: "none" })}" data-v-173363a0>`);
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "mb-4",
        modelValue: password.value,
        "onUpdate:modelValue": ($event) => password.value = $event,
        id: "password",
        type: "password",
        label: _ctx.$t("checkout.customerBaseInfo.passwordLabel"),
        placeholder: _ctx.$t("checkout.customerBaseInfo.passwordPlaceholder"),
        errorMessage: __props.errorMessages?.value?.password?.$errors?.[0] ?? ""
      }, null, _parent));
      _push(`</div></div></div></form>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/checkout/CustomerBaseInfo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CustomerBaseInfo = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-173363a0"]]), { __name: "CheckoutCustomerBaseInfo" });

export { CustomerBaseInfo as default };
