import __nuxt_component_0 from './SalutationSelect-CT4DLAVC.mjs';
import __nuxt_component_0$1 from './AccountTypeSelect-WWW-q77x.mjs';
import __nuxt_component_0$2 from './InputField-D300m7hz.mjs';
import __nuxt_component_1 from './BaseButton-CtNN_2CK.mjs';
import { defineComponent, useModel, mergeProps, withCtx, createTextVNode, toDisplayString, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import './DropdownField-DTfEBMIB.mjs';
import './BaseDropdown-DnldUMz4.mjs';
import './server.mjs';
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
import './BaseInput-Bd1YNFpA.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DataForm",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    validation: { default: () => void 0 }
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["submit"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const AccountType = {
      business: "business"
    };
    const state = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormSalutationSelect = __nuxt_component_0;
      const _component_FormAccountTypeSelect = __nuxt_component_0$1;
      const _component_FormInputField = __nuxt_component_0$2;
      const _component_FormBaseButton = __nuxt_component_1;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-4" }, _attrs))}><div class="w-[240px]">`);
      _push(ssrRenderComponent(_component_FormSalutationSelect, {
        modelValue: state.value.salutationId,
        "onUpdate:modelValue": ($event) => state.value.salutationId = $event,
        errorMessage: __props.validation?.salutationId?.$errors[0]
      }, null, _parent));
      _push(`</div><div class="w-[240px]">`);
      _push(ssrRenderComponent(_component_FormAccountTypeSelect, {
        modelValue: state.value.accountType,
        "onUpdate:modelValue": ($event) => state.value.accountType = $event,
        errorMessage: __props.validation?.accountType?.$errors[0]
      }, null, _parent));
      _push(`</div><div class="flex-col md:flex-row flex gap-2">`);
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "w-full",
        modelValue: state.value.firstName,
        "onUpdate:modelValue": ($event) => state.value.firstName = $event,
        label: _ctx.$t("account.profile.form.firstName"),
        errorMessage: __props.validation?.firstName?.$errors[0]
      }, null, _parent));
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "w-full",
        modelValue: state.value.lastName,
        "onUpdate:modelValue": ($event) => state.value.lastName = $event,
        label: _ctx.$t("account.profile.form.lastName"),
        errorMessage: __props.validation?.lastName?.$errors[0]
      }, null, _parent));
      _push(`</div>`);
      if (state.value.accountType === AccountType.business) {
        _push(`<div class="flex-col md:flex-row flex gap-2">`);
        _push(ssrRenderComponent(_component_FormInputField, {
          class: "w-full",
          modelValue: state.value.company,
          "onUpdate:modelValue": ($event) => state.value.company = $event,
          label: _ctx.$t("account.profile.form.company"),
          errorMessage: __props.validation?.company?.$errors[0]
        }, null, _parent));
        _push(ssrRenderComponent(_component_FormInputField, {
          class: "w-full",
          modelValue: state.value.vatIds,
          "onUpdate:modelValue": ($event) => state.value.vatIds = $event,
          label: _ctx.$t("account.profile.form.vatIds"),
          errorMessage: __props.validation?.vatIds?.$errors[0]
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_FormBaseButton, { type: "submit" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("account.profile.form.buttonSubmit"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$t("account.profile.form.buttonSubmit")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/personal/DataForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "AccountPersonalDataForm" });

export { __nuxt_component_3 as default };
