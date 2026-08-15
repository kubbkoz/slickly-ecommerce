import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import './composables-x8_ENpEe.mjs';
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
import '@shopware/helpers';
import './server.mjs';
import 'pinia';
import '@iconify/vue';
import '@shopware/api-client';
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseIcon",
  __ssrInlineRender: true,
  props: {
    src: {},
    size: { default: 24 },
    alt: { default: "" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      _push(ssrRenderComponent(_component_NuxtImg, mergeProps({
        src: __props.src,
        alt: __props.alt,
        width: __props.size,
        height: __props.size
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/ui/BaseIcon.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "SwBaseIcon" });

export { __nuxt_component_0 as default };
