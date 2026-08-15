import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
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

const StarEmptySvg = "data:image/svg+xml,%3csvg%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M8.00015%2012.5599L12.0046%2014.3245L11.5638%209.97075L14.4795%206.70761L10.2026%205.78147L8.00015%202.00012L5.79771%205.78147L1.52085%206.70761L4.43653%209.97075L3.99572%2014.3245L8.00015%2012.5599ZM4.53339%2015.5446C3.85953%2015.8416%203.07255%2015.536%202.7756%2014.8622C2.68261%2014.6511%202.64594%2014.4196%202.66917%2014.1902L3.0508%2010.421L0.526591%207.59599C0.0359476%207.04688%200.083346%206.20399%200.632458%205.71335C0.804415%205.5597%201.01328%205.45328%201.23866%205.40448L4.94128%204.60269L6.848%201.32905C7.21862%200.692736%208.0349%200.477347%208.67122%200.847967C8.87048%200.964028%209.03624%201.12979%209.1523%201.32905L11.059%204.60269L14.7616%205.40448C15.4813%205.56033%2015.9384%206.2701%2015.7826%206.9898C15.7338%207.21517%2015.6274%207.42404%2015.4737%207.59599L12.9495%2010.421L13.3311%2014.1902C13.4053%2014.9228%2012.8715%2015.5769%2012.1389%2015.651C11.9095%2015.6743%2011.6779%2015.6376%2011.4669%2015.5446L8.00015%2014.0169L4.53339%2015.5446Z'%20fill='%23696470'/%3e%3c/svg%3e";
const StarFilledSvg = "data:image/svg+xml,%3csvg%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M4.53339%2015.5446C3.85953%2015.8416%203.07255%2015.536%202.7756%2014.8622C2.68261%2014.6511%202.64594%2014.4196%202.66917%2014.1902L3.0508%2010.421L0.526591%207.59599C0.0359476%207.04688%200.083346%206.20399%200.632458%205.71335C0.804415%205.5597%201.01328%205.45328%201.23866%205.40448L4.94128%204.60269L6.848%201.32905C7.21862%200.692736%208.0349%200.477347%208.67122%200.847967C8.87048%200.964028%209.03624%201.12979%209.1523%201.32905L11.059%204.60269L14.7616%205.40448C15.4813%205.56033%2015.9384%206.2701%2015.7826%206.9898C15.7338%207.21517%2015.6274%207.42404%2015.4737%207.59599L12.9495%2010.421L13.3311%2014.1902C13.4053%2014.9228%2012.8715%2015.5769%2012.1389%2015.651C11.9095%2015.6743%2011.6779%2015.6376%2011.4669%2015.5446L8.00015%2014.0169L4.53339%2015.5446Z'%20fill='%23696470'/%3e%3c/svg%3e";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StarIcon",
  __ssrInlineRender: true,
  props: {
    filled: { type: Boolean, default: true },
    size: { default: 20 }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      _push(ssrRenderComponent(_component_NuxtImg, mergeProps({
        src: __props.filled ? unref(StarFilledSvg) : unref(StarEmptySvg),
        alt: "Star",
        width: __props.size,
        height: __props.size
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/ui/StarIcon.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "SwStarIcon" });

export { __nuxt_component_0 as default };
