import __nuxt_component_1$1 from './DropdownField-DTfEBMIB.mjs';
import { defineComponent, ref, watch, mergeProps, isRef, unref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import './BaseDropdown-DnldUMz4.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SizeSelector",
  __ssrInlineRender: true,
  props: {
    value: {}
  },
  emits: ["change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const state = ref(props.value.toString());
    const options = [
      { value: "1", label: "1" },
      { value: "15", label: "15" },
      { value: "30", label: "30" },
      { value: "45", label: "45" }
    ];
    function handleChange() {
      emit("change", Number(state.value));
    }
    watch(
      () => props.value,
      (newValue) => {
        state.value = newValue.toString();
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormDropdownField = __nuxt_component_1$1;
      _push(ssrRenderComponent(_component_FormDropdownField, mergeProps({
        id: "page-size",
        modelValue: unref(state),
        "onUpdate:modelValue": ($event) => isRef(state) ? state.value = $event : null,
        options,
        onChange: handleChange
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/shared/SizeSelector.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "SharedSizeSelector" });

export { __nuxt_component_1 as default };
