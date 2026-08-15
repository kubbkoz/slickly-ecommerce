import { d as useRoute, c as useRouter, h as useAsyncData, L as __nuxt_component_0 } from './server.mjs';
import __nuxt_component_0$1 from './PageHeader-CHrO2U4n.mjs';
import __nuxt_component_2 from './Line-Dhl0MxsU.mjs';
import { defineComponent, withAsyncContext, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { u as useCustomerOrders } from './useCustomerOrders-ScyFmL9F.mjs';
import { u as useDefaultOrderAssociations } from './useDefaultOrderAssociations-WycTFxJ-.mjs';
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
import './nuxt-link-B7B0pxEe.mjs';
import './Status-BPwYdPy_.mjs';
import './LineData-GQG9oQnE.mjs';
import './Product-CxGE2cGw.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import './Price-D7PucwgC.mjs';
import './usePrice-CDJKOx8c.mjs';

const defaultPage = 1;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    useRouter();
    const {
      orders,
      loadOrders,
      limit
    } = useCustomerOrders();
    const orderAssociations = useDefaultOrderAssociations();
    [__temp, __restore] = withAsyncContext(() => useAsyncData("getOrders", () => {
      return loadOrders({
        limit: limit.value,
        page: route.query.p ? Number(route.query.p) : defaultPage,
        checkPromotion: true,
        associations: orderAssociations,
        sort: [
          {
            field: "createdAt",
            order: "DESC"
          }
        ]
      });
    })), await __temp, __restore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_AccountPageHeader = __nuxt_component_0$1;
      const _component_AccountOrderLine = __nuxt_component_2;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "account" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AccountPageHeader, {
              class: "mb-14",
              title: _ctx.$t("account.order.header"),
              subtitle: _ctx.$t("account.order.subHeader")
            }, null, _parent2, _scopeId));
            _push2(`<!--[-->`);
            ssrRenderList(unref(orders), (order) => {
              _push2(ssrRenderComponent(_component_AccountOrderLine, {
                class: "mb-4",
                key: order.id,
                order
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode(_component_AccountPageHeader, {
                  class: "mb-14",
                  title: _ctx.$t("account.order.header"),
                  subtitle: _ctx.$t("account.order.subHeader")
                }, null, 8, ["title", "subtitle"]),
                (openBlock(true), createBlock(Fragment, null, renderList(unref(orders), (order) => {
                  return openBlock(), createBlock(_component_AccountOrderLine, {
                    class: "mb-4",
                    key: order.id,
                    order
                  }, null, 8, ["order"]);
                }), 128))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/pages/account/order/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
