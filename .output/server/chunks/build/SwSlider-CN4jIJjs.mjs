import __nuxt_component_0$1 from './ChevronIcon-Aj1t6zS4.mjs';
import { defineComponent, useSlots, computed, useTemplateRef, ref, watch, mergeProps, unref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrRenderVNode, ssrRenderComponent } from 'vue/server-renderer';
import { a as useElementSize } from './index-B6MI764M.mjs';
import { u as useCmsElementConfig } from './useCmsElementConfig-DY8wkVjg.mjs';
import './NuxtImg-BPLMxRzm.mjs';
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
import './server.mjs';
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

const setInterval = () => {
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwSlider",
  __ssrInlineRender: true,
  props: {
    config: {},
    slidesToShow: { default: 1 },
    slidesToScroll: { default: 1 },
    gap: { default: "0px" },
    autoplay: { type: Boolean, default: false },
    autoplaySpeed: { default: 3e3 }
  },
  emits: ["changeSlide"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const { getConfigValue } = useCmsElementConfig({
      config: __props.config
    });
    const slots = useSlots();
    function getSlotChildren() {
      return slots?.default?.()[0]?.children ?? [];
    }
    const childrenRaw = computed(() => getSlotChildren());
    const slidesToScroll = computed(
      () => __props.slidesToScroll >= __props.slidesToShow ? __props.slidesToShow : __props.slidesToScroll
    );
    const slidesToShow = computed(
      () => __props.slidesToShow >= childrenRaw.value.length ? childrenRaw.value.length : __props.slidesToShow
    );
    const children = computed(() => {
      const count = childrenRaw.value.length;
      if (count === 0) return [];
      const n = slidesToShow.value;
      return [
        ...getSlotChildren().slice(-n),
        // prepend: last N slides
        ...getSlotChildren(),
        // main slides
        ...getSlotChildren().slice(0, n)
        // append: first N slides
      ];
    });
    const emit = __emit;
    const slider = useTemplateRef("slider");
    const imageSlider = useTemplateRef("imageSlider");
    const imageSliderTrackStyle = ref();
    const activeSlideIndex = ref(0);
    const speed = ref(300);
    const imageSliderTrack = useTemplateRef("imageSliderTrack");
    const autoPlayInterval = ref();
    const isReady = ref();
    const isSliding = ref();
    const { width: imageSliderWidth } = useElementSize(imageSlider);
    ref(0);
    ref(0);
    watch(
      () => __props.autoplay && isReady.value,
      (value) => {
        if (value) {
          autoPlayInterval.value = setInterval(() => {
            next();
          }, __props.autoplaySpeed);
        } else {
          if (autoPlayInterval.value) {
            clearInterval(autoPlayInterval.value);
          }
        }
      },
      {
        immediate: true
      }
    );
    const imageSliderStyle = computed(() => {
      if (getConfigValue("displayMode") === "cover") {
        return {
          minHeight: getConfigValue("minHeight"),
          margin: `0 -${__props.gap}`
        };
      }
      return {
        minHeight: getConfigValue("minHeight")
      };
    });
    const verticalAlignValue = computed(
      () => getConfigValue("verticalAlign") || "flex-start"
    );
    const displayModeValue = computed(
      () => getConfigValue("displayMode") || "standard"
    );
    const navigationArrowsValue = computed(
      () => getConfigValue("navigationArrows") || "none"
    );
    const navigationDotsValue = computed(
      () => getConfigValue("navigationDots") || "none"
    );
    function buildImageSliderTrackStyle(transformIndex, moving = false, callback = () => {
    }) {
      let styleObj = {
        transform: `translate3d(-${(transformIndex + slidesToShow.value) * (imageSliderWidth.value / slidesToShow.value)}px, 0px, 0px)`,
        width: `${children.value.length * imageSliderWidth.value}px`
      };
      if (imageSliderTrackStyle.value?.height) {
        styleObj.height = imageSliderTrackStyle.value?.height;
      }
      if (moving) {
        styleObj = {
          ...styleObj,
          transition: `transform ${speed.value}ms ease 0s`
        };
        imageSliderTrackStyle.value = { ...styleObj };
        isSliding.value = true;
        setTimeout(() => {
          const { transition: _, ...styleWithoutTransition } = styleObj;
          imageSliderTrackStyle.value = { ...styleWithoutTransition };
          isSliding.value = false;
          callback();
        }, speed.value);
      } else {
        imageSliderTrackStyle.value = { ...styleObj };
      }
      setTimeout(() => {
        let height = "unset";
        if (displayModeValue.value === "cover") {
          height = "100%";
        } else if (displayModeValue.value === "standard") {
          const childComponent = imageSliderTrack.value?.children[transformIndex + 1];
          height = childComponent?.children[0]?.children[0]?.clientHeight ? `${childComponent.clientHeight}px` : "auto";
        }
        styleObj = {
          ...styleObj,
          height
        };
        imageSliderTrackStyle.value = { ...styleObj };
      });
    }
    function next() {
      if (isSliding.value) return;
      activeSlideIndex.value = activeSlideIndex.value + slidesToScroll.value;
      buildImageSliderTrackStyle(activeSlideIndex.value, true, () => {
        if (activeSlideIndex.value === children.value.length - slidesToShow.value * 2) {
          activeSlideIndex.value = 0;
          buildImageSliderTrackStyle(activeSlideIndex.value);
        }
        emit("changeSlide", activeSlideIndex.value);
      });
    }
    function previous() {
      if (isSliding.value) return;
      activeSlideIndex.value = activeSlideIndex.value - slidesToScroll.value;
      buildImageSliderTrackStyle(activeSlideIndex.value, true, () => {
        if (activeSlideIndex.value <= 0 - slidesToShow.value) {
          activeSlideIndex.value = children.value.length - slidesToShow.value * 3;
          buildImageSliderTrackStyle(activeSlideIndex.value);
        }
        emit("changeSlide", activeSlideIndex.value);
      });
    }
    function goToSlide(index) {
      if (isSliding.value) return;
      if (activeSlideIndex.value === index) return;
      activeSlideIndex.value = index;
      buildImageSliderTrackStyle(activeSlideIndex.value, true);
      emit("changeSlide", activeSlideIndex.value);
    }
    __expose({
      next,
      previous,
      goToSlide
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwChevronIcon = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "slider",
        ref: slider,
        class: {
          "relative overflow-hidden h-full": true,
          "px-10": navigationArrowsValue.value === "outside",
          "pb-15": navigationDotsValue.value === "outside",
          "opacity-0": !isReady.value
        }
      }, _attrs))}><div class="overflow-hidden h-full" style="${ssrRenderStyle(imageSliderStyle.value)}"><div class="${ssrRenderClass({
        flex: true,
        "items-center": displayModeValue.value === "contain" && verticalAlignValue.value === "center",
        "items-start": displayModeValue.value === "contain" && verticalAlignValue.value === "flex-start",
        "items-end": displayModeValue.value === "contain" && verticalAlignValue.value === "flex-end"
      })}" style="${ssrRenderStyle(imageSliderTrackStyle.value)}"><!--[-->`);
      ssrRenderList(children.value, (child, index) => {
        _push(`<div${ssrRenderAttr("index", index - slidesToShow.value)} style="${ssrRenderStyle({
          width: unref(imageSliderWidth) ? `${unref(imageSliderWidth) / slidesToShow.value}px` : "auto",
          padding: `0 ${__props.gap}`,
          height: displayModeValue.value === "standard" ? "min-content" : "100%"
        })}">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(child), null, null), _parent);
        _push(`</div>`);
      });
      _push(`<!--]--></div></div><div class="${ssrRenderClass({ hidden: navigationArrowsValue.value === "none" })}"><button aria-label="Previous slide" class="${ssrRenderClass({
        "absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center": true,
        "bg-brand-tertiary text-surface-on-surface": navigationArrowsValue.value === "outside",
        "transition bg-white/20 hover:bg-white/50": navigationArrowsValue.value === "inside"
      })}">`);
      _push(ssrRenderComponent(_component_SwChevronIcon, { direction: "left" }, null, _parent));
      _push(`</button><button aria-label="Next slide" class="${ssrRenderClass({
        "absolute top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center": true,
        "bg-brand-tertiary text-surface-on-surface": navigationArrowsValue.value === "outside",
        "transition bg-white/20 hover:bg-white/50": navigationArrowsValue.value === "inside"
      })}">`);
      _push(ssrRenderComponent(_component_SwChevronIcon, { direction: "right" }, null, _parent));
      _push(`</button></div><div class="${ssrRenderClass({
        "absolute bottom-5 left-1/2 transform -translate-x-1/2 gap-2 items-center": true,
        flex: navigationDotsValue.value !== "none",
        hidden: navigationDotsValue.value === "none"
      })}"><!--[-->`);
      ssrRenderList(childrenRaw.value, (_, i) => {
        _push(`<div class="${ssrRenderClass({
          "rounded-full cursor-pointer transition-all duration-300": true,
          "w-6 h-2 bg-surface-on-surface-variant": i === activeSlideIndex.value,
          "w-2 h-2 bg-surface-surface-container-highest": i !== activeSlideIndex.value
        })}"></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwSlider.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "SwSlider" });

export { __nuxt_component_0 as default };
