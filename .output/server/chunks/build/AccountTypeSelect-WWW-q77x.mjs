import __nuxt_component_1 from './DropdownField-DTfEBMIB.mjs';
import { defineComponent, useModel, mergeProps, mergeModels, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { m as useI18n } from './server.mjs';
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
  __name: "AccountTypeSelect",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    dataTestId: { default: "" },
    id: { default: "" },
    errorMessage: { default: () => void 0 }
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const { t } = useI18n();
    const accountTypeOptions = [
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
      const _component_FormDropdownField = __nuxt_component_1;
      _push(ssrRenderComponent(_component_FormDropdownField, mergeProps({
        id: __props.id,
        modelValue: model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        label: _ctx.$t("form.accountType.title"),
        options: accountTypeOptions,
        "data-testid": __props.dataTestId,
        errorMessage: __props.errorMessage
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/form/AccountTypeSelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "FormAccountTypeSelect" });

export { __nuxt_component_0 as default };
