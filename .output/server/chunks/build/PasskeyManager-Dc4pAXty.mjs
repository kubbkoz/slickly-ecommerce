import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderAttr } from 'vue/server-renderer';
import { Fingerprint, ShieldCheck, AlertCircle, CheckCircle, Loader2, Trash2, Plus } from 'lucide-vue-next';
import { _ as _export_sfc } from './server.mjs';
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

const useWebAuthn = () => {
  const isSupported = async () => {
    return false;
  };
  const detectDeviceName = () => {
    return "Zariadenie";
  };
  const registerPasskey = async (email, deviceName) => {
    const { startRegistration } = await import('@simplewebauthn/browser');
    const options = await $fetch(
      "/api/webauthn/register-options",
      { method: "POST", body: { email } }
    );
    const credential = await startRegistration({ optionsJSON: options });
    await $fetch("/api/webauthn/register", {
      method: "POST",
      body: {
        email,
        deviceName: deviceName || detectDeviceName(),
        credential
      }
    });
  };
  const loginWithPasskey = async () => {
    const { startAuthentication } = await import('@simplewebauthn/browser');
    const options = await $fetch(
      "/api/webauthn/login-options",
      { method: "POST" }
    );
    const credential = await startAuthentication({ optionsJSON: options });
    await $fetch("/api/webauthn/login", {
      method: "POST",
      body: {
        credential: { ...credential, challenge: options.challenge }
      }
    });
  };
  const listPasskeys = async () => {
    const res = await $fetch("/api/webauthn/credentials");
    return res.credentials || [];
  };
  const deletePasskey = async (credentialId) => {
    await $fetch("/api/webauthn/credentials", {
      method: "DELETE",
      body: { credentialId }
    });
  };
  return {
    isSupported,
    detectDeviceName,
    registerPasskey,
    loginWithPasskey,
    listPasskeys,
    deletePasskey
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PasskeyManager",
  __ssrInlineRender: true,
  props: {
    email: {}
  },
  setup(__props) {
    const { detectDeviceName } = useWebAuthn();
    const supported = ref(false);
    const passkeys = ref([]);
    const isLoadingList = ref(true);
    const isAdding = ref(false);
    const deletingId = ref(null);
    const error = ref(null);
    const success = ref(null);
    const detectedDevice = computed(() => detectDeviceName());
    function formatDate(ts) {
      return new Intl.DateTimeFormat("sk-SK", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(new Date(ts));
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white border border-gray-100" }, _attrs))} data-v-bd5b7e3e><div class="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-gray-100" data-v-bd5b7e3e>`);
      _push(ssrRenderComponent(unref(Fingerprint), {
        class: "w-4 h-4 text-gray-900",
        "stroke-width": 1.8
      }, null, _parent));
      _push(`<h2 class="text-xs font-bold tracking-[0.2em] text-gray-900 font-sans uppercase leading-none" data-v-bd5b7e3e> Passkey / Biometria </h2>`);
      if (unref(passkeys).length) {
        _push(`<span class="ml-auto inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-600" data-v-bd5b7e3e>`);
        _push(ssrRenderComponent(unref(ShieldCheck), { class: "w-3 h-3" }, null, _parent));
        _push(` Aktívne </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="px-5 md:px-8 py-6 space-y-5" data-v-bd5b7e3e>`);
      if (!unref(supported)) {
        _push(`<div class="flex items-start gap-3 bg-gray-50 border border-gray-100 p-4 text-xs text-gray-600" data-v-bd5b7e3e>`);
        _push(ssrRenderComponent(unref(AlertCircle), { class: "w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" }, null, _parent));
        _push(`<p data-v-bd5b7e3e> Tento prehliadač/zariadenie nepodporuje biometrické prihlasovanie. Použite moderný prehliadač na zariadení s Face ID, Touch ID alebo Windows Hello. </p></div>`);
      } else {
        _push(`<!--[--><p class="text-sm text-gray-600 font-sans leading-relaxed" data-v-bd5b7e3e> Prihlasujte sa rýchlejšie a bezpečnejšie — bez hesla, jediným dotykom prsta alebo pohľadom. Passkey je viazaný na konkrétne zariadenie a nedá sa odcudziť. </p>`);
        if (unref(error)) {
          _push(`<div class="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-3 text-xs" data-v-bd5b7e3e>`);
          _push(ssrRenderComponent(unref(AlertCircle), { class: "w-4 h-4 flex-shrink-0 mt-0.5" }, null, _parent));
          _push(`<p data-v-bd5b7e3e>${ssrInterpolate(unref(error))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(success)) {
          _push(`<div class="flex items-start gap-3 bg-green-50 border border-green-100 text-green-700 p-3 text-xs" data-v-bd5b7e3e>`);
          _push(ssrRenderComponent(unref(CheckCircle), { class: "w-4 h-4 flex-shrink-0 mt-0.5" }, null, _parent));
          _push(`<p data-v-bd5b7e3e>${ssrInterpolate(unref(success))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(isLoadingList)) {
          _push(`<div class="flex items-center gap-2 text-xs text-gray-400 font-sans" data-v-bd5b7e3e>`);
          _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent));
          _push(` Načítavam zariadenia... </div>`);
        } else if (unref(passkeys).length === 0) {
          _push(`<div class="text-xs text-gray-500 font-sans italic" data-v-bd5b7e3e> Zatiaľ nemáte pridané žiadne passkey. Pridajte si toto zariadenie nižšie. </div>`);
        } else {
          _push(`<ul class="space-y-2" data-v-bd5b7e3e><!--[-->`);
          ssrRenderList(unref(passkeys), (pk) => {
            _push(`<li class="flex items-center gap-3 border border-gray-100 px-4 py-3 hover:border-gray-200 transition-colors" data-v-bd5b7e3e><div class="flex-shrink-0 w-9 h-9 bg-gray-50 flex items-center justify-center" data-v-bd5b7e3e>`);
            _push(ssrRenderComponent(unref(Fingerprint), { class: "w-4 h-4 text-brand" }, null, _parent));
            _push(`</div><div class="flex-1 min-w-0" data-v-bd5b7e3e><p class="text-xs font-bold uppercase tracking-widest font-tech truncate" data-v-bd5b7e3e>${ssrInterpolate(pk.deviceName)}</p><p class="text-[10px] text-gray-400 font-sans mt-0.5" data-v-bd5b7e3e>Pridané ${ssrInterpolate(formatDate(pk.createdAt))}</p></div><button type="button"${ssrIncludeBooleanAttr(unref(deletingId) === pk.id) ? " disabled" : ""} class="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"${ssrRenderAttr("aria-label", `Odstrániť ${pk.deviceName}`)} data-v-bd5b7e3e>`);
            if (unref(deletingId) === pk.id) {
              _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent));
            } else {
              _push(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4" }, null, _parent));
            }
            _push(`</button></li>`);
          });
          _push(`<!--]--></ul>`);
        }
        _push(`<button type="button"${ssrIncludeBooleanAttr(unref(isAdding)) ? " disabled" : ""} class="flex items-center justify-center gap-2 w-full py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed" data-v-bd5b7e3e>`);
        if (unref(isAdding)) {
          _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent));
        }
        _push(` ${ssrInterpolate(unref(isAdding) ? "Registrujem..." : `Pridať passkey (${unref(detectedDevice)})`)}</button><!--]-->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/PasskeyManager.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PasskeyManager = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-bd5b7e3e"]]), { __name: "PasskeyManager" });

export { PasskeyManager as default };
