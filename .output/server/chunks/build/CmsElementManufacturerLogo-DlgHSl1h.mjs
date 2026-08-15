import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import CmsElementImage from './CmsElementImage-BpNT58Zk.mjs';
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
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import './index-B6MI764M.mjs';
import './isSpatial-B7iPo9RI.mjs';
import './useCmsElementConfig-DY8wkVjg.mjs';
import './useUrlResolver-CibZ14y1.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsElementManufacturerLogo",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(CmsElementImage, mergeProps({ content: __props.content }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementManufacturerLogo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsElementManufacturerLogo = Object.assign(_sfc_main, { __name: "CmsElementManufacturerLogo" });

export { CmsElementManufacturerLogo as default };
