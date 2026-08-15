import __nuxt_component_4 from './DataSection-C2-LUM1W.mjs';
import __nuxt_component_1 from './EditButton-DGxlnwSh.mjs';
import __nuxt_component_2 from './DeleteButton-C2mhQTWj.mjs';
import __nuxt_component_3 from './ActionLink-DifUUHPS.mjs';
import __nuxt_component_1$1 from './index-DKA3nfTy.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import './DataTextRow-BWtIhzlr.mjs';
import './BaseButton-CtNN_2CK.mjs';
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
import './LinkButton-CTjOSiub.mjs';
import '@iconify/utils/lib/css/icon';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Tile",
  __ssrInlineRender: true,
  props: {
    address: {},
    isDeleting: { type: Boolean },
    isDefaultBillingAddress: { type: Boolean },
    isDefaultShippingAddress: { type: Boolean }
  },
  emits: ["delete", "edit", "setAsDefaultBillingAddress", "setAsDefaultShippingAddress"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    function handleSetAsDefaultBillingAddress(address) {
      emit("setAsDefaultBillingAddress", address.id);
    }
    function handleSetAsDefaultShippingAddress(address) {
      emit("setAsDefaultShippingAddress", address.id);
    }
    function handleDeleteAddress(address) {
      emit("delete", address.id);
    }
    function handleEditAddress(addressId) {
      emit("edit", addressId);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AccountAddressDataSection = __nuxt_component_4;
      const _component_AccountAddressEditButton = __nuxt_component_1;
      const _component_AccountAddressDeleteButton = __nuxt_component_2;
      const _component_AccountActionLink = __nuxt_component_3;
      const _component_Icon = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["transition-all duration-300 ease-out", {
          "opacity-50 pointer-events-none": __props.isDeleting,
          "transform scale-95": __props.isDeleting
        }]
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_AccountAddressDataSection, {
        class: "mb-8",
        address: __props.address
      }, null, _parent));
      _push(`<div class="flex gap-4">`);
      _push(ssrRenderComponent(_component_AccountAddressEditButton, {
        onClick: ($event) => handleEditAddress(__props.address.id),
        disabled: __props.isDeleting
      }, null, _parent));
      if (!__props.isDefaultBillingAddress && !__props.isDefaultShippingAddress) {
        _push(ssrRenderComponent(_component_AccountAddressDeleteButton, {
          disabled: __props.isDeleting,
          onClick: ($event) => handleDeleteAddress(__props.address)
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex flex-col gap-4 mt-8">`);
      if (!__props.isDefaultBillingAddress) {
        _push(ssrRenderComponent(_component_AccountActionLink, {
          disabled: __props.isDeleting,
          onClick: ($event) => handleSetAsDefaultBillingAddress(__props.address)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Icon, {
                class: "w-4.5 h-6",
                name: "shopware:file-text"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(_ctx.$t("account.address.useAsDefaultBillingAddressButton"))}`);
            } else {
              return [
                createVNode(_component_Icon, {
                  class: "w-4.5 h-6",
                  name: "shopware:file-text"
                }),
                createTextVNode(" " + toDisplayString(_ctx.$t("account.address.useAsDefaultBillingAddressButton")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!__props.isDefaultShippingAddress) {
        _push(ssrRenderComponent(_component_AccountActionLink, {
          disabled: __props.isDeleting,
          onClick: ($event) => handleSetAsDefaultShippingAddress(__props.address)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Icon, {
                class: "w-6 h-4.5",
                name: "shopware:truck"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(_ctx.$t("account.address.useAsDefaultShippingAddressButton"))}`);
            } else {
              return [
                createVNode(_component_Icon, {
                  class: "w-6 h-4.5",
                  name: "shopware:truck"
                }),
                createTextVNode(" " + toDisplayString(_ctx.$t("account.address.useAsDefaultShippingAddressButton")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/address/Tile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main, { __name: "AccountAddressTile" });

export { __nuxt_component_5 as default };
