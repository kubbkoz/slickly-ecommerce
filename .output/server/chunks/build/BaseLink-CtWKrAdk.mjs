import { _ as __nuxt_component_0$1 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, computed, mergeProps, withCtx, renderSlot, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, j as useNuxtApp } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseLink",
  __ssrInlineRender: true,
  props: {
    to: {},
    external: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const { $url } = useNuxtApp();
    const resolvedTo = computed(() => $url(props.to));
    const isExternal = computed(() => {
      if (props.external) return true;
      if (typeof props.to !== "string") return false;
      return props.to.startsWith("http") || props.to.startsWith("mailto:") || props.to.startsWith("tel:");
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      if (isExternal.value) {
        _push(`<a${ssrRenderAttrs(mergeProps(_ctx.$attrs, {
          href: String(__props.to),
          target: "_blank",
          rel: "noopener noreferrer"
        }, _attrs))} data-v-68d529c8>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</a>`);
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, mergeProps(_ctx.$attrs, { to: resolvedTo.value }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "default", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/BaseLink.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-68d529c8"]]), { __name: "BaseLink" });

export { __nuxt_component_0 as default };
