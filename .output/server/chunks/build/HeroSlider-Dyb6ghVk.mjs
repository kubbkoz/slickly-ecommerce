import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { ArrowRight, Plus, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { H as HERO_SLIDES } from './constants-Dm0Yhftm.mjs';
import { _ as _export_sfc, u as useHead } from './server.mjs';
import { u as useImage } from './composables-x8_ENpEe.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "HeroSlider",
  __ssrInlineRender: true,
  props: {
    slides: { default: () => HERO_SLIDES }
  },
  setup(__props) {
    const props = __props;
    const translatedSlides = computed(() => {
      if (!props.slides || props.slides.length === 0) {
        return HERO_SLIDES;
      }
      return props.slides;
    });
    computed(() => "Viac info");
    const currentSlide = ref(0);
    const activeHotspot = ref(null);
    ref(null);
    const slide = computed(() => translatedSlides.value[currentSlide.value]);
    const $img = useImage();
    const optimizeHero = (src) => {
      if (!src || src.startsWith("data:") || src.startsWith("/")) return src || "";
      try {
        return $img(src, { width: 1920, format: "avif", quality: 72 });
      } catch {
        return src;
      }
    };
    const encodeImg = (img) => {
      if (!img || img.startsWith("data:")) return "";
      return img.replace(/ /g, "%20").replace(/'/g, "%27");
    };
    const heroBg = computed(() => encodeImg(optimizeHero(slide.value?.image)));
    useHead(computed(() => {
      const first = (translatedSlides.value || [])[0];
      const href = encodeImg(optimizeHero(first?.image));
      if (!href) return {};
      return {
        link: [{
          rel: "preload",
          as: "image",
          href,
          fetchpriority: "high"
        }]
      };
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative w-full overflow-hidden bg-black text-white hero-slider",
        style: { "height": "calc(100svh - var(--navbar-height-unscrolled, 169px))" }
      }, _attrs))} data-v-d65b26f4><div class="absolute inset-0" data-v-d65b26f4><div class="absolute inset-0 overflow-hidden" data-v-d65b26f4><div class="absolute inset-0 w-full h-full bg-center bg-cover" style="${ssrRenderStyle(unref(heroBg) ? { backgroundImage: `url('${unref(heroBg)}')` } : {})}" role="img"${ssrRenderAttr("aria-label", unref(slide)?.title || "Hero Image")} data-v-d65b26f4></div><div class="absolute inset-0 bg-black/40 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" data-v-d65b26f4></div></div></div><div class="relative container mx-auto px-4 lg:px-8 h-full flex flex-col justify-center z-20" data-v-d65b26f4><div class="max-w-3xl pl-4 md:pl-0 border-l-4 border-brand md:border-0 relative" data-v-d65b26f4>`);
      if (unref(slide)?.badge) {
        _push(`<div class="inline-block bg-amber rounded-sm px-3 py-1 md:px-4 md:py-1.5 mb-3 md:mb-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-black font-tech" data-v-d65b26f4>${ssrInterpolate(unref(slide).badge)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<h1 class="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-3 md:mb-5 leading-[0.9] uppercase italic font-tech tracking-wide break-words" data-v-d65b26f4>${ssrInterpolate(unref(slide)?.title)}</h1><p class="text-base sm:text-lg md:text-xl text-gray-200 mb-6 md:mb-8 max-w-lg font-normal leading-relaxed font-sans line-clamp-3 md:line-clamp-none" data-v-d65b26f4>${ssrInterpolate(unref(slide)?.subtitle)}</p><div class="flex flex-col sm:flex-row gap-3" data-v-d65b26f4>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(slide)?.ctaLink || "#",
        class: "group inline-flex items-center justify-center gap-3 bg-amber hover:bg-amber-dark text-black font-tech font-bold uppercase tracking-widest text-sm px-8 py-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.5)] active:scale-[0.98] active:translate-y-0 w-full sm:w-auto rounded-default gpu-boost"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(slide)?.cta)} `);
            _push2(ssrRenderComponent(unref(ArrowRight), { class: "w-5 h-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(toDisplayString(unref(slide)?.cta) + " ", 1),
              createVNode(unref(ArrowRight), { class: "w-5 h-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(slide)?.secondaryCta) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(slide)?.secondaryCtaLink || "#",
          class: "inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-tech font-bold uppercase tracking-widest text-sm px-8 py-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 w-full sm:w-auto rounded-default gpu-boost"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(slide)?.secondaryCta)}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(slide)?.secondaryCta), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      if (unref(slide) && unref(slide).hotspots && unref(slide).hotspots.length > 0) {
        _push(`<div class="absolute inset-0 z-20 pointer-events-none hidden lg:block" data-v-d65b26f4><!--[-->`);
        ssrRenderList(unref(slide).hotspots, (spot) => {
          _push(`<div class="absolute pointer-events-auto" style="${ssrRenderStyle({ top: `${spot.y}%`, left: `${spot.x}%` })}" data-v-d65b26f4><button class="${ssrRenderClass([unref(activeHotspot) === spot.id ? "bg-brand scale-110" : "bg-white/20 backdrop-blur-sm hover:bg-brand/80", "relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-auto"])}"${ssrRenderAttr("aria-label", `Zobraziť detail produktu ${spot.label || ""}`.trim())}${ssrRenderAttr("aria-expanded", unref(activeHotspot) === spot.id)} data-v-d65b26f4><div class="absolute inset-0 rounded-full border-2 border-white animate-pulse-slow" data-v-d65b26f4></div>`);
          _push(ssrRenderComponent(unref(Plus), {
            class: "w-4 h-4 text-white",
            "aria-hidden": "true"
          }, null, _parent));
          _push(`</button><div class="${ssrRenderClass([unref(activeHotspot) === spot.id ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible", "absolute left-full ml-4 top-1/2 -translate-y-1/2 w-96 bg-black/90 backdrop-blur-md p-4 shadow-2xl border-l-4 border-brand transition-all duration-300 origin-left pointer-events-auto flex gap-4"])}" style="${ssrRenderStyle({ "z-index": "100" })}" data-v-d65b26f4>`);
          if (spot.image) {
            _push(`<div class="w-24 h-24 flex-shrink-0 bg-white p-1 rounded-sm" data-v-d65b26f4><img${ssrRenderAttr("src", spot.image)}${ssrRenderAttr("alt", spot.label)} width="96" height="96" loading="lazy" class="w-full h-full object-contain" referrerpolicy="no-referrer" data-v-d65b26f4></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex-1 min-w-0 flex flex-col justify-center" data-v-d65b26f4><h3 class="text-white font-bold text-lg mb-1 font-tech uppercase leading-tight line-clamp-2" data-v-d65b26f4>${ssrInterpolate(spot.label)}</h3><div class="flex items-center justify-between border-t border-gray-700 pt-2 mt-auto" data-v-d65b26f4><span class="text-white font-black text-lg font-tech underline decoration-brand decoration-2 underline-offset-4" data-v-d65b26f4>${ssrInterpolate(spot.price)}</span>`);
          if (spot.link) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: spot.link,
              class: "text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1 text-white uppercase tracking-wider transition-colors font-sans rounded"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Viac info `);
                } else {
                  return [
                    createTextVNode(" Viac info ")
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="absolute bottom-10 right-10 flex gap-2 z-30" data-v-d65b26f4><button class="w-14 h-14 border border-white/30 hover:bg-brand hover:border-brand hover:scale-105 flex items-center justify-center transition-all duration-300 text-white bg-black/50 backdrop-blur-sm rounded-default cursor-pointer gpu-boost" aria-label="Predchádzajúca snímka" data-v-d65b26f4>`);
      _push(ssrRenderComponent(unref(ChevronLeft), {
        class: "w-8 h-8 pointer-events-none",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</button><button class="w-14 h-14 border border-white/30 hover:bg-brand hover:border-brand hover:scale-105 flex items-center justify-center transition-all duration-300 text-white bg-black/50 backdrop-blur-sm rounded-default cursor-pointer gpu-boost" aria-label="Nasledujúca snímka" data-v-d65b26f4>`);
      _push(ssrRenderComponent(unref(ChevronRight), {
        class: "w-8 h-8 pointer-events-none",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</button></div><div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-30" data-v-d65b26f4><!--[-->`);
      ssrRenderList(unref(translatedSlides), (_, idx) => {
        _push(`<button class="${ssrRenderClass([unref(currentSlide) === idx ? "w-16 bg-brand" : "w-8 bg-white/40 hover:bg-white", "h-1.5 transition-all duration-300 rounded-sm cursor-pointer"])}"${ssrRenderAttr("aria-label", `Prejsť na snímku ${idx + 1}`)}${ssrRenderAttr("aria-current", unref(currentSlide) === idx ? "true" : "false")} data-v-d65b26f4></button>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HeroSlider.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const HeroSlider = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-d65b26f4"]]), { __name: "HeroSlider" });

export { HeroSlider as default };
