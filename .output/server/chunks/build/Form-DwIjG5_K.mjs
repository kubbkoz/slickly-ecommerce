import __nuxt_component_0 from './SalutationSelect-CT4DLAVC.mjs';
import __nuxt_component_0$1 from './InputField-D300m7hz.mjs';
import __nuxt_component_2 from './CountryStateInput-f0sWk9zO.mjs';
import __nuxt_component_1 from './BaseButton-CtNN_2CK.mjs';
import { defineComponent, ref, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { useRegle } from '@regle/core';
import { u as useCountries } from './useCountries-DcMVa9Fw.mjs';
import { c as customValidators } from './i18n-validators-CFSHkMK2.mjs';
import { m as useI18n, b as useLocalePath, M as useInternationalization, c as useRouter } from './server.mjs';
import './DropdownField-DTfEBMIB.mjs';
import './BaseDropdown-DnldUMz4.mjs';
import './BaseInput-Bd1YNFpA.mjs';
import '@regle/rules';
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

function addressFormRules(state) {
  const { required, minLength, requiredIf } = customValidators();
  const { getStatesForCountry } = useCountries();
  return computed(() => ({
    salutationId: {
      required
    },
    firstName: {
      required,
      minLength: minLength(2)
    },
    lastName: {
      required,
      minLength: minLength(2)
    },
    street: {
      required,
      minLength: minLength(3)
    },
    zipcode: {
      required
    },
    city: {
      required
    },
    countryId: {
      required
    },
    countryStateId: {
      required: requiredIf(() => {
        return !!getStatesForCountry(state.value.countryId)?.length;
      })
    }
  }));
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Form",
  __ssrInlineRender: true,
  props: {
    address: {}
  },
  emits: ["handleSubmit"],
  setup(__props, { emit: __emit }) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    const props = __props;
    const router = useRouter();
    const state = ref({
      firstName: "",
      lastName: "",
      salutationId: "",
      company: "",
      street: "",
      zipcode: "",
      city: "",
      countryId: "",
      countryStateId: ""
    });
    function populateStateFromAddress(address) {
      Object.assign(state.value, address);
    }
    watch(
      () => props.address,
      (newAddress) => {
        if (newAddress) {
          populateStateFromAddress(newAddress);
        }
      },
      { immediate: true }
    );
    const { r$ } = useRegle(state, addressFormRules(state));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormSalutationSelect = __nuxt_component_0;
      const _component_FormInputField = __nuxt_component_0$1;
      const _component_SharedCountryStateInput = __nuxt_component_2;
      const _component_FormBaseButton = __nuxt_component_1;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_FormSalutationSelect, {
        modelValue: unref(state).salutationId,
        "onUpdate:modelValue": ($event) => unref(state).salutationId = $event,
        id: "salutation",
        errorMessage: unref(r$).salutationId.$errors[0]
      }, null, _parent));
      _push(`<div class="flex gap-4">`);
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "basis-1/2",
        modelValue: unref(state).firstName,
        "onUpdate:modelValue": ($event) => unref(state).firstName = $event,
        id: "first-name",
        label: _ctx.$t("form.firstName"),
        placeholder: _ctx.$t("form.firstNamePlaceholder"),
        errorMessage: unref(r$).firstName.$errors[0]
      }, null, _parent));
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "basis-1/2",
        modelValue: unref(state).lastName,
        "onUpdate:modelValue": ($event) => unref(state).lastName = $event,
        id: "last-name",
        label: _ctx.$t("form.lastName"),
        placeholder: _ctx.$t("form.lastNamePlaceholder"),
        errorMessage: unref(r$).lastName.$errors[0]
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_FormInputField, {
        modelValue: unref(state).street,
        "onUpdate:modelValue": ($event) => unref(state).street = $event,
        id: "street",
        label: _ctx.$t("form.streetAddress"),
        placeholder: _ctx.$t("form.streetPlaceholder"),
        errorMessage: unref(r$).street.$errors[0]
      }, null, _parent));
      _push(`<div class="flex gap-4">`);
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "basis-1/2",
        modelValue: unref(state).zipcode,
        "onUpdate:modelValue": ($event) => unref(state).zipcode = $event,
        id: "zipcode",
        label: _ctx.$t("form.postalCode"),
        placeholder: _ctx.$t("form.postalCodePlaceholder"),
        errorMessage: unref(r$).zipcode.$errors[0]
      }, null, _parent));
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "basis-1/2",
        modelValue: unref(state).city,
        "onUpdate:modelValue": ($event) => unref(state).city = $event,
        id: "city",
        label: _ctx.$t("form.city"),
        placeholder: _ctx.$t("form.cityPlaceholder"),
        errorMessage: unref(r$).city.$errors[0]
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_SharedCountryStateInput, {
        "country-id": unref(state).countryId,
        "onUpdate:countryId": ($event) => unref(state).countryId = $event,
        "state-id": unref(state).countryStateId,
        "onUpdate:stateId": ($event) => unref(state).countryStateId = $event,
        "country-id-validation": unref(r$).countryId,
        "state-id-validation": unref(r$).countryStateId
      }, null, _parent));
      _push(`<p class="text-sm text-surface-on-surface-variant">${ssrInterpolate(_ctx.$t("form.requiredFieldsNote"))}</p><div class="flex gap-4 mt-6">`);
      _push(ssrRenderComponent(_component_FormBaseButton, {
        type: "submit",
        variant: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("account.address.saveButton"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$t("account.address.saveButton")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_FormBaseButton, {
        type: "button",
        variant: "secondary",
        onClick: ($event) => unref(router).push(unref(formatLink)("/account/address"))
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("form.cancel"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$t("form.cancel")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/address/Form.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "AccountAddressForm" });

export { __nuxt_component_3 as default };
