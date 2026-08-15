import { defineComponent, ref, computed, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { getTranslatedProperty } from '@shopware/helpers';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
import { e as useShopwareContext } from './server.mjs';
import { u as useProduct } from './useProduct-a-4w44J3.mjs';
import { u as useUrlResolver } from './useUrlResolver-CibZ14y1.mjs';
import { au as defu } from '../nitro/nitro.mjs';
import { useRouter } from 'vue-router';
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
import 'node:url';
import '@iconify/utils';
import 'consola';

function useProductConfigurator() {
  const { apiClient } = useShopwareContext();
  const { configurator, product } = useProduct();
  const selected = ref({});
  const isLoadingOptions = ref(!!product.value.options?.length);
  const parentProductId = computed(() => product.value?.parentId);
  const getOptionGroups = computed(() => {
    return configurator.value || [];
  });
  const findGroupCodeForOption = (optionId) => {
    const group = getOptionGroups.value.find((optionGroup) => {
      const optionFound = optionGroup.options?.find((option) => {
        return option.id === optionId;
      });
      return !!optionFound;
    });
    return getTranslatedProperty(group, "name");
  };
  for (const optionId of product.value.optionIds || []) {
    const optionGroupCode = findGroupCodeForOption(optionId);
    if (optionGroupCode) {
      selected.value[optionGroupCode] = optionId;
    }
  }
  async function findVariantForSelectedOptions(options) {
    const filter = [
      {
        type: "equals",
        field: "parentId",
        value: parentProductId.value
      },
      ...Object.values(options || selected.value).map(
        (id) => ({
          type: "equals",
          field: "optionIds",
          value: id
        })
      )
    ];
    try {
      const response = await apiClient.invoke("readProduct post /product", {
        body: {
          filter,
          limit: 1,
          includes: {
            product: ["id", "translated", "productNumber", "seoUrls"],
            seo_url: ["seoPathInfo"]
          },
          associations: {
            seoUrls: {}
          }
        }
      });
      return response.data.elements?.[0];
    } catch (e) {
      return void 0;
    }
  }
  const handleChange = async (group, option, onChangeHandled) => {
    selected.value = Object.assign({}, selected.value, {
      [group]: option
    });
    if (typeof onChangeHandled === "function") {
      await onChangeHandled();
    }
  };
  return {
    handleChange,
    findVariantForSelectedOptions,
    isLoadingOptions,
    getOptionGroups,
    getSelectedOptions: computed(() => selected.value)
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwVariantConfigurator",
  __ssrInlineRender: true,
  props: {
    allowRedirect: { type: Boolean, default: true }
  },
  emits: ["change"],
  setup(__props, { emit: __emit }) {
    const { getUrlPrefix } = useUrlResolver();
    getUrlPrefix();
    let translations = {
      product: {
        chooseA: "Choose a"
      }
    };
    translations = defu(useCmsTranslations(), translations);
    const isLoading = ref();
    useRouter();
    const {
      getOptionGroups,
      getSelectedOptions
    } = useProductConfigurator();
    computed(
      () => Object.values(unref(getSelectedOptions))
    );
    const isOptionSelected = (optionId) => Object.values(getSelectedOptions.value).includes(optionId);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col" }, _attrs))}>`);
      if (isLoading.value) {
        _push(`<div class="absolute inset-0 flex items-center justify-center z-10 bg-white/75"><div data-testid="loading" class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-gray-500"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(getOptionGroups), (optionGroup) => {
        _push(`<div class="mt-6"><div class="text-sm text-gray-900 font-medium">${ssrInterpolate(optionGroup.name)}</div><fieldset class="mt-4 flex-1"><legend class="sr-only">${ssrInterpolate(unref(translations).product.chooseA)} ${ssrInterpolate(optionGroup.name)}</legend><div class="flex gap-3"><!--[-->`);
        ssrRenderList(optionGroup.options, (option) => {
          _push(`<label data-testid="product-variant" class="${ssrRenderClass([{
            "border-3 border-brand-primary": isOptionSelected(option.id)
          }, "group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer"])}"><p${ssrRenderAttr("id", `${option.id}-choice-label`)} data-testid="product-variant-text">${ssrInterpolate(option.translated.name)}</p></label>`);
        });
        _push(`<!--]--></div></fieldset></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwVariantConfigurator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "SwVariantConfigurator" });

export { __nuxt_component_1 as default };
