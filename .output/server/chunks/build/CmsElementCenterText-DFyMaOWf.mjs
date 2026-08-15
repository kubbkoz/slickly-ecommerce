import __nuxt_component_0 from './CmsElementText-CnAlO-WO.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import 'entities';
import './useCmsElementConfig-DY8wkVjg.mjs';
import './useUrlResolver-CibZ14y1.mjs';
import '@shopware/helpers';
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
  __name: "CmsElementCenterText",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CmsElementText = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "cms-center-text text-center" }, _attrs))} data-v-5ca01a96>`);
      _push(ssrRenderComponent(_component_CmsElementText, { content: __props.content }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/public/cms/element/CmsElementCenterText.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsElementCenterText = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-5ca01a96"]]), { __name: "CmsElementCenterText" });

export { CmsElementCenterText as default };
