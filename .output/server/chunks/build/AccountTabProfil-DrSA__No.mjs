import { I as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
import { Camera, Loader2 } from 'lucide-vue-next';
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
  __name: "AccountTabProfil",
  __ssrInlineRender: true,
  props: {
    user: {},
    currentAvatar: {}
  },
  emits: ["open-avatar-modal"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const profileFirstName = ref(props.user?.firstName || "");
    const profileLastName = ref(props.user?.lastName || "");
    const profileBirthday = ref(props.user?.birthday || "");
    const isSavingProfile = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in space-y-6" }, _attrs))}><div class="bg-white p-8 shadow-sm"><div class="pb-5 border-b border-gray-100 mb-6"><h2 class="text-xl font-black uppercase tracking-wide font-tech">Osobné údaje</h2></div><div class="max-w-xl"><div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8 border-b border-gray-100"><div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-black font-black text-xl flex-shrink-0 overflow-hidden relative group border-2 border-gray-200">`);
      if (__props.currentAvatar) {
        _push(`<img${ssrRenderAttr("src", __props.currentAvatar)} alt="avatar" class="w-full h-full object-cover transition-all group-hover:brightness-75">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="button" class="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 transition-all rounded-full" aria-label="Zmeniť avatar">`);
      _push(ssrRenderComponent(unref(Camera), { class: "w-6 h-6 text-white drop-shadow-md" }, null, _parent));
      _push(`</button></div><div><h3 class="text-xs font-bold text-black uppercase tracking-widest mb-1">Profilová fotografia</h3><p class="text-[11px] text-gray-500 mb-3 font-sans">Zmeňte svoj vzhľad v systéme a na fórach.</p><button type="button" class="text-[10px] font-bold uppercase tracking-widest text-brand hover:text-white transition-colors border border-brand hover:bg-brand px-4 py-2 bg-transparent"> Zmeniť avatar </button></div></div><form class="space-y-6"><div class="grid grid-cols-1 sm:grid-cols-2 gap-5"><div><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Meno</label><input${ssrRenderAttr("value", profileFirstName.value)} type="text" class="w-full px-5 py-3 bg-gray-50 border border-gray-200 text-sm font-medium text-black focus:outline-none focus:border-brand transition-colors rounded-default"></div><div><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Priezvisko</label><input${ssrRenderAttr("value", profileLastName.value)} type="text" class="w-full px-5 py-3 bg-gray-50 border border-gray-200 text-sm font-medium text-black focus:outline-none focus:border-brand transition-colors rounded-default"></div></div><div><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Dátum narodenia</label><input${ssrRenderAttr("value", profileBirthday.value)} type="date" class="w-full px-5 py-3 bg-gray-50 border border-gray-200 text-sm font-medium text-black focus:outline-none focus:border-brand transition-colors rounded-default"><p class="text-[10px] text-brand mt-2 font-bold italic tracking-wide">Ak budete mať sviatok, možno vám príde nejaký darček :)</p></div><div><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label><input${ssrRenderAttr("value", __props.user?.email)} type="email" disabled class="w-full px-5 py-3 bg-gray-50 border border-gray-100 text-sm font-medium text-gray-400 rounded-default cursor-not-allowed"><p class="text-[10px] text-gray-400 mt-2 font-sans">Email nie je možné zmeniť.</p></div><div class="pt-8 mt-4 border-t border-gray-100"><h3 class="text-[12px] font-bold uppercase tracking-widest text-black mb-5">Zmena hesla</h3><div class="space-y-4"><input type="password" placeholder="Aktuálne heslo" class="w-full px-5 py-3 bg-gray-50 border border-gray-200 text-sm font-medium text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors rounded-default"><input type="password" placeholder="Nové heslo" class="w-full px-5 py-3 bg-gray-50 border border-gray-200 text-sm font-medium text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors rounded-default"></div></div><div class="pt-8 flex items-center justify-between"><button type="submit" class="px-10 py-3.5 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand transition-colors duration-200">`);
      if (isSavingProfile.value) {
        _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent));
      } else {
        _push(`<span>Uložiť zmeny</span>`);
      }
      _push(`</button><button type="button" class="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors underline"> Zmazať účet </button></div></form></div></div>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/account/AccountTabProfil.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main, { __name: "AccountTabProfil" });

export { __nuxt_component_9 as default };
