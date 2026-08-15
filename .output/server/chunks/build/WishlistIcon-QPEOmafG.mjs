import __nuxt_component_0$1 from './IconButton-C-Xi6SDN.mjs';
import __nuxt_component_1 from './index-DKA3nfTy.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
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
  __name: "WishlistIcon",
  __ssrInlineRender: true,
  props: {
    isSelected: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormIconButton = __nuxt_component_0$1;
      const _component_Icon = __nuxt_component_1;
      _push(ssrRenderComponent(_component_FormIconButton, mergeProps({
        type: "ghost",
        class: "justify-center"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="h-10 w-10 bg-brand-secondary rounded-full flex items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              size: "1.2rem",
              name: __props.isSelected ? "shopware:solid-heart" : "shopware:heart",
              class: "color-brand-primary"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "h-10 w-10 bg-brand-secondary rounded-full flex items-center justify-center" }, [
                createVNode(_component_Icon, {
                  size: "1.2rem",
                  name: __props.isSelected ? "shopware:solid-heart" : "shopware:heart",
                  class: "color-brand-primary"
                }, null, 8, ["name"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/product/WishlistIcon.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "ProductWishlistIcon" });

export { __nuxt_component_0 as default };
