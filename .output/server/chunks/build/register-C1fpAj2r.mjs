import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import RegisterForm from './RegisterForm-xy4C6HGo.mjs';
import { u as useHead } from './server.mjs';
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
import 'lucide-vue-next';
import './useCountries-DcMVa9Fw.mjs';
import './useSalutations-BJL9Pq5t.mjs';
import './useAuth-CPF16ec2.mjs';
import 'pinia';
import './BaseButton-BJMOoNbK.mjs';
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
import './AppHoneypot-DdH0YZXD.mjs';
import './SocialLoginButtons-DBcyBy6L.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Registrácia — SLICKLY",
      meta: [
        { name: "description", content: "Vytvorte si zákaznícky účet v SLICKLY e-shope a nakupujte rýchlejšie." }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 py-16 md:py-24 px-4 relative overflow-hidden" }, _attrs))}><div class="absolute -top-32 -right-32 w-96 h-96 bg-brand/5 rounded-full blur-3xl -z-10 pointer-events-none"></div><div class="absolute -bottom-32 -left-32 w-96 h-96 bg-brand/5 rounded-full blur-3xl -z-10 pointer-events-none"></div><div class="container mx-auto"><div class="max-w-2xl mx-auto mb-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"${_scopeId}></path></svg> Späť na hlavnú stránku `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-4 h-4",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                })
              ])),
              createTextVNode(" Späť na hlavnú stránku ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="max-w-2xl mx-auto bg-white p-8 md:p-12 shadow-lg border border-gray-100">`);
      _push(ssrRenderComponent(RegisterForm, null, null, _parent));
      _push(`</div><div class="max-w-2xl mx-auto mt-8 text-center"><p class="text-[10px] font-bold uppercase tracking-widest text-gray-400"> Máte účet? <button type="button" class="text-brand hover:underline ml-1" onclick="window.history.back()"> Prihláste sa </button></p></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
