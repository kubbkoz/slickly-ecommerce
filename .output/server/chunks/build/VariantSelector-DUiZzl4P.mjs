import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderClass } from 'vue/server-renderer';
import { u as useProductHelpers } from './useProductHelpers-Ch_jrkwO.mjs';
import { c as useRouter, d as useRoute, m as useI18n } from './server.mjs';
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
  __name: "VariantSelector",
  __ssrInlineRender: true,
  props: {
    product: {},
    selectedVariantId: {},
    activeId: {},
    hideInfo: { type: Boolean }
  },
  emits: ["variantSelected"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useProductHelpers();
    useRouter();
    useRoute();
    const { t } = useI18n();
    const variantGroups = computed(() => {
      const groupMap = /* @__PURE__ */ new Map();
      const settings = props.product?.configuratorSettings || [];
      if (settings.length > 0) {
        for (const cs of settings) {
          const option = cs.option;
          if (!option) continue;
          const groupId = option.groupId || option.group?.id || "default_group";
          const groupName = option.group?.translated?.name || option.group?.name || "Veľkosť";
          if (!groupMap.has(groupId)) {
            groupMap.set(groupId, { id: groupId, name: groupName, options: [] });
          }
          const currentRaw = props.product?._raw || props.product;
          let childVariant = props.product?.children?.find(
            (child) => (
              // Primary: match via optionIds (UUID array)
              child.optionIds?.includes(option.id) || // Fallback: match via options association (option objects)
              child.options?.some((o) => o.id === option.id)
            )
          );
          const currentOptionIds = currentRaw?.optionIds || props.product?.optionIds || [];
          const currentOptions = currentRaw?.options || props.product?.options || [];
          if (!childVariant && (currentOptionIds.includes(option.id) || currentOptions.some((o) => o.id === option.id))) {
            childVariant = currentRaw;
          }
          const preComputedVariant = props.product?.variants?.find(
            (v) => v.optionIds?.includes(option.id)
          );
          let realStockStatus = "on_order";
          let stockValue = 0;
          let restockTime = 0;
          if (preComputedVariant) {
            realStockStatus = preComputedVariant.stockStatus;
            stockValue = preComputedVariant.stockCount ?? 0;
          } else if (childVariant) {
            stockValue = childVariant.availableStock ?? childVariant.stock ?? 0;
            restockTime = childVariant.restockTime ?? 0;
            const childIsCloseout = (childVariant.isCloseout ?? props.product?.isCloseout) === true;
            if (stockValue > 0) {
              realStockStatus = "in_stock";
            } else if (childIsCloseout) {
              realStockStatus = "unavailable";
            } else {
              realStockStatus = "on_order";
            }
          }
          groupMap.get(groupId).options.push({
            id: option.id,
            groupId,
            name: option.translated?.name || option.name || "",
            stockStatus: realStockStatus,
            stock: stockValue,
            restockTime
          });
        }
      }
      const groups = Array.from(groupMap.values());
      for (const g of groups) {
        g.options.sort((a, b) => {
          const numA = parseFloat(a.name.match(/\d+(\.\d+)?/)?.[0] || "0");
          const numB = parseFloat(b.name.match(/\d+(\.\d+)?/)?.[0] || "0");
          if (numA && numB && numA !== numB) return numA - numB;
          return a.name.localeCompare(b.name, void 0, { numeric: true, sensitivity: "base" });
        });
      }
      return groups;
    });
    const isActive = (option) => {
      const raw = props.product?._raw || props.product;
      const optionIds = raw?.optionIds || props.product?.optionIds || [];
      if (Array.isArray(optionIds)) {
        return optionIds.includes(option.id);
      }
      return String(props.activeId).toLowerCase() === String(option.id).toLowerCase();
    };
    const formatOptionLabel = (name) => {
      const index = name.indexOf("(");
      if (index === -1) return { top: name, bottom: "" };
      return {
        top: name.substring(0, index).trim(),
        bottom: name.substring(index).trim()
      };
    };
    const activeVariantInfo = computed(() => {
      const raw = props.product?._raw || props.product;
      if (!raw) return null;
      const isParentWithChildren = !raw.parentId && (raw.childCount > 0 || raw.children?.length > 0);
      if (isParentWithChildren) return null;
      const stock = raw.availableStock ?? raw.stock ?? 0;
      const isAvailable = stock > 0;
      return {
        sku: raw.productNumber,
        ean: raw.ean,
        stock,
        restockTime: raw.restockTime ?? 0,
        isAvailable,
        isCloseout: raw.isCloseout
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mb-6" }, _attrs))}>`);
      if (variantGroups.value.length) {
        _push(`<!--[-->`);
        ssrRenderList(variantGroups.value, (group) => {
          _push(`<div class="mb-4"><p class="text-xs font-bold uppercase tracking-widest text-[#111] font-sans mb-3">${ssrInterpolate(group.name.toLowerCase().includes("rám") || group.name.toLowerCase().includes("frame") || group.name.toLowerCase().includes("size") ? group.name.toLowerCase().includes("rám") || group.name.toLowerCase().includes("frame") ? _ctx.$t("pdp.size_frame") : _ctx.$t("pdp.size_general") : group.name)}</p><div class="grid grid-cols-2 md:grid-cols-4 gap-2"><!--[-->`);
          ssrRenderList(group.options, (option) => {
            _push(`<button${ssrIncludeBooleanAttr(option.stockStatus === "unavailable") ? " disabled" : ""} class="${ssrRenderClass([[
              option.stockStatus === "unavailable" ? "bg-gray-50 text-gray-300 border-gray-100 pointer-events-none" : isActive(option) ? option.stockStatus === "in_stock" ? "bg-white text-black border-success" : "bg-white text-black border-amber-400" : "bg-white text-black border-gray-200 hover:border-black cursor-pointer"
            ], "relative w-full h-20 md:h-22 flex flex-col items-center justify-center transition-all duration-150 border-2 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset rounded-default p-2"])}">`);
            if (option.stockStatus === "unavailable") {
              _push(`<span class="absolute inset-x-0 top-1/2 h-px bg-gray-300 -rotate-12 z-10" aria-hidden="true"></span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="${ssrRenderClass([[isActive(option) ? "pb-5" : ""], "flex flex-col items-center justify-center transition-all duration-200"])}">`);
            if (formatOptionLabel(option.name).top) {
              _push(`<!--[--><span class="font-black text-sm md:text-base leading-tight uppercase font-tech text-center">${ssrInterpolate(formatOptionLabel(option.name).top)}</span>`);
              if (formatOptionLabel(option.name).bottom) {
                _push(`<span class="text-[10px] md:text-[11px] font-medium leading-tight opacity-70 text-center mt-0.5">${ssrInterpolate(formatOptionLabel(option.name).bottom)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<!--]-->`);
            } else {
              _push(`<span class="font-bold text-sm md:text-base text-center">${ssrInterpolate(option.name)}</span>`);
            }
            _push(`</div>`);
            if (isActive(option)) {
              _push(`<div class="${ssrRenderClass([[
                option.stockStatus === "in_stock" ? "bg-success" : option.stockStatus === "on_order" ? "bg-amber-400" : "bg-brand"
              ], "absolute bottom-0 left-0 right-0 h-6 flex items-center justify-center text-[9px] md:text-[10px] font-bold uppercase tracking-tight text-white leading-none px-1 py-0.5"])}">`);
              if (option.stockStatus === "in_stock") {
                _push(`<!--[-->${ssrInterpolate(_ctx.$t("availability_inStock"))} ${ssrInterpolate(option.stock >= 3 ? "> 3ks" : `${option.stock}ks`)}<!--]-->`);
              } else if (option.stockStatus === "on_order") {
                _push(`<!--[-->${ssrInterpolate(_ctx.$t("availability_restockTime", { days: option.restockTime || 4 }))}<!--]-->`);
              } else {
                _push(`<!--[-->${ssrInterpolate(_ctx.$t("availability_soldOut"))}<!--]-->`);
              }
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</button>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]-->`);
      } else if (activeVariantInfo.value) {
        _push(`<div class="mb-4"><div class="${ssrRenderClass([[
          activeVariantInfo.value.isAvailable ? "border-success" : activeVariantInfo.value.isCloseout ? "border-gray-100" : "border-amber-400"
        ], "inline-flex items-center justify-center border-2 pointer-events-none"])}"><div class="${ssrRenderClass([[
          activeVariantInfo.value.isAvailable ? "bg-success" : activeVariantInfo.value.isCloseout ? "bg-brand" : "bg-amber-400"
        ], "flex items-center justify-center text-[10px] md:text-[11px] font-bold uppercase tracking-tight text-white h-7 px-4 min-w-[120px]"])}">`);
        if (activeVariantInfo.value.isAvailable) {
          _push(`<!--[-->${ssrInterpolate(_ctx.$t("availability_inStock"))} ${ssrInterpolate(activeVariantInfo.value.stock >= 3 ? "> 3ks" : `${activeVariantInfo.value.stock}ks`)}<!--]-->`);
        } else if (!activeVariantInfo.value.isCloseout) {
          _push(`<!--[-->${ssrInterpolate(_ctx.$t("availability_restockTime", { days: activeVariantInfo.value.restockTime || 4 }))}<!--]-->`);
        } else {
          _push(`<!--[-->${ssrInterpolate(_ctx.$t("availability_soldOut"))}<!--]-->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeVariantInfo.value && !__props.hideInfo) {
        _push(`<div class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 animate-fade-in"><div class="flex items-center gap-2"><span class="text-xs font-bold uppercase tracking-widest text-black font-sans">SKU:</span><span class="text-sm font-medium text-gray-600 font-sans">${ssrInterpolate(activeVariantInfo.value.sku)}</span></div>`);
        if (activeVariantInfo.value.ean) {
          _push(`<div class="flex items-center gap-2"><span class="text-xs font-bold uppercase tracking-widest text-black font-sans">EAN:</span><span class="text-sm font-medium text-gray-600 font-sans">${ssrInterpolate(activeVariantInfo.value.ean)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/VariantSelector.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const VariantSelector = Object.assign(_sfc_main, { __name: "VariantSelector" });

export { VariantSelector as default };
