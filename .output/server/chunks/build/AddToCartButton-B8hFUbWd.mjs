import { defineComponent, ref, computed, unref, withCtx, createVNode, createTextVNode, mergeProps, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { ArrowRight, Loader2, Check, ShoppingCart } from 'lucide-vue-next';
import { _ as _export_sfc, a as useCart, c as useRouter, J as useTimeoutFn } from './server.mjs';
import BaseButton from './BaseButton-BJMOoNbK.mjs';
import { u as useUiState } from './useUiState-BTlUPkrr.mjs';
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
import './nuxt-link-B7B0pxEe.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AddToCartButton",
  __ssrInlineRender: true,
  props: {
    product: {},
    quantity: {},
    selectedSize: {},
    variant: {},
    fullWidth: { type: Boolean },
    showText: { type: Boolean },
    isCloseout: { type: Boolean },
    label: {},
    iconRight: { type: Boolean }
  },
  emits: ["success"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { addProduct } = useCart();
    const { toggleCartSidebar } = useUiState();
    const router = useRouter();
    const state = ref("idle");
    const isShakeActive = ref(false);
    const triggerShake = () => {
      isShakeActive.value = true;
      setTimeout(() => {
        isShakeActive.value = false;
      }, 500);
    };
    const isUnselectedVariant = computed(() => props.product.hasVariants && !props.product._isVariantOverride);
    const isEffectivelyCloseout = computed(() => {
      const raw = props.product?._raw || props.product;
      const closeout = props.isCloseout || raw?.isCloseout === true || props.product?.isCloseout === true;
      const stock = Number(props.product?.availableStock ?? raw?.availableStock ?? props.product?.stock ?? raw?.stock ?? 0);
      return closeout && stock <= 0;
    });
    const handleClick = async (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (isEffectivelyCloseout.value) return;
      if (isUnselectedVariant.value) {
        triggerShake();
        return;
      }
      if (state.value !== "idle") return;
      const { start: resetState } = useTimeoutFn(() => {
        state.value = "idle";
      }, 2e3, { immediate: false });
      state.value = "loading";
      try {
        if (props.product.isParentProduct && !props.product._isVariantOverride) {
          state.value = "idle";
          return;
        }
        if (!props.product?.id || props.product.id.length < 32) {
          state.value = "idle";
          return;
        }
        const cartResponse = await addProduct({ id: props.product.id, quantity: props.quantity || 1 });
        state.value = "success";
        emit("success");
        setTimeout(() => toggleCartSidebar(true), 350);
        resetState();
      } catch (error) {
        state.value = "idle";
      }
    };
    const buttonVariant = computed(() => props.variant === "compact" ? "primary" : props.variant);
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.product.hasVariants && !__props.selectedSize && __props.variant === "compact") {
        _push(`<div${ssrRenderAttrs(_attrs)} data-v-79f2f8c4>`);
        _push(ssrRenderComponent(BaseButton, {
          variant: "primary",
          "full-width": __props.fullWidth,
          class: "shadow-xl",
          onClick: ($event) => unref(router).push(`/product/${__props.product.id}`)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ArrowRight), { class: "w-4 h-4 mr-2" }, null, _parent2, _scopeId));
              _push2(` Detail `);
            } else {
              return [
                createVNode(unref(ArrowRight), { class: "w-4 h-4 mr-2" }),
                createTextVNode(" Detail ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else if (unref(isEffectivelyCloseout)) {
        _push(ssrRenderComponent(BaseButton, mergeProps({
          variant: "white",
          "full-width": __props.fullWidth,
          class: "!bg-gray-100 !border-gray-200 !text-gray-400 !cursor-not-allowed hover:!bg-gray-100 !opacity-100 gap-2 font-tech",
          disabled: ""
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (__props.showText) {
                _push2(`<span class="ml-2 uppercase tracking-wider text-xs font-bold" data-v-79f2f8c4${_scopeId}>${ssrInterpolate(_ctx.$t("pdp.sold_out"))}</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                __props.showText ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "ml-2 uppercase tracking-wider text-xs font-bold"
                }, toDisplayString(_ctx.$t("pdp.sold_out")), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(BaseButton, mergeProps({
          variant: unref(buttonVariant),
          "full-width": __props.fullWidth,
          class: [
            "transition-all duration-300 gap-2 font-tech",
            unref(state) === "success" ? "!bg-green-600 !border-green-600 !text-white hover:!bg-green-700" : "",
            unref(isUnselectedVariant) ? "!bg-[#f7f9fa] !border-gray-200 !text-gray-400 !cursor-not-allowed hover:!bg-[#f7f9fa] !opacity-100" : "",
            unref(isShakeActive) ? "animate-shake" : ""
          ],
          onClick: handleClick,
          disabled: unref(state) !== "idle" && !unref(isUnselectedVariant)
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(state) === "loading") {
                _push2(`<!--[-->`);
                _push2(ssrRenderComponent(unref(Loader2), { class: "w-5 h-5 animate-spin" }, null, _parent2, _scopeId));
                if (__props.showText) {
                  _push2(`<span class="ml-2" data-v-79f2f8c4${_scopeId}>${ssrInterpolate(_ctx.$t("pdp.adding"))}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              } else if (unref(state) === "success") {
                _push2(`<!--[-->`);
                _push2(ssrRenderComponent(unref(Check), { class: "w-5 h-5" }, null, _parent2, _scopeId));
                if (__props.showText) {
                  _push2(`<span class="ml-2" data-v-79f2f8c4${_scopeId}>${ssrInterpolate(_ctx.$t("pdp.added"))}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              } else {
                _push2(`<!--[-->`);
                if (!unref(isUnselectedVariant) && !__props.iconRight) {
                  _push2(ssrRenderComponent(unref(ShoppingCart), {
                    class: __props.iconRight ? "w-3.5 h-3.5" : "w-5 h-5"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                if (__props.showText) {
                  _push2(`<span class="${ssrRenderClass(__props.iconRight ? "" : "ml-2")}" data-v-79f2f8c4${_scopeId}>${ssrInterpolate(unref(isUnselectedVariant) ? _ctx.$t("pdp.select_size") : __props.label || _ctx.$t("pdp.add_to_cart"))}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (!unref(isUnselectedVariant) && __props.iconRight) {
                  _push2(ssrRenderComponent(unref(ShoppingCart), { class: "w-[1rem] h-[1rem] shrink-0 [stroke-width:2]" }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              }
            } else {
              return [
                unref(state) === "loading" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                  createVNode(unref(Loader2), { class: "w-5 h-5 animate-spin" }),
                  __props.showText ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "ml-2"
                  }, toDisplayString(_ctx.$t("pdp.adding")), 1)) : createCommentVNode("", true)
                ], 64)) : unref(state) === "success" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                  createVNode(unref(Check), { class: "w-5 h-5" }),
                  __props.showText ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "ml-2"
                  }, toDisplayString(_ctx.$t("pdp.added")), 1)) : createCommentVNode("", true)
                ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                  !unref(isUnselectedVariant) && !__props.iconRight ? (openBlock(), createBlock(unref(ShoppingCart), {
                    key: 0,
                    class: __props.iconRight ? "w-3.5 h-3.5" : "w-5 h-5"
                  }, null, 8, ["class"])) : createCommentVNode("", true),
                  __props.showText ? (openBlock(), createBlock("span", {
                    key: 1,
                    class: __props.iconRight ? "" : "ml-2"
                  }, toDisplayString(unref(isUnselectedVariant) ? _ctx.$t("pdp.select_size") : __props.label || _ctx.$t("pdp.add_to_cart")), 3)) : createCommentVNode("", true),
                  !unref(isUnselectedVariant) && __props.iconRight ? (openBlock(), createBlock(unref(ShoppingCart), {
                    key: 2,
                    class: "w-[1rem] h-[1rem] shrink-0 [stroke-width:2]"
                  })) : createCommentVNode("", true)
                ], 64))
              ];
            }
          }),
          _: 1
        }, _parent));
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/AddToCartButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AddToCartButton = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-79f2f8c4"]]), { __name: "AddToCartButton" });

export { AddToCartButton as default };
