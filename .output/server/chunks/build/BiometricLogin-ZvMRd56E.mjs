import { defineComponent, ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { Loader2, Fingerprint, AlertCircle } from 'lucide-vue-next';
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
  __name: "BiometricLogin",
  __ssrInlineRender: true,
  emits: ["success"],
  setup(__props, { emit: __emit }) {
    const isLoading = ref(false);
    const error = ref(null);
    const supported = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(supported)) {
        _push(`<div${ssrRenderAttrs(_attrs)} data-v-bcc1cf5a><div class="flex items-center gap-3 my-4" data-v-bcc1cf5a><div class="flex-1 h-px bg-gray-200" data-v-bcc1cf5a></div><span class="text-[10px] font-bold uppercase tracking-widest text-gray-400" data-v-bcc1cf5a>alebo</span><div class="flex-1 h-px bg-gray-200" data-v-bcc1cf5a></div></div><button type="button"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} class="flex items-center justify-center gap-3 w-full py-3 px-4 border border-gray-200 bg-white hover:bg-gray-50 hover:border-black transition-all duration-200 text-sm font-bold uppercase tracking-widest text-gray-800 font-sans disabled:opacity-50 disabled:cursor-not-allowed" data-v-bcc1cf5a>`);
        if (unref(isLoading)) {
          _push(ssrRenderComponent(unref(Loader2), { class: "w-5 h-5 animate-spin text-brand" }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(Fingerprint), { class: "w-5 h-5 text-brand" }, null, _parent));
        }
        _push(` ${ssrInterpolate(unref(isLoading) ? "Overujem..." : "Prihlásiť biometriou")}</button>`);
        if (unref(error)) {
          _push(`<div class="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-3 text-xs mt-3" data-v-bcc1cf5a>`);
          _push(ssrRenderComponent(unref(AlertCircle), { class: "w-4 h-4 flex-shrink-0 mt-0.5" }, null, _parent));
          _push(`<p data-v-bcc1cf5a>${ssrInterpolate(unref(error))}</p></div>`);
        } else {
          _push(`<!---->`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/BiometricLogin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BiometricLogin = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-bcc1cf5a"]]), { __name: "BiometricLogin" });

export { BiometricLogin as default };
