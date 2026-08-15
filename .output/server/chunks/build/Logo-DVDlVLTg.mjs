import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, m as useI18n, b as useLocalePath } from './server.mjs';
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
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Logo",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale: currentLocale } = useI18n();
    const localePath = useLocalePath();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex-shrink-0 z-50" }, _attrs))} data-v-ed341619>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/", unref(currentLocale)),
        class: "block group",
        "aria-label": "SLICKLY Domov"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="logo-wordmark flex items-baseline font-tech font-black uppercase leading-none tracking-tight text-white" data-v-ed341619${_scopeId}><span data-v-ed341619${_scopeId}>SL</span><span class="logo-i-wrap" data-v-ed341619${_scopeId}><span class="logo-i-dot bg-amber" data-v-ed341619${_scopeId}></span>I</span><span data-v-ed341619${_scopeId}>CKLY</span></div>`);
          } else {
            return [
              createVNode("div", { class: "logo-wordmark flex items-baseline font-tech font-black uppercase leading-none tracking-tight text-white" }, [
                createVNode("span", null, "SL"),
                createVNode("span", { class: "logo-i-wrap" }, [
                  createVNode("span", { class: "logo-i-dot bg-amber" }),
                  createTextVNode("I")
                ]),
                createVNode("span", null, "CKLY")
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/navbar/Logo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Logo = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-ed341619"]]), { __name: "Logo" });

export { Logo as default };
