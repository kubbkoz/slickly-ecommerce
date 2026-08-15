import __nuxt_component_1 from './DropdownField-DTfEBMIB.mjs';
import { defineComponent, useModel, computed, mergeProps, unref, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { u as useCountries } from './useCountries-DcMVa9Fw.mjs';
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
  __name: "CountryStateInput",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    countryIdValidation: { default: () => void 0 },
    stateIdValidation: { default: () => void 0 }
  }, {
    "countryId": {
      required: true
    },
    "countryIdModifiers": {},
    "stateId": {
      required: true
    },
    "stateIdModifiers": {}
  }),
  emits: ["update:countryId", "update:stateId"],
  setup(__props) {
    const countryId = useModel(__props, "countryId");
    const stateId = useModel(__props, "stateId");
    const { getStatesForCountry, getCountriesOptions } = useCountries();
    const states = computed(() => getStatesForCountry(countryId.value || ""));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormDropdownField = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex gap-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_FormDropdownField, {
        class: "w-full",
        id: "country",
        modelValue: countryId.value,
        "onUpdate:modelValue": ($event) => countryId.value = $event,
        label: _ctx.$t("form.country"),
        options: unref(getCountriesOptions),
        "data-testid": "country-select",
        errorMessage: __props.countryIdValidation?.$errors[0]
      }, null, _parent));
      if (unref(states) && unref(states).length) {
        _push(`<div class="w-full"><label for="state" class="block text-sm font-medium text-secondary-700">${ssrInterpolate(_ctx.$t("form.state"))}</label><select id="state" required name="state" autocomplete="off" class="mt-1 block w-full p-2.5 border border-secondary-300 text-secondary-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-light" data-testid="checkout-pi-state-input"><option disabled selected value="">${ssrInterpolate(_ctx.$t("form.chooseState"))}</option><!--[-->`);
        ssrRenderList(unref(states), (state) => {
          _push(`<option${ssrRenderAttr("value", state.id)}${ssrIncludeBooleanAttr(Array.isArray(stateId.value) ? ssrLooseContain(stateId.value, state.id) : ssrLooseEqual(stateId.value, state.id)) ? " selected" : ""}>${ssrInterpolate(state.name)}</option>`);
        });
        _push(`<!--]--></select>`);
        if (__props.stateIdValidation?.$error && __props.stateIdValidation?.$errors[0]) {
          _push(`<span class="pt-1 text-sm text-red-600 focus:ring-primary border-secondary-300">${ssrInterpolate(__props.stateIdValidation.$errors[0])}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/shared/CountryStateInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "SharedCountryStateInput" });

export { __nuxt_component_2 as default };
