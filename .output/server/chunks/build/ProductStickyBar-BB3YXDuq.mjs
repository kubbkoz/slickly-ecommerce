import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { g as useState, I as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, computed, ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { Minus, Plus, ShoppingCart } from 'lucide-vue-next';
import AddToCartButton from './AddToCartButton-B8hFUbWd.mjs';
import { u as usePrice } from './usePrice-CDJKOx8c.mjs';
import { u as useCountrySelector } from './useCountrySelector-Cujau6dz.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './BaseButton-BJMOoNbK.mjs';
import './nuxt-link-B7B0pxEe.mjs';
import './useUiState-BTlUPkrr.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductStickyBar",
  __ssrInlineRender: true,
  props: {
    product: {},
    visible: { type: Boolean },
    selectedSize: {},
    quantity: {}
  },
  emits: ["update:quantity"],
  setup(__props, { emit: __emit }) {
    const { getFormattedPrice } = usePrice();
    const props = __props;
    const emit = __emit;
    useState("mobileVariantPanelOpen", () => false);
    const sanitizedProductName = computed(() => props.product.name?.replace(/\s*\(Variant\)$/i, "") || "");
    const hasVariants = computed(() => (props.product?.childCount ?? 0) > 0 || (props.product?.children?.length ?? 0) > 0);
    const isUnselectedVariant = computed(
      () => hasVariants.value && !props.product?._isVariantOverride && (!props.selectedSize || props.selectedSize === "")
    );
    const { adjustPrice } = useCountrySelector();
    const unitPrice = computed(() => adjustPrice(props.product.calculatedPrice?.unitPrice ?? props.product.price ?? 0));
    const listPrice = computed(() => {
      const p = props.product.calculatedPrice?.listPrice?.price ?? null;
      return p != null ? adjustPrice(p) : null;
    });
    const discountPct = computed(() => {
      if (!listPrice.value || listPrice.value <= unitPrice.value) return null;
      return Math.round((1 - unitPrice.value / listPrice.value) * 100);
    });
    const localQty = computed({
      get: () => Math.max(1, props.quantity ?? 1),
      set: (val) => emit("update:quantity", Math.max(1, val))
    });
    ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (__props.visible) {
        _push(`<div class="hidden lg:block fixed inset-x-0 bottom-0 z-50 bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.15)]" role="complementary" aria-label="Rýchle pridanie do košíka"><div class="container mx-auto px-4 lg:px-8 py-3 pb-safe flex items-center gap-6">`);
        if (__props.product.image) {
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: __props.product.image,
            alt: __props.product.name,
            width: "112",
            height: "112",
            sizes: "56px",
            class: "w-14 h-14 object-contain mix-blend-multiply flex-shrink-0",
            format: "webp",
            loading: "lazy"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex-1 min-w-0"><p class="font-sans font-bold text-sm leading-tight text-black truncate mb-1">${ssrInterpolate(unref(sanitizedProductName))}</p><div class="flex items-center gap-3"><span class="text-brand font-bold font-tech text-lg leading-none">${ssrInterpolate(unref(getFormattedPrice)(unref(unitPrice)))}</span>`);
        if (unref(listPrice)) {
          _push(`<span class="text-gray-400 line-through text-sm font-tech">${ssrInterpolate(unref(getFormattedPrice)(unref(listPrice)))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(discountPct)) {
          _push(`<span class="px-2 py-0.5 text-xs font-bold text-black bg-amber rounded-[3px]"> -${ssrInterpolate(unref(discountPct))}% </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="flex items-center gap-3 flex-shrink-0"><div class="flex items-center border border-gray-200 h-12 rounded-default overflow-hidden"><button class="w-10 h-full flex items-center justify-center text-gray-400 hover:text-black transition-colors" aria-label="Znížiť množstvo">`);
        _push(ssrRenderComponent(unref(Minus), { class: "w-4 h-4" }, null, _parent));
        _push(`</button><span class="w-8 text-center font-bold font-tech text-sm select-none">${ssrInterpolate(unref(localQty))}</span><button class="w-10 h-full flex items-center justify-center text-gray-400 hover:text-black transition-colors" aria-label="Zvýšiť množstvo">`);
        _push(ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent));
        _push(`</button></div>`);
        if (unref(isUnselectedVariant)) {
          _push(`<button class="h-12 px-8 whitespace-nowrap bg-brand text-white font-bold font-tech text-sm tracking-widest uppercase flex items-center gap-3 transition-opacity hover:opacity-90 rounded-default">`);
          _push(ssrRenderComponent(unref(ShoppingCart), { class: "w-6 h-6" }, null, _parent));
          _push(` PRIDAŤ DO KOŠÍKA </button>`);
        } else {
          _push(ssrRenderComponent(AddToCartButton, {
            product: __props.product,
            quantity: unref(localQty),
            selectedSize: __props.selectedSize || "",
            showText: true,
            class: "h-12 px-8 whitespace-nowrap text-sm font-bold tracking-widest uppercase [&_svg]:w-6 [&_svg]:h-6"
          }, null, _parent));
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ProductStickyBar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductStickyBar = Object.assign(_sfc_main, { __name: "ProductStickyBar" });

export { ProductStickyBar as default };
