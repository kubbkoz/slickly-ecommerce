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

const UserSvg = "data:image/svg+xml,%3csvg%20id='meteor-icon-kit__regular-user'%20viewBox='0%200%2020%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M10%202C7.79086%202%206%203.79086%206%206C6%208.20914%207.79086%2010%2010%2010C12.2091%2010%2014%208.20914%2014%206C14%203.79086%2012.2091%202%2010%202zM10%200C13.3137%200%2016%202.68629%2016%206C16%209.3137%2013.3137%2012%2010%2012C6.68629%2012%204%209.3137%204%206C4%202.68629%206.68629%200%2010%200zM2%2021.099C2%2021.6513%201.55228%2022.099%201%2022.099C0.44772%2022.099%200%2021.6513%200%2021.099V19C0%2016.2386%202.23858%2014%205%2014H15.0007C17.7621%2014%2020.0007%2016.2386%2020.0007%2019V21.099C20.0007%2021.6513%2019.553%2022.099%2019.0007%2022.099C18.4484%2022.099%2018.0007%2021.6513%2018.0007%2021.099V19C18.0007%2017.3431%2016.6576%2016%2015.0007%2016H5C3.34315%2016%202%2017.3431%202%2019V21.099z'%20fill='currentColor'/%3e%3c/svg%3e";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "UserIcon",
  __ssrInlineRender: true,
  props: {
    size: { default: 24 }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwBaseIcon = __nuxt_component_0;
      _push(ssrRenderComponent(_component_SwBaseIcon, mergeProps({
        src: unref(UserSvg),
        size: __props.size,
        alt: "User"
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/ui/UserIcon.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const UserIcon = Object.assign(_sfc_main, { __name: "SwUserIcon" });

export { UserIcon as default };
