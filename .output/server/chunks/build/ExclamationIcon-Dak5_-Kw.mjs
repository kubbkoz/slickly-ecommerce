import __nuxt_component_0 from './BaseIcon-CuUpCLk5.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import './NuxtImg-BPLMxRzm.mjs';
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

const ExclamationCircleSvg = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M24%2012C24%2018.6274%2018.6274%2024%2012%2024C5.37258%2024%200%2018.6274%200%2012C0%205.37258%205.37258%200%2012%200C18.6274%200%2024%205.37258%2024%2012ZM10.5%207.5V12C10.5%2012.8284%2011.1716%2013.5%2012%2013.5C12.8284%2013.5%2013.5%2012.8284%2013.5%2012V7.5C13.5%206.67157%2012.8284%206%2012%206C11.1716%206%2010.5%206.67157%2010.5%207.5ZM12%2018C12.8284%2018%2013.5%2017.3284%2013.5%2016.5C13.5%2015.6716%2012.8284%2015%2012%2015C11.1716%2015%2010.5%2015.6716%2010.5%2016.5C10.5%2017.3284%2011.1716%2018%2012%2018Z'%20fill='%231E1E24'/%3e%3c/svg%3e";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ExclamationIcon",
  __ssrInlineRender: true,
  props: {
    size: { default: 24 }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwBaseIcon = __nuxt_component_0;
      _push(ssrRenderComponent(_component_SwBaseIcon, mergeProps({
        src: unref(ExclamationCircleSvg),
        size: __props.size,
        alt: "Error"
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/ui/ExclamationIcon.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "SwExclamationIcon" });

export { __nuxt_component_1 as default };
