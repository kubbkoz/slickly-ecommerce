import __nuxt_component_0 from './CmsGenericElement-0uMNMOJ4.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useCmsBlock } from './useCmsBlock-B8Ac2OqI.mjs';
import { _ as _export_sfc } from './server.mjs';
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
  __name: "CmsBlockImageTextRow",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { getSlotContent } = useCmsBlock(props.content);
    const leftImageContent = getSlotContent("left-image");
    const leftTextContent = getSlotContent("left-text");
    const centerImageContent = getSlotContent("center-image");
    const centerTextContent = getSlotContent("center-text");
    const rightImageContent = getSlotContent("right-image");
    const rightTextContent = getSlotContent("right-text");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CmsGenericElement = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "cms-block-image-text-row flex flex-col md:flex-row justify-center items-stretch gap-6 w-full" }, _attrs))} data-v-4b23706c><div class="w-full md:flex-1 flex flex-col" data-v-4b23706c><div class="flex-1 mb-4 overflow-hidden rounded-lg min-h-64" data-v-4b23706c>`);
      _push(ssrRenderComponent(_component_CmsGenericElement, { content: unref(leftImageContent) }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_CmsGenericElement, {
        content: unref(leftTextContent),
        class: "text-center"
      }, null, _parent));
      _push(`</div><div class="w-full md:flex-1 flex flex-col" data-v-4b23706c><div class="flex-1 mb-4 overflow-hidden rounded-lg min-h-64" data-v-4b23706c>`);
      _push(ssrRenderComponent(_component_CmsGenericElement, { content: unref(centerImageContent) }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_CmsGenericElement, {
        content: unref(centerTextContent),
        class: "text-center"
      }, null, _parent));
      _push(`</div><div class="w-full md:flex-1 flex flex-col" data-v-4b23706c><div class="flex-1 mb-4 overflow-hidden rounded-lg min-h-64" data-v-4b23706c>`);
      _push(ssrRenderComponent(_component_CmsGenericElement, { content: unref(rightImageContent) }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_CmsGenericElement, {
        content: unref(rightTextContent),
        class: "text-center"
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/block/CmsBlockImageTextRow.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsBlockImageTextRow = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-4b23706c"]]), { __name: "CmsBlockImageTextRow" });

export { CmsBlockImageTextRow as default };
