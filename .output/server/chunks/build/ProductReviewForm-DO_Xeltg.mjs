import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { Star, CheckCircle, AlertCircle } from 'lucide-vue-next';
import { _ as _export_sfc, f as useUser, e as useShopwareContext, d as useRoute, c as useRouter, g as useState } from './server.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';
import BaseButton from './BaseButton-BJMOoNbK.mjs';
import AppHoneypot from './AppHoneypot-DdH0YZXD.mjs';
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

const MIN_CONTENT_LENGTH = 40;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductReviewForm",
  __ssrInlineRender: true,
  props: {
    productId: {}
  },
  emits: ["success", "cancel"],
  setup(__props, { emit: __emit }) {
    const { isLoggedIn } = useUser();
    const emit = __emit;
    useShopwareContext();
    useShopwareLanguage();
    const formData = ref({
      name: "",
      email: "",
      title: "",
      content: "",
      points: 0,
      shopware_honeypot: ""
    });
    const isSubmitting = ref(false);
    const error = ref(null);
    const success = ref(false);
    const currentContentLength = computed(() => formData.value.content.length);
    const route = useRoute();
    const router = useRouter();
    const openLoginModal = () => {
      useState("loginModalOpen", () => false).value = true;
      emit("cancel");
    };
    const goToRegister = () => {
      emit("cancel");
      router.push(`/register?redirectTo=${encodeURIComponent(route.fullPath)}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "font-sans" }, _attrs))} data-v-4491b202>`);
      if (!unref(isLoggedIn)) {
        _push(`<div class="px-6 pt-8 pb-4 md:px-12 animate-fade-in bg-white font-sans text-center flex flex-col items-center" data-v-4491b202><div class="w-24 h-24 bg-gray-50 flex items-center justify-center mb-8 border border-gray-100" data-v-4491b202>`);
        _push(ssrRenderComponent(unref(Star), { class: "w-12 h-12 text-yellow-400 animate-pulse-slow" }, null, _parent));
        _push(`</div><h4 class="text-xl font-black text-black mb-4 uppercase font-tech tracking-widest" data-v-4491b202>Recenzie sú len pre prihlásených</h4><p class="text-gray-500 mb-8 max-w-sm font-sans text-sm leading-relaxed" data-v-4491b202> Aby sme zabezpečili autenticitu recenzií, pridávať ich môžu len registrovaní zákazníci. Prosím, prihláste sa do svojho účtu. </p><div class="flex flex-col items-center gap-6 w-full" data-v-4491b202>`);
        _push(ssrRenderComponent(BaseButton, {
          variant: "primary",
          size: "lg",
          class: "w-full md:w-auto md:min-w-[280px] uppercase font-bold tracking-widest py-5",
          onClick: openLoginModal
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Prihlásiť sa `);
            } else {
              return [
                createTextVNode(" Prihlásiť sa ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="flex flex-col items-center gap-3 mt-4 pt-6 border-t border-gray-100 w-full text-center" data-v-4491b202><p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2" data-v-4491b202>Ešte nemáte účet?</p>`);
        _push(ssrRenderComponent(BaseButton, {
          variant: "white",
          block: "",
          class: "border border-gray-200 uppercase font-black tracking-widest",
          onClick: goToRegister
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Zaregistrovať sa `);
            } else {
              return [
                createTextVNode(" Zaregistrovať sa ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
      } else if (success.value) {
        _push(`<div class="flex flex-col items-center justify-center py-12 text-center animate-fade-in" data-v-4491b202>`);
        _push(ssrRenderComponent(unref(CheckCircle), { class: "w-16 h-16 text-green-500 mb-4" }, null, _parent));
        _push(`<h3 class="text-xl font-bold text-black mb-2 uppercase font-tech" data-v-4491b202>Ďakujeme za vašu recenziu!</h3><p class="text-gray-500" data-v-4491b202>Vaša recenzia bola úspešne odoslaná a po schválení administrátorom sa zobrazí na stránke.</p></div>`);
      } else {
        _push(`<form class="space-y-6" data-v-4491b202>`);
        _push(ssrRenderComponent(AppHoneypot, {
          modelValue: formData.value.shopware_honeypot,
          "onUpdate:modelValue": ($event) => formData.value.shopware_honeypot = $event
        }, null, _parent));
        _push(`<div data-v-4491b202><label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3" data-v-4491b202>Vaše hodnotenie *</label><div class="flex gap-2" data-v-4491b202><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<button type="button" class="transition-transform active:scale-95 group focus:outline-none"${ssrRenderAttr("aria-label", `Hodnotiť ${i} z 5 hviezdičiek`)} data-v-4491b202>`);
          _push(ssrRenderComponent(unref(Star), {
            class: ["w-8 h-8 transition-colors", i <= formData.value.points ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-transparent group-hover:text-yellow-200"]
          }, null, _parent));
          _push(`</button>`);
        });
        _push(`<!--]--></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-4491b202><div data-v-4491b202><label for="review-name" class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2" data-v-4491b202>Meno *</label><input id="review-name"${ssrRenderAttr("value", formData.value.name)} type="text" required placeholder="Vaše meno" class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium" data-v-4491b202></div><div data-v-4491b202><label for="review-email" class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2" data-v-4491b202>Email *</label><input id="review-email"${ssrRenderAttr("value", formData.value.email)} type="email" required placeholder="vas@email.sk" class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium" data-v-4491b202></div></div><div data-v-4491b202><label for="review-title" class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2" data-v-4491b202>Titulok recenzie *</label><input id="review-title"${ssrRenderAttr("value", formData.value.title)} type="text" required placeholder="Stručné zhrnutie (napr. Skvelý produkt!)" class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium" data-v-4491b202></div><div data-v-4491b202><label for="review-content" class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2" data-v-4491b202>Vaša skúsenosť *</label><textarea id="review-content" required rows="5"${ssrRenderAttr("placeholder", `Napíšte nám viac o vašej skúsenosti (minimálne ${MIN_CONTENT_LENGTH} znakov)...`)} class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium resize-none mb-1" data-v-4491b202>${ssrInterpolate(formData.value.content)}</textarea><div class="flex justify-between items-center px-1" data-v-4491b202><p class="text-[10px] text-gray-400 uppercase tracking-widest font-bold" data-v-4491b202>Zostáva aspoň ${ssrInterpolate(Math.max(0, MIN_CONTENT_LENGTH - currentContentLength.value))} znakov</p><p class="${ssrRenderClass([[currentContentLength.value >= MIN_CONTENT_LENGTH ? "text-green-500" : "text-gray-400"], "text-[10px] font-bold"])}" data-v-4491b202>${ssrInterpolate(currentContentLength.value)} znakov </p></div></div>`);
        if (error.value) {
          _push(`<div class="bg-red-50 text-red-600 p-4 flex items-start gap-3 text-sm animate-shake" data-v-4491b202>`);
          _push(ssrRenderComponent(unref(AlertCircle), { class: "w-5 h-5 flex-shrink-0 mt-0.5" }, null, _parent));
          _push(`<p data-v-4491b202>${ssrInterpolate(error.value)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-center justify-end gap-4 pt-4 border-t border-gray-100" data-v-4491b202><button type="button" class="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors" data-v-4491b202> Zrušiť </button>`);
        _push(ssrRenderComponent(BaseButton, {
          type: "submit",
          variant: "primary",
          class: "min-w-[180px]",
          disabled: isSubmitting.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(isSubmitting.value ? "Odosielam..." : "Odoslať recenziu")}`);
            } else {
              return [
                createTextVNode(toDisplayString(isSubmitting.value ? "Odosielam..." : "Odoslať recenziu"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></form>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ProductReviewForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductReviewForm = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-4491b202"]]), { __name: "ProductReviewForm" });

export { ProductReviewForm as default };
