import { f as useUser, K as useNotifications, m as useI18n, L as __nuxt_component_0 } from './server.mjs';
import __nuxt_component_0$1 from './PageHeader-CHrO2U4n.mjs';
import __nuxt_component_3 from './SectionHeader-DyYH6NEM.mjs';
import __nuxt_component_3$1 from './DataSection-D3DlmO5D.mjs';
import __nuxt_component_4 from './NewsletterSection-DnpbAbFL.mjs';
import __nuxt_component_4$1 from './DataSection-C2-LUM1W.mjs';
import { defineComponent, ref, mergeProps, withCtx, unref, isRef, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { u as useNewsletter } from './useNewsletter-EwyUjPBW.mjs';
import { u as useApiErrorsResolver } from './useApiErrorsResolver-BfHgRTVy.mjs';
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
import './DataTextRow-BWtIhzlr.mjs';
import './Checkbox-DT7ZMZZl.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useUser();
    const { pushSuccess } = useNotifications();
    const { t } = useI18n();
    const {
      newsletterUnsubscribe,
      newsletterSubscribe,
      getNewsletterStatus,
      SUBSRIBE_KEY,
      confirmationNeeded
    } = useNewsletter();
    const { handleApiError } = useApiErrorsResolver("account_newsletter_form");
    const newsletter = ref(false);
    const newsletterDisabled = ref(false);
    async function handleNewsletterChange() {
      newsletterDisabled.value = true;
      try {
        if (newsletter.value) {
          await newsletterSubscribe({
            email: user.value?.email || "",
            option: SUBSRIBE_KEY
          });
          await getNewsletterStatus();
          pushSuccess(t("account.overview.newsletter.messages.subscribed"));
        } else {
          await newsletterUnsubscribe(user.value?.email || "");
          pushSuccess(t("account.overview.newsletter.messages.unsubscribed"));
        }
      } catch (error) {
        handleApiError(error);
      } finally {
        newsletterDisabled.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_AccountPageHeader = __nuxt_component_0$1;
      const _component_AccountSectionHeader = __nuxt_component_3;
      const _component_AccountPersonalDataSection = __nuxt_component_3$1;
      const _component_AccountNewsletterSection = __nuxt_component_4;
      const _component_AccountAddressDataSection = __nuxt_component_4$1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "account" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AccountPageHeader, {
              class: "mb-14",
              title: _ctx.$t("account.overview.header"),
              subtitle: _ctx.$t("account.overview.subHeader")
            }, null, _parent2, _scopeId));
            _push2(`<div class="mb-10"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AccountSectionHeader, {
              class: "mb-4",
              title: _ctx.$t("account.overview.personalDataSectionHeader")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_AccountPersonalDataSection, {
              "customer-name": unref(user)?.firstName + " " + unref(user)?.lastName,
              "customer-email": unref(user)?.email || ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-10"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AccountSectionHeader, {
              class: "mb-4",
              title: _ctx.$t("account.overview.newsletter.subscriptionSectionHeader")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_AccountNewsletterSection, {
              modelValue: unref(newsletter),
              "onUpdate:modelValue": ($event) => isRef(newsletter) ? newsletter.value = $event : null,
              disabled: unref(confirmationNeeded) || unref(newsletterDisabled),
              "confirmation-needed": unref(confirmationNeeded),
              onChange: handleNewsletterChange
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="block md:flex gap-10 mb-10"${_scopeId}><div class="flex-1 mb-10"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AccountSectionHeader, {
              class: "mb-4",
              title: _ctx.$t("account.overview.defaultBillingAddressSectionHeader")
            }, null, _parent2, _scopeId));
            if (unref(user)?.defaultBillingAddress) {
              _push2(ssrRenderComponent(_component_AccountAddressDataSection, {
                address: unref(user).defaultBillingAddress
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex-1 mb-10"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AccountSectionHeader, {
              class: "mb-4",
              title: _ctx.$t("account.overview.defaultShippingAddressSectionHeader")
            }, null, _parent2, _scopeId));
            if (unref(user)?.defaultShippingAddress) {
              _push2(ssrRenderComponent(_component_AccountAddressDataSection, {
                address: unref(user).defaultShippingAddress
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode(_component_AccountPageHeader, {
                  class: "mb-14",
                  title: _ctx.$t("account.overview.header"),
                  subtitle: _ctx.$t("account.overview.subHeader")
                }, null, 8, ["title", "subtitle"]),
                createVNode("div", { class: "mb-10" }, [
                  createVNode(_component_AccountSectionHeader, {
                    class: "mb-4",
                    title: _ctx.$t("account.overview.personalDataSectionHeader")
                  }, null, 8, ["title"]),
                  createVNode(_component_AccountPersonalDataSection, {
                    "customer-name": unref(user)?.firstName + " " + unref(user)?.lastName,
                    "customer-email": unref(user)?.email || ""
                  }, null, 8, ["customer-name", "customer-email"])
                ]),
                createVNode("div", { class: "mb-10" }, [
                  createVNode(_component_AccountSectionHeader, {
                    class: "mb-4",
                    title: _ctx.$t("account.overview.newsletter.subscriptionSectionHeader")
                  }, null, 8, ["title"]),
                  createVNode(_component_AccountNewsletterSection, {
                    modelValue: unref(newsletter),
                    "onUpdate:modelValue": ($event) => isRef(newsletter) ? newsletter.value = $event : null,
                    disabled: unref(confirmationNeeded) || unref(newsletterDisabled),
                    "confirmation-needed": unref(confirmationNeeded),
                    onChange: handleNewsletterChange
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "confirmation-needed"])
                ]),
                createVNode("div", { class: "block md:flex gap-10 mb-10" }, [
                  createVNode("div", { class: "flex-1 mb-10" }, [
                    createVNode(_component_AccountSectionHeader, {
                      class: "mb-4",
                      title: _ctx.$t("account.overview.defaultBillingAddressSectionHeader")
                    }, null, 8, ["title"]),
                    unref(user)?.defaultBillingAddress ? (openBlock(), createBlock(_component_AccountAddressDataSection, {
                      key: 0,
                      address: unref(user).defaultBillingAddress
                    }, null, 8, ["address"])) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "flex-1 mb-10" }, [
                    createVNode(_component_AccountSectionHeader, {
                      class: "mb-4",
                      title: _ctx.$t("account.overview.defaultShippingAddressSectionHeader")
                    }, null, 8, ["title"]),
                    unref(user)?.defaultShippingAddress ? (openBlock(), createBlock(_component_AccountAddressDataSection, {
                      key: 0,
                      address: unref(user).defaultShippingAddress
                    }, null, 8, ["address"])) : createCommentVNode("", true)
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/pages/account/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
