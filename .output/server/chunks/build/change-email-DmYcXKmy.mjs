import { m as useI18n, e as useShopwareContext, K as useNotifications, c as useRouter, b as useLocalePath, M as useInternationalization, L as __nuxt_component_0 } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-B7B0pxEe.mjs';
import __nuxt_component_0$2 from './PageHeader-CHrO2U4n.mjs';
import __nuxt_component_3 from './SectionHeader-DyYH6NEM.mjs';
import __nuxt_component_0$3 from './InputField-D300m7hz.mjs';
import __nuxt_component_1 from './BaseButton-CtNN_2CK.mjs';
import { defineComponent, ref, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, withModifiers, computed, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { useRegle } from '@regle/core';
import { u as useApiErrorsResolver } from './useApiErrorsResolver-BfHgRTVy.mjs';
import { c as customValidators } from './i18n-validators-CFSHkMK2.mjs';
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

function changeEmailFormRules(state) {
  const { required, email, sameAs } = customValidators();
  return {
    email: {
      required,
      email
    },
    emailConfirmation: {
      required,
      sameAs: sameAs(computed(() => state.value.email))
    },
    password: {
      required
    }
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "change-email",
  __ssrInlineRender: true,
  setup(__props) {
    const { t: $t } = useI18n();
    const { apiClient } = useShopwareContext();
    const { pushSuccess } = useNotifications();
    const router = useRouter();
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    const { handleApiError } = useApiErrorsResolver("account_change_email_form");
    const state = ref(
      {
        email: "",
        emailConfirmation: "",
        password: ""
      }
    );
    const { r$ } = useRegle(state, changeEmailFormRules(state));
    async function handleSubmit() {
      await r$.$validate();
      if (r$.$invalid) {
        return;
      }
      try {
        await apiClient.invoke("changeEmail post /account/change-email", {
          body: {
            email: state.value.email,
            emailConfirmation: state.value.emailConfirmation,
            password: state.value.password
          }
        });
        pushSuccess($t("account.changeEmail.form.successUpdate"));
        await router.push(formatLink("/account/profile"));
      } catch (error) {
        handleApiError(error);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_AccountPageHeader = __nuxt_component_0$2;
      const _component_AccountSectionHeader = __nuxt_component_3;
      const _component_FormInputField = __nuxt_component_0$3;
      const _component_FormBaseButton = __nuxt_component_1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "account" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-10"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              class: "text-sm inline-flex items-center gap-1 text-brand-primary bg-none bg-transparent",
              to: unref(formatLink)("/account/profile")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` &lt; ${ssrInterpolate(unref($t)("account.back"))}`);
                } else {
                  return [
                    createTextVNode(" < " + toDisplayString(unref($t)("account.back")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_AccountPageHeader, {
              class: "mb-14",
              title: unref($t)("account.changeEmail.header")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_AccountSectionHeader, {
              class: "mb-8",
              title: unref($t)("account.changeEmail.subHeader")
            }, null, _parent2, _scopeId));
            _push2(`<form class="flex flex-col gap-4 max-w-md"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormInputField, {
              id: "newEmail",
              modelValue: unref(state).email,
              "onUpdate:modelValue": ($event) => unref(state).email = $event,
              type: "email",
              label: unref($t)("account.changeEmail.form.newEmailLabel"),
              errorMessage: unref(r$).email.$errors[0],
              autocomplete: "off"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormInputField, {
              id: "confirmEmail",
              modelValue: unref(state).emailConfirmation,
              "onUpdate:modelValue": ($event) => unref(state).emailConfirmation = $event,
              type: "email",
              label: unref($t)("account.changeEmail.form.confirmEmailLabel"),
              errorMessage: unref(r$).emailConfirmation.$errors[0],
              autocomplete: "off"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormInputField, {
              id: "password",
              modelValue: unref(state).password,
              "onUpdate:modelValue": ($event) => unref(state).password = $event,
              type: "password",
              label: unref($t)("account.changeEmail.form.passwordLabel"),
              errorMessage: unref(r$).password.$errors[0],
              autocomplete: "current-password"
            }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormBaseButton, {
              label: unref($t)("account.changeEmail.form.buttonSubmit"),
              type: "submit"
            }, null, _parent2, _scopeId));
            _push2(`</div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "mb-10" }, [
                createVNode(_component_NuxtLink, {
                  class: "text-sm inline-flex items-center gap-1 text-brand-primary bg-none bg-transparent",
                  to: unref(formatLink)("/account/profile")
                }, {
                  default: withCtx(() => [
                    createTextVNode(" < " + toDisplayString(unref($t)("account.back")), 1)
                  ]),
                  _: 1
                }, 8, ["to"]),
                createVNode(_component_AccountPageHeader, {
                  class: "mb-14",
                  title: unref($t)("account.changeEmail.header")
                }, null, 8, ["title"]),
                createVNode(_component_AccountSectionHeader, {
                  class: "mb-8",
                  title: unref($t)("account.changeEmail.subHeader")
                }, null, 8, ["title"]),
                createVNode("form", {
                  onSubmit: withModifiers(handleSubmit, ["prevent"]),
                  class: "flex flex-col gap-4 max-w-md"
                }, [
                  createVNode(_component_FormInputField, {
                    id: "newEmail",
                    modelValue: unref(state).email,
                    "onUpdate:modelValue": ($event) => unref(state).email = $event,
                    type: "email",
                    label: unref($t)("account.changeEmail.form.newEmailLabel"),
                    errorMessage: unref(r$).email.$errors[0],
                    autocomplete: "off"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "errorMessage"]),
                  createVNode(_component_FormInputField, {
                    id: "confirmEmail",
                    modelValue: unref(state).emailConfirmation,
                    "onUpdate:modelValue": ($event) => unref(state).emailConfirmation = $event,
                    type: "email",
                    label: unref($t)("account.changeEmail.form.confirmEmailLabel"),
                    errorMessage: unref(r$).emailConfirmation.$errors[0],
                    autocomplete: "off"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "errorMessage"]),
                  createVNode(_component_FormInputField, {
                    id: "password",
                    modelValue: unref(state).password,
                    "onUpdate:modelValue": ($event) => unref(state).password = $event,
                    type: "password",
                    label: unref($t)("account.changeEmail.form.passwordLabel"),
                    errorMessage: unref(r$).password.$errors[0],
                    autocomplete: "current-password"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "errorMessage"]),
                  createVNode("div", null, [
                    createVNode(_component_FormBaseButton, {
                      label: unref($t)("account.changeEmail.form.buttonSubmit"),
                      type: "submit"
                    }, null, 8, ["label"])
                  ])
                ], 32)
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/pages/account/profile/change-email.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
