import { defineComponent, watchEffect, computed, resolveComponent, h, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { getProductListingFromCmsPage, getCmsLayoutConfiguration, getBackgroundImageUrl } from '@shopware/helpers';
import { ax as pascalCase } from '../nitro/nitro.mjs';
import { c as createCategoryListingContext } from './useListing-D9PeCG7-.mjs';
import { u as useNavigationContext } from './useNavigationContext-KcJT19yU.mjs';
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
import './useCategory-DZrTDjvY.mjs';
import './server.mjs';
import 'pinia';
import '@iconify/vue';
import '@shopware/api-client';
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './useShopwareLanguage-CGPCneCN.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsPage",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { routeName } = useNavigationContext();
    function updateListingContext(content) {
      if (routeName.value === "frontend.navigation.page") {
        const initialListing = getProductListingFromCmsPage(content);
        if (initialListing) {
          createCategoryListingContext(initialListing);
        }
      }
    }
    watchEffect(() => {
      updateListingContext(props.content);
    });
    const cmsSections = computed(() => {
      return props.content?.sections || [];
    });
    const DynamicRender = () => {
      const componentsMap = cmsSections.value.map((section) => {
        return {
          name: `CmsSection${pascalCase(section.type)}`,
          component: resolveComponent(`CmsSection${pascalCase(section.type)}`),
          section
        };
      });
      return componentsMap.map((componentObject) => {
        const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(
          componentObject.section
        );
        if (typeof componentObject.component === "string") {
          return h("div", {}, `There is no ${componentObject.component}`);
        }
        if (layoutStyles?.backgroundImage) {
          layoutStyles.backgroundImage = getBackgroundImageUrl(
            layoutStyles.backgroundImage,
            componentObject.section
          );
        }
        return h(componentObject.component, {
          content: componentObject.section,
          class: {
            ...cssClasses,
            "max-w-screen-2xl w-full mx-auto": layoutStyles?.sizingMode === "boxed",
            "w-full": layoutStyles?.sizingMode === "full_width"
          },
          style: {
            backgroundColor: layoutStyles?.backgroundColor,
            backgroundImage: layoutStyles?.backgroundImage,
            backgroundSize: layoutStyles?.backgroundSize
          }
        });
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(DynamicRender, _attrs, null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/CmsPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "CmsPage" });

export { __nuxt_component_1 as default };
