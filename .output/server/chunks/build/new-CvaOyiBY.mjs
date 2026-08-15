import { m as useI18n, K as useNotifications, c as useRouter, L as __nuxt_component_0 } from './server.mjs';
import __nuxt_component_0$1 from './PageHeader-CHrO2U4n.mjs';
import __nuxt_component_3 from './SectionHeader-DyYH6NEM.mjs';
import __nuxt_component_3$1 from './Form-DwIjG5_K.mjs';
import { defineComponent, ref, mergeProps, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { ApiClientError } from '@shopware/api-client';
import { u as useAddress } from './useAddress-C-wqGrYv.mjs';
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
import './InputField-D300m7hz.mjs';
import './BaseInput-Bd1YNFpA.mjs';
import './CountryStateInput-f0sWk9zO.mjs';
import './useCountries-DcMVa9Fw.mjs';
import './BaseButton-CtNN_2CK.mjs';
import '@regle/core';
import './i18n-validators-CFSHkMK2.mjs';
import '@regle/rules';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "new",
  __ssrInlineRender: true,
  setup(__props) {
    const { t: $t } = useI18n();
    const { createCustomerAddress } = useAddress();
    const { pushError, pushSuccess } = useNotifications();
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
    async function handleSubmit(addressData) {
      try {
        await createCustomerAddress(addressData);
        pushSuccess($t("account.address.new.successMessage"));
        await router.push("/account/address");
      } catch (error) {
        if (error instanceof ApiClientError) {
          for (const errorItem of error.details.errors) {
            if (errorItem?.detail) {
              pushError(errorItem.detail);
            }
          }
        }
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_AccountPageHeader = __nuxt_component_0$1;
      const _component_AccountSectionHeader = __nuxt_component_3;
      const _component_AccountAddressForm = __nuxt_component_3$1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "account" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AccountPageHeader, {
              class: "mb-14",
              title: unref($t)("account.address.new.header"),
              subtitle: unref($t)("account.address.new.subHeader")
            }, null, _parent2, _scopeId));
            _push2(`<div class="mb-10"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AccountSectionHeader, {
              class: "mb-4",
              title: unref($t)("account.address.new.personalDataSectionHeader")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_AccountAddressForm, {
              address: unref(state),
              onHandleSubmit: handleSubmit
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode(_component_AccountPageHeader, {
                  class: "mb-14",
                  title: unref($t)("account.address.new.header"),
                  subtitle: unref($t)("account.address.new.subHeader")
                }, null, 8, ["title", "subtitle"]),
                createVNode("div", { class: "mb-10" }, [
                  createVNode(_component_AccountSectionHeader, {
                    class: "mb-4",
                    title: unref($t)("account.address.new.personalDataSectionHeader")
                  }, null, 8, ["title"]),
                  createVNode(_component_AccountAddressForm, {
                    address: unref(state),
                    onHandleSubmit: handleSubmit
                  }, null, 8, ["address"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/pages/account/address/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
