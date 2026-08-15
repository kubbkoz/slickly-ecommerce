import { defineComponent, toRefs, watch, useTemplateRef, unref, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderStyle, ssrRenderSlot } from 'vue/server-renderer';
import { b as useMagicKeys, o as onClickOutside } from './index-B6MI764M.mjs';
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
  __name: "Modal",
  __ssrInlineRender: true,
  props: {
    controller: {}
  },
  setup(__props) {
    const props = __props;
    const { controller } = toRefs(props);
    const { isOpen, close } = controller.value;
    const { escape: escapeKey } = useMagicKeys();
    watch(
      () => escapeKey,
      () => {
        isOpen.value && close();
      }
    );
    const modalContentElement = useTemplateRef("modalContentElement");
    onClickOutside(modalContentElement, () => close());
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50" style="${ssrRenderStyle(unref(isOpen) ? null : { display: "none" })}"><div class="flex items-center justify-center min-h-screen lg:-mt-3% text-center">`);
        if (unref(isOpen)) {
          _push2(`<div id="modal-content" class="bg-white rounded-lg text-left overflow-hidden shadow-xl p-8" role="dialog" aria-modal="true" aria-labelledby="modal-headline">`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/shared/Modal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Modal = Object.assign(_sfc_main, { __name: "SharedModal" });

export { Modal as default };
