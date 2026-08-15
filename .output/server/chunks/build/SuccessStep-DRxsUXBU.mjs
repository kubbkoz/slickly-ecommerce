import BaseButton from './BaseButton-BJMOoNbK.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { CheckCircle } from 'lucide-vue-next';
import './nuxt-link-B7B0pxEe.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SuccessStep",
  __ssrInlineRender: true,
  props: {
    onBackToShop: { type: Function }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseButton = BaseButton;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white p-12 text-center border-t-4 border-brand animate-fade-in font-sans" }, _attrs))}><div class="w-24 h-24 bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-6">`);
      _push(ssrRenderComponent(unref(CheckCircle), { class: "w-12 h-12 text-green-600" }, null, _parent));
      _push(`</div><h2 class="text-4xl font-black font-tech uppercase mb-4">Ďakujeme za <span class="text-brand">objednávku!</span></h2><div class="section-decorator mx-auto mt-3 mb-6"></div><p class="text-gray-500 mb-8 max-w-md mx-auto font-sans text-sm"> Potvrdenie objednávky sme vám poslali na email. Hneď ako tovar vyexpedujeme, budeme vás informovať SMS správou. </p>`);
      _push(ssrRenderComponent(_component_BaseButton, {
        variant: "primary",
        size: "lg",
        onClick: __props.onBackToShop
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Späť na úvod `);
          } else {
            return [
              createTextVNode(" Späť na úvod ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/checkout/SuccessStep.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SuccessStep = Object.assign(_sfc_main, { __name: "SuccessStep" });

export { SuccessStep as default };
