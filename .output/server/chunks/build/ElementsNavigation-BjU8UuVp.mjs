import __nuxt_component_0 from './Pagination-Cue1vOZm.mjs';
import __nuxt_component_1 from './SizeSelector-DQWtP7Lz.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
import './DropdownField-DTfEBMIB.mjs';
import './BaseDropdown-DnldUMz4.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ElementsNavigation",
  __ssrInlineRender: true,
  props: {
    pages: {},
    currentPage: {},
    showPageSizeSelector: { type: Boolean },
    pageSize: {}
  },
  emits: ["changePage", "changeSize"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    function handleChangePage(page) {
      emit("changePage", page);
    }
    function handleChangeSize(size) {
      emit("changeSize", size);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedPagination = __nuxt_component_0;
      const _component_SharedSizeSelector = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-2 justify-between" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_SharedPagination, {
        onChangePage: handleChangePage,
        total: __props.pages,
        current: __props.currentPage
      }, null, _parent));
      if (__props.showPageSizeSelector) {
        _push(ssrRenderComponent(_component_SharedSizeSelector, {
          onChange: handleChangeSize,
          value: __props.pageSize ?? 15
        }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/shared/ElementsNavigation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "SharedElementsNavigation" });

export { __nuxt_component_3 as default };
