import { defineComponent, watch, unref, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderComponent, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { X } from 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AppModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    title: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        (void 0).body.style.overflow = "hidden";
      } else {
        (void 0).body.style.overflow = "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.isOpen) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div class="absolute inset-0"></div><div class="relative w-full max-w-lg bg-white p-8 shadow-2xl rounded-default"><button class="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors" aria-label="Zatvoriť">`);
          _push2(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
          _push2(`</button>`);
          ssrRenderSlot(_ctx.$slots, "prefix", {}, null, _push2, _parent);
          _push2(`<h2 class="text-xl font-bold uppercase tracking-wider mb-6 pr-6 font-tech text-black">${ssrInterpolate(__props.title)}</h2><div class="prose prose-sm font-sans max-h-[70vh] overflow-y-auto w-full text-gray-600 scrollbar-hide">`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/AppModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "AppModal" });

export { __nuxt_component_2 as default };
