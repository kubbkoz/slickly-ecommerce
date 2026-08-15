import { I as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, ref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { u as useCategory } from './useCategory-DZrTDjvY.mjs';
import { u as useNavigation } from './useNavigation-CF5ohcDB.mjs';
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
import 'pinia';
import '@iconify/vue';
import '@shopware/api-client';
import '@shopware/helpers';
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
  __name: "CmsElementCategoryNavigation",
  __ssrInlineRender: true,
  setup(__props) {
    const { category: activeCategory } = useCategory();
    ref(true);
    ref([]);
    const currentCategoryId = activeCategory.value?.id ?? "main-navigation";
    const type = currentCategoryId;
    useNavigation({
      type
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementCategoryNavigation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsElementCategoryNavigation = Object.assign(_sfc_main, { __name: "CmsElementCategoryNavigation" });

export { CmsElementCategoryNavigation as default };
