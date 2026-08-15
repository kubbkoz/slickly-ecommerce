import __nuxt_component_0 from './AccountTypeSelect-WWW-q77x.mjs';
import __nuxt_component_0$1 from './InputField-D300m7hz.mjs';
import __nuxt_component_2 from './CountryStateInput-f0sWk9zO.mjs';
import __nuxt_component_1 from './BaseButton-CtNN_2CK.mjs';
import { defineComponent, ref, useTemplateRef, watch, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { useRegle } from '@regle/core';
import { f as useUser, c as useRouter, m as useI18n, n as navigateTo } from './server.mjs';
import { u as useApiErrorsResolver } from './useApiErrorsResolver-BfHgRTVy.mjs';
import { u as useCountries } from './useCountries-DcMVa9Fw.mjs';
import { c as customValidators } from './i18n-validators-CFSHkMK2.mjs';
import { u as useBreadcrumbs } from './useBreadcrumbs-Dt7IBWvA.mjs';
import './DropdownField-DTfEBMIB.mjs';
import './BaseDropdown-DnldUMz4.mjs';
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
import '@regle/rules';

function registrationFormRules(accountType, countryId) {
  const { required, minLength, email, requiredIf } = customValidators();
  const { getStatesForCountry } = useCountries();
  return computed(() => ({
    accountType: {
      required
    },
    firstName: {
      required,
      minLength: minLength(3)
    },
    lastName: {
      required,
      minLength: minLength(3)
    },
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(8)
    },
    billingAddress: {
      company: {
        required: requiredIf(() => unref(accountType) === "business")
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
          return !!getStatesForCountry(unref(countryId))?.length;
        })
      }
    }
  }));
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "RegistrationForm",
  __ssrInlineRender: true,
  props: {
    customerGroupId: {}
  },
  setup(__props) {
    const props = __props;
    const { isLoggedIn } = useUser();
    useApiErrorsResolver("account_registration_form");
    useRouter();
    ref();
    useTemplateRef("doubleOptInBox");
    const showDoubleOptInBox = ref(false);
    const { t } = useI18n();
    watch(isLoggedIn, (isLoggedIn2) => {
      if (isLoggedIn2) {
        navigateTo({ path: "/account" });
      }
    });
    const initialState = {
      requestedGroupId: props.customerGroupId,
      accountType: "private",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      vatIds: [""],
      billingAddress: {
        company: "",
        street: "",
        zipcode: "",
        city: "",
        countryId: "",
        countryStateId: ""
      },
      acceptedDataProtection: true
    };
    const state = reactive(
      JSON.parse(JSON.stringify(initialState))
    );
    const { r$ } = useRegle(
      state,
      registrationFormRules(
        computed(() => state.accountType),
        computed(() => state.billingAddress.countryId)
      )
    );
    useBreadcrumbs([
      {
        name: t("breadcrumbs.register"),
        path: "/register"
      }
    ]);
    [
      {
        label: t("form.accountType.private"),
        value: "private"
      },
      {
        label: t("form.accountType.business"),
        value: "business"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormAccountTypeSelect = __nuxt_component_0;
      const _component_FormInputField = __nuxt_component_0$1;
      const _component_SharedCountryStateInput = __nuxt_component_2;
      const _component_FormBaseButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-screen-xl mx-auto px-6 sm:px-4" }, _attrs))}>`);
      if (unref(showDoubleOptInBox)) {
        _push(`<div class="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 mb-4">${ssrInterpolate(_ctx.$t("account.messages.signUpSuccess"))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="w-full relative mt-10" data-testid="registration-form"><h3 class="block border-b-1 mb-5 pb-2 font-bold">${ssrInterpolate(_ctx.$t("account.signUpHeader"))}</h3><div class="grid grid-cols-12 gap-5 mb-10">`);
      _push(ssrRenderComponent(_component_FormAccountTypeSelect, {
        class: "col-span-12",
        modelValue: unref(state).accountType,
        "onUpdate:modelValue": ($event) => unref(state).accountType = $event,
        dataTestId: "registration-account-type-select",
        id: "accountType"
      }, null, _parent));
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "col-span-12 md:col-span-4",
        id: "firstName",
        modelValue: unref(state).firstName,
        "onUpdate:modelValue": ($event) => unref(state).firstName = $event,
        autocomplete: "firstName",
        label: _ctx.$t("form.firstName"),
        errorMessage: unref(r$).firstName.$errors[0],
        onBlur: ($event) => unref(r$).firstName.$touch(),
        "data-testid": "registration-first-name-input"
      }, null, _parent));
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "col-span-12 md:col-span-4",
        id: "lastName",
        modelValue: unref(state).lastName,
        "onUpdate:modelValue": ($event) => unref(state).lastName = $event,
        autocomplete: "family-name",
        label: _ctx.$t("form.lastName"),
        errorMessage: unref(r$).lastName.$errors[0],
        onBlur: ($event) => unref(r$).lastName.$touch(),
        "data-testid": "registration-last-name-input"
      }, null, _parent));
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "col-span-12 md:col-span-6",
        id: "emailAddress",
        modelValue: unref(state).email,
        "onUpdate:modelValue": ($event) => unref(state).email = $event,
        autocomplete: "email",
        label: _ctx.$t("form.email"),
        errorMessage: unref(r$).email.$errors[0],
        onBlur: ($event) => unref(r$).email.$touch(),
        "data-testid": "registration-email-input"
      }, null, _parent));
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "col-span-12 md:col-span-4",
        id: "password",
        modelValue: unref(state).password,
        "onUpdate:modelValue": ($event) => unref(state).password = $event,
        autocomplete: "current-password",
        type: "password",
        label: _ctx.$t("form.password"),
        errorMessage: unref(r$).password.$errors[0],
        onBlur: ($event) => unref(r$).password.$touch(),
        "data-testid": "registration-password-input"
      }, null, _parent));
      if (unref(state).accountType === "business") {
        _push(ssrRenderComponent(_component_FormInputField, {
          class: "col-span-12 md:col-span-4",
          id: "vatId",
          modelValue: unref(state).vatIds[0],
          "onUpdate:modelValue": ($event) => unref(state).vatIds[0] = $event,
          label: _ctx.$t("form.vatId"),
          onBlur: ($event) => unref(r$).vatIds.$touch(),
          "data-testid": "registration-vatid-input"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><h3 class="block border-b-1 mb-5 pb-2 font-bold">${ssrInterpolate(_ctx.$t("account.yourAddress"))}</h3><div class="grid grid-cols-12 gap-5 mb-5">`);
      if (unref(state).accountType === "business") {
        _push(ssrRenderComponent(_component_FormInputField, {
          class: "col-span-12 md:col-span-4",
          id: "company",
          modelValue: unref(state).billingAddress.company,
          "onUpdate:modelValue": ($event) => unref(state).billingAddress.company = $event,
          autocomplete: "company",
          label: _ctx.$t("form.company"),
          "data-testid": "registration-company-input",
          onBlur: ($event) => unref(r$).billingAddress.company.$touch(),
          errorMessage: unref(r$).billingAddress.company.$errors[0]
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "col-span-12 md:col-span-4",
        id: "street",
        modelValue: unref(state).billingAddress.street,
        "onUpdate:modelValue": ($event) => unref(state).billingAddress.street = $event,
        autocomplete: "street-address",
        label: _ctx.$t("form.streetAddress"),
        "data-testid": "registration-street-input",
        onBlur: ($event) => unref(r$).billingAddress.street.$touch(),
        errorMessage: unref(r$).billingAddress.street.$errors[0]
      }, null, _parent));
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "col-span-12 md:col-span-4",
        label: _ctx.$t("form.postalCode"),
        id: "zipcode",
        modelValue: unref(state).billingAddress.zipcode,
        "onUpdate:modelValue": ($event) => unref(state).billingAddress.zipcode = $event,
        autocomplete: "postal-code",
        "data-testid": "registration-zipcode-input",
        onBlur: ($event) => unref(r$).billingAddress.zipcode.$touch(),
        errorMessage: unref(r$).billingAddress.zipcode.$errors[0]
      }, null, _parent));
      _push(ssrRenderComponent(_component_FormInputField, {
        class: "col-span-12 md:col-span-4",
        label: _ctx.$t("form.city"),
        id: "city",
        modelValue: unref(state).billingAddress.city,
        "onUpdate:modelValue": ($event) => unref(state).billingAddress.city = $event,
        autocomplete: "address-level2",
        "data-testid": "registration-city-input",
        onBlur: ($event) => unref(r$).billingAddress.city.$touch(),
        errorMessage: unref(r$).billingAddress.city.$errors[0]
      }, null, _parent));
      _push(ssrRenderComponent(_component_SharedCountryStateInput, {
        "country-id": unref(state).billingAddress.countryId,
        "onUpdate:countryId": ($event) => unref(state).billingAddress.countryId = $event,
        "state-id": unref(state).billingAddress.countryStateId,
        "onUpdate:stateId": ($event) => unref(state).billingAddress.countryStateId = $event,
        "country-id-validation": unref(r$).billingAddress.countryId,
        "state-id-validation": unref(r$).billingAddress.countryStateId,
        class: "col-span-12 md:col-span-4"
      }, null, _parent));
      _push(`</div><div class="mb-5 text-right">`);
      _push(ssrRenderComponent(_component_FormBaseButton, {
        label: _ctx.$t("form.submit"),
        type: "submit",
        "data-testid": "registration-submit-button"
      }, null, _parent));
      _push(`</div></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/RegistrationForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RegistrationForm = Object.assign(_sfc_main, { __name: "AccountRegistrationForm" });

export { RegistrationForm as default };
