import __nuxt_component_0 from './InputField-D300m7hz.mjs';
import __nuxt_component_1 from './DropdownField-DTfEBMIB.mjs';
import { defineComponent, useModel, mergeProps, unref, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useCountries } from './useCountries-DcMVa9Fw.mjs';
import './BaseInput-Bd1YNFpA.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CustomerAddress",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    errorMessages: {}
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const state = useModel(__props, "modelValue");
    const { getCountriesOptions } = useCountries();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormInputField = __nuxt_component_0;
      const _component_FormDropdownField = __nuxt_component_1;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-4" }, _attrs))}><div class="flex gap-4">`);
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "basis-1/2",
        modelValue: state.value.firstName,
        "onUpdate:modelValue": ($event) => state.value.firstName = $event,
        id: "first-name",
        label: _ctx.$t("checkout.customerAddress.firstNameLabel"),
        placeholder: _ctx.$t("checkout.customerAddress.firstNamePlaceholder"),
        errorMessage: __props.errorMessages?.value?.firstName?.$errors?.[0] ?? ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "basis-1/2",
        modelValue: state.value.lastName,
        "onUpdate:modelValue": ($event) => state.value.lastName = $event,
        id: "last-name",
        label: _ctx.$t("checkout.customerAddress.lastNameLabel"),
        placeholder: _ctx.$t("checkout.customerAddress.lastNamePlaceholder"),
        errorMessage: __props.errorMessages?.value?.lastName?.$errors?.[0] ?? ""
      }, null, _parent));
      _push(`</div><div>`);
      _push(ssrRenderComponent(_component_FormInputField, {
        modelValue: state.value.street,
        "onUpdate:modelValue": ($event) => state.value.street = $event,
        id: "street",
        label: _ctx.$t("checkout.customerAddress.streetLabel"),
        placeholder: _ctx.$t("checkout.customerAddress.streetPlaceholder"),
        errorMessage: __props.errorMessages?.value?.street?.$errors?.[0] ?? ""
      }, null, _parent));
      _push(`</div><div class="flex gap-4">`);
      if (state.value.zipcode !== void 0) {
        _push(ssrRenderComponent(_component_FormInputField, {
          class: "basis-1/2",
          modelValue: state.value.zipcode,
          "onUpdate:modelValue": ($event) => state.value.zipcode = $event,
          id: "zipcode",
          label: _ctx.$t("checkout.customerAddress.zipcodeLabel"),
          placeholder: _ctx.$t("checkout.customerAddress.zipcodePlaceholder"),
          errorMessage: __props.errorMessages?.value?.zipcode?.$errors?.[0] ?? ""
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "basis-1/2",
        modelValue: state.value.city,
        "onUpdate:modelValue": ($event) => state.value.city = $event,
        id: "city",
        label: _ctx.$t("checkout.customerAddress.cityLabel"),
        placeholder: _ctx.$t("checkout.customerAddress.cityPlaceholder"),
        errorMessage: __props.errorMessages?.value?.city?.$errors?.[0] ?? ""
      }, null, _parent));
      _push(`</div><div>`);
      _push(ssrRenderComponent(_component_FormDropdownField, {
        id: "country",
        modelValue: state.value.countryId,
        "onUpdate:modelValue": ($event) => state.value.countryId = $event,
        label: _ctx.$t("checkout.customerAddress.countryLabel"),
        placeholder: _ctx.$t("checkout.customerAddress.countryPlaceholder"),
        options: unref(getCountriesOptions),
        errorMessage: __props.errorMessages?.value?.countryId?.$errors?.[0] ?? ""
      }, null, _parent));
      _push(`</div></form>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/checkout/CustomerAddress.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CustomerAddress = Object.assign(_sfc_main, { __name: "CheckoutCustomerAddress" });

export { CustomerAddress as default };
