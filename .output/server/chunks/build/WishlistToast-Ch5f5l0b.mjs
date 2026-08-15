import { _ as _export_sfc, g as useState, I as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, ref, watch, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "WishlistToast",
  __ssrInlineRender: true,
  setup(__props) {
    const toast = useState("wishlistToast", () => ({ show: false, productName: "", action: "add" }));
    const visible = ref(false);
    let timer = null;
    const close = () => {
      visible.value = false;
      setTimeout(() => {
        toast.value.show = false;
      }, 500);
    };
    watch(() => toast.value.show, (newVal) => {
      if (newVal) {
        visible.value = true;
        if (timer) clearTimeout(timer);
        timer = setTimeout(close, 4e3);
      } else {
        visible.value = false;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/WishlistToast.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const WishlistToast = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-8bfe4ead"]]), { __name: "WishlistToast" });

export { WishlistToast as default };
