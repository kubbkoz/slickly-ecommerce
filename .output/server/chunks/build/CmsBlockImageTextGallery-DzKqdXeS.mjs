import CmsElementImage from './CmsElementImage-BpNT58Zk.mjs';
import __nuxt_component_0 from './CmsElementText-CnAlO-WO.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useCmsBlock } from './useCmsBlock-B8Ac2OqI.mjs';
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
import 'entities';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsBlockImageTextGallery",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { getSlotContent } = useCmsBlock(props.content);
    const leftTextContent = getSlotContent("left-text");
    const rightTextContent = getSlotContent("right-text");
    const centerTextContent = getSlotContent("center-text");
    const leftImageContent = getSlotContent(
      "left-image"
    );
    const rightImageContent = getSlotContent(
      "right-image"
    );
    const centerImageContent = getSlotContent(
      "center-image"
    );
    function onImageClick(slotContent) {
      if (slotContent.data?.url) {
        if (slotContent.data?.newTab) {
          (void 0).open(slotContent.data.url);
        } else {
          (void 0).location.href = slotContent.data.url;
        }
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CmsElementImage = CmsElementImage;
      const _component_CmsElementText = __nuxt_component_0;
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: "cms-block-image-text-gallery flex flex-col sm:flex-row justify-start items-start gap-6 w-full",
        style: { backgroundColor: __props.content.backgroundColor || "" }
      }, _attrs))}><div class="w-full sm:flex-1">`);
      _push(ssrRenderComponent(_component_CmsElementImage, {
        content: unref(leftImageContent),
        style: { cursor: unref(leftImageContent).data?.url && "pointer" },
        onClick: ($event) => onImageClick(unref(leftImageContent))
      }, null, _parent));
      _push(ssrRenderComponent(_component_CmsElementText, {
        content: unref(leftTextContent),
        class: "self-stretch"
      }, null, _parent));
      _push(`</div><div class="w-full sm:flex-1">`);
      _push(ssrRenderComponent(_component_CmsElementImage, {
        content: unref(centerImageContent),
        style: {
          cursor: unref(centerImageContent).data?.url && "pointer"
        },
        onClick: ($event) => onImageClick(unref(centerImageContent))
      }, null, _parent));
      _push(ssrRenderComponent(_component_CmsElementText, {
        content: unref(centerTextContent),
        class: "self-stretch"
      }, null, _parent));
      _push(`</div><div class="w-full sm:flex-1">`);
      _push(ssrRenderComponent(_component_CmsElementImage, {
        content: unref(rightImageContent),
        style: { cursor: unref(rightImageContent).data?.url && "pointer" },
        onClick: ($event) => onImageClick(unref(rightImageContent))
      }, null, _parent));
      _push(ssrRenderComponent(_component_CmsElementText, {
        content: unref(rightTextContent),
        class: "self-stretch"
      }, null, _parent));
      _push(`</div></article>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/block/CmsBlockImageTextGallery.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsBlockImageTextGallery = Object.assign(_sfc_main, { __name: "CmsBlockImageTextGallery" });

export { CmsBlockImageTextGallery as default };
