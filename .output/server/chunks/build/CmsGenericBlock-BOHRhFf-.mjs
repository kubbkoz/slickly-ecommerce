import { defineComponent, h, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { r as resolveCmsComponent } from './index-D4TJHf28.mjs';
import { getCmsLayoutConfiguration, getBackgroundImageUrl } from '@shopware/helpers';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsGenericBlock",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const DynamicRender = () => {
      const {
        resolvedComponent,
        componentName,
        isResolved,
        componentNameToResolve
      } = resolveCmsComponent(props.content);
      if (resolvedComponent) {
        if (!isResolved)
          return h("div", {}, `Problem resolving component: ${componentName}`);
        const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(
          props.content
        );
        if (layoutStyles.backgroundImage) {
          layoutStyles.backgroundImage = getBackgroundImageUrl(
            layoutStyles.backgroundImage,
            props.content
          );
        }
        const containerStyles = {
          backgroundColor: layoutStyles.backgroundColor,
          backgroundImage: layoutStyles.backgroundImage,
          backgroundSize: layoutStyles.backgroundSize
        };
        layoutStyles.backgroundColor = null;
        layoutStyles.backgroundImage = null;
        layoutStyles.backgroundSize = null;
        return h(
          "div",
          {
            style: containerStyles
          },
          h(resolvedComponent, {
            content: props.content,
            style: layoutStyles,
            class: cssClasses
          })
        );
      }
      return h("div", {}, "");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(DynamicRender, _attrs, null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/CmsGenericBlock.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "CmsGenericBlock" });

export { __nuxt_component_0 as default };
