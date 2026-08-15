import __nuxt_component_0 from './CmsGenericElement-0uMNMOJ4.mjs';
import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import './index-D4TJHf28.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsBlockHtml",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CmsGenericElement = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><!--[-->`);
      ssrRenderList(__props.content.slots, (slot) => {
        _push(ssrRenderComponent(_component_CmsGenericElement, {
          key: slot.versionId,
          content: slot
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/block/CmsBlockHtml.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsBlockHtml = Object.assign(_sfc_main, { __name: "CmsBlockHtml" });

export { CmsBlockHtml as default };
