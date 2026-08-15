import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, computed, mergeProps, unref, createVNode, resolveDynamicComponent, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderVNode, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { Building2, MapPin, Globe, Phone, Mail } from 'lucide-vue-next';
import { s as sanitizeHtml } from './sanitize-DKvwg8Vq.mjs';
import './composables-x8_ENpEe.mjs';
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
import '@shopware/helpers';
import './server.mjs';
import 'pinia';
import '@iconify/vue';
import '@shopware/api-client';
import 'js-cookie';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ManufacturerInfo",
  __ssrInlineRender: true,
  props: {
    manufacturer: {},
    productsLink: { default: null },
    heading: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const manufacturerName = computed(
      () => props.manufacturer?.translated?.name || props.manufacturer?.name || "Výrobca"
    );
    const logoUrl = computed(() => props.manufacturer?.media?.url || null);
    const description = computed(() => {
      const raw = props.manufacturer?.translated?.description || props.manufacturer?.description || "";
      return raw ? sanitizeHtml(raw) : "";
    });
    const cf = computed(() => ({
      ...props.manufacturer?.customFields ?? {},
      ...props.manufacturer?.translated?.customFields ?? {}
    }));
    const address = computed(() => {
      const raw = cf.value?.mtsport_vyrobca_adresa || "";
      return raw ? raw.replace(/<[^>]*>/g, "").trim() : null;
    });
    const phone = computed(() => cf.value?.mtsport_vyrobca_telefon || null);
    const email = computed(() => cf.value?.mtsport_vyrobca_email || null);
    const website = computed(() => props.manufacturer?.link || null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in font-sans" }, _attrs))}><div class="flex flex-col md:flex-row gap-8 items-start"><div class="w-full md:w-1/3 border border-gray-200 flex flex-col items-center text-center overflow-hidden"><div class="w-full bg-white flex items-center justify-center p-6 border-b border-gray-100" style="${ssrRenderStyle({ "min-height": "120px" })}">`);
      if (unref(logoUrl)) {
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: unref(logoUrl),
          alt: unref(manufacturerName),
          class: "w-full h-auto max-h-24 object-contain",
          loading: "lazy"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Building2), { class: "w-12 h-12 text-gray-300" }, null, _parent));
      }
      _push(`</div><div class="p-6 flex flex-col items-center w-full">`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.heading ? "h1" : "h5"), { class: "font-black font-tech text-2xl uppercase mb-4" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(manufacturerName))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(manufacturerName)), 1)
            ];
          }
        }),
        _: 1
      }), _parent);
      if (__props.productsLink) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: __props.productsLink,
          class: "text-brand font-bold uppercase text-xs hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Zobraziť všetky produkty → `);
            } else {
              return [
                createTextVNode(" Zobraziť všetky produkty → ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex-1">`);
      if (unref(description)) {
        _push(`<div class="text-gray-600 leading-relaxed mb-6 text-sm">${unref(description) ?? ""}</div>`);
      } else {
        _push(`<p class="text-gray-400 italic text-sm mb-6">Popis výrobcu nie je k dispozícii.</p>`);
      }
      _push(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">`);
      if (unref(address)) {
        _push(`<div class="flex items-start">`);
        _push(ssrRenderComponent(unref(MapPin), { class: "w-5 h-5 text-brand mr-3 mt-0.5 shrink-0" }, null, _parent));
        _push(`<div><span class="font-bold text-gray-900 block text-sm uppercase">Adresa</span><span class="text-sm text-gray-600">${ssrInterpolate(unref(address))}</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(website)) {
        _push(`<div class="flex items-start">`);
        _push(ssrRenderComponent(unref(Globe), { class: "w-5 h-5 text-brand mr-3 mt-0.5 shrink-0" }, null, _parent));
        _push(`<div><span class="font-bold text-gray-900 block text-sm uppercase">Web</span><a${ssrRenderAttr("href", unref(website))} target="_blank" rel="noopener" class="text-sm text-gray-600 hover:text-brand break-all">${ssrInterpolate(unref(website).replace(/^https?:\/\/(www\.)?/, ""))}</a></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(phone)) {
        _push(`<div class="flex items-start">`);
        _push(ssrRenderComponent(unref(Phone), { class: "w-5 h-5 text-brand mr-3 mt-0.5 shrink-0" }, null, _parent));
        _push(`<div><span class="font-bold text-gray-900 block text-sm uppercase">Tel. kontakt</span><a${ssrRenderAttr("href", `tel:${unref(phone)}`)} class="text-sm text-gray-600 hover:text-brand">${ssrInterpolate(unref(phone))}</a></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(email)) {
        _push(`<div class="flex items-start">`);
        _push(ssrRenderComponent(unref(Mail), { class: "w-5 h-5 text-brand mr-3 mt-0.5 shrink-0" }, null, _parent));
        _push(`<div><span class="font-bold text-gray-900 block text-sm uppercase">Emailová adresa</span><a${ssrRenderAttr("href", `mailto:${unref(email)}`)} class="text-sm text-gray-600 hover:text-brand">${ssrInterpolate(unref(email))}</a></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ManufacturerInfo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ManufacturerInfo = Object.assign(_sfc_main, { __name: "ManufacturerInfo" });

export { ManufacturerInfo as default };
