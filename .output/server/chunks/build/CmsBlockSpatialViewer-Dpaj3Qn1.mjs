import { I as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, computed, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useCmsBlock } from './useCmsBlock-B8Ac2OqI.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsBlockSpatialViewer",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { getSlotContent } = useCmsBlock(props.content);
    const slotContent = getSlotContent("default");
    function getConfigValue(key) {
      if (!slotContent?.config) return null;
      const configEntry = slotContent.config[key];
      if (configEntry && typeof configEntry === "object" && "value" in configEntry && configEntry !== null) {
        return configEntry.value;
      }
      return null;
    }
    computed(() => {
      if (slotContent?.data) {
        const data = slotContent.data;
        if (data?.url && typeof data.url === "string") {
          return data.url;
        }
      }
      const configUrl = getConfigValue("url");
      if (typeof configUrl === "string" && configUrl) {
        return configUrl;
      }
      return null;
    });
    const maxHeight = computed(() => {
      const height = getConfigValue("maxHeight");
      return typeof height === "string" ? height : "600px";
    });
    const formFactor = computed(() => {
      const factor = getConfigValue("formFactor");
      return typeof factor === "string" ? factor : "square";
    });
    const aspectRatio = computed(() => {
      switch (formFactor.value) {
        case "square":
          return 1;
        case "landscape":
          return 16 / 9;
        case "portrait":
          return 9 / 16;
        default:
          return 1;
      }
    });
    const containerStyle = computed(() => ({
      width: "100%",
      height: "100%",
      minHeight: "400px",
      maxHeight: maxHeight.value,
      aspectRatio: `${aspectRatio.value}`,
      position: "relative"
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_client_only = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "cms-block-spatial-viewer",
        style: containerStyle.value
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_client_only, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-full h-full flex items-center justify-center bg-gray-100"${_scopeId}><span class="text-gray-500"${_scopeId}>3D Viewer</span></div>`);
          } else {
            return [
              createVNode("div", { class: "w-full h-full flex items-center justify-center bg-gray-100" }, [
                createVNode("span", { class: "text-gray-500" }, "3D Viewer")
              ])
            ];
          }
        })
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/CmsBlockSpatialViewer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsBlockSpatialViewer = Object.assign(_sfc_main, { __name: "CmsBlockSpatialViewer" });

export { CmsBlockSpatialViewer as default };
