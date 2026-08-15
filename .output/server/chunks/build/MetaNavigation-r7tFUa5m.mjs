import __nuxt_component_1 from './index-DKA3nfTy.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
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
import './server.mjs';
import 'pinia';
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
  __name: "MetaNavigation",
  __ssrInlineRender: true,
  props: {
    currentLanguageLabel: {},
    languages: {}
  },
  emits: ["onLanguageChangeHandler"],
  setup(__props, { emit: __emit }) {
    const languagesListVisibility = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-surface-surface-primary py-2" }, _attrs))}><div class="flex items-center justify-between container mx-auto color-surface-on-surface-primary"><div class="flex items-center relative"><div class="flex items-center gap-3.5">`);
      _push(ssrRenderComponent(_component_Icon, {
        size: "1.5rem",
        name: "material-symbols:language"
      }, null, _parent));
      _push(`<span>${ssrInterpolate(__props.currentLanguageLabel)}</span></div><ul class="absolute bg-surface-surface-primary top-8 p-2 w-full cursor-pointer z-20" style="${ssrRenderStyle(unref(languagesListVisibility) ? null : { display: "none" })}"><!--[-->`);
      ssrRenderList(__props.languages, (language) => {
        _push(`<li>${ssrInterpolate(language.label)}</li>`);
      });
      _push(`<!--]--></ul></div><menu>`);
      ssrRenderSlot(_ctx.$slots, "menu", {}, null, _push, _parent);
      _push(`</menu></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/MetaNavigation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const MetaNavigation = Object.assign(_sfc_main, { __name: "LayoutMetaNavigation" });

export { MetaNavigation as default };
