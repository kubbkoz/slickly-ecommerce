import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { X, Loader2, Search } from 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "SearchInput" },
  __name: "SearchInput",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    isOpen: { type: Boolean },
    isLoading: { type: Boolean },
    placeholder: {}
  },
  emits: ["update:modelValue", "focus", "keydown", "search", "clear"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const inputEl = ref(null);
    __expose({ inputEl });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["relative w-full flex group", __props.isOpen ? "z-[70]" : "z-10"]
      }, _attrs))}><input type="text"${ssrRenderAttr("value", __props.modelValue)}${ssrRenderAttr("placeholder", __props.placeholder)} autocomplete="off" spellcheck="false" class="${ssrRenderClass([__props.isOpen ? "shadow-[0_0_0_2px_rgba(182,0,5,1)]" : "shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_0_0_1px_rgba(182,0,5,0.4)]", "w-full bg-white text-black pl-5 pr-16 py-3.5 focus:outline-none rounded-default text-sm tracking-wide placeholder-gray-400 font-sans transition-shadow duration-200"])}" aria-label="Hľadať produkt" aria-autocomplete="list"${ssrRenderAttr("aria-expanded", __props.isOpen)} role="combobox">`);
      if (__props.modelValue) {
        _push(`<button class="absolute right-12 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors" aria-label="Zmazať hľadanie" type="button">`);
        _push(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="absolute right-0 top-0 h-full w-12 bg-amber text-black flex items-center justify-center hover:bg-amber-dark transition-colors group/btn rounded-tr rounded-br" aria-label="Hľadať" type="button">`);
      if (__props.isLoading) {
        _push(ssrRenderComponent(unref(Loader2), { class: "w-5 h-5 animate-spin" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Search), { class: "w-5 h-5 transition-transform group-hover/btn:scale-110" }, null, _parent));
      }
      _push(`</button></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/navbar/search/SearchInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SearchInput = Object.assign(_sfc_main, { __name: "SearchInput" });

export { SearchInput as default };
