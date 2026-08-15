import __nuxt_component_0 from './CmsElementSidebarFilter-BpXhNfQ5.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { u as useCmsBlock } from './useCmsBlock-B8Ac2OqI.mjs';
import './SwProductListingFilters-CfTWGHyq.mjs';
import './SwFilterChips-BkykUXAw.mjs';
import './SwSortDropdown-Bbvi3pDB.mjs';
import './BaseButton-D0eElC8N.mjs';
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
import './index-B6MI764M.mjs';
import './SwProductListingFilter-BBWYHPB5.mjs';
import './useCmsTranslations-C7n8Bwji.mjs';
import './Checkbox-8GjGFXe_.mjs';
import './SwitchButton-BwRPFSLu.mjs';
import './useCategoryListing-BIkms3Qx.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';
import './SwProductListingFiltersHorizontal-BJb1X7QR.mjs';
import './SwFilterDropdown-C60wMOfB.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsBlockSidebarFilter",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { getSlotContent } = useCmsBlock(props.content);
    const slotContent = getSlotContent(
      "content"
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CmsElementSidebarFilter = __nuxt_component_0;
      _push(ssrRenderComponent(_component_CmsElementSidebarFilter, mergeProps({ content: unref(slotContent) }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/block/CmsBlockSidebarFilter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsBlockSidebarFilter = Object.assign(_sfc_main, { __name: "CmsBlockSidebarFilter" });

export { CmsBlockSidebarFilter as default };
