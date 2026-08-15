import { defineComponent, h, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { getCmsLayoutConfiguration } from '@shopware/helpers';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsElementHtml",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(props.content);
    const HtmlComponent = () => {
      return h("div", {
        class: cssClasses,
        style: layoutStyles,
        innerHTML: props.content.data.content || ""
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(HtmlComponent, _attrs, null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementHtml.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsElementHtml = Object.assign(_sfc_main, { __name: "CmsElementHtml" });

export { CmsElementHtml as default };
