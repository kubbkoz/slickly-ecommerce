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
  __name: "CmsBlockGalleryBuybox",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { getSlotContent } = useCmsBlock(props.content);
    const rightContent = getSlotContent("right");
    const leftContent = getSlotContent("left");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CmsGenericElement = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full flex flex-col lg:flex-row justify-center items-stretch gap-4 lg:gap-10 lg:px-0 overflow-hidden" }, _attrs))}><div class="w-full lg:w-3/5">`);
      _push(ssrRenderComponent(_component_CmsGenericElement, { content: unref(leftContent) }, null, _parent));
      _push(`</div><div class="w-full lg:w-2/5">`);
      _push(ssrRenderComponent(_component_CmsGenericElement, { content: unref(rightContent) }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/block/CmsBlockGalleryBuybox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsBlockGalleryBuybox = Object.assign(_sfc_main, { __name: "CmsBlockGalleryBuybox" });

export { CmsBlockGalleryBuybox as default };
