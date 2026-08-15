import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsNoComponent",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const elementType = computed(
      () => props.content.apiAlias === "cms_block" ? "Block" : props.content.apiAlias === "cms_section" ? "Section" : "Element"
    );
    const componentName = computed(() => props.content.type);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({ class: "sw-text-error" }, _attrs))}><b>${ssrInterpolate(elementType.value)}<i>${ssrInterpolate(componentName.value)}</i></b> is not implemented yet! </span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/CmsNoComponent.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsNoComponent = Object.assign(_sfc_main, { __name: "CmsNoComponent" });

export { CmsNoComponent as default };
