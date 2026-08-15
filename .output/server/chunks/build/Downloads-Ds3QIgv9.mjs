import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useOrderDetails } from './useOrderDetails-CE2XJ7gX.mjs';
import './server.mjs';
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
import './useDefaultOrderAssociations-WycTFxJ-.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Downloads",
  __ssrInlineRender: true,
  props: {
    documents: {}
  },
  setup(__props) {
    const props = __props;
    if (!props.documents.length || !props.documents[0]?.orderId) {
      throw new Error(
        "AccountOrderDownloads requires at least one document with orderId"
      );
    }
    const { getDocumentFile } = useOrderDetails(props.documents[0].orderId);
    const getDocumentDate = (documentDate) => new Date(documentDate).toLocaleDateString(
      "en-US"
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h3 class="font-medium">${ssrInterpolate(_ctx.$t("account.documentsLabel"))}</h3><ul class="list-disc pl-6"><!--[-->`);
      ssrRenderList(__props.documents, (document) => {
        _push(`<li class="cursor-pointer"><span class="text-dark">${ssrInterpolate(document.config.title || document.config.name)}</span> (${ssrInterpolate(getDocumentDate(
          document.updatedAt ? document.updatedAt : document.createdAt ?? ""
        ))}) </li>`);
      });
      _push(`<!--]--></ul></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/order/Downloads.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "AccountOrderDownloads" });

export { __nuxt_component_1 as default };
