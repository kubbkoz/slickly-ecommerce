import { defineComponent, withAsyncContext, resolveComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { e as useShopwareContext, h as useAsyncData } from './server.mjs';
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
  __name: "FrontendAccountCustomerGroupRegistrationPage",
  __ssrInlineRender: true,
  props: {
    navigationId: {}
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const { apiClient } = useShopwareContext();
    const { data: registrationResponse } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      `cmsNavigation${props.navigationId}`,
      async () => {
        const response = await apiClient.invoke(
          "getCustomerGroupRegistrationInfo get /customer-group-registration/config/{customerGroupId}",
          {
            pathParams: { customerGroupId: props.navigationId }
          }
        );
        return response.data || {};
      }
    )), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AccountRegisterForm = resolveComponent("AccountRegisterForm");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto bg-white flex flex-col" }, _attrs))}><h1 class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-surface-on-surface md:text-3xl lg:text-5xl dark:text-white text-center">${ssrInterpolate(unref(registrationResponse)?.translated.registrationTitle)}</h1>`);
      if (unref(registrationResponse)?.registrationActive) {
        _push(`<div class="text-lg font-normal text-secondary-500 lg:text-xl dark:text-surface-on-surface-400"><p class="px-6 sm:px-4 mb-6">${ssrInterpolate(unref(registrationResponse)?.translated.registrationIntroduction)}</p>`);
        _push(ssrRenderComponent(_component_AccountRegisterForm, {
          "customer-group-id": unref(registrationResponse)?.id
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-secondary-800 dark:text-yellow-300" role="alert"><span class="font-medium">Registration is not active!</span> Try again later or contact us. </div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/FrontendAccountCustomerGroupRegistrationPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FrontendAccountCustomerGroupRegistrationPage = Object.assign(_sfc_main, { __name: "FrontendAccountCustomerGroupRegistrationPage" });

export { FrontendAccountCustomerGroupRegistrationPage as default };
