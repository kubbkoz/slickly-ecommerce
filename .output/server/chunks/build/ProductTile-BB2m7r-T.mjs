import { _ as __nuxt_component_2$1 } from './NuxtImg-BPLMxRzm.mjs';
import __nuxt_component_3 from './Price-D7PucwgC.mjs';
import __nuxt_component_2$2 from './QuantitySelect-CmcRrO8d.mjs';
import __nuxt_component_10 from './LinkButton-CTjOSiub.mjs';
import { defineComponent, ref, computed, mergeProps, unref, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { getSmallestThumbnailUrl } from '@shopware/helpers';
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
import './usePrice-CDJKOx8c.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductTile",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  emits: ["remove", "updateQuantity"],
  setup(__props, { emit: __emit }) {
    const quantity = ref(__props.item.quantity);
    const emit = __emit;
    const cover = computed(
      () => __props.item.cover ? getSmallestThumbnailUrl(__props.item.cover) : ""
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2$1;
      const _component_SharedPrice = __nuxt_component_3;
      const _component_FormQuantitySelect = __nuxt_component_2$2;
      const _component_FormLinkButton = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex gap-4" }, _attrs))}><div class="w-37.5 h-37.5">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: unref(cover),
        alt: `${__props.item.label || __props.item.payload.name || ""} cart item`,
        class: "object-cover object-center"
      }, null, _parent));
      _push(`</div><div class="grid grid-cols-2 justify-between py-2.5 grow"><div class="text-surface-on-surface"><div class="line-clamp-2">${ssrInterpolate(__props.item.label)}</div></div>`);
      _push(ssrRenderComponent(_component_SharedPrice, {
        class: "text-right justify-start text-surface-on-surface ml-auto",
        value: __props.item.price?.totalPrice
      }, null, _parent));
      _push(`<div class="content-end">`);
      _push(ssrRenderComponent(_component_FormQuantitySelect, {
        modelValue: unref(quantity),
        "onUpdate:modelValue": [($event) => isRef(quantity) ? quantity.value = $event : null, ($event) => emit("updateQuantity", __props.item.id, unref(quantity))],
        size: "small"
      }, null, _parent));
      _push(`</div><div class="content-end text-right">`);
      _push(ssrRenderComponent(_component_FormLinkButton, {
        class: "text-sm border-b-1 border-b-solid border-b-brand-primary hover:border-none",
        label: "Remove",
        onClick: ($event) => emit("remove", __props.item.id)
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/checkout/ProductTile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "CheckoutProductTile" });

export { __nuxt_component_2 as default };
