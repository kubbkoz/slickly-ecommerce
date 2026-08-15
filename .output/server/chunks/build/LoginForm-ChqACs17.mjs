import __nuxt_component_3 from './LoginForm-B-UFijii.mjs';
import __nuxt_component_1 from './BaseButton-CtNN_2CK.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { c as useRouter, b as useLocalePath, M as useInternationalization, T as useWishlist, f as useUser, K as useNotifications, m as useI18n } from './server.mjs';
import { u as useApiErrorsResolver } from './useApiErrorsResolver-BfHgRTVy.mjs';
import 'lucide-vue-next';
import './BaseButton-BJMOoNbK.mjs';
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
import './AppHoneypot-DdH0YZXD.mjs';
import './ForgotPasswordForm-CTFrh_Xj.mjs';
import './useAuth-CPF16ec2.mjs';
import './SocialLoginButtons-DBcyBy6L.mjs';
import './BiometricLogin-ZvMRd56E.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LoginForm",
  __ssrInlineRender: true,
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const { push } = useRouter();
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    const { mergeWishlistProducts } = useWishlist();
    const { login } = useUser();
    const { pushSuccess } = useNotifications();
    const { t } = useI18n();
    const { handleApiError } = useApiErrorsResolver("account_login_form");
    const emit = __emit;
    async function handleLogin(formData) {
      try {
        await login(formData);
        pushSuccess(t("account.messages.loggedInSuccess"));
        mergeWishlistProducts();
        emit("close");
      } catch (error) {
        handleApiError(error);
      }
    }
    function handleSignUp() {
      push(formatLink("/register"));
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LoginForm = __nuxt_component_3;
      const _component_FormBaseButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-auto sm:w-100 flex flex-col gap-3 m-auto p-5" }, _attrs))}><div class="mb-4"><h3 class="text-2xl font-bold">${ssrInterpolate(_ctx.$t("loginForm.header"))}</h3><p class="text-sm text-text-bg-surface-surface-disabled">${ssrInterpolate(_ctx.$t("loginForm.subHeader"))}</p></div>`);
      _push(ssrRenderComponent(_component_LoginForm, { onSubmit: handleLogin }, null, _parent));
      _push(ssrRenderComponent(_component_FormBaseButton, {
        label: _ctx.$t("loginForm.signUpButtonLabel"),
        variant: "secondary",
        onClick: handleSignUp
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/LoginForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const LoginForm = Object.assign(_sfc_main, { __name: "AccountLoginForm" });

export { LoginForm as default };
