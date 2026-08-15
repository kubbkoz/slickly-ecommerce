import __nuxt_component_1$1 from './BaseButton-CtNN_2CK.mjs';
import __nuxt_component_1$2 from './index-DKA3nfTy.mjs';
import { mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_FormBaseButton = __nuxt_component_1$1;
  const _component_Icon = __nuxt_component_1$2;
  _push(ssrRenderComponent(_component_FormBaseButton, mergeProps({ variant: "tertiary" }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="flex gap-2 items-center"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Icon, { name: "shopware:pencil-s" }, null, _parent2, _scopeId));
        _push2(` ${ssrInterpolate(_ctx.$t("account.address.editAddressButton"))}</div>`);
      } else {
        return [
          createVNode("div", { class: "flex gap-2 items-center" }, [
            createVNode(_component_Icon, { name: "shopware:pencil-s" }),
            createTextVNode(" " + toDisplayString(_ctx.$t("account.address.editAddressButton")), 1)
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/address/EditButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "AccountAddressEditButton" });

export { __nuxt_component_1 as default };
