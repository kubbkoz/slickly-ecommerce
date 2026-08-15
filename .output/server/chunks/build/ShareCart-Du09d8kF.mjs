import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { Loader2, Share2, Check, Link } from 'lucide-vue-next';
import { o as onClickOutside } from './index-B6MI764M.mjs';
import { a as useCart } from './server.mjs';
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

const shareTitle = "Môj nákupný košík — SLICKLY";
const shareText = "Pozri si môj výber produktov na SLICKLY!";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ShareCart",
  __ssrInlineRender: true,
  setup(__props) {
    const { cartItems } = useCart();
    const isOpen = ref(false);
    const isSaving = ref(false);
    const copied = ref(false);
    ref("");
    const dropdownRef = ref(null);
    onClickOutside(dropdownRef, () => {
      isOpen.value = false;
    });
    const shareUrl = computed(() => {
      return "";
    });
    const socials = computed(() => [
      {
        label: "Facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`,
        color: "bg-[#1877F2]"
      },
      {
        label: "WhatsApp",
        href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl.value)}`,
        color: "bg-[#25D366]"
      },
      {
        label: "X / Twitter",
        href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl.value)}&text=${encodeURIComponent(shareText)}`,
        color: "bg-black border border-gray-600"
      },
      {
        label: "Email",
        href: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl.value)}`,
        color: "bg-gray-600"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative",
        ref_key: "dropdownRef",
        ref: dropdownRef
      }, _attrs))}><button${ssrIncludeBooleanAttr(unref(isSaving)) ? " disabled" : ""} class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-brand transition-colors focus:outline-none disabled:opacity-60 bg-transparent border-0 p-0">`);
      if (unref(isSaving)) {
        _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Share2), { class: "w-4 h-4" }, null, _parent));
      }
      _push(`<span class="hidden sm:block">Zdieľať košík</span></button>`);
      if (unref(isOpen)) {
        _push(`<div class="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-100 shadow-xl z-50 origin-top-left"><div class="px-4 py-3 border-b border-gray-100"><p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Zdieľať košík</p></div><div class="px-4 py-3 border-b border-gray-100 bg-gray-50"><p class="text-[10px] text-gray-400 font-sans mb-1 uppercase font-bold tracking-widest">Permanentný link</p><div class="flex items-center gap-2"><code class="text-[11px] text-gray-700 truncate flex-1 font-mono">${ssrInterpolate(unref(shareUrl))}</code><button class="flex-shrink-0 flex items-center gap-1 px-2 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">`);
        if (unref(copied)) {
          _push(ssrRenderComponent(unref(Check), { class: "w-3 h-3 text-green-400" }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(Link), { class: "w-3 h-3" }, null, _parent));
        }
        _push(` ${ssrInterpolate(unref(copied) ? "OK" : "Kopírovať")}</button></div></div><div class="px-4 py-3"><p class="text-[9px] font-bold uppercase tracking-widest text-gray-300 mb-2">Sociálne siete</p><div class="grid grid-cols-4 gap-2"><!--[-->`);
        ssrRenderList(unref(socials), (social) => {
          _push(`<a${ssrRenderAttr("href", social.href)} target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-1 group"${ssrRenderAttr("aria-label", social.label)}><div class="${ssrRenderClass(["w-10 h-10 flex items-center justify-center text-white text-[11px] font-black transition-all group-hover:scale-110", social.color])}">${ssrInterpolate(social.label.charAt(0))}</div><span class="text-[9px] text-gray-400 group-hover:text-brand transition-colors font-sans text-center">${ssrInterpolate(social.label.split("/")[0].trim())}</span></a>`);
        });
        _push(`<!--]--></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/ShareCart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "ShareCart" });

export { __nuxt_component_3 as default };
