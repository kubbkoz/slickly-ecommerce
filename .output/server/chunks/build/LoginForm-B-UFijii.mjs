import { defineComponent, ref, watch, computed, mergeProps, unref, withCtx, createTextVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { CheckCircle, AlertCircle, Mail, Lock, Loader2 } from 'lucide-vue-next';
import { _ as _export_sfc, f as useUser, l as useSessionContext, n as navigateTo } from './server.mjs';
import BaseButton from './BaseButton-BJMOoNbK.mjs';
import AppHoneypot from './AppHoneypot-DdH0YZXD.mjs';
import ForgotPasswordForm from './ForgotPasswordForm-CTFrh_Xj.mjs';
import SocialLoginButtons from './SocialLoginButtons-DBcyBy6L.mjs';
import BiometricLogin from './BiometricLogin-ZvMRd56E.mjs';
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
import './nuxt-link-B7B0pxEe.mjs';
import './useAuth-CPF16ec2.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LoginForm",
  __ssrInlineRender: true,
  props: {
    oauthSuccess: {},
    oauthError: {},
    oauthPrefillEmail: {}
  },
  emits: ["success", "close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    useUser();
    useSessionContext();
    const email = ref(props.oauthPrefillEmail ?? "");
    const password = ref("");
    const honeypot = ref("");
    const error = ref(null);
    const isLoading = ref(false);
    const showForgotPassword = ref(false);
    watch(() => props.oauthPrefillEmail, (newEmail) => {
      if (newEmail) email.value = newEmail;
    });
    const OAUTH_ERROR_MESSAGES = {
      oauth_cancelled: "Prihlásenie bolo zrušené.",
      oauth_state_mismatch: "Bezpečnostná chyba (state mismatch). Skús to znova.",
      oauth_no_code: "Google/Facebook nevrátili overovací kód.",
      oauth_token_exchange: "Chyba pri výmene tokenu s poskytovateľom.",
      oauth_profile_fetch: "Nepodarilo sa získať profil od poskytovateľa.",
      oauth_no_email: "Facebook nezdieľal email — povoľ ho v nastaveniach Facebook účtu.",
      email_exists: 'Tento email je už registrovaný v SLICKLY s heslom. Zadaj heslo nižšie alebo si ho obnov cez "Zabudli ste heslo?".',
      oauth_registration_failed: "Vytvorenie zákazníckeho účtu zlyhalo. Pozri server log alebo kontaktuj podporu."
    };
    const oauthErrorMsg = computed(
      () => props.oauthError ? OAUTH_ERROR_MESSAGES[props.oauthError] ?? `Chyba: ${props.oauthError}` : null
    );
    async function goToAccount() {
      return;
    }
    function goToRegister() {
      emit("close");
      navigateTo("/register");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "font-sans" }, _attrs))} data-v-ac72e348>`);
      if (__props.oauthSuccess) {
        _push(`<div class="text-center py-6" data-v-ac72e348><div class="w-16 h-16 mx-auto mb-5 bg-green-50 border-2 border-green-200 flex items-center justify-center" data-v-ac72e348>`);
        _push(ssrRenderComponent(unref(CheckCircle), { class: "w-9 h-9 text-green-600" }, null, _parent));
        _push(`</div><h3 class="text-2xl font-black font-tech uppercase tracking-wide leading-none mb-2" data-v-ac72e348> Prihlásenie <span class="text-brand" data-v-ac72e348>úspešné</span></h3><div class="w-16 h-1 bg-brand skew-x-[-20deg] mx-auto mb-5" data-v-ac72e348></div><p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1" data-v-ac72e348>Prihlásený ako</p><p class="text-sm font-bold text-black mb-8 break-all" data-v-ac72e348>${ssrInterpolate(__props.oauthSuccess)}</p>`);
        _push(ssrRenderComponent(BaseButton, {
          variant: "primary",
          block: "",
          size: "lg",
          class: "uppercase font-bold tracking-widest py-5",
          onClick: goToAccount
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Pokračovať na môj účet `);
            } else {
              return [
                createTextVNode(" Pokračovať na môj účet ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<button type="button" class="mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors" data-v-ac72e348> Zavrieť a pokračovať v nákupe </button></div>`);
      } else if (showForgotPassword.value) {
        _push(`<div data-v-ac72e348><div class="flex items-center gap-3 mb-6" data-v-ac72e348><button type="button" class="text-gray-400 hover:text-black transition-colors" aria-label="Späť" data-v-ac72e348><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-ac72e348><path d="M19 12H5M5 12l7 7M5 12l7-7" data-v-ac72e348></path></svg></button><h2 class="text-xl font-black font-tech uppercase tracking-wider" data-v-ac72e348>Obnovenie hesla</h2></div>`);
        _push(ssrRenderComponent(ForgotPasswordForm, {
          onBack: ($event) => showForgotPassword.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div data-v-ac72e348>`);
        if (oauthErrorMsg.value) {
          _push(`<div class="mb-5 flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-4 text-sm" data-v-ac72e348>`);
          _push(ssrRenderComponent(unref(AlertCircle), { class: "w-5 h-5 flex-shrink-0 mt-0.5" }, null, _parent));
          _push(`<p data-v-ac72e348>${ssrInterpolate(oauthErrorMsg.value)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<form novalidate class="space-y-5" data-v-ac72e348>`);
        _push(ssrRenderComponent(AppHoneypot, {
          modelValue: honeypot.value,
          "onUpdate:modelValue": ($event) => honeypot.value = $event
        }, null, _parent));
        _push(`<div data-v-ac72e348><label for="login-email" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2" data-v-ac72e348>E-mail</label><div class="relative" data-v-ac72e348>`);
        _push(ssrRenderComponent(unref(Mail), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" }, null, _parent));
        _push(`<input id="login-email"${ssrRenderAttr("value", email.value)} type="email" required autocomplete="email" placeholder="vas@email.sk" class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-ac72e348></div></div><div data-v-ac72e348><div class="flex items-center justify-between mb-2" data-v-ac72e348><label for="login-password" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500" data-v-ac72e348>Heslo</label><button type="button" class="text-[10px] font-bold uppercase tracking-widest text-brand hover:underline" data-v-ac72e348> Zabudli ste heslo? </button></div><div class="relative" data-v-ac72e348>`);
        _push(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" }, null, _parent));
        _push(`<input id="login-password"${ssrRenderAttr("value", password.value)} type="password" required autocomplete="current-password" placeholder="••••••••" class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-ac72e348></div></div>`);
        if (error.value) {
          _push(`<div class="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-4 text-sm" data-v-ac72e348>`);
          _push(ssrRenderComponent(unref(AlertCircle), { class: "w-5 h-5 flex-shrink-0 mt-0.5" }, null, _parent));
          _push(`<p data-v-ac72e348>${ssrInterpolate(error.value)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(BaseButton, {
          type: "submit",
          variant: "primary",
          block: "",
          size: "lg",
          disabled: isLoading.value,
          class: "mt-2 uppercase font-bold tracking-widest py-5"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading.value) {
                _push2(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 mr-2 animate-spin" }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(isLoading.value ? "Prihlasujem..." : "Prihlásiť sa")}`);
            } else {
              return [
                isLoading.value ? (openBlock(), createBlock(unref(Loader2), {
                  key: 0,
                  class: "w-4 h-4 mr-2 animate-spin"
                })) : createCommentVNode("", true),
                createTextVNode(" " + toDisplayString(isLoading.value ? "Prihlasujem..." : "Prihlásiť sa"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(BiometricLogin, {
          onSuccess: ($event) => _ctx.$emit("success")
        }, null, _parent));
        _push(ssrRenderComponent(SocialLoginButtons, { context: "login" }, null, _parent));
        _push(`<div class="mt-4 pt-6 border-t border-gray-100 text-center" data-v-ac72e348><p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2" data-v-ac72e348>Ešte nemáte účet?</p>`);
        _push(ssrRenderComponent(BaseButton, {
          variant: "white",
          block: "",
          class: "border border-gray-200 uppercase font-black tracking-widest",
          onClick: goToRegister
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Zaregistrovať sa `);
            } else {
              return [
                createTextVNode(" Zaregistrovať sa ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></form></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/LoginForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-ac72e348"]]), { __name: "LoginForm" });

export { __nuxt_component_3 as default };
