import __nuxt_component_0 from './BaseInput-Bd1YNFpA.mjs';
import __nuxt_component_1 from './index-DKA3nfTy.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-B7B0pxEe.mjs';
import __nuxt_component_3 from './Suggest-Bki7k34l.mjs';
import { defineComponent, useModel, ref, computed, watch, useTemplateRef, mergeProps, withCtx, createVNode, unref, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { getProductRoute } from '@shopware/helpers';
import { e as useShopwareContext, b as useLocalePath, M as useInternationalization, c as useRouter, o as useDebounceFn } from './server.mjs';
import { u as useApiErrorsResolver } from './useApiErrorsResolver-BfHgRTVy.mjs';
import { o as onClickOutside } from './index-B6MI764M.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
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
import '@shopware/api-client';
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import './Price-D7PucwgC.mjs';
import './usePrice-CDJKOx8c.mjs';
import './useProductPrice--vjxv0K3.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Search",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    displayTotal: { default: 10 }
  }, {
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const { apiClient } = useShopwareContext();
    const model = useModel(__props, "modelValue");
    const suggestElements = ref([]);
    const suggestElementsTotal = ref(0);
    const searchTerm = ref("");
    const loading = ref(false);
    const { handleApiError } = useApiErrorsResolver("suggest_search");
    async function getSuggestElements(value) {
      try {
        const response = await apiClient.invoke(
          "searchSuggest post /search-suggest",
          {
            body: {
              search: value
            }
          }
        );
        return response;
      } catch (error) {
        handleApiError(error);
        return {
          data: {
            elements: [],
            total: 0
          }
        };
      }
    }
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    const performSuggestSearch = useDebounceFn(async (value) => {
      searchTerm.value = value;
      loading.value = true;
      try {
        const data = await getSuggestElements(value);
        suggestElements.value = data.data.elements;
        suggestElementsTotal.value = data.data.total || 0;
      } finally {
        loading.value = false;
      }
    }, 300);
    const showSuggest = computed(
      () => model.value.length >= 3 && suggestIsActive.value
    );
    watch(model, async (value) => {
      if (value.length >= 3) {
        performSuggestSearch(value);
      } else {
        suggestElements.value = [];
        suggestElementsTotal.value = 0;
      }
    });
    const refSearchBox = useTemplateRef("searchBox");
    const suggestIsActive = ref(true);
    onClickOutside(refSearchBox, () => {
      suggestIsActive.value = false;
    });
    const router = useRouter();
    const handleEnterKey = () => {
      if (showSuggest.value && model.value) {
        suggestIsActive.value = false;
        router.push({
          path: "/search",
          query: { search: model.value }
        });
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormBaseInput = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_SearchSuggest = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ ref: "searchBox" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_FormBaseInput, {
        modelValue: model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        placeholder: _ctx.$t("search.placeholder"),
        onClick: ($event) => suggestIsActive.value = true,
        onFocus: ($event) => suggestIsActive.value = true,
        onKeydown: handleEnterKey
      }, {
        rightIcon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "shopware:search-s",
              class: "color-surface-on-surface-variant rotate-90 ml-2"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Icon, {
                name: "shopware:search-s",
                class: "color-surface-on-surface-variant rotate-90 ml-2"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(showSuggest)) {
        _push(`<div data-testid="layout-search-result-box" class="absolute top-full left-0 mt-2 border-1 border-outline-outline-variant rounded-lg shadow-lg overflow-hidden z-20 bg-surface-surface w-full"><!--[-->`);
        ssrRenderList(unref(suggestElements)?.slice(0, __props.displayTotal), (product) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: product.id,
            to: unref(formatLink)(unref(getProductRoute)(product)),
            "data-testid": "layout-search-suggest-link",
            onClick: ($event) => suggestIsActive.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_SearchSuggest, { product }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_SearchSuggest, { product }, null, 8, ["product"])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--><div class="${ssrRenderClass([{
          loading: [
            "bg-surface-surface-container text-surface-on-surface-variant"
          ]
        }, "h-11 text-sm p-3 text-center transition border-t-1 border-outline-outline-variant flex items-center justify-center"])}">`);
        if (unref(loading)) {
          _push(`<div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>`);
        } else {
          _push(`<div class="flex items-center justify-center">`);
          if (unref(suggestElementsTotal) > 0) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              "data-testid": "layout-search-result-box-more-link",
              to: unref(formatLink)({ path: `/search`, query: { search: model.value } }),
              onClick: ($event) => suggestIsActive.value = false
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(_ctx.$t("search.see"))} `);
                  if (unref(suggestElementsTotal) !== 1) {
                    _push2(`<span${_scopeId}>${ssrInterpolate(_ctx.$t("search.all"))}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(` ${ssrInterpolate(unref(suggestElementsTotal))} <span${_scopeId}>${ssrInterpolate(_ctx.$t("search.result", unref(suggestElementsTotal)))}</span>`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.$t("search.see")) + " ", 1),
                    unref(suggestElementsTotal) !== 1 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(_ctx.$t("search.all")), 1)) : createCommentVNode("", true),
                    createTextVNode(" " + toDisplayString(unref(suggestElementsTotal)) + " ", 1),
                    createVNode("span", null, toDisplayString(_ctx.$t("search.result", unref(suggestElementsTotal))), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<div data-testid="layout-search-result-box-no-result">${ssrInterpolate(_ctx.$t("search.noResults"))}</div>`);
          }
          _push(`</div>`);
        }
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/header/Search.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "LayoutHeaderSearch" });

export { __nuxt_component_2 as default };
