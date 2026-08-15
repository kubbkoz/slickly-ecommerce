import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import __nuxt_component_1 from './CheckoutSteps-fIRCoRAa.mjs';
import __nuxt_component_2 from './AppModal-CMHCLJuP.mjs';
import __nuxt_component_3 from './LoginForm-B-UFijii.mjs';
import { defineComponent, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { ShieldCheck, User } from 'lucide-vue-next';
import { _ as _export_sfc, f as useUser, g as useState, b as useLocalePath } from './server.mjs';
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
import './BaseButton-BJMOoNbK.mjs';
import './AppHoneypot-DdH0YZXD.mjs';
import './ForgotPasswordForm-CTFrh_Xj.mjs';
import './useAuth-CPF16ec2.mjs';
import './SocialLoginButtons-DBcyBy6L.mjs';
import './BiometricLogin-ZvMRd56E.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cart",
  __ssrInlineRender: true,
  setup(__props) {
    const { user, isLoggedIn } = useUser();
    const isLoginModalOpen = useState("loginModalOpen", () => false);
    const localePath = useLocalePath();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_CheckoutSteps = __nuxt_component_1;
      const _component_AppModal = __nuxt_component_2;
      const _component_LoginForm = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 font-sans flex flex-col" }, _attrs))} data-v-45437645><header class="bg-black flex-shrink-0 shadow-xl fixed top-0 left-0 right-0 z-50" data-v-45437645><div class="h-[3px] bg-amber w-full" data-v-45437645></div><div class="container mx-auto px-4 lg:px-8 h-[72px] flex items-center justify-between" data-v-45437645><div class="w-auto lg:w-[300px] flex items-center gap-5 flex-shrink-0" data-v-45437645>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/"),
        "aria-label": "SLICKLY Domov",
        class: "font-tech font-black uppercase leading-none tracking-tighter flex items-baseline text-white text-[2.5rem]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-45437645${_scopeId}>SL</span><span class="logo-i-wrap" data-v-45437645${_scopeId}><span class="logo-i-dot bg-amber" data-v-45437645${_scopeId}></span>I</span><span data-v-45437645${_scopeId}>CKLY</span>`);
          } else {
            return [
              createVNode("span", null, "SL"),
              createVNode("span", { class: "logo-i-wrap" }, [
                createVNode("span", { class: "logo-i-dot bg-amber" }),
                createTextVNode("I")
              ]),
              createVNode("span", null, "CKLY")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="hidden lg:flex items-center gap-2 border-l border-gray-700 pl-5 text-gray-200" data-v-45437645>`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "w-4 h-4 text-amber flex-shrink-0" }, null, _parent));
      _push(`<span class="text-xs font-bold uppercase tracking-widest whitespace-nowrap" data-v-45437645>Bezpečný nákup</span></div></div><div class="hidden lg:flex flex-1 justify-center items-center" data-v-45437645>`);
      _push(ssrRenderComponent(_component_CheckoutSteps, {
        "current-step": 1,
        surface: "dark"
      }, null, _parent));
      _push(`</div><div class="w-auto lg:w-[300px] flex justify-end flex-shrink-0" data-v-45437645><button class="flex items-center gap-2 text-white hover:text-amber transition-colors bg-gray-900 border border-gray-700 hover:border-gray-500 px-4 py-2.5 focus:outline-none" aria-label="Prihlásiť sa / Môj účet" data-v-45437645>`);
      _push(ssrRenderComponent(unref(User), { class: "w-4 h-4 flex-shrink-0" }, null, _parent));
      _push(`<span class="text-[11px] font-bold uppercase tracking-widest font-sans" data-v-45437645>`);
      if (unref(isLoggedIn) && unref(user)?.firstName) {
        _push(`<!--[-->${ssrInterpolate(unref(user).firstName)}<!--]-->`);
      } else {
        _push(`<!--[-->Prihlásiť sa<!--]-->`);
      }
      _push(`</span></button></div></div><div class="lg:hidden bg-amber py-2.5 flex justify-center border-t border-black/10" data-v-45437645>`);
      _push(ssrRenderComponent(_component_CheckoutSteps, {
        "current-step": 1,
        surface: "amber"
      }, null, _parent));
      _push(`</div></header><div class="h-[123px] lg:h-[75px] flex-shrink-0" data-v-45437645></div><main class="flex-1" data-v-45437645>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="border-t border-gray-200 bg-white py-4 flex-shrink-0" data-v-45437645><div class="container mx-auto px-4 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest font-sans" data-v-45437645> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} SLICKLY s.r.o. <span class="mx-2 text-gray-300" data-v-45437645>·</span>Bezpečné SSL šifrovanie <span class="mx-2 text-gray-300" data-v-45437645>·</span>GDPR </div></footer>`);
      _push(ssrRenderComponent(_component_AppModal, {
        "is-open": unref(isLoginModalOpen),
        title: "Prihlásenie",
        onClose: ($event) => isLoginModalOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_LoginForm, {
              onSuccess: ($event) => isLoginModalOpen.value = false,
              onClose: ($event) => isLoginModalOpen.value = false
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_LoginForm, {
                onSuccess: ($event) => isLoginModalOpen.value = false,
                onClose: ($event) => isLoginModalOpen.value = false
              }, null, 8, ["onSuccess", "onClose"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/cart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cart = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-45437645"]]);

export { cart as default };
