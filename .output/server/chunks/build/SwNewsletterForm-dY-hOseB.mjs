import { defineComponent, ref, computed, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { u as useCmsElementConfig } from './useCmsElementConfig-DY8wkVjg.mjs';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
import { u as useNewsletter } from './useNewsletter-EwyUjPBW.mjs';
import { u as useSalutations } from './useSalutations-BJL9Pq5t.mjs';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { au as defu } from '../nitro/nitro.mjs';
import './server.mjs';
import 'pinia';
import 'vue-router';
import '@iconify/vue';
import '@shopware/api-client';
import '@shopware/helpers';
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
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
import 'node:url';
import '@iconify/utils';
import 'consola';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwNewsletterForm",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    let translations = {
      form: {
        subscribeLabel: "Subscribe to newsletter",
        unsubscribeLabel: "Unsubscribe from newsletter",
        action: "Action",
        email: "Email address",
        emailPlaceholder: "Enter email address...",
        salutation: "Salutation",
        salutationPlaceholder: "Enter salutation...",
        firstName: "First name",
        firstNamePlaceholder: "Enter first name...",
        lastName: "Last name",
        lastNamePlaceholder: "Enter last name...",
        privacy: "Privacy",
        privacyLabel: "I have read the data protection information.",
        submit: "Submit",
        newsletterBenefits: "Be aware of upcoming sales and events.Receive gifts and special offers!"
      }
    };
    translations = defu(useCmsTranslations(), translations);
    const loading = ref();
    const formSent = ref(false);
    ref([]);
    const subscriptionOptions = [
      {
        label: translations.form.subscribeLabel,
        value: "subscribe"
      },
      {
        label: translations.form.unsubscribeLabel,
        value: "unsubscribe"
      }
    ];
    const { getSalutations } = useSalutations();
    const { getConfigValue } = useCmsElementConfig(props.content);
    useNewsletter();
    const getFormTitle = computed(() => getConfigValue("title"));
    const state = reactive({
      option: subscriptionOptions[0]?.value ?? "subscribe",
      salutationId: "",
      firstName: "",
      lastName: "",
      email: "",
      checkbox: false
    });
    const rules = computed(() => {
      const temp = {
        email: {
          required,
          email
        },
        checkbox: {
          required,
          isTrue: (value) => value === true
        }
      };
      if (state.option === "subscribe") {
        temp.firstName = {
          required,
          minLength: 3
        };
        temp.lastName = {
          required,
          minLength: 3
        };
      }
      return temp;
    });
    const $v = useVuelidate(rules, state);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "w-full relative" }, _attrs))}>`);
      if (loading.value) {
        _push(`<div class="absolute inset-0 flex items-center justify-center z-10 bg-white/50"><div class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-gray-500"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<h3 class="pb-3 mb-10 border-b border-gray-300">${ssrInterpolate(getFormTitle.value ? getFormTitle.value : state.option === "subscribe" ? unref(translations).form.subscribeLabel : unref(translations).form.unsubscribeLabel)}</h3>`);
      if (!formSent.value) {
        _push(`<!--[--><div class="grid grid-cols-12 gap-5"><div class="col-span-12"><label for="option">${ssrInterpolate(unref(translations).form.action)} *</label><select id="option" name="option" class="appearance-none relative block w-full px-3 py-2 border border-outline-outline-variant placeholder-surface-on-surface-variant text-surface-on-surface rounded-md focus:border-brand-primary focus:outline-none focus:ring-brand-primary focus:z-10 sm:text-sm"><!--[-->`);
        ssrRenderList(subscriptionOptions, (subscription) => {
          _push(`<option${ssrRenderAttr("value", subscription.value)}${ssrIncludeBooleanAttr(Array.isArray(state.option) ? ssrLooseContain(state.option, subscription.value) : ssrLooseEqual(state.option, subscription.value)) ? " selected" : ""}>${ssrInterpolate(subscription.label)}</option>`);
        });
        _push(`<!--]--></select></div><div class="col-span-12"><label for="email-address">${ssrInterpolate(unref(translations).form.email)} *</label><input id="email-address"${ssrRenderAttr("value", state.email)} name="email" type="email" autocomplete="email" class="${ssrRenderClass([[
          unref($v).email.$error ? "border-red-600 focus:border-red-600" : "border-outline-outline-variant focus:border-brand-primary"
        ], "appearance-none relative block w-full px-3 py-2 border placeholder-surface-on-surface-variant text-surface-on-surface rounded-md focus:outline-none focus:ring-brand-primary focus:z-10 sm:text-sm"])}"${ssrRenderAttr("placeholder", unref(translations).form.emailPlaceholder)}>`);
        if (unref($v).email.$error && unref($v).email.$errors[0]?.$message) {
          _push(`<span class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300">${ssrInterpolate(unref($v).email.$errors[0].$message)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (state.option === "subscribe") {
          _push(`<div class="col-span-4"><label for="salutation">${ssrInterpolate(unref(translations).form.salutation)} *</label><select id="salutation" name="salutation" class="border-outline-outline-variant focus:border-brand-primaryappearance-none relative block w-full px-3 py-2 border placeholder-surface-on-surface-variant text-surface-on-surface rounded-md focus:outline-none focus:ring-brand-primary focus:z-10 sm:text-sm"><option disabled selected value="">${ssrInterpolate(unref(translations).form.salutationPlaceholder)}</option><!--[-->`);
          ssrRenderList(unref(getSalutations), (salutation) => {
            _push(`<option${ssrRenderAttr("value", salutation.id)}${ssrIncludeBooleanAttr(Array.isArray(state.salutationId) ? ssrLooseContain(state.salutationId, salutation.id) : ssrLooseEqual(state.salutationId, salutation.id)) ? " selected" : ""}>${ssrInterpolate(salutation.displayName)}</option>`);
          });
          _push(`<!--]--></select></div>`);
        } else {
          _push(`<!---->`);
        }
        if (state.option === "subscribe") {
          _push(`<div class="col-span-4"><label for="first-name">${ssrInterpolate(unref(translations).form.firstName)} *</label><input id="first-name"${ssrRenderAttr("value", state.firstName)} name="first-name" type="text" autocomplete="given-name" class="${ssrRenderClass([[
            unref($v).firstName?.$error ? "border-red-600 focus:border-red-600" : "border-outline-outline-variant focus:border-brand-primary"
          ], "appearance-none relative block w-full px-3 py-2 border placeholder-surface-on-surface-variant text-surface-on-surface rounded-md focus:outline-none focus:ring-brand-primary focus:z-10 sm:text-sm"])}"${ssrRenderAttr("placeholder", unref(translations).form.firstNamePlaceholder)}>`);
          if (unref($v).firstName?.$error && unref($v).firstName?.$errors[0]?.$message) {
            _push(`<span class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300">${ssrInterpolate(unref($v).firstName?.$errors[0].$message)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (state.option === "subscribe") {
          _push(`<div class="col-span-4"><label for="last-name">${ssrInterpolate(unref(translations).form.lastName)} *</label><input id="last-name"${ssrRenderAttr("value", state.lastName)} name="last-name" type="text" autocomplete="family-name" class="${ssrRenderClass([[
            unref($v).lastName?.$error ? "border-red-600 focus:border-red-600" : "border-outline-outline-variant focus:border-brand-primary"
          ], "appearance-none relative block w-full px-3 py-2 border placeholder-surface-on-surface-variant text-surface-on-surface rounded-md focus:outline-none focus:ring-brand-primary focus:z-10 sm:text-sm"])}"${ssrRenderAttr("placeholder", unref(translations).form.lastNamePlaceholder)}>`);
          if (unref($v).lastName?.$error && unref($v).lastName?.$errors[0]?.$message) {
            _push(`<span class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300">${ssrInterpolate(unref($v).lastName?.$errors[0].$message)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="col-span-12"><label>${ssrInterpolate(unref(translations).form.privacy)} *</label><div class="flex gap-3 items-start"><input id="privacy"${ssrIncludeBooleanAttr(Array.isArray(state.checkbox) ? ssrLooseContain(state.checkbox, null) : state.checkbox) ? " checked" : ""} name="privacy" type="checkbox" class="${ssrRenderClass([[
          unref($v).checkbox?.$error ? "border-red-600" : "border-gray-300"
        ], "mt-1 focus:ring-brand-primary h-4 w-4 border text-brand-primary rounded"])}"><div><label class="${ssrRenderClass([unref($v).checkbox?.$error ? "text-red-600" : ""])}" for="privacy">${ssrInterpolate(unref(translations).form.privacyLabel)}</label></div></div></div></div><div class="flex justify-end mt-10"><button class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-75" type="submit">${ssrInterpolate(unref(translations).form.submit)}</button></div><!--]-->`);
      } else {
        _push(`<p class="py-10 text-lg text-center">${ssrInterpolate(unref(translations).form.newsletterBenefits)}</p>`);
      }
      _push(`</form>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwNewsletterForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SwNewsletterForm = Object.assign(_sfc_main, { __name: "SwNewsletterForm" });

export { SwNewsletterForm as default };
