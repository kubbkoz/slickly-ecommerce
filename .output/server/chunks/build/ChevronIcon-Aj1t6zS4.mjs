import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
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

const ChevronSvg = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M8.70711%208.79289C8.31658%208.40237%207.68342%208.40237%207.29289%208.79289C6.90237%209.18342%206.90237%209.81658%207.29289%2010.2071L11.2929%2014.2071C11.6834%2014.5976%2012.3166%2014.5976%2012.7071%2014.2071L16.7071%2010.2071C17.0976%209.81658%2017.0976%209.18342%2016.7071%208.79289C16.3166%208.40237%2015.6834%208.40237%2015.2929%208.79289L12%2012.0858L8.70711%208.79289Z'%20fill='currentColor'/%3e%3c/svg%3e";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ChevronIcon",
  __ssrInlineRender: true,
  props: {
    direction: { default: "down" },
    size: { default: 24 },
    alt: { default: "" }
  },
  setup(__props) {
    const rotationClass = computed(() => {
      const rotations = {
        down: "",
        up: "rotate-180",
        left: "rotate-90",
        right: "-rotate-90"
      };
      return rotations[__props.direction];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      _push(ssrRenderComponent(_component_NuxtImg, mergeProps({
        src: unref(ChevronSvg),
        alt: __props.alt,
        class: ["transition-transform", rotationClass.value],
        width: __props.size,
        height: __props.size
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/ui/ChevronIcon.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "SwChevronIcon" });

export { __nuxt_component_0 as default };
