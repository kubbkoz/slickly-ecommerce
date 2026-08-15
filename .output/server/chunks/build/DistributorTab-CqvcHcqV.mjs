import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { F as slugify } from './server.mjs';
import ManufacturerInfo from './ManufacturerInfo-CWjTobFI.mjs';
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
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import './nuxt-link-B7B0pxEe.mjs';
import './sanitize-DKvwg8Vq.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DistributorTab",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  setup(__props) {
    const props = __props;
    const manufacturer = computed(() => props.product.manufacturer);
    const manufacturerName = computed(
      () => manufacturer.value?.translated?.name || manufacturer.value?.name || props.product.brand || "Výrobca"
    );
    const brandFilterUrl = computed(() => {
      const name = manufacturerName.value;
      if (name && name !== "Výrobca") return `/znacka/${slugify(name)}`;
      return null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(ManufacturerInfo, mergeProps({
        manufacturer: unref(manufacturer),
        "products-link": unref(brandFilterUrl)
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/tabs/DistributorTab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DistributorTab = Object.assign(_sfc_main, { __name: "DistributorTab" });

export { DistributorTab as default };
