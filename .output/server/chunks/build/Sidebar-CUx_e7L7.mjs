import { defineComponent, toRefs, useTemplateRef, unref, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderStyle, ssrRenderAttr, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
import { o as onClickOutside } from './index-B6MI764M.mjs';
import './server.mjs';
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
  __name: "Sidebar",
  __ssrInlineRender: true,
  props: {
    controller: {},
    side: { default: "right" }
  },
  setup(__props) {
    const { controller } = toRefs({ controller: __props.controller, side: __props.side });
    const { isOpen, close } = controller.value;
    const sidebarContentElement = useTemplateRef("sidebarContentElement");
    onClickOutside(sidebarContentElement, () => close());
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50" style="${ssrRenderStyle(unref(isOpen) ? null : { display: "none" })}"><div class="flex items-start justify-center min-h-screen pt-24 text-center">`);
        if (unref(isOpen)) {
          _push2(`<div${ssrRenderAttr("data-testid", `sidebar-${__props.side}`)} class="${ssrRenderClass([{
            "left-0": __props.side === "left",
            "right-0": __props.side === "right"
          }, "pointer-events-none fixed inset-y-0 flex max-w-full"])}"><div class="pointer-events-auto w-screen max-w-md"><div class="flex h-full flex-col bg-white shadow-xl">`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`</div></div>`);
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/Sidebar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "LayoutSidebar" });

export { __nuxt_component_0 as default };
