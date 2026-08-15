import { _ as __nuxt_component_2$1 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
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
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const CheckmarkFilledSvg = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M12%2024C18.6274%2024%2024%2018.6274%2024%2012C24%205.37258%2018.6274%200%2012%200C5.37258%200%200%205.37258%200%2012C0%2018.6274%205.37258%2024%2012%2024ZM7.56066%2010.9393L10.5%2013.8787L16.4393%207.93934C17.0251%207.35355%2017.9749%207.35355%2018.5607%207.93934C19.1464%208.52513%2019.1464%209.47487%2018.5607%2010.0607L11.5607%2017.0607C10.9749%2017.6464%2010.0251%2017.6464%209.43934%2017.0607L5.43934%2013.0607C4.85355%2012.4749%204.85355%2011.5251%205.43934%2010.9393C6.02513%2010.3536%206.97487%2010.3536%207.56066%2010.9393Z'%20fill='%231E1E24'/%3e%3c/svg%3e";
const CheckmarkSvg = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M3.06066%2010.4393C2.47487%209.85355%201.52513%209.85355%200.93934%2010.4393C0.353553%2011.0251%200.353553%2011.9749%200.93934%2012.5607L7.93934%2019.5607C8.52513%2020.1464%209.47487%2020.1464%2010.0607%2019.5607L23.0607%206.56066C23.6464%205.97487%2023.6464%205.02513%2023.0607%204.43934C22.4749%203.85355%2021.5251%203.85355%2020.9393%204.43934L9%2016.3787L3.06066%2010.4393Z'%20fill='%231E1E24'/%3e%3c/svg%3e";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CheckmarkIcon",
  __ssrInlineRender: true,
  props: {
    filled: { type: Boolean, default: false },
    size: { default: 24 },
    alt: { default: "" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2$1;
      _push(ssrRenderComponent(_component_NuxtImg, mergeProps({
        src: __props.filled ? unref(CheckmarkFilledSvg) : unref(CheckmarkSvg),
        alt: __props.alt,
        width: __props.size,
        height: __props.size
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/ui/CheckmarkIcon.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "SwCheckmarkIcon" });

export { __nuxt_component_2 as default };
