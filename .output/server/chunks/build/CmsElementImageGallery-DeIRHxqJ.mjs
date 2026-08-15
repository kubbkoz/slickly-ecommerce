import { _ as _export_sfc, I as __nuxt_component_0$1 } from './server.mjs';
import __nuxt_component_1 from './CmsElementImageGallery3dPlaceholder-oJCEVX_7.mjs';
import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import __nuxt_component_0$2 from './ChevronIcon-Aj1t6zS4.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { i as isSpatial } from './isSpatial-B7iPo9RI.mjs';
import { u as useCmsElementConfig } from './useCmsElementConfig-DY8wkVjg.mjs';
import { u as useImagePlaceholder } from './useImagePlaceholder-30hLRW4O.mjs';
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
import './composables-x8_ENpEe.mjs';

const DEFAULT_MIN_HEIGHT = "500px";
const DEFAULT_NAVIGATION = "inside";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsElementImageGallery",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { getConfigValue } = useCmsElementConfig(props.content);
    const minHeight = computed(
      () => getConfigValue("minHeight") || DEFAULT_MIN_HEIGHT
    );
    const navigationArrows = computed(
      () => getConfigValue("navigationArrows") || DEFAULT_NAVIGATION
    );
    const navigationDots = computed(
      () => getConfigValue("navigationDots") || DEFAULT_NAVIGATION
    );
    const currentIndex = ref(0);
    const mediaGallery = computed(() => props.content.data?.sliderItems ?? []);
    const placeholderSvg = useImagePlaceholder();
    const currentImage = computed(() => {
      return mediaGallery.value[currentIndex.value]?.media;
    });
    ref(0);
    ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_client_only = __nuxt_component_0$1;
      const _component_CmsElementImageGallery3dPlaceholder = __nuxt_component_1;
      const _component_NuxtImg = __nuxt_component_2;
      const _component_SwChevronIcon = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full max-w-full relative inline-flex flex-col justify-center items-center gap-2 mx-auto" }, _attrs))} data-v-4fc4efc8><div class="w-full" data-v-4fc4efc8><div class="w-full relative overflow-hidden" style="${ssrRenderStyle({ minHeight: minHeight.value })}" data-v-4fc4efc8>`);
      if (currentImage.value && unref(isSpatial)(currentImage.value)) {
        _push(`<div class="w-full h-full relative" style="${ssrRenderStyle({ minHeight: minHeight.value })}" data-v-4fc4efc8>`);
        _push(ssrRenderComponent(_component_client_only, null, {
          fallback: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_CmsElementImageGallery3dPlaceholder, { class: "w-full h-full absolute inset-0 object-cover" }, null, _parent2, _scopeId));
              _push2(`<span class="absolute bottom-4 right-4 text-sm bg-gray-800 rounded px-2 py-1 text-white" data-v-4fc4efc8${_scopeId}> 3D </span>`);
            } else {
              return [
                createVNode(_component_CmsElementImageGallery3dPlaceholder, { class: "w-full h-full absolute inset-0 object-cover" }),
                createVNode("span", { class: "absolute bottom-4 right-4 text-sm bg-gray-800 rounded px-2 py-1 text-white" }, " 3D ")
              ];
            }
          })
        }, _parent));
        _push(`</div>`);
      } else if (currentImage.value) {
        _push(ssrRenderComponent(_component_NuxtImg, {
          key: currentImage.value.url,
          preset: "hero",
          loading: "lazy",
          class: "w-full h-full absolute inset-0 object-cover",
          placeholder: unref(placeholderSvg),
          src: currentImage.value.url,
          alt: currentImage.value.alt || "Product image"
        }, null, _parent));
      } else {
        _push(`<img class="w-full h-full absolute inset-0 object-cover"${ssrRenderAttr("src", unref(placeholderSvg))} alt="Placeholder image" data-v-4fc4efc8>`);
      }
      _push(`</div>`);
      if (mediaGallery.value.length > 1 && navigationArrows.value !== "none") {
        _push(`<div class="absolute inset-0 flex items-center justify-between px-2 sm:px-4 pointer-events-none" data-v-4fc4efc8><button class="${ssrRenderClass([
          "w-10 h-10 rounded-full transition disabled:opacity-50 pointer-events-auto shadow-lg flex items-center justify-center",
          navigationArrows.value === "outside" ? "bg-brand-tertiary text-surface-on-surface" : "bg-surface-surface/20 hover:bg-surface-surface/50"
        ])}"${ssrIncludeBooleanAttr(currentIndex.value === 0) ? " disabled" : ""} aria-label="Previous image" data-v-4fc4efc8>`);
        _push(ssrRenderComponent(_component_SwChevronIcon, { direction: "left" }, null, _parent));
        _push(`</button><button class="${ssrRenderClass([
          "w-10 h-10 rounded-full transition disabled:opacity-50 pointer-events-auto shadow-lg flex items-center justify-center",
          navigationArrows.value === "outside" ? "bg-brand-tertiary text-surface-on-surface" : "bg-surface-surface/20 hover:bg-surface-surface/50"
        ])}"${ssrIncludeBooleanAttr(currentIndex.value === mediaGallery.value.length - 1) ? " disabled" : ""} aria-label="Next image" data-v-4fc4efc8>`);
        _push(ssrRenderComponent(_component_SwChevronIcon, { direction: "right" }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (mediaGallery.value.length > 1 && navigationDots.value !== "none") {
        _push(`<div class="${ssrRenderClass([
          "flex justify-center items-center gap-2",
          navigationDots.value === "outside" ? "mt-4" : "absolute bottom-4 left-1/2 transform -translate-x-1/2"
        ])}" data-v-4fc4efc8><!--[-->`);
        ssrRenderList(mediaGallery.value, (image, index) => {
          _push(`<button class="${ssrRenderClass([{
            "w-6 h-2 bg-surface-on-surface-variant": index === currentIndex.value,
            "w-2 h-2 bg-surface-surface-container-highest": index !== currentIndex.value
          }, "relative rounded-full transition-all duration-200 hover:scale-110"])}"${ssrRenderAttr("aria-label", `Go to image ${index + 1}`)} data-v-4fc4efc8></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementImageGallery.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-4fc4efc8"]]), { __name: "CmsElementImageGallery" });

export { __nuxt_component_0 as default };
