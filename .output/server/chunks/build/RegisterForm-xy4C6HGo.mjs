import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { CheckCircle, User, Mail, Lock, MapPin, AlertCircle, Loader2 } from 'lucide-vue-next';
import { u as useCountries } from './useCountries-DcMVa9Fw.mjs';
import { _ as _export_sfc, f as useUser, d as useRoute } from './server.mjs';
import { u as useSalutations } from './useSalutations-BJL9Pq5t.mjs';
import { u as useAuth } from './useAuth-CPF16ec2.mjs';
import BaseButton from './BaseButton-BJMOoNbK.mjs';
import AppHoneypot from './AppHoneypot-DdH0YZXD.mjs';
import SocialLoginButtons from './SocialLoginButtons-DBcyBy6L.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "RegisterForm",
  __ssrInlineRender: true,
  setup(__props) {
    useUser();
    const { isLoading } = useAuth();
    const { getSalutations } = useSalutations();
    const { getCountries } = useCountries();
    const honeypot = ref("");
    const error = ref(null);
    const success = ref(false);
    const form = ref({
      salutationId: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
      street: "",
      zipcode: "",
      city: "",
      countryId: ""
    });
    const route = useRoute();
    const redirectTo = computed(() => route.query.redirectTo);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "font-sans max-w-2xl mx-auto" }, _attrs))} data-v-e4529ea4>`);
      if (success.value) {
        _push(`<div class="flex flex-col items-center py-16 text-center" data-v-e4529ea4>`);
        _push(ssrRenderComponent(unref(CheckCircle), { class: "w-20 h-20 text-green-500 mb-6" }, null, _parent));
        _push(`<h2 class="text-3xl font-black uppercase font-tech tracking-tight mb-3" data-v-e4529ea4>Registrácia úspešná!</h2><p class="text-gray-500 mb-8" data-v-e4529ea4>Váš účet bol vytvorený. Presmerúvame Vás ${ssrInterpolate(unref(redirectTo) ? "späť k produktu" : "do profilu")}…</p>`);
        _push(ssrRenderComponent(BaseButton, {
          to: unref(redirectTo) || "/account",
          variant: "primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(redirectTo) ? "Späť k produktu" : "Prejsť do profilu")}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(redirectTo) ? "Späť k produktu" : "Prejsť do profilu"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<form novalidate class="space-y-8" data-v-e4529ea4>`);
        _push(ssrRenderComponent(AppHoneypot, {
          modelValue: honeypot.value,
          "onUpdate:modelValue": ($event) => honeypot.value = $event
        }, null, _parent));
        _push(`<div class="flex items-center gap-4" data-v-e4529ea4><span class="w-1.5 h-8 bg-brand flex-shrink-0" data-v-e4529ea4></span><h1 class="text-3xl font-black font-tech uppercase tracking-tighter" data-v-e4529ea4>Registrácia</h1></div><section class="space-y-5" data-v-e4529ea4><h2 class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 pb-2" data-v-e4529ea4> Osobné údaje </h2><div class="grid grid-cols-1 md:grid-cols-2 gap-5" data-v-e4529ea4><div class="md:col-span-2" data-v-e4529ea4><label for="reg-salutation" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2" data-v-e4529ea4> Oslovenie </label><select id="reg-salutation" required class="w-full p-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} data-v-e4529ea4><!--[-->`);
        ssrRenderList(unref(getSalutations), (sal) => {
          _push(`<option${ssrRenderAttr("value", sal.id)} data-v-e4529ea4${ssrIncludeBooleanAttr(Array.isArray(form.value.salutationId) ? ssrLooseContain(form.value.salutationId, sal.id) : ssrLooseEqual(form.value.salutationId, sal.id)) ? " selected" : ""}>${ssrInterpolate(sal.displayName)}</option>`);
        });
        _push(`<!--]--></select></div><div data-v-e4529ea4><label for="reg-firstname" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2" data-v-e4529ea4>Meno *</label><div class="relative" data-v-e4529ea4>`);
        _push(ssrRenderComponent(unref(User), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" }, null, _parent));
        _push(`<input id="reg-firstname"${ssrRenderAttr("value", form.value.firstName)} type="text" required autocomplete="given-name" placeholder="Jozef" class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} data-v-e4529ea4></div></div><div data-v-e4529ea4><label for="reg-lastname" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2" data-v-e4529ea4>Priezvisko *</label><div class="relative" data-v-e4529ea4>`);
        _push(ssrRenderComponent(unref(User), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" }, null, _parent));
        _push(`<input id="reg-lastname"${ssrRenderAttr("value", form.value.lastName)} type="text" required autocomplete="family-name" placeholder="Novák" class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} data-v-e4529ea4></div></div><div class="md:col-span-2" data-v-e4529ea4><label for="reg-email" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2" data-v-e4529ea4>E-mail *</label><div class="relative" data-v-e4529ea4>`);
        _push(ssrRenderComponent(unref(Mail), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" }, null, _parent));
        _push(`<input id="reg-email"${ssrRenderAttr("value", form.value.email)} type="email" required autocomplete="email" placeholder="email@priklad.sk" class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} data-v-e4529ea4></div></div><div data-v-e4529ea4><label for="reg-password" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2" data-v-e4529ea4>Heslo * (min. 8 znakov)</label><div class="relative" data-v-e4529ea4>`);
        _push(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" }, null, _parent));
        _push(`<input id="reg-password"${ssrRenderAttr("value", form.value.password)} type="password" required minlength="8" autocomplete="new-password" placeholder="••••••••" class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} data-v-e4529ea4></div></div><div data-v-e4529ea4><label for="reg-password-confirm" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2" data-v-e4529ea4>Potvrďte heslo *</label><div class="relative" data-v-e4529ea4>`);
        _push(ssrRenderComponent(unref(Lock), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" }, null, _parent));
        _push(`<input id="reg-password-confirm"${ssrRenderAttr("value", form.value.passwordConfirm)} type="password" required minlength="8" autocomplete="new-password" placeholder="••••••••" class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} data-v-e4529ea4></div></div></div></section><section class="space-y-5" data-v-e4529ea4><h2 class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 pb-2" data-v-e4529ea4> Fakturačná adresa </h2><div class="grid grid-cols-1 md:grid-cols-2 gap-5" data-v-e4529ea4><div class="md:col-span-2" data-v-e4529ea4><label for="reg-street" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2" data-v-e4529ea4>Ulica a číslo *</label><div class="relative" data-v-e4529ea4>`);
        _push(ssrRenderComponent(unref(MapPin), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" }, null, _parent));
        _push(`<input id="reg-street"${ssrRenderAttr("value", form.value.street)} type="text" required autocomplete="street-address" placeholder="Hlavná 123" class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} data-v-e4529ea4></div></div><div data-v-e4529ea4><label for="reg-city" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2" data-v-e4529ea4>Mesto *</label><input id="reg-city"${ssrRenderAttr("value", form.value.city)} type="text" required autocomplete="address-level2" placeholder="Bratislava" class="w-full p-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} data-v-e4529ea4></div><div data-v-e4529ea4><label for="reg-zip" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2" data-v-e4529ea4>PSČ *</label><input id="reg-zip"${ssrRenderAttr("value", form.value.zipcode)} type="text" required autocomplete="postal-code" placeholder="831 01" class="w-full p-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} data-v-e4529ea4></div><div class="md:col-span-2" data-v-e4529ea4><label for="reg-country" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2" data-v-e4529ea4>Krajina *</label><select id="reg-country" required class="w-full p-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} data-v-e4529ea4><!--[-->`);
        ssrRenderList(unref(getCountries), (country) => {
          _push(`<option${ssrRenderAttr("value", country.id)} data-v-e4529ea4${ssrIncludeBooleanAttr(Array.isArray(form.value.countryId) ? ssrLooseContain(form.value.countryId, country.id) : ssrLooseEqual(form.value.countryId, country.id)) ? " selected" : ""}>${ssrInterpolate(country.name)}</option>`);
        });
        _push(`<!--]--></select></div></div></section>`);
        if (error.value) {
          _push(`<div class="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-4 text-sm" data-v-e4529ea4>`);
          _push(ssrRenderComponent(unref(AlertCircle), { class: "w-5 h-5 flex-shrink-0 mt-0.5" }, null, _parent));
          _push(`<p data-v-e4529ea4>${ssrInterpolate(error.value)}</p></div>`);
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
              _push2(` ${ssrInterpolate(unref(isLoading) ? "Registrujem..." : "Vytvoriť účet")}`);
            } else {
              return [
                unref(isLoading) ? (openBlock(), createBlock(unref(Loader2), {
                  key: 0,
                  class: "w-4 h-4 mr-2 animate-spin"
                })) : createCommentVNode("", true),
                createTextVNode(" " + toDisplayString(unref(isLoading) ? "Registrujem..." : "Vytvoriť účet"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<p class="text-center text-xs text-gray-400" data-v-e4529ea4> Kliknutím súhlasíte s <a href="/obchodne-podmienky" class="text-brand hover:underline font-bold" data-v-e4529ea4>obchodnými podmienkami</a> a <a href="/ochrana-sukromia" class="text-brand hover:underline font-bold" data-v-e4529ea4>ochranou súkromia</a>. </p>`);
        _push(ssrRenderComponent(SocialLoginButtons, { context: "register" }, null, _parent));
        _push(`</form>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/RegisterForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RegisterForm = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-e4529ea4"]]), { __name: "RegisterForm" });

export { RegisterForm as default };
