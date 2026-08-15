import __nuxt_component_1 from './DropdownField-DTfEBMIB.mjs';
import { defineComponent, useModel, withAsyncContext, computed, unref, mergeProps, mergeModels, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { j as useNuxtApp, e as useShopwareContext, D as useAppConfig, h as useAsyncData } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SalutationSelect",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    id: { default: "" },
    dataTestId: { default: "" },
    errorMessage: { default: () => void 0 }
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  async setup(__props) {
    let __temp, __restore;
    const model = useModel(__props, "modelValue");
    const nuxtApp = useNuxtApp();
    const { apiClient } = useShopwareContext();
    const { defaultCSRCacheLifetime } = useAppConfig();
    const {
      data: salutationData,
      status,
      error
    } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "salutationData",
      () => apiClient.invoke("readSalutation post /salutation"),
      {
        transform: (apiData) => {
          const options = apiData.data.elements?.map((element) => ({
            label: element.displayName,
            value: element.id
          })) || [];
          return { options, cachedDate: /* @__PURE__ */ new Date() };
        },
        getCachedData: (key) => {
          const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
          if (!data || Date.now() > new Date(data.cachedDate).getTime() + defaultCSRCacheLifetime)
            return;
          return data;
        }
      }
    )), __temp = await __temp, __restore(), __temp);
    const isLoading = computed(() => unref(status) === "pending");
    const errorMessageText = computed(() => error ? error : __props.errorMessage);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormDropdownField = __nuxt_component_1;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_FormDropdownField, mergeProps(_ctx.$attrs, {
        id: __props.id,
        modelValue: model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        label: _ctx.$t("form.salutation"),
        options: unref(salutationData)?.options ?? [],
        "data-testid": __props.dataTestId,
        loading: unref(isLoading)
      }), null, _parent));
      if (unref(errorMessageText)) {
        _push(`<small class="text-states-error">${ssrInterpolate(unref(errorMessageText))}</small>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/form/SalutationSelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "FormSalutationSelect" });

export { __nuxt_component_0 as default };
