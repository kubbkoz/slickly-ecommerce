import { defineComponent, ref, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderAttr, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { Loader2, Lock, Bookmark, Check } from 'lucide-vue-next';
import { f as useUser, a as useCart, g as useState } from './server.mjs';
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
  __name: "SaveCart",
  __ssrInlineRender: true,
  setup(__props) {
    const { isLoggedIn, user } = useUser();
    const { cartItems } = useCart();
    useState("loginModalOpen", () => false);
    const isSaving = ref(false);
    const savedHash = ref("");
    const copied = ref(false);
    const error = ref("");
    const savedUrl = computed(() => {
      if (!savedHash.value || true) return "";
    });
    computed(() => user.value?.id);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (!unref(savedHash)) {
        _push(`<button${ssrIncludeBooleanAttr(unref(isSaving)) ? " disabled" : ""} class="${ssrRenderClass([unref(isLoggedIn) ? "text-gray-500 hover:text-brand" : "text-gray-400 hover:text-gray-600", "flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-colors focus:outline-none disabled:opacity-50 group bg-transparent border-0 p-0"])}"${ssrRenderAttr("title", unref(isLoggedIn) ? "Uložiť košík na 30 dní" : "Vyžaduje prihlásenie")}>`);
        if (unref(isSaving)) {
          _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin text-brand" }, null, _parent));
        } else if (!unref(isLoggedIn)) {
          _push(ssrRenderComponent(unref(Lock), { class: "w-4 h-4" }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(Bookmark), { class: "w-4 h-4 group-hover:fill-brand transition-all" }, null, _parent));
        }
        _push(`<span class="hidden sm:block">Uložiť košík</span></button>`);
      } else {
        _push(`<div class="flex items-center gap-2 group">`);
        _push(ssrRenderComponent(unref(Check), { class: "w-4 h-4 text-green-600 flex-shrink-0" }, null, _parent));
        _push(`<button class="${ssrRenderClass([unref(copied) ? "text-green-600" : "text-gray-500 hover:text-brand", "text-[11px] font-bold uppercase tracking-widest transition-colors focus:outline-none"])}"${ssrRenderAttr("title", unref(savedUrl))}>${ssrInterpolate(unref(copied) ? "Skopírované!" : "Uložené")}</button><button class="text-[9px] text-gray-300 hover:text-gray-500 transition-colors focus:outline-none ml-1 hidden group-hover:block" title="Uložiť znovu (aktualizovať)"> ↺ </button></div>`);
      }
      if (unref(error)) {
        _push(`<p class="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">${ssrInterpolate(unref(error))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/SaveCart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main, { __name: "SaveCart" });

export { __nuxt_component_4 as default };
