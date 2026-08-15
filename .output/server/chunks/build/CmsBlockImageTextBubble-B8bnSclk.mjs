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
  __name: "CmsBlockImageTextBubble",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { getSlotContent } = useCmsBlock(props.content);
    const leftText = getSlotContent("left-text");
    const leftImage = getSlotContent("left-image");
    const centerText = getSlotContent("center-text");
    const centerImage = getSlotContent("center-image");
    const rightText = getSlotContent("right-text");
    const rightImage = getSlotContent("right-image");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CmsGenericElement = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "cms-block-image-text-bubble flex flex-col sm:flex-row justify-start items-start gap-6 w-full" }, _attrs))}><div class="w-full sm:flex-1"><div class="self-stretch flex justify-center">`);
      _push(ssrRenderComponent(_component_CmsGenericElement, {
        content: unref(leftImage),
        class: "object-center rounded-full w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_CmsGenericElement, {
        content: unref(leftText),
        class: "self-stretch"
      }, null, _parent));
      _push(`</div><div class="w-full sm:flex-1"><div class="self-stretch flex justify-center">`);
      _push(ssrRenderComponent(_component_CmsGenericElement, {
        content: unref(centerImage),
        class: "object-center rounded-full w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_CmsGenericElement, {
        content: unref(centerText),
        class: "self-stretch"
      }, null, _parent));
      _push(`</div><div class="w-full sm:flex-1"><div class="self-stretch flex justify-center">`);
      _push(ssrRenderComponent(_component_CmsGenericElement, {
        content: unref(rightImage),
        class: "object-center rounded-full w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_CmsGenericElement, {
        content: unref(rightText),
        class: "self-stretch"
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/block/CmsBlockImageTextBubble.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsBlockImageTextBubble = Object.assign(_sfc_main, { __name: "CmsBlockImageTextBubble" });

export { CmsBlockImageTextBubble as default };
