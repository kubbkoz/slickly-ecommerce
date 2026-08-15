import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import BaseButton from './BaseButton-BJMOoNbK.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { ArrowRight, Loader2 } from 'lucide-vue-next';
import { e as useShopwareContext, d as useRoute, g as useState, b as useLocalePath, h as useAsyncData, G as getCategoryUrl } from './server.mjs';
import { p as proxyMediaUrl } from './media-BNPyNy3v.mjs';
import __nuxt_component_0$1 from './ProductCardMini-C5JVac9Q.mjs';
import { u as useStaticTranslations } from './useStaticTranslations-DjO9xa-s.mjs';
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
import './useProductHelpers-Ch_jrkwO.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MegaMenu",
  __ssrInlineRender: true,
  props: {
    category: {},
    isVisible: { type: Boolean }
  },
  emits: ["mouseenter", "mouseleave"],
  setup(__props) {
    const props = __props;
    const { apiClient } = useShopwareContext();
    useRoute();
    const isLoginModalOpen = useState("loginModalOpen", () => false);
    const { t } = useStaticTranslations();
    const localePath = useLocalePath();
    const displayedSubcategories = computed(() => {
      if (!props.category?.children) return [];
      return props.category.children.filter((c) => !!c).slice(0, 10);
    });
    const { data: bestSellers, pending: isFetchingProducts } = useAsyncData(
      () => `megamenu-products-${props.category?.id}`,
      async () => {
        if (!props.category?.id) return [];
        const canonicalCategoryId = props.category.id;
        try {
          const response = await apiClient.invoke("readProductList post /product", {
            body: {
              limit: 4,
              filter: [
                { type: "equals", field: "active", value: true },
                {
                  type: "multi",
                  operator: "OR",
                  queries: [
                    { type: "equals", field: "categoryTree", value: canonicalCategoryId },
                    { type: "equals", field: "categoryIds", value: canonicalCategoryId }
                  ]
                },
                { type: "equals", field: "markAsTopseller", value: true }
              ],
              associations: {
                media: {},
                cover: { associations: { media: {} } }
              }
            }
          });
          let elements = response.data.elements || [];
          if (elements.length < 4) {
            const remainingCount = 4 - elements.length;
            const exclusionIds = elements.map((e) => e.id);
            const targetIds = [canonicalCategoryId];
            if (props.category?.id && props.category.id !== canonicalCategoryId) {
              targetIds.push(props.category.id);
            }
            const fallbackFilter = [
              { type: "equals", field: "active", value: true },
              {
                type: "multi",
                operator: "OR",
                queries: targetIds.flatMap((id) => [
                  { type: "equals", field: "categoryTree", value: id },
                  { type: "equals", field: "categoryIds", value: id }
                ])
              }
            ];
            if (exclusionIds.length > 0) {
              fallbackFilter.push({
                type: "equalsAny",
                field: "id",
                value: exclusionIds,
                negate: true
              });
            }
            const fillResponse = await apiClient.invoke("readProductList post /product", {
              body: {
                limit: remainingCount,
                filter: fallbackFilter,
                sort: [{ field: "sales", order: "DESC" }],
                associations: {
                  media: {},
                  cover: { associations: { media: {} } }
                }
              }
            });
            const fillElements = fillResponse.data.elements || [];
            elements = [...elements, ...fillElements];
          }
          return elements.slice(0, 4);
        } catch (e) {
          return [];
        }
      },
      { watch: [() => props.category?.id], lazy: true, server: false }
    );
    const getCategoryImage = (cat) => {
      const url = cat.media?.url || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=contain";
      return proxyMediaUrl(url);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_BaseButton = BaseButton;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["mega-menu-root absolute top-full left-0 w-full bg-white text-black shadow-2xl transition-all duration-300 transform origin-top border-t-4 border-brand z-50 overflow-hidden overflow-y-auto max-h-[calc(100vh-60px)] gpu-boost", [
          __props.isVisible ? "opacity-100 visible translate-y-0 pointer-events-auto" : "opacity-0 invisible -translate-y-4 pointer-events-none"
        ]]
      }, _attrs))}>`);
      if (__props.category) {
        _push(`<div class="container mx-auto px-4 lg:px-8 py-5 xl:py-10"><div class="grid grid-cols-12 gap-6 xl:gap-12"><div class="col-span-6 pr-4 xl:pr-8 flex flex-col justify-between min-h-[300px] xl:min-h-[400px]"><div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)(unref(getCategoryUrl)(__props.category)),
          class: "font-tech text-2xl xl:text-4xl font-black uppercase text-black mb-5 xl:mb-8 tracking-wide italic cursor-pointer hover:text-brand transition-colors block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(__props.category.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(__props.category.name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<ul class="grid grid-cols-2 gap-x-4 xl:gap-x-8 gap-y-0.5 xl:gap-y-1"><!--[-->`);
        ssrRenderList(unref(displayedSubcategories), (sub) => {
          _push(`<li class="group/sub">`);
          if (sub) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: unref(localePath)(unref(getCategoryUrl)(sub)),
              class: "flex items-center gap-3 xl:gap-6 py-2 xl:py-4 px-3 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-200 w-full rounded-default"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="w-10 h-10 xl:w-16 xl:h-16 flex-shrink-0 relative overflow-hidden bg-white rounded-default border border-gray-100/50"${_scopeId}><img${ssrRenderAttr("src", getCategoryImage(sub))} alt="" class="w-full h-full object-contain transition-transform duration-700 p-1"${_scopeId}></div><div class="flex-1"${_scopeId}><span class="block font-tech text-[11px] xl:text-[15px] font-black uppercase tracking-wide text-black group-hover/sub:text-brand transition-colors leading-none"${_scopeId}>${ssrInterpolate(sub.name)}</span></div>`);
                } else {
                  return [
                    createVNode("div", { class: "w-10 h-10 xl:w-16 xl:h-16 flex-shrink-0 relative overflow-hidden bg-white rounded-default border border-gray-100/50" }, [
                      createVNode("img", {
                        src: getCategoryImage(sub),
                        alt: "",
                        class: "w-full h-full object-contain transition-transform duration-700 p-1"
                      }, null, 8, ["src"])
                    ]),
                    createVNode("div", { class: "flex-1" }, [
                      createVNode("span", { class: "block font-tech text-[11px] xl:text-[15px] font-black uppercase tracking-wide text-black group-hover/sub:text-brand transition-colors leading-none" }, toDisplayString(sub.name), 1)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul></div><div class="mt-8">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)(unref(getCategoryUrl)(__props.category)),
          class: "inline-flex items-center text-brand font-bold uppercase tracking-widest text-xs border-b-2 border-brand pb-1 hover:text-black hover:border-black transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("zobrazit_vsetko"))} `);
              _push2(ssrRenderComponent(unref(ArrowRight), { class: "ml-2 w-3 h-3" }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("zobrazit_vsetko")) + " ", 1),
                createVNode(unref(ArrowRight), { class: "ml-2 w-3 h-3" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><div class="col-span-6 grid grid-cols-2 gap-4 xl:gap-8"><div class="col-span-1 flex flex-col min-h-[300px] xl:min-h-[400px]"><div class="mb-3 xl:mb-6"><h6 class="font-tech text-lg xl:text-2xl font-black uppercase text-black italic leading-none mb-2 xl:mb-3">${ssrInterpolate(unref(t)("megamenu_recommended_products"))}</h6><p class="text-gray-500 text-[10px] uppercase tracking-widest font-bold">${ssrInterpolate(unref(t)("megamenu_in_category"))} ${ssrInterpolate(__props.category.name)}</p></div><div class="flex-1 flex flex-col gap-3 relative">`);
        if (unref(isFetchingProducts)) {
          _push(`<div class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">`);
          _push(ssrRenderComponent(unref(Loader2), { class: "w-8 h-8 animate-spin text-brand" }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(bestSellers), (prod) => {
          _push(ssrRenderComponent(__nuxt_component_0$1, {
            key: prod.id,
            product: prod
          }, null, _parent));
        });
        _push(`<!--]-->`);
        if (!unref(isFetchingProducts) && (!unref(bestSellers) || unref(bestSellers).length === 0)) {
          _push(`<div class="py-8 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest border border-dashed border-gray-200">${ssrInterpolate(unref(t)("megamenu_no_recommendations"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)(unref(getCategoryUrl)(__props.category)),
          class: "mt-6 text-[10px] font-bold uppercase tracking-widest border-b border-black w-fit hover:text-brand hover:border-brand transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("prezriet_ponuku"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("prezriet_ponuku")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="col-span-1 bg-black text-white p-5 xl:p-8 2xl:p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group/banner rounded-default h-full min-h-[300px] xl:min-h-[400px]"><div class="absolute inset-0 opacity-20 bg-[url(&#39;/assets/images/carbon-fibre.png&#39;)]"></div><div class="absolute inset-0 bg-brand/10 transform scale-0 rounded-full group-hover/banner:scale-150 transition-transform duration-700 ease-out gpu-boost"></div><div class="relative z-10 flex flex-col justify-center items-center h-full w-full"><span class="text-brand font-tech text-sm xl:text-xl uppercase tracking-[0.2em] mb-2 xl:mb-4 block">${ssrInterpolate(unref(t)("megamenu_club_title"))}</span><h4 class="font-tech text-xl xl:text-3xl 2xl:text-4xl font-black uppercase italic leading-[1] mb-4 xl:mb-8">${ssrInterpolate(unref(t)("megamenu_club_line1"))} <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-brand to-red-500">${ssrInterpolate(unref(t)("megamenu_club_line2"))}</span></h4><div class="flex flex-col gap-2 xl:gap-3 w-full max-w-[200px] xl:max-w-[240px]">`);
        _push(ssrRenderComponent(_component_BaseButton, {
          variant: "primary",
          class: "w-full !py-2.5 xl:!py-4 !text-xs tracking-widest",
          onClick: ($event) => isLoginModalOpen.value = true
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("megamenu_register"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("megamenu_register")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/mtsport-club",
          class: "w-full py-2.5 xl:py-4 border border-white text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("megamenu_club_more_info"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("megamenu_club_more_info")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/navbar/MegaMenu.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const MegaMenu = Object.assign(_sfc_main, { __name: "MegaMenu" });

export { MegaMenu as default };
