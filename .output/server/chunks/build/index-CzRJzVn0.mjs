import { _ as _export_sfc, f as useUser, K as useNotifications, L as __nuxt_component_0, n as navigateTo } from './server.mjs';
import __nuxt_component_0$1 from './PageHeader-CHrO2U4n.mjs';
import __nuxt_component_1 from './BaseButton-CtNN_2CK.mjs';
import __nuxt_component_3 from './SectionHeader-DyYH6NEM.mjs';
import __nuxt_component_4 from './DataSection-C2-LUM1W.mjs';
import __nuxt_component_5 from './Tile-BERtVUuN.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, toDisplayString, unref, createVNode, openBlock, createBlock, createCommentVNode, TransitionGroup, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttrs, ssrRenderList } from 'vue/server-renderer';
import { ApiClientError } from '@shopware/api-client';
import { u as useApiErrorsResolver } from './useApiErrorsResolver-BfHgRTVy.mjs';
import { u as useAddress } from './useAddress-C-wqGrYv.mjs';
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
import '@shopware/helpers';
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './DataTextRow-BWtIhzlr.mjs';
import './EditButton-DGxlnwSh.mjs';
import './index-DKA3nfTy.mjs';
import '@iconify/utils/lib/css/icon';
import './DeleteButton-C2mhQTWj.mjs';
import './ActionLink-DifUUHPS.mjs';
import './LinkButton-CTjOSiub.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { user, defaultBillingAddressId, defaultShippingAddressId, refreshUser } = useUser();
    const { resolveApiErrors } = useApiErrorsResolver("account_addresses");
    const { pushError } = useNotifications();
    const {
      customerAddresses,
      loadCustomerAddresses,
      deleteCustomerAddress,
      setDefaultCustomerBillingAddress,
      setDefaultCustomerShippingAddress
    } = useAddress();
    const deletingAddresses = ref(/* @__PURE__ */ new Set());
    function handleAddAddress() {
      navigateTo("/account/address/new");
    }
    function handleEditAddress(addressId) {
      navigateTo(`/account/address/edit/${addressId}`);
    }
    async function handleDeleteAddress(addressId) {
      deletingAddresses.value.add(addressId);
      try {
        await deleteCustomerAddress(addressId);
        await loadCustomerAddresses();
        await refreshUser();
      } catch (error) {
        if (error instanceof ApiClientError) {
          const errors = resolveApiErrors(error.details.errors);
          for (const error2 of errors) {
            pushError(error2);
          }
        }
      } finally {
        deletingAddresses.value.delete(addressId);
      }
    }
    async function handleSetAsDefaultBillingAddress(addressId) {
      try {
        await setDefaultCustomerBillingAddress(addressId);
        await loadCustomerAddresses();
        await refreshUser();
      } catch (error) {
        if (error instanceof ApiClientError) {
          const errors = resolveApiErrors(error.details.errors);
          for (const apiError of errors) {
            pushError(apiError);
          }
        }
      }
    }
    async function handleSetAsDefaultShippingAddress(addressId) {
      try {
        await setDefaultCustomerShippingAddress(addressId);
        await loadCustomerAddresses();
        await refreshUser();
      } catch (error) {
        if (error instanceof ApiClientError) {
          const errors = resolveApiErrors(error.details.errors);
          for (const error2 of errors) {
            pushError(error2);
          }
        }
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_AccountPageHeader = __nuxt_component_0$1;
      const _component_FormBaseButton = __nuxt_component_1;
      const _component_AccountSectionHeader = __nuxt_component_3;
      const _component_AccountAddressDataSection = __nuxt_component_4;
      const _component_AccountAddressTile = __nuxt_component_5;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "account" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-7aaf9e4c${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AccountPageHeader, {
              class: "mb-14",
              title: _ctx.$t("account.address.header"),
              subtitle: _ctx.$t("account.address.subHeader")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormBaseButton, {
              class: "mb-14",
              variant: "secondary",
              onClick: handleAddAddress
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` + ${ssrInterpolate(_ctx.$t("account.address.addAddressButton"))}`);
                } else {
                  return [
                    createTextVNode(" + " + toDisplayString(_ctx.$t("account.address.addAddressButton")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="block md:flex gap-10 mb-10" data-v-7aaf9e4c${_scopeId}><div class="flex-1 mb-10" data-v-7aaf9e4c${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AccountSectionHeader, {
              class: "mb-4",
              title: _ctx.$t("account.address.defaultBillingAddressSectionHeader")
            }, null, _parent2, _scopeId));
            if (unref(user)?.defaultBillingAddress) {
              _push2(ssrRenderComponent(_component_AccountAddressDataSection, {
                address: unref(user).defaultBillingAddress
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex-1 mb-10" data-v-7aaf9e4c${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AccountSectionHeader, {
              class: "mb-4",
              title: _ctx.$t("account.address.defaultShippingAddressSectionHeader")
            }, null, _parent2, _scopeId));
            if (unref(user)?.defaultShippingAddress) {
              _push2(ssrRenderComponent(_component_AccountAddressDataSection, {
                address: unref(user).defaultShippingAddress
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="mb-10" data-v-7aaf9e4c${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AccountSectionHeader, {
              class: "mb-4",
              title: _ctx.$t("account.address.availableAddressesSectionHeader")
            }, null, _parent2, _scopeId));
            _push2(`<div${ssrRenderAttrs({
              class: "block md:grid grid-cols-2 gap-10",
              name: "addresses"
            })} data-v-7aaf9e4c>`);
            ssrRenderList(unref(customerAddresses), (address) => {
              _push2(ssrRenderComponent(_component_AccountAddressTile, {
                key: address.id,
                address,
                "is-deleting": unref(deletingAddresses).has(address.id),
                "is-default-billing-address": address.id === unref(defaultBillingAddressId),
                "is-default-shipping-address": address.id === unref(defaultShippingAddressId),
                onDelete: handleDeleteAddress,
                onEdit: handleEditAddress,
                onSetAsDefaultBillingAddress: handleSetAsDefaultBillingAddress,
                onSetAsDefaultShippingAddress: handleSetAsDefaultShippingAddress
              }, null, _parent2, _scopeId));
            });
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode(_component_AccountPageHeader, {
                  class: "mb-14",
                  title: _ctx.$t("account.address.header"),
                  subtitle: _ctx.$t("account.address.subHeader")
                }, null, 8, ["title", "subtitle"]),
                createVNode(_component_FormBaseButton, {
                  class: "mb-14",
                  variant: "secondary",
                  onClick: handleAddAddress
                }, {
                  default: withCtx(() => [
                    createTextVNode(" + " + toDisplayString(_ctx.$t("account.address.addAddressButton")), 1)
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "block md:flex gap-10 mb-10" }, [
                  createVNode("div", { class: "flex-1 mb-10" }, [
                    createVNode(_component_AccountSectionHeader, {
                      class: "mb-4",
                      title: _ctx.$t("account.address.defaultBillingAddressSectionHeader")
                    }, null, 8, ["title"]),
                    unref(user)?.defaultBillingAddress ? (openBlock(), createBlock(_component_AccountAddressDataSection, {
                      key: 0,
                      address: unref(user).defaultBillingAddress
                    }, null, 8, ["address"])) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "flex-1 mb-10" }, [
                    createVNode(_component_AccountSectionHeader, {
                      class: "mb-4",
                      title: _ctx.$t("account.address.defaultShippingAddressSectionHeader")
                    }, null, 8, ["title"]),
                    unref(user)?.defaultShippingAddress ? (openBlock(), createBlock(_component_AccountAddressDataSection, {
                      key: 0,
                      address: unref(user).defaultShippingAddress
                    }, null, 8, ["address"])) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("div", { class: "mb-10" }, [
                  createVNode(_component_AccountSectionHeader, {
                    class: "mb-4",
                    title: _ctx.$t("account.address.availableAddressesSectionHeader")
                  }, null, 8, ["title"]),
                  createVNode(TransitionGroup, {
                    class: "block md:grid grid-cols-2 gap-10",
                    name: "addresses",
                    tag: "div"
                  }, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(customerAddresses), (address) => {
                        return openBlock(), createBlock(_component_AccountAddressTile, {
                          key: address.id,
                          address,
                          "is-deleting": unref(deletingAddresses).has(address.id),
                          "is-default-billing-address": address.id === unref(defaultBillingAddressId),
                          "is-default-shipping-address": address.id === unref(defaultShippingAddressId),
                          onDelete: handleDeleteAddress,
                          onEdit: handleEditAddress,
                          onSetAsDefaultBillingAddress: handleSetAsDefaultBillingAddress,
                          onSetAsDefaultShippingAddress: handleSetAsDefaultShippingAddress
                        }, null, 8, ["address", "is-deleting", "is-default-billing-address", "is-default-shipping-address"]);
                      }), 128))
                    ]),
                    _: 1
                  })
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/pages/account/address/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7aaf9e4c"]]);

export { index as default };
