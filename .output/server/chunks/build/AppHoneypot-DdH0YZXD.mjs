import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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
  __name: "AppHoneypot",
  __ssrInlineRender: true,
  props: {
    name: {},
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const fieldName = props.name || "shopware_honeypot";
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "hp-wrapper",
        "aria-hidden": "true"
      }, _attrs))} data-v-454f6984><label${ssrRenderAttr("for", unref(fieldName))} data-v-454f6984>Do not fill this field</label><input${ssrRenderAttr("id", unref(fieldName))}${ssrRenderAttr("name", unref(fieldName))} type="text" tabindex="-1"${ssrRenderAttr("value", __props.modelValue)} data-v-454f6984></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/AppHoneypot.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AppHoneypot = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-454f6984"]]), { __name: "AppHoneypot" });

export { AppHoneypot as default };
