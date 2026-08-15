import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, computed, unref, mergeProps, withCtx, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { b as useLocalePath } from './server.mjs';
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
  __name: "ChatProductCard",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  setup(__props) {
    const props = __props;
    const localePath = useLocalePath();
    const discount = computed(() => {
      if (!props.product.listPrice || props.product.listPrice <= props.product.price) return 0;
      return Math.round((props.product.listPrice - props.product.price) / props.product.listPrice * 100);
    });
    const href = computed(
      () => props.product.seoPath ? localePath(props.product.seoPath) : null
    );
    const resolvedImage = computed(() => {
      const url = props.product.imageUrl;
      if (!url) return null;
      return url;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (unref(href)) {
        _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
          to: unref(href),
          class: "flex gap-3 p-2.5 bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer group border border-gray-100 hover:border-brand/30 no-underline"
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="w-[72px] h-[72px] bg-gray-50 shrink-0 relative overflow-hidden flex items-center justify-center p-1.5 border border-gray-100/80"${_scopeId}>`);
              if (unref(resolvedImage)) {
                _push2(`<img${ssrRenderAttr("src", unref(resolvedImage))}${ssrRenderAttr("alt", __props.product.name)} class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" loading="lazy"${_scopeId}>`);
              } else {
                _push2(`<div class="w-full h-full bg-gray-100 flex items-center justify-center"${_scopeId}><span class="text-[10px] text-gray-400 font-tech"${_scopeId}>MT</span></div>`);
              }
              if (unref(discount) > 0) {
                _push2(`<div class="absolute top-0 left-0 bg-amber text-black text-[9px] font-bold px-1.5 py-0.5"${_scopeId}> -${ssrInterpolate(unref(discount))}% </div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="flex flex-col justify-center min-w-0 flex-1"${_scopeId}>`);
              if (__props.product.brand) {
                _push2(`<p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-tech mb-0.5"${_scopeId}>${ssrInterpolate(__props.product.brand)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<h4 class="font-sans text-[12px] font-bold text-gray-900 group-hover:text-brand transition-colors line-clamp-2 leading-tight mb-1.5"${_scopeId}>${ssrInterpolate(__props.product.name)}</h4><div class="flex items-baseline gap-2"${_scopeId}><span class="font-tech font-black text-[15px] text-black leading-none"${_scopeId}>${ssrInterpolate(__props.product.price.toLocaleString("sk-SK"))} € </span>`);
              if (__props.product.listPrice && __props.product.listPrice > __props.product.price) {
                _push2(`<span class="text-[10px] text-gray-400 line-through font-tech"${_scopeId}>${ssrInterpolate(__props.product.listPrice.toLocaleString("sk-SK"))} € </span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            } else {
              return [
                createVNode("div", { class: "w-[72px] h-[72px] bg-gray-50 shrink-0 relative overflow-hidden flex items-center justify-center p-1.5 border border-gray-100/80" }, [
                  unref(resolvedImage) ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: unref(resolvedImage),
                    alt: __props.product.name,
                    class: "w-full h-full object-contain transition-transform duration-300 group-hover:scale-105",
                    loading: "lazy"
                  }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "w-full h-full bg-gray-100 flex items-center justify-center"
                  }, [
                    createVNode("span", { class: "text-[10px] text-gray-400 font-tech" }, "MT")
                  ])),
                  unref(discount) > 0 ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "absolute top-0 left-0 bg-amber text-black text-[9px] font-bold px-1.5 py-0.5"
                  }, " -" + toDisplayString(unref(discount)) + "% ", 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "flex flex-col justify-center min-w-0 flex-1" }, [
                  __props.product.brand ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-[10px] font-bold text-gray-400 uppercase tracking-widest font-tech mb-0.5"
                  }, toDisplayString(__props.product.brand), 1)) : createCommentVNode("", true),
                  createVNode("h4", { class: "font-sans text-[12px] font-bold text-gray-900 group-hover:text-brand transition-colors line-clamp-2 leading-tight mb-1.5" }, toDisplayString(__props.product.name), 1),
                  createVNode("div", { class: "flex items-baseline gap-2" }, [
                    createVNode("span", { class: "font-tech font-black text-[15px] text-black leading-none" }, toDisplayString(__props.product.price.toLocaleString("sk-SK")) + " € ", 1),
                    __props.product.listPrice && __props.product.listPrice > __props.product.price ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "text-[10px] text-gray-400 line-through font-tech"
                    }, toDisplayString(__props.product.listPrice.toLocaleString("sk-SK")) + " € ", 1)) : createCommentVNode("", true)
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/ChatProductCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ChatProductCard = Object.assign(_sfc_main, { __name: "ChatProductCard" });

export { ChatProductCard as default };
