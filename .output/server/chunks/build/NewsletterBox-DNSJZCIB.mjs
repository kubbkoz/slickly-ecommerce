import __nuxt_component_0 from './InputField-D300m7hz.mjs';
import __nuxt_component_1 from './BaseButton-CtNN_2CK.mjs';
import { defineComponent, ref, unref, isRef, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { useRegle } from '@regle/core';
import { u as useNewsletter } from './useNewsletter-EwyUjPBW.mjs';
import { K as useNotifications, m as useI18n } from './server.mjs';
import { u as useApiErrorsResolver } from './useApiErrorsResolver-BfHgRTVy.mjs';
import { c as customValidators } from './i18n-validators-CFSHkMK2.mjs';
import './BaseInput-Bd1YNFpA.mjs';
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
import '@regle/rules';

function footerNewsletterBoxRules() {
  const { required, email } = customValidators();
  return {
    email: {
      required,
      email
    }
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "NewsletterBox",
  __ssrInlineRender: true,
  setup(__props) {
    const email = ref("");
    const newsletterDisabled = ref(false);
    useNewsletter();
    useNotifications();
    const { t } = useI18n();
    useApiErrorsResolver("newsletter_box_form");
    const { r$ } = useRegle({ email }, footerNewsletterBoxRules());
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormInputField = __nuxt_component_0;
      const _component_FormBaseButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-2 text-surface-inverse-on-surface">${ssrInterpolate(_ctx.$t("layout.footer.newsletter.title"))}</div><div class="mb-4 text-surface-inverse-on-surface">${ssrInterpolate(_ctx.$t("layout.footer.newsletter.description"))}</div><form><div class="flex gap-2"><div><div class="newsletter-input-wrapper">`);
      _push(ssrRenderComponent(_component_FormInputField, {
        id: "newsletter-email",
        class: [unref(r$).email.$errors[0] ? "mb-4" : "mb-1"],
        modelValue: unref(email),
        "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
        placeholder: _ctx.$t("layout.footer.newsletter.placeholder"),
        onBlur: ($event) => unref(r$).email.$touch(),
        errorMessage: unref(r$).email.$errors[0],
        disabled: unref(newsletterDisabled)
      }, null, _parent));
      _push(`</div><div class="text-surface-inverse-on-surface text-xs leading-5">${ssrInterpolate(_ctx.$t("layout.footer.newsletter.privacyPolicy"))}</div></div><div>`);
      _push(ssrRenderComponent(_component_FormBaseButton, {
        class: "mt-0.5",
        type: "submit",
        variant: "secondary",
        size: "small",
        disabled: unref(newsletterDisabled)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("layout.footer.newsletter.button"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$t("layout.footer.newsletter.button")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/footer/NewsletterBox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "LayoutFooterNewsletterBox" });

export { __nuxt_component_2 as default };
