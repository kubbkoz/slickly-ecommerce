import { defineComponent, ref, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { X, CheckCircle, Fingerprint, AlertCircle, Loader2 } from 'lucide-vue-next';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BiometricSetup",
  __ssrInlineRender: true,
  props: {
    email: {}
  },
  emits: ["dismiss", "registered"],
  setup(__props, { emit: __emit }) {
    const isLoading = ref(false);
    const isDone = ref(false);
    const error = ref(null);
    const supported = ref(false);
    const deviceName = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(supported)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative bg-white border border-gray-100 p-5" }, _attrs))} data-v-3995ace9><button type="button" class="absolute top-3 right-3 text-gray-300 hover:text-gray-600 transition-colors" aria-label="Zatvoriť" data-v-3995ace9>`);
        _push(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent));
        _push(`</button>`);
        if (unref(isDone)) {
          _push(`<div class="text-center py-2" data-v-3995ace9>`);
          _push(ssrRenderComponent(unref(CheckCircle), { class: "w-10 h-10 text-green-500 mx-auto mb-3" }, null, _parent));
          _push(`<p class="text-sm font-bold uppercase tracking-widest font-tech" data-v-3995ace9>Biometria aktivovaná!</p><p class="text-xs text-gray-500 mt-1 font-sans" data-v-3995ace9>Nabudúce sa prihlásite odtlačkom prsta.</p><button type="button" class="mt-4 text-[10px] font-bold uppercase tracking-widest text-brand hover:underline" data-v-3995ace9> Zatvoriť </button></div>`);
        } else {
          _push(`<div data-v-3995ace9><div class="flex items-start gap-4" data-v-3995ace9><div class="flex-shrink-0 w-10 h-10 bg-gray-50 flex items-center justify-center" data-v-3995ace9>`);
          _push(ssrRenderComponent(unref(Fingerprint), { class: "w-5 h-5 text-brand" }, null, _parent));
          _push(`</div><div class="flex-1 min-w-0" data-v-3995ace9><p class="text-xs font-bold uppercase tracking-widest font-tech mb-1" data-v-3995ace9>Rýchle prihlásenie</p><p class="text-xs text-gray-500 font-sans leading-relaxed" data-v-3995ace9> Nastaviť prihlásenie cez ${ssrInterpolate(unref(deviceName) || "biometriu")} pre rýchly prístup a potvrdenie objednávok. </p></div></div>`);
          if (unref(error)) {
            _push(`<div class="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-3 text-xs mt-4" data-v-3995ace9>`);
            _push(ssrRenderComponent(unref(AlertCircle), { class: "w-4 h-4 flex-shrink-0 mt-0.5" }, null, _parent));
            _push(`<p data-v-3995ace9>${ssrInterpolate(unref(error))}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex gap-2 mt-4" data-v-3995ace9><button type="button"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed" data-v-3995ace9>`);
          if (unref(isLoading)) {
            _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(Fingerprint), { class: "w-4 h-4" }, null, _parent));
          }
          _push(` ${ssrInterpolate(unref(isLoading) ? "Registrujem..." : "Aktivovať")}</button><button type="button" class="px-4 py-2.5 border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:border-gray-400 transition-colors" data-v-3995ace9> Neskôr </button></div></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/BiometricSetup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BiometricSetup = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-3995ace9"]]), { __name: "BiometricSetup" });

export { BiometricSetup as default };
