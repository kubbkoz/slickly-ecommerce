import __nuxt_component_1 from './index-DKA3nfTy.mjs';
import __nuxt_component_1$1 from './MainCounter-CRUGyARM.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "CartIcon",
  __ssrInlineRender: true,
  props: {
    counter: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1;
      const _component_LayoutMainCounter = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Icon, {
        size: "1.2rem",
        name: "shopware:shopping-cart",
        class: "color-brand-primary"
      }, null, _parent));
      if (__props.counter > 0) {
        _push(ssrRenderComponent(_component_LayoutMainCounter, {
          class: "absolute top-[-50%] left-[50%]",
          count: __props.counter
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/header/CartIcon.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main, { __name: "LayoutHeaderCartIcon" });

export { __nuxt_component_8 as default };
