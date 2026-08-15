import { _ as _export_sfc, I as __nuxt_component_0$1 } from './server.mjs';
import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, useTemplateRef, computed, defineAsyncComponent, unref, createVNode, resolveDynamicComponent, mergeProps, withCtx, openBlock, createBlock, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderVNode, ssrRenderClass, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
import { encodeUrlPath, buildUrlPrefix, urlIsAbsolute, relativeUrlSlash, getSrcSetForMedia } from '@shopware/helpers';
import { a as useElementSize } from './index-B6MI764M.mjs';
import { i as isSpatial } from './isSpatial-B7iPo9RI.mjs';
import { u as useCmsElementConfig } from './useCmsElementConfig-DY8wkVjg.mjs';
import { u as useUrlResolver } from './useUrlResolver-CibZ14y1.mjs';
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
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './composables-x8_ENpEe.mjs';

function useCmsElementImage(element) {
  const { getConfigValue } = useCmsElementConfig(element);
  const containerStyle = computed(() => ({
    minHeight: getConfigValue("minHeight")
  }));
  const anchorAttrs = computed(() => ({
    href: getConfigValue("url"),
    target: getConfigValue("newTab") ? "_blank" : "_self"
  }));
  const imageLink = computed(() => ({
    newTab: element.data?.newTab,
    url: element.data?.url
  }));
  const imageContainerAttrs = computed(() => {
    const attr = {};
    if (imageLink.value.url) {
      attr.href = urlIsAbsolute(imageLink.value.url) ? imageLink.value.url : relativeUrlSlash(imageLink.value.url);
    }
    if (imageLink.value.newTab) {
      attr.target = "blank";
      attr.rel = "noopener noreferrer";
    }
    return attr;
  });
  const imageAttrs = computed(() => ({
    src: element.data?.media?.url,
    alt: element.data?.media?.alt || "",
    srcset: getSrcSetForMedia(element.data?.media)
  }));
  const displayMode = computed(
    () => getConfigValue("displayMode") || "initial"
  );
  const isVideoElement = computed(() => {
    return !!element.data?.media?.mimeType?.includes("video");
  });
  const mimeType = computed(() => {
    return element.data?.media?.mimeType;
  });
  return {
    containerStyle,
    anchorAttrs,
    imageAttrs,
    imageContainerAttrs,
    imageLink,
    displayMode,
    isVideoElement,
    mimeType
  };
}
const DEFAULT_THUMBNAIL_SIZE = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsElementImage",
  __ssrInlineRender: true,
  props: {
    content: {},
    imageGallery: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const { getUrlPrefix } = useUrlResolver();
    const {
      containerStyle,
      displayMode,
      imageContainerAttrs,
      imageAttrs,
      imageLink,
      isVideoElement,
      mimeType
    } = useCmsElementImage(props.content);
    const imageElement = useTemplateRef("imageElement");
    const { width, height } = useElementSize(imageElement);
    function roundUp(num) {
      return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE;
    }
    const srcPath = computed(() => {
      if (!imageAttrs.value.src) return "";
      try {
        const encodedUrl = encodeUrlPath(imageAttrs.value.src);
        const url = new URL(encodedUrl);
        const w = roundUp(width.value);
        const h = roundUp(height.value);
        if (w > DEFAULT_THUMBNAIL_SIZE || h > DEFAULT_THUMBNAIL_SIZE) {
          if (width.value > height.value) {
            url.searchParams.set("width", String(w));
          } else {
            url.searchParams.set("height", String(h));
          }
        }
        url.searchParams.set("fit", "crop,smart");
        return url.toString();
      } catch {
        return imageAttrs.value.src;
      }
    });
    const imageComputedContainerAttrs = computed(() => {
      const imageAttrsCopy = Object.assign({}, imageContainerAttrs.value);
      if (imageAttrsCopy?.href) {
        imageAttrsCopy.href = buildUrlPrefix(
          imageAttrsCopy.href,
          getUrlPrefix()
        ).path;
      }
      return imageAttrsCopy;
    });
    const SwMedia3D = computed(() => {
      if (isSpatial(props.content.data.media)) {
        return defineAsyncComponent(() => import('./SwMedia3D-BsV7xQJH.mjs'));
      }
      return "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      const _component_NuxtImg = __nuxt_component_2;
      if (unref(imageAttrs).src) {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(imageLink).url ? "a" : "div"), mergeProps({
          class: ["cms-element-image self-stretch relative", {
            "flex justify-center items-center": __props.imageGallery
          }],
          style: unref(containerStyle)
        }, imageComputedContainerAttrs.value, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(isVideoElement)) {
                _push2(`<video controls class="${ssrRenderClass({
                  "w-full h-full": true,
                  "absolute inset-0": ["cover", "stretch"].includes(unref(displayMode)),
                  "object-cover": unref(displayMode) === "cover",
                  "object-contain": unref(displayMode) !== "cover"
                })}" data-v-87d4985b${_scopeId}><source${ssrRenderAttr("src", unref(imageAttrs).src)}${ssrRenderAttr("type", unref(mimeType))} data-v-87d4985b${_scopeId}> Your browser does not support the video tag. </video>`);
              } else if (unref(isSpatial)(props.content.data.media)) {
                _push2(ssrRenderComponent(_component_ClientOnly, null, {}, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(_component_NuxtImg, {
                  ref_key: "imageElement",
                  ref: imageElement,
                  preset: "productDetail",
                  loading: "lazy",
                  class: {
                    "w-full": !__props.imageGallery,
                    "h-full": !__props.imageGallery && ["cover", "stretch"].includes(unref(displayMode)),
                    "w-4/5": __props.imageGallery,
                    "absolute left-0 top-0": ["cover", "stretch"].includes(unref(displayMode)),
                    "object-cover": unref(displayMode) === "cover",
                    "object-contain": __props.imageGallery || unref(displayMode) !== "cover"
                  },
                  alt: unref(imageAttrs).alt,
                  src: srcPath.value,
                  srcset: unref(imageAttrs).srcset
                }, null, _parent2, _scopeId));
              }
            } else {
              return [
                unref(isVideoElement) ? (openBlock(), createBlock("video", {
                  key: 0,
                  controls: "",
                  class: {
                    "w-full h-full": true,
                    "absolute inset-0": ["cover", "stretch"].includes(unref(displayMode)),
                    "object-cover": unref(displayMode) === "cover",
                    "object-contain": unref(displayMode) !== "cover"
                  }
                }, [
                  createVNode("source", {
                    src: unref(imageAttrs).src,
                    type: unref(mimeType)
                  }, null, 8, ["src", "type"]),
                  createTextVNode(" Your browser does not support the video tag. ")
                ], 2)) : unref(isSpatial)(props.content.data.media) ? (openBlock(), createBlock(_component_ClientOnly, { key: 1 }, {
                  default: withCtx(() => [
                    (openBlock(), createBlock(resolveDynamicComponent(SwMedia3D.value), {
                      src: props.content.data.media.url
                    }, null, 8, ["src"]))
                  ]),
                  _: 1
                })) : (openBlock(), createBlock(_component_NuxtImg, {
                  key: 2,
                  ref_key: "imageElement",
                  ref: imageElement,
                  preset: "productDetail",
                  loading: "lazy",
                  class: {
                    "w-full": !__props.imageGallery,
                    "h-full": !__props.imageGallery && ["cover", "stretch"].includes(unref(displayMode)),
                    "w-4/5": __props.imageGallery,
                    "absolute left-0 top-0": ["cover", "stretch"].includes(unref(displayMode)),
                    "object-cover": unref(displayMode) === "cover",
                    "object-contain": __props.imageGallery || unref(displayMode) !== "cover"
                  },
                  alt: unref(imageAttrs).alt,
                  src: srcPath.value,
                  srcset: unref(imageAttrs).srcset
                }, null, 8, ["class", "alt", "src", "srcset"]))
              ];
            }
          }),
          _: 1
        }), _parent);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementImage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsElementImage = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-87d4985b"]]), { __name: "CmsElementImage" });

export { CmsElementImage as default };
