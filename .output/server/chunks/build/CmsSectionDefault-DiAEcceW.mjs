import __nuxt_component_0 from './CmsGenericBlock-BOHRhFf-.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { getCmsLayoutConfiguration } from '@shopware/helpers';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsSectionDefault",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(props.content);
    const { sizingMode: _, ...sectionStyles } = layoutStyles;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CmsGenericBlock = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["my-4", unref(cssClasses)],
        style: sectionStyles
      }, _attrs))}><!--[-->`);
      ssrRenderList(__props.content.blocks, (cmsBlock) => {
        _push(ssrRenderComponent(_component_CmsGenericBlock, {
          key: cmsBlock.id,
          content: cmsBlock
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/section/CmsSectionDefault.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsSectionDefault = Object.assign(_sfc_main, { __name: "CmsSectionDefault" });

export { CmsSectionDefault as default };
