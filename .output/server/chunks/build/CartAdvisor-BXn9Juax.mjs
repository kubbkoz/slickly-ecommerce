import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { RefreshCw, Loader2, ShoppingCart, Plus, CheckCircle2 } from 'lucide-vue-next';
import { _ as _export_sfc, b as useLocalePath, a as useCart } from './server.mjs';
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
import './composables-x8_ENpEe.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CartAdvisor",
  __ssrInlineRender: true,
  props: {
    cartItems: {}
  },
  setup(__props) {
    ref("");
    const products = ref([]);
    const isLoading = ref(false);
    const hasLoaded = ref(false);
    const localePath = useLocalePath();
    const { addProduct, cartItems: realCartItems } = useCart();
    const addingIds = ref(/* @__PURE__ */ new Set());
    const shakingIds = ref(/* @__PURE__ */ new Set());
    const isAddingAll = ref(false);
    const selectedVariants = ref({});
    const addedProductIds = computed(() => {
      const ids = /* @__PURE__ */ new Set();
      (realCartItems.value || []).forEach((item) => {
        if (item.referencedId) ids.add(item.referencedId);
        if (item.productId) ids.add(item.productId);
      });
      return ids;
    });
    const formatPrice = (p) => new Intl.NumberFormat("sk-SK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(p);
    const imgSrc = (url) => {
      if (!url) return null;
      return url;
    };
    const getActiveVariant = (product) => {
      const selId = selectedVariants.value[product.id];
      if (selId) return product.variants.find((v) => v.id === selId) || null;
      return product.variants[0] || null;
    };
    const getAddId = (product) => {
      if (!product.hasVariants) return product.id;
      const active = getActiveVariant(product);
      return active?.id || null;
    };
    const getOptionGroups = (product) => {
      const groups = {};
      product.variants.forEach((v) => {
        v.options.forEach((o) => {
          if (!groups[o.groupName]) groups[o.groupName] = [];
          if (!groups[o.groupName].includes(o.name)) groups[o.groupName].push(o.name);
        });
      });
      return groups;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_2;
      if (__props.cartItems.length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in" }, _attrs))} data-v-881b22da><div class="flex items-end justify-between gap-4 mb-8" data-v-881b22da><div data-v-881b22da><h2 class="text-2xl md:text-3xl font-bold uppercase italic font-tech tracking-tight text-black" data-v-881b22da> Odporúčame <span class="text-brand" data-v-881b22da>dokúpiť</span></h2><div class="w-16 h-1 bg-brand mt-2" data-v-881b22da></div></div>`);
        if (unref(hasLoaded) && unref(products).length > 0) {
          _push(`<div class="flex items-center gap-4 flex-shrink-0 pb-1" data-v-881b22da><button class="flex items-center gap-1.5 text-gray-400 hover:text-brand font-sans text-[10px] font-medium uppercase tracking-widest transition-colors bg-transparent focus:outline-none"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} data-v-881b22da>`);
          _push(ssrRenderComponent(unref(RefreshCw), {
            class: ["w-3 h-3", { "animate-spin": unref(isLoading) }]
          }, null, _parent));
          _push(` Ďalšie vhodné produkty </button>`);
          if (!unref(products).every((p) => unref(addedProductIds).has(p.id))) {
            _push(`<button${ssrIncludeBooleanAttr(unref(isAddingAll)) ? " disabled" : ""} class="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-[10px] font-medium uppercase tracking-widest hover:bg-brand transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md" data-v-881b22da>`);
            if (unref(isAddingAll)) {
              _push(ssrRenderComponent(unref(Loader2), { class: "w-3 h-3 animate-spin" }, null, _parent));
            } else {
              _push(ssrRenderComponent(unref(ShoppingCart), { class: "w-3 h-3" }, null, _parent));
            }
            _push(` Pridať všetko </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(isLoading) && !unref(hasLoaded)) {
          _push(`<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4" data-v-881b22da><!--[-->`);
          ssrRenderList(5, (n) => {
            _push(`<div class="bg-white border border-gray-100 p-4" data-v-881b22da><div class="aspect-square bg-gray-50 animate-pulse mb-4" data-v-881b22da></div><div class="space-y-3" data-v-881b22da><div class="h-3 bg-gray-100 animate-pulse w-3/4" data-v-881b22da></div><div class="h-4 bg-gray-100 animate-pulse w-1/2" data-v-881b22da></div><div class="h-9 bg-gray-50 animate-pulse w-full mt-4" data-v-881b22da></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else if (unref(hasLoaded) && unref(products).length) {
          _push(`<div class="${ssrRenderClass([unref(products).length <= 3 ? "md:grid-cols-3" : unref(products).length === 4 ? "md:grid-cols-4" : "md:grid-cols-5", "grid grid-cols-2 gap-4"])}" data-v-881b22da><!--[-->`);
          ssrRenderList(unref(products), (product) => {
            _push(`<div class="${ssrRenderClass([{ "animate-shake border-red-300": unref(shakingIds).has(product.id) }, "bg-white border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex flex-col group relative gpu-boost"])}" data-v-881b22da>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: product.seoPath ? unref(localePath)(product.seoPath) : unref(localePath)("/"),
              class: "block overflow-hidden bg-gray-50 aspect-square p-4 relative"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  if (imgSrc(product.imageUrl)) {
                    _push2(ssrRenderComponent(_component_NuxtImg, {
                      src: imgSrc(product.imageUrl),
                      alt: product.name,
                      format: "webp",
                      loading: "lazy",
                      class: "w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    }, null, _parent2, _scopeId));
                  } else {
                    _push2(`<div class="w-full h-full flex items-center justify-center text-gray-200" data-v-881b22da${_scopeId}>`);
                    _push2(ssrRenderComponent(unref(ShoppingCart), { class: "w-10 h-10" }, null, _parent2, _scopeId));
                    _push2(`</div>`);
                  }
                } else {
                  return [
                    imgSrc(product.imageUrl) ? (openBlock(), createBlock(_component_NuxtImg, {
                      key: 0,
                      src: imgSrc(product.imageUrl),
                      alt: product.name,
                      format: "webp",
                      loading: "lazy",
                      class: "w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "w-full h-full flex items-center justify-center text-gray-200"
                    }, [
                      createVNode(unref(ShoppingCart), { class: "w-10 h-10" })
                    ]))
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`<div class="p-4 flex flex-col flex-1 gap-2.5" data-v-881b22da>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: product.seoPath ? unref(localePath)(product.seoPath) : unref(localePath)("/"),
              class: "text-[11px] font-bold uppercase tracking-tight text-black hover:text-brand transition-colors font-sans leading-tight line-clamp-2 h-7"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(product.name)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(product.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            if (product.hasVariants && product.variants.length) {
              _push(`<div class="min-h-[44px]" data-v-881b22da><!--[-->`);
              ssrRenderList(getOptionGroups(product), (values, groupName) => {
                _push(`<div class="mb-2 last:mb-0" data-v-881b22da><div class="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1" data-v-881b22da>${ssrInterpolate(groupName)}</div><div class="flex flex-wrap gap-1" data-v-881b22da><!--[-->`);
                ssrRenderList(values, (val) => {
                  _push(`<button class="${ssrRenderClass([
                    getActiveVariant(product)?.options.some((o) => o.groupName === groupName && o.name === val) ? "border-black bg-black text-white" : "border-gray-200 text-gray-600 hover:border-black hover:text-black",
                    "px-1.5 py-0.5 text-[9px] font-bold border transition-all duration-200"
                  ])}" data-v-881b22da>${ssrInterpolate(val)}</button>`);
                });
                _push(`<!--]--></div></div>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<div class="min-h-[44px] flex items-center" data-v-881b22da></div>`);
            }
            _push(`<div class="flex items-baseline gap-2 mt-auto" data-v-881b22da>`);
            if (product.listPrice) {
              _push(`<span class="text-[10px] text-gray-400 line-through font-tech" data-v-881b22da>${ssrInterpolate(formatPrice(product.listPrice))} € </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<span class="text-lg font-black font-tech text-black leading-none" data-v-881b22da>${ssrInterpolate(formatPrice(product.price))} € </span></div><div class="pt-2" data-v-881b22da>`);
            if (product.hasVariants && !getAddId(product)) {
              _push(ssrRenderComponent(_component_NuxtLink, {
                to: product.seoPath ? unref(localePath)(product.seoPath) : unref(localePath)("/"),
                class: "w-full border border-black bg-black text-white flex items-center justify-center gap-2 py-2.5 text-[10px] font-medium uppercase tracking-widest transition-colors duration-300 hover:bg-brand hover:border-brand shadow-sm"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(ssrRenderComponent(unref(Plus), { class: "w-3 h-3" }, null, _parent2, _scopeId));
                    _push2(` Vybrať veľkosť `);
                  } else {
                    return [
                      createVNode(unref(Plus), { class: "w-3 h-3" }),
                      createTextVNode(" Vybrať veľkosť ")
                    ];
                  }
                }),
                _: 2
              }, _parent));
            } else {
              _push(`<button${ssrIncludeBooleanAttr(!product.available || !!unref(addingIds).has(getAddId(product) ?? "")) ? " disabled" : ""} class="${ssrRenderClass([unref(addedProductIds).has(product.id) || getAddId(product) && unref(addedProductIds).has(getAddId(product)) ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-black border-gray-200 hover:bg-black hover:text-white hover:border-black shadow-sm", "w-full border flex items-center justify-center gap-2 py-2.5 text-[10px] font-medium uppercase tracking-widest transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"])}" data-v-881b22da>`);
              if (unref(addingIds).has(getAddId(product) ?? "")) {
                _push(ssrRenderComponent(unref(Loader2), { class: "w-3 h-3 animate-spin" }, null, _parent));
              } else if (unref(addedProductIds).has(product.id) || getAddId(product) && unref(addedProductIds).has(getAddId(product))) {
                _push(ssrRenderComponent(unref(CheckCircle2), { class: "w-3 h-3" }, null, _parent));
              } else {
                _push(ssrRenderComponent(unref(Plus), { class: "w-3 h-3" }, null, _parent));
              }
              _push(` ${ssrInterpolate(unref(addedProductIds).has(product.id) || getAddId(product) && unref(addedProductIds).has(getAddId(product)) ? "Pridané" : "Do košíka")}</button>`);
            }
            _push(`</div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/CartAdvisor.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CartAdvisor = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-881b22da"]]), { __name: "CartAdvisor" });

export { CartAdvisor as default };
