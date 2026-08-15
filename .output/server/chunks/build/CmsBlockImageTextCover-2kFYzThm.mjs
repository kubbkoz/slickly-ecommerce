import __nuxt_component_0 from './CmsGenericElement-0uMNMOJ4.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useCmsBlock } from './useCmsBlock-B8Ac2OqI.mjs';
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
  __name: "CmsBlockImageTextCover",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { getSlotContent } = useCmsBlock(props.content);
    const leftContent = getSlotContent("left");
    const rightContent = getSlotContent("right");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CmsGenericElement = __nuxt_component_0;
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "flex flex-col md:flex-row justify-start items-start gap-6 w-full pb-6" }, _attrs))}><div class="w-full md:flex-1 px-6 pt-6 md:px-0 md:pt-6 md:pl-6">`);
      _push(ssrRenderComponent(_component_CmsGenericElement, { content: unref(leftContent) }, null, _parent));
      _push(`</div><div class="w-full md:flex-1 px-6 pt-0 md:pt-6 pb-6 md:px-0 md:pr-6">`);
      _push(ssrRenderComponent(_component_CmsGenericElement, { content: unref(rightContent) }, null, _parent));
      _push(`</div></article>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/block/CmsBlockImageTextCover.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsBlockImageTextCover = Object.assign(_sfc_main, { __name: "CmsBlockImageTextCover" });

export { CmsBlockImageTextCover as default };
