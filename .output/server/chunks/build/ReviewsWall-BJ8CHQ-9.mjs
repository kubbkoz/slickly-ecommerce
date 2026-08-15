import { defineComponent, computed, ref, watchEffect, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { ExternalLink, ArrowRight } from 'lucide-vue-next';
import RatingStars from './RatingStars-CZsf46JE.mjs';
import { h as useAsyncData, u as useHead } from './server.mjs';
import { u as useScrollReveal } from './useScrollReveal-hir-7v74.mjs';
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

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJ1f4ccNbJFUcRUbCbvaArmfw";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ReviewsWall",
  __ssrInlineRender: true,
  setup(__props) {
    const { data, pending } = useAsyncData(
      "google-reviews",
      () => $fetch("/api/google/reviews").catch(() => ({ rating: 0, totalReviews: 0, reviews: [] })),
      { getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key] }
    );
    const reviews = computed(() => data.value?.reviews ?? []);
    const rating = computed(() => data.value?.rating ?? 0);
    const total = computed(() => data.value?.totalReviews ?? 0);
    const hasReviews = computed(() => reviews.value.length > 0);
    const photoErrors = ref({});
    const showPhoto = (idx, photo) => !!photo && !photoErrors.value[idx];
    watchEffect(() => {
      if (!rating.value) return;
      useHead({
        script: [{
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "SLICKLY",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: rating.value,
              reviewCount: total.value,
              bestRating: 5,
              worstRating: 1
            }
          })
        }]
      });
    });
    const { target, isVisible } = useScrollReveal();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref_key: "target",
        ref: target,
        class: "py-24 bg-gray-50 border-t border-gray-100 min-h-[300px]"
      }, _attrs))}><div class="container mx-auto px-4 lg:px-8"><div class="${ssrRenderClass([unref(isVisible) ? "reveal-visible" : "reveal", "reveal-base flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6"])}"><div><h2 class="section-h2 mb-4"> Čo hovoria <span class="text-brand">zákazníci</span></h2><div class="section-decorator mb-6"></div></div>`);
      if (unref(hasReviews)) {
        _push(`<a${ssrRenderAttr("href", MAPS_URL)} target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 group flex-shrink-0 self-end lg:self-auto" aria-label="Pozrieť všetky recenzie na Google">`);
        _push(ssrRenderComponent(RatingStars, {
          rating: unref(rating),
          "size-class": "w-5 h-5"
        }, null, _parent));
        _push(`<div class="text-right"><span class="block font-tech font-black text-3xl md:text-4xl text-black leading-none">${ssrInterpolate(unref(rating).toFixed(1))}</span><span class="block text-[10px] uppercase tracking-widest text-gray-400 font-sans whitespace-nowrap">${ssrInterpolate(unref(total))} recenzií · Google </span></div>`);
        _push(ssrRenderComponent(unref(ExternalLink), {
          class: "w-4 h-4 text-gray-300 group-hover:text-brand transition-colors",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</a>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(pending)) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<div class="card-surface p-6 flex flex-col gap-4"><div class="flex gap-1"><!--[-->`);
          ssrRenderList(5, (s) => {
            _push(`<div class="w-4 h-4 bg-gray-200 animate-pulse rounded-full"></div>`);
          });
          _push(`<!--]--></div><div class="space-y-2 flex-1"><div class="h-3 bg-gray-100 animate-pulse w-full"></div><div class="h-3 bg-gray-100 animate-pulse w-5/6"></div><div class="h-3 bg-gray-100 animate-pulse w-4/6"></div></div><div class="flex items-center gap-3 pt-4 border-t border-gray-50"><div class="w-9 h-9 rounded-full bg-gray-200 animate-pulse flex-shrink-0"></div><div class="space-y-1 flex-1"><div class="h-3 bg-gray-200 animate-pulse w-24"></div><div class="h-2 bg-gray-100 animate-pulse w-16"></div></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(hasReviews)) {
        _push(`<div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"><!--[-->`);
        ssrRenderList(unref(reviews), (review, idx) => {
          _push(`<article class="card-surface p-6 flex flex-col gap-4 relative">`);
          _push(ssrRenderComponent(RatingStars, {
            rating: review.rating,
            "size-class": "w-4 h-4"
          }, null, _parent));
          _push(`<p class="font-sans text-sm text-gray-600 leading-relaxed line-clamp-5 flex-1">${ssrInterpolate(review.text)}</p><div class="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">`);
          if (showPhoto(idx, review.photo)) {
            _push(`<img${ssrRenderAttr("src", review.photo)}${ssrRenderAttr("alt", review.author)} class="w-9 h-9 rounded-full object-cover flex-shrink-0" loading="lazy" width="36" height="36" referrerpolicy="no-referrer" crossorigin="anonymous">`);
          } else {
            _push(`<div class="w-9 h-9 rounded-full bg-brand flex items-center justify-center flex-shrink-0" aria-hidden="true"><span class="text-white text-sm font-tech font-bold">${ssrInterpolate(review.author.charAt(0).toUpperCase())}</span></div>`);
          }
          _push(`<div class="min-w-0 flex-1"><span class="block font-tech font-bold uppercase text-xs text-black tracking-wide truncate">${ssrInterpolate(review.author)}</span><span class="block text-[10px] text-gray-400 uppercase tracking-wider font-sans">${ssrInterpolate(review.date)}</span></div></div></article>`);
        });
        _push(`<!--]--></div><div class="flex justify-end mt-8"><a${ssrRenderAttr("href", MAPS_URL)} target="_blank" rel="noopener noreferrer" class="btn-cta-motion"> Pozrieť recenzie na Google `);
        _push(ssrRenderComponent(unref(ArrowRight), { class: "w-5 h-5" }, null, _parent));
        _push(`</a></div></div>`);
      } else {
        _push(`<div class="flex justify-end py-8"><a${ssrRenderAttr("href", MAPS_URL)} target="_blank" rel="noopener noreferrer" class="btn-cta-motion"> Pozrieť recenzie na Google `);
        _push(ssrRenderComponent(unref(ArrowRight), { class: "w-5 h-5" }, null, _parent));
        _push(`</a></div>`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/ReviewsWall.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ReviewsWall = Object.assign(_sfc_main, { __name: "ReviewsWall" });

export { ReviewsWall as default };
