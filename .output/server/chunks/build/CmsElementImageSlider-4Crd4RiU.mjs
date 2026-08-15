import __nuxt_component_0 from './SwSlider-CN4jIJjs.mjs';
import CmsElementImage from './CmsElementImage-BpNT58Zk.mjs';
import { defineComponent, computed, mergeProps, withCtx, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import './ChevronIcon-Aj1t6zS4.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
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
import './server.mjs';
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
import './index-B6MI764M.mjs';
import './useCmsElementConfig-DY8wkVjg.mjs';
import './isSpatial-B7iPo9RI.mjs';
import './useUrlResolver-CibZ14y1.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsElementImageSlider",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const items = computed(() => props.content.data.sliderItems);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwSlider = __nuxt_component_0;
      const _component_CmsElementImage = CmsElementImage;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "cms-element-image-slider w-[92vw] sm:w-[94vw] md:w-full" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_SwSlider, {
        config: props.content.config
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(items.value, (image) => {
              _push2(ssrRenderComponent(_component_CmsElementImage, {
                key: image.media.url,
                content: {
                  data: image,
                  config: props.content.config
                }
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(items.value, (image) => {
                return openBlock(), createBlock(_component_CmsElementImage, {
                  key: image.media.url,
                  content: {
                    data: image,
                    config: props.content.config
                  }
                }, null, 8, ["content"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementImageSlider.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsElementImageSlider = Object.assign(_sfc_main, { __name: "CmsElementImageSlider" });

export { CmsElementImageSlider as default };
