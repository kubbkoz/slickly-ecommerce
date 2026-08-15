import __nuxt_component_0 from './BaseDropdown-DnldUMz4.mjs';
import { defineComponent, useModel, computed, unref, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DropdownField",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    placeholder: {},
    label: {},
    id: {},
    options: {},
    errorMessage: {},
    loading: { type: Boolean }
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const errorText = computed(() => unref(__props.errorMessage));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormBaseDropdown = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (__props.label) {
        _push(`<label class="text-surface-on-surface text-sm mb-1 block"${ssrRenderAttr("for", __props.id)}>${ssrInterpolate(__props.label)}</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_FormBaseDropdown, {
        class: "text-sm w-full",
        modelValue: model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        placeholder: __props.placeholder,
        id: __props.id,
        options: __props.options,
        invalid: !!unref(errorText),
        loading: __props.loading
      }, null, _parent));
      if (unref(errorText)) {
        _push(`<span class="text-states-error text-xs block mt-1">${ssrInterpolate(unref(errorText))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/form/DropdownField.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "FormDropdownField" });

export { __nuxt_component_1 as default };
