import __nuxt_component_0 from './SwCategoryNavigationLink-BU65EIA1.mjs';
import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { _ as _export_sfc } from './server.mjs';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import './ChevronIcon-Aj1t6zS4.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
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
import '@shopware/helpers';
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
import './useUrlResolver-CibZ14y1.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwCategoryNavigation",
  __ssrInlineRender: true,
  props: {
    activeCategory: {},
    elements: {},
    level: { default: 0 }
  },
  setup(__props) {
    const expandedItems = ref(/* @__PURE__ */ new Set());
    function isActive(navigationElement) {
      return navigationElement.id === __props.activeCategory?.id;
    }
    function toggleExpanded(id) {
      if (expandedItems.value.has(id)) {
        expandedItems.value.delete(id);
      } else {
        expandedItems.value.add(id);
      }
    }
    function isExpanded(id) {
      return expandedItems.value.has(id);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwCategoryNavigationLink = __nuxt_component_0;
      const _component_SwCategoryNavigation = SwCategoryNavigation;
      if (__props.elements?.length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "self-stretch flex flex-col justify-start items-start gap-4" }, _attrs))} data-v-f49bc7a2><!--[-->`);
        ssrRenderList(__props.elements, (navigationElement, index) => {
          _push(`<div class="w-full" data-v-f49bc7a2>`);
          _push(ssrRenderComponent(_component_SwCategoryNavigationLink, {
            "navigation-element": navigationElement,
            "is-active": isActive(navigationElement),
            "is-expanded": isExpanded(navigationElement.id),
            level: __props.level,
            onToggle: ($event) => toggleExpanded(navigationElement.id)
          }, null, _parent));
          if (navigationElement.children && isExpanded(navigationElement.id)) {
            _push(`<div class="self-stretch flex flex-col justify-start items-start" data-v-f49bc7a2>`);
            _push(ssrRenderComponent(_component_SwCategoryNavigation, {
              elements: navigationElement.children,
              "active-category": __props.activeCategory,
              level: __props.level + 1
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwCategoryNavigation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SwCategoryNavigation = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-f49bc7a2"]]), { __name: "SwCategoryNavigation" });

export { SwCategoryNavigation as default };
