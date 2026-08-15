import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, computed, ref, watch, nextTick, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrRenderTeleport } from 'vue/server-renderer';
import { ZoomIn, ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { b as badgeSizeClass } from './useProductBadges-BvF7DSTC.mjs';
import { _ as _export_sfc } from './server.mjs';
import './composables-x8_ENpEe.mjs';
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
  __name: "ProductGallery",
  __ssrInlineRender: true,
  props: {
    product: {},
    activeImage: {},
    galleryImages: {},
    imageBadges: { default: () => [] }
  },
  emits: ["update:activeImage", "update:galleryImages"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const allMedia = computed(() => {
      const fromGallery = props.galleryImages.length > 0 ? props.galleryImages : props.activeImage ? [props.activeImage] : [];
      return [...new Set(fromGallery)].filter(Boolean);
    });
    const firstImage = computed(() => allMedia.value[0] || "");
    const gridImages = computed(() => allMedia.value.slice(1));
    const isExpanded = ref(false);
    const displayedGridImages = computed(
      () => isExpanded.value ? gridImages.value : gridImages.value.slice(0, 4)
    );
    const hasHiddenImages = computed(() => gridImages.value.length > 4);
    ref(null);
    const currentSlide = ref(0);
    const imageLoaded = ref({});
    const onImageLoad = (idx) => {
      imageLoaded.value[idx] = true;
    };
    computed(() => {
      const oldPrice = Number(props.product.oldPrice);
      const price = Number(props.product.price);
      return oldPrice && price ? Math.round((oldPrice - price) / oldPrice * 100) : 0;
    });
    const isFullscreenOpen = ref(false);
    const currentFsIndex = ref(0);
    ref({});
    const fsThumbnailsRef = ref(null);
    const isZoomed = ref(false);
    const zoomOriginX = ref(50);
    const zoomOriginY = ref(50);
    const openFullscreen = (index) => {
      currentFsIndex.value = index;
      isZoomed.value = false;
      isFullscreenOpen.value = true;
      (void 0).body.style.overflow = "hidden";
    };
    ref(0);
    watch(currentFsIndex, async () => {
      await nextTick();
      const container = fsThumbnailsRef.value;
      if (!container) return;
      const thumb = container.children[currentFsIndex.value];
      thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "w-full",
        role: "region",
        "aria-label": "Galéria produktu"
      }, _attrs))} data-v-93bb8a59><div class="lg:hidden relative w-full flex flex-col bg-white border-b border-gray-100 pb-3" data-v-93bb8a59><div class="relative w-full aspect-[4/5] sm:aspect-square bg-[#f7f9fa] flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar [touch-action:pan-x_pan-y] rounded-default" data-v-93bb8a59><!--[-->`);
      ssrRenderList(allMedia.value, (img, idx) => {
        _push(`<div class="flex-shrink-0 w-full h-full snap-center relative" data-v-93bb8a59>`);
        if (!imageLoaded.value[idx]) {
          _push(`<div class="absolute inset-0 bg-gray-100 animate-pulse" data-v-93bb8a59></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="absolute inset-0 p-1 md:p-2 flex items-center justify-center" data-v-93bb8a59>`);
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: img,
          width: "800",
          height: "1000",
          sizes: "100vw",
          class: "w-full h-full object-contain mix-blend-multiply cursor-custom-zoom",
          format: "webp",
          loading: idx === 0 ? "eager" : "lazy",
          fetchpriority: idx === 0 ? "high" : "auto",
          referrerpolicy: "no-referrer",
          onLoad: ($event) => onImageLoad(idx)
        }, null, _parent));
        _push(`</div></div>`);
      });
      _push(`<!--]-->`);
      if (allMedia.value.length > 1) {
        _push(`<div class="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-10" aria-hidden="true" data-v-93bb8a59><!--[-->`);
        ssrRenderList(allMedia.value, (_, idx) => {
          _push(`<span class="${ssrRenderClass([currentSlide.value === idx ? "w-5 bg-brand" : "w-1.5 bg-gray-300", "h-[3px] transition-all duration-200"])}" data-v-93bb8a59></span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (allMedia.value.length > 1) {
        _push(`<div class="flex gap-2 overflow-x-auto hide-scrollbar px-4 pt-3 pb-1 mt-1 scroll-smooth snap-x" data-v-93bb8a59><!--[-->`);
        ssrRenderList(allMedia.value, (img, idx) => {
          _push(`<button class="${ssrRenderClass([currentSlide.value === idx ? "border-brand shadow-sm" : "border-gray-200 opacity-60 hover:opacity-100", "flex-shrink-0 snap-center w-16 h-16 bg-[#f7f9fa] border transition-all duration-200 flex items-center justify-center p-2 focus:outline-none rounded-default"])}"${ssrRenderAttr("aria-label", `Zobraziť obrázok ${idx + 1}`)} data-v-93bb8a59>`);
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: img,
            width: "128",
            height: "128",
            sizes: "64px",
            class: ["w-full h-full mix-blend-multiply", idx === 0 ? "object-contain" : "object-cover"],
            format: "webp",
            loading: "lazy",
            referrerpolicy: "no-referrer"
          }, null, _parent));
          _push(`</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.imageBadges.length) {
        _push(`<div class="absolute top-3 left-3 flex flex-row flex-wrap gap-1 z-20 pointer-events-none max-w-[calc(100%-1.5rem)]" data-v-93bb8a59><!--[-->`);
        ssrRenderList(__props.imageBadges, (badge) => {
          _push(`<span class="${ssrRenderClass(["font-bold uppercase tracking-wider leading-none font-tech shadow-sm", unref(badgeSizeClass)(badge.size)])}" style="${ssrRenderStyle({ backgroundColor: badge.bgColor, color: badge.textColor })}" data-v-93bb8a59>${ssrInterpolate(badge.text)}</span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="hidden lg:block" data-v-93bb8a59><div class="relative w-full bg-[#f7f9fa] overflow-hidden group aspect-square rounded-default [@media(min-width:1200px)_and_(max-width:1536px)]:aspect-[4/3]" data-v-93bb8a59>`);
      if (!imageLoaded.value[0] && firstImage.value) {
        _push(`<div class="absolute inset-0 bg-gray-200 animate-pulse" aria-hidden="true" data-v-93bb8a59></div>`);
      } else {
        _push(`<!---->`);
      }
      if (firstImage.value) {
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: firstImage.value,
          alt: `${__props.product.name} — hlavný pohľad`,
          width: "1000",
          height: "1000",
          sizes: "(min-width: 1024px) 50vw, 100vw",
          class: "absolute inset-0 w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105 cursor-custom-zoom",
          format: "webp",
          loading: "eager",
          fetchpriority: "high",
          referrerpolicy: "no-referrer",
          onLoad: ($event) => onImageLoad(0),
          onClick: ($event) => openFullscreen(0)
        }, null, _parent));
      } else {
        _push(`<div class="w-full h-full flex items-center justify-center" data-v-93bb8a59><span class="text-6xl font-tech uppercase opacity-20" data-v-93bb8a59>${ssrInterpolate(__props.product.name)}</span></div>`);
      }
      if (__props.imageBadges.length) {
        _push(`<div class="absolute top-4 left-4 flex flex-row flex-wrap gap-1.5 z-20 pointer-events-none max-w-[calc(100%-2rem)]" data-v-93bb8a59><!--[-->`);
        ssrRenderList(__props.imageBadges, (badge) => {
          _push(`<span class="${ssrRenderClass(["font-bold uppercase tracking-wider leading-none font-tech shadow-sm", unref(badgeSizeClass)(badge.size)])}" style="${ssrRenderStyle({ backgroundColor: badge.bgColor, color: badge.textColor })}" data-v-93bb8a59>${ssrInterpolate(badge.text)}</span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/40 text-white px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" data-v-93bb8a59>`);
      _push(ssrRenderComponent(unref(ZoomIn), { class: "w-3.5 h-3.5" }, null, _parent));
      _push(`<span class="text-[10px] font-bold uppercase tracking-widest font-sans" data-v-93bb8a59>Zväčšiť</span></div></div>`);
      if (gridImages.value.length > 0) {
        _push(`<div class="relative" data-v-93bb8a59><div class="grid grid-cols-2 gap-[1px] mt-[1px]" data-v-93bb8a59><!--[-->`);
        ssrRenderList(displayedGridImages.value, (img, idx) => {
          _push(`<div class="relative aspect-square overflow-hidden group cursor-custom-zoom rounded-default" data-v-93bb8a59>`);
          if (!imageLoaded.value[idx + 1]) {
            _push(`<div class="absolute inset-0 bg-gray-100 animate-pulse" aria-hidden="true" data-v-93bb8a59></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: img,
            alt: `${__props.product.name} — pohľad ${idx + 2}`,
            width: "600",
            height: "600",
            sizes: "(min-width: 1024px) 25vw, 50vw",
            class: ["absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-150", { "opacity-0": !imageLoaded.value[idx + 1], "opacity-100 transition-opacity duration-500": imageLoaded.value[idx + 1] }],
            style: { "transform-origin": "var(--x, 50%) var(--y, 50%)" },
            format: "webp",
            loading: "lazy",
            referrerpolicy: "no-referrer",
            onLoad: ($event) => onImageLoad(idx + 1)
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]-->`);
        if (displayedGridImages.value.length % 2 !== 0) {
          _push(`<div class="aspect-square" aria-hidden="true" data-v-93bb8a59></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (hasHiddenImages.value) {
          _push(`<div id="gallery-toggle-area" class="absolute left-0 right-0 z-20 flex justify-center -bottom-8" data-v-93bb8a59><button class="bg-white text-black px-10 py-5 font-bold text-sm tracking-widest uppercase flex items-center justify-center transition-all hover:bg-black hover:text-white font-sans group border border-black rounded-default" data-v-93bb8a59>${ssrInterpolate(isExpanded.value ? "Zobraziť menej" : "Zobraziť viac")} `);
          _push(ssrRenderComponent(unref(ChevronDown), {
            class: ["w-4 h-4 ml-3 transition-transform duration-300", isExpanded.value ? "rotate-180" : "group-hover:translate-y-0.5"]
          }, null, _parent));
          _push(`</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (isFullscreenOpen.value) {
          _push2(`<div class="fixed inset-0 z-[200] bg-white flex flex-col" role="dialog" aria-modal="true" aria-label="Fullscreen galéria" data-v-93bb8a59><div class="flex items-center justify-between px-5 md:px-8 py-4 flex-shrink-0 border-b border-gray-100" data-v-93bb8a59><div class="flex items-center gap-3" data-v-93bb8a59><span class="font-tech font-bold text-black text-sm tracking-widest" data-v-93bb8a59>${ssrInterpolate(currentFsIndex.value + 1)}<span class="text-gray-300 mx-1" data-v-93bb8a59>/</span>${ssrInterpolate(allMedia.value.length)}</span><span class="hidden md:flex items-center gap-1.5 text-gray-400 text-[10px] font-sans uppercase tracking-widest" data-v-93bb8a59>`);
          _push2(ssrRenderComponent(unref(ZoomIn), { class: "w-3 h-3" }, null, _parent));
          _push2(` Kliknúť pre zoom </span></div><button class="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black transition-colors" aria-label="Zatvoriť galériu (Esc)" data-v-93bb8a59>`);
          _push2(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
          _push2(`</button></div><div class="flex-1 relative flex items-center justify-center overflow-hidden min-h-0" data-v-93bb8a59>`);
          if (allMedia.value.length > 1) {
            _push2(`<button class="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white border border-gray-200 hover:border-brand hover:bg-brand hover:text-white text-gray-700 shadow-sm transition-colors duration-200" aria-label="Predchádzajúci obrázok (←)" data-arrow="prev" data-v-93bb8a59>`);
            _push2(ssrRenderComponent(unref(ChevronLeft), { class: "w-5 h-5" }, null, _parent));
            _push2(`</button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="${ssrRenderClass([isZoomed.value ? "cursor-zoom-out" : "cursor-zoom-in", "w-full h-full flex items-center justify-center overflow-hidden px-14 md:px-16"])}" data-v-93bb8a59>`);
          _push2(ssrRenderComponent(_component_NuxtImg, {
            key: currentFsIndex.value,
            src: allMedia.value[currentFsIndex.value],
            alt: `${__props.product.name} — ${currentFsIndex.value + 1}`,
            width: "1200",
            height: "1200",
            sizes: "100vw",
            class: "max-w-full max-h-full object-contain select-none will-change-transform",
            style: isZoomed.value ? `transform: scale(2.2); transform-origin: ${zoomOriginX.value}% ${zoomOriginY.value}%; transition: transform-origin 0s` : "transform: scale(1); transition: transform 0.2s ease",
            format: "webp",
            loading: "eager",
            referrerpolicy: "no-referrer"
          }, null, _parent));
          _push2(`</div>`);
          if (allMedia.value.length > 1) {
            _push2(`<button class="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white border border-gray-200 hover:border-brand hover:bg-brand hover:text-white text-gray-700 shadow-sm transition-colors duration-200" aria-label="Nasledujúci obrázok (→)" data-v-93bb8a59>`);
            _push2(ssrRenderComponent(unref(ChevronRight), { class: "w-6 h-6" }, null, _parent));
            _push2(`</button>`);
          } else {
            _push2(`<!---->`);
          }
          if (allMedia.value.length > 1) {
            _push2(`<div class="md:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none" data-v-93bb8a59><!--[-->`);
            ssrRenderList(allMedia.value, (_, idx) => {
              _push2(`<div class="${ssrRenderClass([currentFsIndex.value === idx ? "w-5 bg-brand" : "w-1.5 bg-gray-300", "h-[3px] transition-all duration-200"])}" data-v-93bb8a59></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="border-t border-gray-100 flex-shrink-0" data-v-93bb8a59>`);
          if (allMedia.value.length > 1) {
            _push2(`<div class="flex gap-2 overflow-x-auto px-4 md:px-8 py-4 hide-scrollbar" data-v-93bb8a59><!--[-->`);
            ssrRenderList(allMedia.value, (img, idx) => {
              _push2(`<button class="${ssrRenderClass([currentFsIndex.value === idx ? "border-2 border-brand opacity-100" : "border border-gray-200 opacity-50 hover:opacity-90 hover:border-gray-400", "flex-shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden transition-all duration-200 bg-gray-50"])}"${ssrRenderAttr("aria-label", `Zobraziť obrázok ${idx + 1}`)}${ssrRenderAttr("aria-current", currentFsIndex.value === idx ? "true" : void 0)} data-v-93bb8a59>`);
              _push2(ssrRenderComponent(_component_NuxtImg, {
                src: img,
                width: "160",
                height: "160",
                sizes: "80px",
                class: "w-full h-full object-contain mix-blend-multiply p-1",
                format: "webp",
                loading: "lazy",
                referrerpolicy: "no-referrer"
              }, null, _parent));
              _push2(`</button>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ProductGallery.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductGallery = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-93bb8a59"]]), { __name: "ProductGallery" });

export { ProductGallery as default };
