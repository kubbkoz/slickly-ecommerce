import __nuxt_component_0 from './CmsElementText-CnAlO-WO.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import 'entities';
import './useCmsElementConfig-DY8wkVjg.mjs';
import './useUrlResolver-CibZ14y1.mjs';
import '@shopware/helpers';
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
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsElementProductName",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CmsElementText = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        role: "heading",
        "aria-level": "1"
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_CmsElementText, {
        content: __props.content,
        class: "self-stretch text-surface-on-surface text-4xl font-normal font-serif leading-[60px]"
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementProductName.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsElementProductName = Object.assign(_sfc_main, { __name: "CmsElementProductName" });

export { CmsElementProductName as default };
