import __nuxt_component_1 from './BaseButton-CtNN_2CK.mjs';
import __nuxt_component_1$1 from './index-DKA3nfTy.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "DeleteButton",
  __ssrInlineRender: true,
  props: {
    disabled: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormBaseButton = __nuxt_component_1;
      const _component_Icon = __nuxt_component_1$1;
      _push(ssrRenderComponent(_component_FormBaseButton, mergeProps({
        variant: "tertiary",
        disabled: __props.disabled,
        class: {
          "opacity-50 pointer-events-none": __props.disabled
        }
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex gap-2 items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, { name: "shopware:trash-s" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(_ctx.$t("account.address.deleteAddressButton"))}</div>`);
          } else {
            return [
              createVNode("div", { class: "flex gap-2 items-center" }, [
                createVNode(_component_Icon, { name: "shopware:trash-s" }),
                createTextVNode(" " + toDisplayString(_ctx.$t("account.address.deleteAddressButton")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/address/DeleteButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "AccountAddressDeleteButton" });

export { __nuxt_component_2 as default };
