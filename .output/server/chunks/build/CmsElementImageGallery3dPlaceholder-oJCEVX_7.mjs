import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: "552",
    height: "383",
    viewBox: "0 0 552 383"
  }, _attrs))}><defs><g id="icons-default-placeholder" fill="none" fill-rule="evenodd" opacity=".65"><rect width="333.061" height="499.591" x="84.659" y="-82.663" fill="#E9EBF2" fill-rule="nonzero" transform="rotate(-89.862 251.19 167.132)"></rect><g transform="translate(51 49)"><rect width="333.06" height="499.59" x="83.983" y="-83.234" fill="#DADDE5" fill-rule="nonzero" transform="rotate(-90 250.513 166.561)"></rect><polygon fill="#E9EBF2" points="137.18 333.1 500.31 333.1 500.31 302.36 322.15 110.42"></polygon><circle cx="113.04" cy="65.68" r="35.9" fill="#F5F7FC"></circle><polygon fill="#F5F7FC" points="219.88 157.3 73.85 333.1 383.05 333.1"></polygon></g></g></defs><use xlink:href="#icons-default-placeholder" fill="#758CA3" fill-rule="evenodd"></use></svg>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementImageGallery3dPlaceholder.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "CmsElementImageGallery3dPlaceholder" });

export { __nuxt_component_1 as default };
