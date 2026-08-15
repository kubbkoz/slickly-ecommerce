import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { u as usePrice } from './usePrice-CDJKOx8c.mjs';
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
  __name: "Price",
  __ssrInlineRender: true,
  props: {
    value: {}
  },
  setup(__props) {
    const { getFormattedPrice } = usePrice();
    const props = __props;
    const getPrice = computed(() => getFormattedPrice(props.value));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<p${ssrRenderAttrs(mergeProps({ class: "flex gap-1" }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "beforePrice", {}, null, _push, _parent);
      _push(`<span>${ssrInterpolate(unref(getPrice))}</span>`);
      ssrRenderSlot(_ctx.$slots, "afterPrice", {}, null, _push, _parent);
      _push(`</p>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/shared/Price.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "SharedPrice" });

export { __nuxt_component_3 as default };
