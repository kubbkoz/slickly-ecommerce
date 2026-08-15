import { m as useI18n, f as useUser, K as useNotifications, L as __nuxt_component_0 } from './server.mjs';
import __nuxt_component_0$1 from './PageHeader-CHrO2U4n.mjs';
import __nuxt_component_3 from './SectionHeader-DyYH6NEM.mjs';
import __nuxt_component_3$1 from './DataForm-DJxzQY7L.mjs';
import __nuxt_component_4 from './LoginData-BJx7d_b4.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, unref, isRef, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
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
import './SalutationSelect-CT4DLAVC.mjs';
import './DropdownField-DTfEBMIB.mjs';
import './BaseDropdown-DnldUMz4.mjs';
import './AccountTypeSelect-WWW-q77x.mjs';
import './InputField-D300m7hz.mjs';
import './BaseInput-Bd1YNFpA.mjs';
import './BaseButton-CtNN_2CK.mjs';
import './nuxt-link-B7B0pxEe.mjs';
import './index-DKA3nfTy.mjs';
import '@iconify/utils/lib/css/icon';
import '@regle/rules';

function personalDataFormRules(accountType) {
  const { required, requiredIf } = customValidators();
  return computed(() => ({
    firstName: {
      required
    },
    lastName: {
      required
    },
    accountType: {
      required
    },
    company: {
      required: requiredIf(() => {
        return accountType.value === "business";
      })
    },
    vatIds: {
      required: requiredIf(() => {
        return accountType.value === "business";
      })
    }
  }));
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t: $t } = useI18n();
    const { user, updatePersonalInfo } = useUser();
    const { pushSuccess } = useNotifications();
    const { handleApiError } = useApiErrorsResolver("account_profile_form");
    const state = ref({
      firstName: "",
      lastName: "",
      salutationId: "",
      title: "",
      accountType: "private",
      company: "",
      vatIds: ""
    });
    const { r$ } = useRegle(
      state,
      personalDataFormRules(computed(() => state.value.accountType))
    );
    async function handleSubmit() {
      await r$.$validate();
      if (r$.$invalid) {
        return;
      }
      try {
        const {
          firstName,
          lastName,
          salutationId,
          title,
          accountType,
          company,
          vatIds
        } = state.value;
        const basePayload = { firstName, lastName, salutationId, title };
        await updatePersonalInfo(
          accountType === "business" ? {
            ...basePayload,
            accountType,
            company: company || "",
            vatIds: vatIds ? [vatIds] : [""]
          } : basePayload
        );
        pushSuccess($t("account.profile.form.successUpdate"));
      } catch (error) {
        handleApiError(error);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_AccountPageHeader = __nuxt_component_0$1;
      const _component_AccountSectionHeader = __nuxt_component_3;
      const _component_AccountPersonalDataForm = __nuxt_component_3$1;
      const _component_AccountPersonalLoginData = __nuxt_component_4;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "account" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AccountPageHeader, {
              class: "mb-14",
              title: unref($t)("account.profile.header"),
              subtitle: unref($t)("account.profile.subHeader")
            }, null, _parent2, _scopeId));
            _push2(`<div class="mb-10"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AccountSectionHeader, {
              class: "mb-4",
              title: unref($t)("account.profile.personalDataSectionHeader")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_AccountPersonalDataForm, {
              modelValue: unref(state),
              "onUpdate:modelValue": ($event) => isRef(state) ? state.value = $event : null,
              validation: unref(r$),
              onSubmit: handleSubmit
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-10"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AccountSectionHeader, {
              class: "mb-4",
              title: unref($t)("account.profile.loginDataSectionHeader")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_AccountPersonalLoginData, {
              email: unref(user)?.email || ""
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode(_component_AccountPageHeader, {
                  class: "mb-14",
                  title: unref($t)("account.profile.header"),
                  subtitle: unref($t)("account.profile.subHeader")
                }, null, 8, ["title", "subtitle"]),
                createVNode("div", { class: "mb-10" }, [
                  createVNode(_component_AccountSectionHeader, {
                    class: "mb-4",
                    title: unref($t)("account.profile.personalDataSectionHeader")
                  }, null, 8, ["title"]),
                  createVNode(_component_AccountPersonalDataForm, {
                    modelValue: unref(state),
                    "onUpdate:modelValue": ($event) => isRef(state) ? state.value = $event : null,
                    validation: unref(r$),
                    onSubmit: handleSubmit
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "validation"])
                ]),
                createVNode("div", { class: "mb-10" }, [
                  createVNode(_component_AccountSectionHeader, {
                    class: "mb-4",
                    title: unref($t)("account.profile.loginDataSectionHeader")
                  }, null, 8, ["title"]),
                  createVNode(_component_AccountPersonalLoginData, {
                    email: unref(user)?.email || ""
                  }, null, 8, ["email"])
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/pages/account/profile/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
