import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { Loader2, UserCheck, CheckCircle, Truck, CreditCard, MapPin, Package, Mail, Phone, User, ArrowRight, Clock } from 'lucide-vue-next';
import { d as useRoute, b as useLocalePath, M as useInternationalization, g as useState, i as useRuntimeConfig } from './server.mjs';
import { u as useOrderDetails } from './useOrderDetails-CE2XJ7gX.mjs';
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
import './useDefaultOrderAssociations-WycTFxJ-.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const orderId = route.params.id;
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    const config = useRuntimeConfig();
    const dobierkaProductId = config.public.shopware.ids.products?.dobierka;
    const balneBikeId = config.public.shopware.ids.products?.balneBike;
    const balneEbikeId = config.public.shopware.ids.products?.balneEbike;
    const {
      order,
      loadOrderDetails,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      subtotal,
      total,
      shippingCosts,
      status
    } = useOrderDetails(orderId);
    const checkoutNavStep = useState("checkoutNavStep", () => 4);
    checkoutNavStep.value = 4;
    const justRegistered = useState("checkoutJustRegistered", () => false);
    const formatPrice = (price) => new Intl.NumberFormat("sk-SK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
    const dobierkaLineItem = computed(() => {
      if (!dobierkaProductId || !order.value) return null;
      return order.value.lineItems?.find((li) => li.referencedId === dobierkaProductId) ?? null;
    });
    const dobierkaPrice = computed(() => dobierkaLineItem.value?.price?.totalPrice ?? 0);
    const balneBikeLineItem = computed(() => {
      if (!balneBikeId || !order.value) return null;
      return order.value.lineItems?.find((li) => li.referencedId === balneBikeId) ?? null;
    });
    const balneEbikeLineItem = computed(() => {
      if (!balneEbikeId || !order.value) return null;
      return order.value.lineItems?.find((li) => li.referencedId === balneEbikeId) ?? null;
    });
    const balneBikePrice = computed(() => balneBikeLineItem.value?.price?.totalPrice ?? 0);
    const balneEbikePrice = computed(() => balneEbikeLineItem.value?.price?.totalPrice ?? 0);
    const subtotalDisplayed = computed(() => Math.max(0, (subtotal.value || 0) - dobierkaPrice.value - balneBikePrice.value - balneEbikePrice.value));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto px-4 lg:px-8 max-w-3xl" }, _attrs))}>`);
      if (!unref(order)) {
        _push(`<div class="flex flex-col items-center justify-center py-24 gap-4">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "w-10 h-10 animate-spin text-brand" }, null, _parent));
        _push(`<p class="text-sm text-gray-500 font-bold uppercase tracking-widest">Načítavam objednávku...</p></div>`);
      } else {
        _push(`<div class="space-y-4 animate-fade-in">`);
        if (unref(justRegistered)) {
          _push(`<div class="flex items-start gap-3 bg-green-50 border border-green-200 px-5 py-4">`);
          _push(ssrRenderComponent(unref(UserCheck), { class: "w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" }, null, _parent));
          _push(`<div><div class="text-sm font-bold text-green-800">Účet bol úspešne vytvorený</div><div class="text-xs text-green-700 mt-0.5 font-sans">Boli ste automaticky prihlásení. Všetky vaše objednávky nájdete v sekcii Môj účet.</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="bg-white border-t-4 border-brand shadow-sm text-center px-8 pt-12 pb-8"><div class="w-20 h-20 bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6">`);
        _push(ssrRenderComponent(unref(CheckCircle), { class: "w-10 h-10 text-green-600" }, null, _parent));
        _push(`</div><h1 class="text-3xl md:text-4xl font-black font-tech uppercase tracking-wide mb-2"> Ďakujeme za <span class="text-brand">objednávku!</span></h1><div class="section-decorator mx-auto mt-4 mb-6"></div><p class="text-gray-500 font-sans text-sm max-w-md mx-auto"> Potvrdenie sme odoslali na váš email. Hneď ako tovar vyexpedujeme, budeme vás informovať správou. </p></div><div class="bg-white border border-gray-100 shadow-sm"><div class="flex items-center justify-between p-6"><div><div class="form-label mb-1">Číslo objednávky</div><div class="text-3xl font-black font-tech text-brand">#${ssrInterpolate(unref(order).orderNumber)}</div></div><div class="text-right"><div class="form-label mb-1">Stav</div><div class="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200"><span class="w-1.5 h-1.5 rounded-full bg-green-500"></span><span class="text-xs font-bold uppercase tracking-widest text-green-700">${ssrInterpolate(unref(order).stateMachineState?.translated?.name || unref(status) || "Prijatá")}</span></div></div></div></div><div class="bg-white border border-gray-100 shadow-sm divide-y divide-gray-50"><div class="flex justify-between px-6 py-3.5 text-sm font-sans text-gray-600"><span>Hodnota tovaru</span><span class="font-bold">${ssrInterpolate(formatPrice(unref(subtotalDisplayed)))} €</span></div><div class="flex justify-between px-6 py-3.5 text-sm font-sans text-gray-600"><span class="flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Truck), { class: "w-4 h-4 text-gray-400" }, null, _parent));
        _push(` ${ssrInterpolate(unref(shippingMethod)?.translated?.name || unref(shippingMethod)?.name || "Doprava")}</span><span class="${ssrRenderClass(unref(shippingCosts) === 0 ? "text-green-600 font-bold" : "")}">${ssrInterpolate(unref(shippingCosts) === 0 ? "ZDARMA" : `${formatPrice(unref(shippingCosts) || 0)} €`)}</span></div>`);
        if (unref(balneBikeLineItem)) {
          _push(`<div class="flex justify-between px-6 py-3.5 text-sm font-sans text-gray-600"><span>Balné bicykel <span class="text-xs text-gray-400">×${ssrInterpolate(unref(balneBikeLineItem).quantity)}</span></span><span>${ssrInterpolate(formatPrice(unref(balneBikePrice)))} €</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(balneEbikeLineItem)) {
          _push(`<div class="flex justify-between px-6 py-3.5 text-sm font-sans text-gray-600"><span>Balné elektrobicykel <span class="text-xs text-gray-400">×${ssrInterpolate(unref(balneEbikeLineItem).quantity)}</span></span><span>${ssrInterpolate(formatPrice(unref(balneEbikePrice)))} €</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(dobierkaLineItem)) {
          _push(`<div class="flex justify-between px-6 py-3.5 text-sm font-sans text-gray-600"><span class="flex items-center gap-2">`);
          _push(ssrRenderComponent(unref(CreditCard), { class: "w-4 h-4 text-gray-400" }, null, _parent));
          _push(` Dobierka </span><span>${ssrInterpolate(formatPrice(unref(dobierkaPrice)))} €</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-between px-6 py-4 font-black"><span class="font-tech uppercase tracking-wide text-sm">Celkom</span><span class="font-tech text-2xl text-brand">${ssrInterpolate(formatPrice(unref(total) || 0))} €</span></div></div>`);
        if (unref(shippingAddress)) {
          _push(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div class="bg-white border border-gray-100 shadow-sm p-5"><div class="flex items-center gap-2 form-label mb-3">`);
          _push(ssrRenderComponent(unref(MapPin), { class: "w-3.5 h-3.5 text-brand" }, null, _parent));
          _push(` Adresa doručenia </div><div class="text-sm font-sans text-gray-700 leading-loose"><div class="font-bold">${ssrInterpolate(unref(shippingAddress).firstName)} ${ssrInterpolate(unref(shippingAddress).lastName)}</div><div>${ssrInterpolate(unref(shippingAddress).street)}</div><div>${ssrInterpolate(unref(shippingAddress).zipcode)} ${ssrInterpolate(unref(shippingAddress).city)}</div></div></div><div class="bg-white border border-gray-100 shadow-sm p-5"><div class="flex items-center gap-2 form-label mb-3">`);
          _push(ssrRenderComponent(unref(CreditCard), { class: "w-3.5 h-3.5 text-brand" }, null, _parent));
          _push(` Spôsob platby </div><div class="text-sm font-bold uppercase tracking-wide text-gray-700 mt-2">${ssrInterpolate(unref(paymentMethod)?.translated?.name || unref(paymentMethod)?.name || "—")}</div><div class="mt-4 pt-3 border-t border-gray-100"><div class="flex items-center gap-2 form-label mb-1">`);
          _push(ssrRenderComponent(unref(Package), { class: "w-3.5 h-3.5" }, null, _parent));
          _push(` Odhadovaná expedícia </div><div class="text-sm font-bold text-gray-700">1–3 pracovné dni</div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="bg-gray-50 border border-gray-100 p-5 flex flex-col sm:flex-row gap-4 text-sm font-sans text-gray-600"><div class="flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Mail), { class: "w-4 h-4 text-brand flex-shrink-0" }, null, _parent));
        _push(` Potvrdenie sme odoslali na váš email </div><div class="flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Phone), { class: "w-4 h-4 text-brand flex-shrink-0" }, null, _parent));
        _push(`<span>Zákaznícka linka: <a href="tel:+421918564238" class="font-bold text-black hover:text-brand transition-colors">+421 918 564 238</a></span></div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-3">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(formatLink)("/account"),
          class: "flex items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm hover:border-brand/30 transition-all group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="w-10 h-10 bg-brand/5 border border-brand/20 flex items-center justify-center flex-shrink-0"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(User), { class: "w-5 h-5 text-brand" }, null, _parent2, _scopeId));
              _push2(`</div><div class="flex-1 min-w-0"${_scopeId}><div class="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-brand transition-colors"${_scopeId}>Prehľad objednávok</div><div class="text-sm font-black uppercase text-black mt-0.5 font-tech"${_scopeId}>Môj účet</div></div>`);
              _push2(ssrRenderComponent(unref(ArrowRight), { class: "w-4 h-4 text-gray-300 group-hover:text-brand transition-colors flex-shrink-0" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode("div", { class: "w-10 h-10 bg-brand/5 border border-brand/20 flex items-center justify-center flex-shrink-0" }, [
                  createVNode(unref(User), { class: "w-5 h-5 text-brand" })
                ]),
                createVNode("div", { class: "flex-1 min-w-0" }, [
                  createVNode("div", { class: "text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-brand transition-colors" }, "Prehľad objednávok"),
                  createVNode("div", { class: "text-sm font-black uppercase text-black mt-0.5 font-tech" }, "Môj účet")
                ]),
                createVNode(unref(ArrowRight), { class: "w-4 h-4 text-gray-300 group-hover:text-brand transition-colors flex-shrink-0" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="flex items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm"><div class="w-10 h-10 bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">`);
        _push(ssrRenderComponent(unref(Truck), { class: "w-5 h-5 text-gray-400" }, null, _parent));
        _push(`</div><div class="flex-1 min-w-0"><div class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sledovanie zásielky</div><div class="text-sm text-gray-500 font-sans mt-0.5">Po expedícii pošleme tracking link emailom</div></div></div></div><div class="bg-white border border-gray-100 shadow-sm p-6"><div class="flex items-center gap-2 form-label mb-5">`);
        _push(ssrRenderComponent(unref(Clock), { class: "w-3.5 h-3.5 text-brand" }, null, _parent));
        _push(` Čo sa stane ďalej? </div><div class="relative"><div class="absolute left-3.5 top-8 bottom-4 w-px bg-gray-100 z-0"></div><div class="space-y-5"><div class="flex gap-4 relative z-10"><div class="flex-shrink-0 w-7 h-7 bg-brand text-white flex items-center justify-center text-[10px] font-black">✓</div><div class="pt-0.5"><div class="text-sm font-black uppercase tracking-wide text-black font-tech">Objednávka prijatá</div><div class="text-xs text-gray-400 mt-0.5 font-sans">Potvrdenie sme odoslali na váš email</div></div></div><div class="flex gap-4 relative z-10"><div class="flex-shrink-0 w-7 h-7 bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-black text-gray-500">2</div><div class="pt-0.5"><div class="text-sm font-black uppercase tracking-wide text-black font-tech">Spracovanie a príprava</div><div class="text-xs text-gray-400 mt-0.5 font-sans">Do 1 pracovného dňa</div></div></div><div class="flex gap-4 relative z-10"><div class="flex-shrink-0 w-7 h-7 bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-black text-gray-500">3</div><div class="pt-0.5"><div class="text-sm font-black uppercase tracking-wide text-black font-tech">Expedícia — dostanete tracking link</div><div class="text-xs text-gray-400 mt-0.5 font-sans">1–3 pracovné dni, sledovanie emailom</div></div></div><div class="flex gap-4 relative z-10"><div class="flex-shrink-0 w-7 h-7 bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-black text-gray-500">4</div><div class="pt-0.5"><div class="text-sm font-black uppercase tracking-wide text-black font-tech">Doručenie ku vám domov</div><div class="text-xs text-gray-400 mt-0.5 font-sans">Kuriér vás kontaktuje pred doručením</div></div></div></div></div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 pb-6">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(formatLink)("/account"),
          class: "flex items-center justify-center gap-2 border-2 border-black text-black font-black uppercase tracking-wide text-sm px-6 py-4 hover:bg-black hover:text-white transition-all duration-200 font-tech"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(User), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` Moje objednávky `);
            } else {
              return [
                createVNode(unref(User), { class: "w-4 h-4" }),
                createTextVNode(" Moje objednávky ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(formatLink)("/"),
          class: "btn-checkout flex items-center justify-center gap-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Pokračovať v nákupe `);
              _push2(ssrRenderComponent(unref(ArrowRight), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Pokračovať v nákupe "),
                createVNode(unref(ArrowRight), { class: "w-5 h-5" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/checkout/success/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
