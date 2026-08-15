import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Loader2, ShoppingBag, ShoppingCart, Link, Check, Copy, Trash2 } from 'lucide-vue-next';
import { f as useUser, e as useShopwareContext, m as useI18n } from './server.mjs';
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
  __name: "AccountTabUlozenKosik",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useUser();
    useShopwareContext();
    const { locale } = useI18n();
    const saves = ref([]);
    const isLoading = ref(true);
    const restoringHash = ref("");
    const deletingHash = ref("");
    const copiedHash = ref("");
    computed(() => user.value?.id);
    function formatDate(ts) {
      const loc = locale.value === "cz" ? "cs-CZ" : `${locale.value}-${locale.value.toUpperCase()}`;
      return new Date(ts).toLocaleDateString(loc, {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white shadow-sm p-8 animate-fade-in" }, _attrs))}><div class="mb-8"><h2 class="text-xl font-black uppercase tracking-wide font-tech">Uložené košíky</h2><p class="text-sm text-gray-500 font-sans mt-1">Košíky uložené na 30 dní. Zdieľajte ich alebo obnovte neskôr.</p></div>`);
      if (unref(isLoading)) {
        _push(`<div class="flex items-center justify-center py-20">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "w-8 h-8 animate-spin text-brand" }, null, _parent));
        _push(`</div>`);
      } else if (unref(saves).length === 0) {
        _push(`<div class="flex flex-col items-center justify-center py-20 text-center">`);
        _push(ssrRenderComponent(unref(ShoppingBag), { class: "w-16 h-16 text-gray-200 mb-4" }, null, _parent));
        _push(`<h3 class="text-sm font-bold uppercase font-tech text-gray-400 mb-2">Zatiaľ žiadne uložené košíky</h3><p class="text-sm text-gray-400 font-sans max-w-xs"> V košíku kliknite na <strong class="text-gray-600">„Uložiť košík&quot;</strong> a link bude dostupný tu. </p></div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(saves), (save) => {
          _push(`<div class="bg-white border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4"><div class="flex items-center gap-4 flex-1 min-w-0"><div class="w-10 h-10 bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">`);
          _push(ssrRenderComponent(unref(ShoppingCart), { class: "w-5 h-5 text-gray-400" }, null, _parent));
          _push(`</div><div class="min-w-0"><p class="text-sm font-bold text-black uppercase tracking-wide font-tech">${ssrInterpolate(save.itemCount)} ${ssrInterpolate(save.itemCount === 1 ? "produkt" : save.itemCount < 5 ? "produkty" : "produktov")}</p><p class="text-[11px] text-gray-400 font-sans mt-0.5">${ssrInterpolate(formatDate(save.createdAt))}</p><div class="flex items-center gap-1.5 mt-1.5">`);
          _push(ssrRenderComponent(unref(Link), { class: "w-3 h-3 text-gray-300 flex-shrink-0" }, null, _parent));
          _push(`<code class="text-[10px] text-gray-400 font-mono truncate max-w-[220px]"> /cart?share=${ssrInterpolate(save.hash)}</code></div></div></div><div class="flex items-center gap-2 flex-shrink-0"><button class="${ssrRenderClass([unref(copiedHash) === save.hash ? "border-green-200 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:border-black hover:text-black", "flex items-center gap-1.5 px-3 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all"])}">`);
          if (unref(copiedHash) === save.hash) {
            _push(ssrRenderComponent(unref(Check), { class: "w-3.5 h-3.5" }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(Copy), { class: "w-3.5 h-3.5" }, null, _parent));
          }
          _push(` ${ssrInterpolate(unref(copiedHash) === save.hash ? "Skopírované" : "Kopírovať")}</button><button${ssrIncludeBooleanAttr(unref(restoringHash) === save.hash) ? " disabled" : ""} class="flex items-center gap-1.5 px-3 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand transition-all disabled:opacity-50">`);
          if (unref(restoringHash) === save.hash) {
            _push(ssrRenderComponent(unref(Loader2), { class: "w-3.5 h-3.5 animate-spin" }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(ShoppingCart), { class: "w-3.5 h-3.5" }, null, _parent));
          }
          _push(` Obnoviť </button><button${ssrIncludeBooleanAttr(unref(deletingHash) === save.hash) ? " disabled" : ""} class="flex items-center justify-center w-9 h-9 border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-all disabled:opacity-50" aria-label="Odstrániť">`);
          if (unref(deletingHash) === save.hash) {
            _push(ssrRenderComponent(unref(Loader2), { class: "w-3.5 h-3.5 animate-spin" }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(Trash2), { class: "w-3.5 h-3.5" }, null, _parent));
          }
          _push(`</button></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/account/AccountTabUlozenKosik.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main, { __name: "AccountTabUlozenKosik" });

export { __nuxt_component_7 as default };
