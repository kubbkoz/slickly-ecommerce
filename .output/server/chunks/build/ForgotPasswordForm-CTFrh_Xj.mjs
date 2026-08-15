import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
import { CheckCircle, Mail, AlertCircle, Loader2 } from 'lucide-vue-next';
import { u as useAuth } from './useAuth-CPF16ec2.mjs';
import BaseButton from './BaseButton-BJMOoNbK.mjs';
import { _ as _export_sfc } from './server.mjs';
import 'pinia';
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
  __name: "ForgotPasswordForm",
  __ssrInlineRender: true,
  emits: ["back"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const { isLoading } = useAuth();
    const email = ref("");
    const error = ref(null);
    const success = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "font-sans" }, _attrs))} data-v-b84b4c2a>`);
      if (success.value) {
        _push(`<div class="flex flex-col items-center py-8 text-center" data-v-b84b4c2a>`);
        _push(ssrRenderComponent(unref(CheckCircle), { class: "w-16 h-16 text-green-500 mb-5" }, null, _parent));
        _push(`<h3 class="text-lg font-black uppercase font-tech mb-2" data-v-b84b4c2a>Email bol odoslaný</h3><p class="text-sm text-gray-500 mb-8 max-w-xs" data-v-b84b4c2a> Ak je tento email v našej databáze, čoskoro dostanete odkaz na zmenu hesla. </p>`);
        _push(ssrRenderComponent(BaseButton, {
          variant: "secondary",
          onClick: ($event) => emit("back")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Späť na prihlásenie`);
            } else {
              return [
                createTextVNode("Späť na prihlásenie")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<form class="space-y-6" data-v-b84b4c2a><p class="text-sm text-gray-500" data-v-b84b4c2a> Zadajte Váš email a pošleme Vám odkaz na vytvorenie nového hesla. </p><div data-v-b84b4c2a><label for="recovery-email" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2" data-v-b84b4c2a>E-mail</label><div class="relative" data-v-b84b4c2a>`);
        _push(ssrRenderComponent(unref(Mail), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" }, null, _parent));
        _push(`<input id="recovery-email"${ssrRenderAttr("value", email.value)} type="email" required autocomplete="email" placeholder="vas@email.sk" class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} data-v-b84b4c2a></div></div>`);
        if (error.value) {
          _push(`<div class="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-4 text-sm" data-v-b84b4c2a>`);
          _push(ssrRenderComponent(unref(AlertCircle), { class: "w-5 h-5 flex-shrink-0 mt-0.5" }, null, _parent));
          _push(`<p data-v-b84b4c2a>${ssrInterpolate(error.value)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(BaseButton, {
          type: "submit",
          variant: "primary",
          block: "",
          size: "lg",
          disabled: unref(isLoading)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(isLoading)) {
                _push2(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 mr-2 animate-spin" }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(unref(isLoading) ? "Odosielam..." : "Odoslať odkaz")}`);
            } else {
              return [
                unref(isLoading) ? (openBlock(), createBlock(unref(Loader2), {
                  key: 0,
                  class: "w-4 h-4 mr-2 animate-spin"
                })) : createCommentVNode("", true),
                createTextVNode(" " + toDisplayString(unref(isLoading) ? "Odosielam..." : "Odoslať odkaz"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</form>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/ForgotPasswordForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ForgotPasswordForm = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-b84b4c2a"]]), { __name: "ForgotPasswordForm" });

export { ForgotPasswordForm as default };
