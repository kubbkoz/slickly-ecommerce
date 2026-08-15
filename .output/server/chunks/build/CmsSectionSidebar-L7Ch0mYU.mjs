import __nuxt_component_0 from './CmsGenericBlock-BOHRhFf-.mjs';
import { defineComponent, computed, provide, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
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

function useCmsSection(content) {
  function getPositionContent(position) {
    return content.blocks.filter(
      (block) => block.sectionPosition === position
    );
  }
  return {
    section: content,
    getPositionContent
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsSectionSidebar",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { getPositionContent, section } = useCmsSection(props.content);
    const sidebarBlocks = getPositionContent("sidebar");
    const mainBlocks = getPositionContent("main");
    const mobileBehavior = computed(() => props.content.mobileBehavior);
    const fullWidth = computed(() => section.sizingMode === "full_width");
    provide("cms-section-layout", "sidebar");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CmsGenericBlock = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["self-stretch flex flex-col lg:flex-row items-stretch gap-16", {
          "px-6": fullWidth.value
        }]
      }, _attrs))}><aside class="${ssrRenderClass({
        "w-full lg:w-72 xl:w-80 flex-shrink-0 bg-surface-surface flex flex-col justify-start items-stretch gap-4 lg:sticky lg:top-20 px-4 lg:px-0": mobileBehavior.value !== "hidden",
        "hidden lg:block": mobileBehavior.value === "hidden"
      })}"><!--[-->`);
      ssrRenderList(unref(sidebarBlocks), (cmsBlock) => {
        _push(`<div class="w-full">`);
        _push(ssrRenderComponent(_component_CmsGenericBlock, { content: cmsBlock }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></aside><div class="flex-1 flex flex-col justify-start items-stretch gap-20"><!--[-->`);
      ssrRenderList(unref(mainBlocks), (cmsBlock) => {
        _push(`<div class="w-full">`);
        _push(ssrRenderComponent(_component_CmsGenericBlock, { content: cmsBlock }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/section/CmsSectionSidebar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsSectionSidebar = Object.assign(_sfc_main, { __name: "CmsSectionSidebar" });

export { CmsSectionSidebar as default };
