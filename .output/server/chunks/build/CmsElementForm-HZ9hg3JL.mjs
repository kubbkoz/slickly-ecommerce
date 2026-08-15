import { defineComponent, computed, defineAsyncComponent, mergeProps, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderVNode } from 'vue/server-renderer';
import { u as useCmsElementConfig } from './useCmsElementConfig-DY8wkVjg.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsElementForm",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { getConfigValue } = useCmsElementConfig(props.content);
    const FormComponent = computed(() => {
      switch (getConfigValue("type")) {
        case "newsletter":
          return defineAsyncComponent(
            () => import('./SwNewsletterForm-dY-hOseB.mjs')
          );
        default:
          return defineAsyncComponent(() => import('./SwContactForm-Dvw--d2j.mjs'));
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "cms-element-form" }, _attrs))}>`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(FormComponent.value), { content: __props.content }, null), _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsElementForm = Object.assign(_sfc_main, { __name: "CmsElementForm" });

export { CmsElementForm as default };
