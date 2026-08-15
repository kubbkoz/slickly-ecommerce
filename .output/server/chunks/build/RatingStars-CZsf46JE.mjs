import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { Star } from 'lucide-vue-next';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "RatingStars",
  __ssrInlineRender: true,
  props: {
    rating: {},
    maxRating: {},
    sizeClass: {}
  },
  setup(__props) {
    const props = __props;
    const max = props.maxRating ?? 5;
    const percentage = computed(() => Math.min(100, Math.max(0, props.rating / max * 100)));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative inline-flex items-center" }, _attrs))} data-v-336228a1><div class="flex items-center gap-0.5 text-gray-200" data-v-336228a1><!--[-->`);
      ssrRenderList(unref(max), (i) => {
        _push(ssrRenderComponent(unref(Star), {
          key: i,
          class: [__props.sizeClass || "w-4 h-4", "fill-current stroke-none"]
        }, null, _parent));
      });
      _push(`<!--]--></div><div class="flex items-center gap-0.5 text-yellow-400 absolute top-0 left-0 overflow-hidden whitespace-nowrap select-none pointer-events-none" style="${ssrRenderStyle({ width: `${unref(percentage)}%` })}" data-v-336228a1><!--[-->`);
      ssrRenderList(unref(max), (i) => {
        _push(ssrRenderComponent(unref(Star), {
          key: i,
          class: [__props.sizeClass || "w-4 h-4", "fill-current stroke-none"]
        }, null, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/RatingStars.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RatingStars = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-336228a1"]]), { __name: "RatingStars" });

export { RatingStars as default };
