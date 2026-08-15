import { defineComponent, createVNode, resolveDynamicComponent, unref, mergeProps, withCtx, renderSlot, useSSRContext } from 'vue';
import { ssrRenderVNode, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
import { _ as __nuxt_component_0$1 } from './nuxt-link-B7B0pxEe.mjs';
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
import './server.mjs';
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
  __name: "Element",
  __ssrInlineRender: true,
  props: {
    link: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.link ? unref(__nuxt_component_0$1) : "div"), mergeProps(__props.link ? { to: __props.link } : {}, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="${ssrRenderClass([{ link: `hover:underline hover:decoration-brand-primary-hover hover:decoration-2 hover:underline-offset-4 hover:text-brand-primary-hover` }, "justify-start leading-normal no-underline text-surface-on-surface"])}"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</span>`);
          } else {
            return [
              createVNode("span", {
                class: [{ link: `hover:underline hover:decoration-brand-primary-hover hover:decoration-2 hover:underline-offset-4 hover:text-brand-primary-hover` }, "justify-start leading-normal no-underline text-surface-on-surface"]
              }, [
                renderSlot(_ctx.$slots, "default")
              ])
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/breadcrumbs/Element.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "LayoutBreadcrumbsElement" });

export { __nuxt_component_0 as default };
