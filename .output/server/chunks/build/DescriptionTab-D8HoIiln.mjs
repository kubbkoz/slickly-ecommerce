import { defineComponent, computed, mergeProps, unref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderVNode, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { Coins, Building2, Mountain, Zap, Settings, Play } from 'lucide-vue-next';
import { s as sanitizeHtml } from './sanitize-DKvwg8Vq.mjs';
import { p as proxyMediaUrl } from './media-BNPyNy3v.mjs';
import { _ as _export_sfc } from './server.mjs';
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
  __name: "DescriptionTab",
  __ssrInlineRender: true,
  props: {
    product: {},
    customFieldsMedia: {}
  },
  setup(__props) {
    const props = __props;
    const featureIcon = computed(() => {
      const iconId = Number(props.product.customFields?.mts_feat_ikona);
      if (!iconId || iconId === 0) return null;
      const iconMap = {
        1: Settings,
        2: Zap,
        3: Mountain,
        4: Building2,
        5: Coins
      };
      return iconMap[iconId] || null;
    });
    const getMediaUrlFromId = (id) => {
      if (!id) return "";
      if (props.customFieldsMedia?.[id]) return props.customFieldsMedia[id];
      const mediaObj = props.product.media?.find((m) => m.media?.id === id || m.mediaId === id);
      return mediaObj?.media?.url ? proxyMediaUrl(mediaObj.media.url) : "";
    };
    const getEmbedUrl = (url) => {
      if (!url) return "";
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match?.[2]?.length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url;
      }
      if (url.includes("vimeo.com")) {
        const regExp = /vimeo\.com\/([0-9]+)/;
        const match = url.match(regExp);
        return match ? `https://player.vimeo.com/video/${match[1]}` : url;
      }
      return url;
    };
    const hasGrids = computed(() => {
      const cf = props.product.customFields;
      return !!(cf?.mts_grid1_title || cf?.mts_grid2_title || cf?.mts_grid3_title || cf?.mts_grid4_title || cf?.mts_grid1_img || cf?.mts_grid2_img || cf?.mts_grid3_img || cf?.mts_grid4_img);
    });
    const grids = computed(() => {
      const cf = props.product.customFields || {};
      return [
        { title: cf.mts_grid1_title, desc: cf.mts_grid1_desc, img: getMediaUrlFromId(cf.mts_grid1_img) },
        { title: cf.mts_grid2_title, desc: cf.mts_grid2_desc, img: getMediaUrlFromId(cf.mts_grid2_img) },
        { title: cf.mts_grid3_title, desc: cf.mts_grid3_desc, img: getMediaUrlFromId(cf.mts_grid3_img) },
        { title: cf.mts_grid4_title, desc: cf.mts_grid4_desc, img: getMediaUrlFromId(cf.mts_grid4_img) }
      ].filter((g) => g.title || g.desc || g.img);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: "product-description-content",
        class: "animate-fade-in relative max-w-7xl mx-auto space-y-16 pb-20"
      }, _attrs))} data-v-4637165c>`);
      if (__props.product.description) {
        _push(`<section class="prose prose-lg max-w-none text-gray-700 font-sans px-4 md:px-0" data-v-4637165c><div data-v-4637165c>${unref(sanitizeHtml)(__props.product.description) ?? ""}</div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.product.customFields?.mts_feat_title || __props.product.customFields?.mts_feat_img) {
        _push(`<section class="bg-black text-white p-8 md:p-20 rounded-default overflow-hidden relative" data-v-4637165c>`);
        if (unref(featureIcon)) {
          _push(`<div class="absolute -top-10 -right-10 opacity-[0.10] text-white pointer-events-none z-0" data-v-4637165c>`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(featureIcon)), { class: "w-96 h-96" }, null), _parent);
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="max-w-4xl mx-auto flex flex-col gap-10 relative z-10" data-v-4637165c><div class="border-l-[6px] border-brand pl-6" data-v-4637165c>`);
        if (__props.product.customFields?.mts_feat_title) {
          _push(`<h2 class="text-2xl md:text-4xl font-bold font-tech uppercase tracking-tight leading-[1.1]" data-v-4637165c>${ssrInterpolate(__props.product.customFields.mts_feat_title)}</h2>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (__props.product.customFields?.mts_feat_img) {
          _push(`<div class="w-full overflow-hidden border border-white/10 shadow-2xl" data-v-4637165c><img${ssrRenderAttr("src", getMediaUrlFromId(__props.product.customFields.mts_feat_img))}${ssrRenderAttr("alt", __props.product.customFields.mts_feat_title || __props.product.name)} class="w-full h-auto object-contain transition-transform duration-1000 hover:scale-105" loading="lazy" data-v-4637165c></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="space-y-8" data-v-4637165c>`);
        if (__props.product.customFields?.mts_feat_desc) {
          _push(`<div class="prose prose-invert prose-lg max-w-none text-gray-300 font-sans leading-relaxed" data-v-4637165c>${unref(sanitizeHtml)(__props.product.customFields.mts_feat_desc) ?? ""}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.product.customFields?.mts_feat_url) {
          _push(`<a${ssrRenderAttr("href", __props.product.customFields.mts_feat_url)} class="group inline-flex items-center gap-3 text-brand font-tech uppercase font-bold tracking-widest text-lg hover:text-white transition-all duration-300" data-v-4637165c><span class="relative" data-v-4637165c> Klikni pre viac info <span class="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand group-hover:w-full transition-all duration-300" data-v-4637165c></span></span>`);
          _push(ssrRenderComponent(unref(Play), { class: "w-5 h-5 fill-brand group-hover:fill-white group-hover:translate-x-1 transition-all duration-300" }, null, _parent));
          _push(`</a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasGrids)) {
        _push(`<section class="px-4 md:px-0" data-v-4637165c><div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12" data-v-4637165c><!--[-->`);
        ssrRenderList(unref(grids), (grid, idx) => {
          _push(`<div class="group flex flex-col transition-all duration-300" data-v-4637165c>`);
          if (grid.title) {
            _push(`<h3 class="text-xl font-bold font-tech uppercase tracking-wide mb-4 flex items-center gap-3" data-v-4637165c><span class="w-1.5 h-6 bg-brand" data-v-4637165c></span> ${ssrInterpolate(grid.title)}</h3>`);
          } else {
            _push(`<!---->`);
          }
          if (grid.img) {
            _push(`<div class="mb-6 overflow-hidden rounded-default w-full aspect-video md:aspect-[16/9] bg-zinc-50 border border-gray-100" data-v-4637165c><img${ssrRenderAttr("src", grid.img)}${ssrRenderAttr("alt", grid.title || "")} class="w-full h-full object-cover" loading="lazy" data-v-4637165c></div>`);
          } else {
            _push(`<!---->`);
          }
          if (grid.desc) {
            _push(`<div class="prose prose-sm max-w-none text-gray-500 font-sans" data-v-4637165c>${unref(sanitizeHtml)(grid.desc) ?? ""}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.product.customFields?.mts_video_file || __props.product.customFields?.mts_video_url) {
        _push(`<section class="px-4 md:px-0" data-v-4637165c><h2 class="text-xl font-bold font-tech uppercase tracking-wide mb-6 flex items-center gap-3 text-black" data-v-4637165c><span class="w-1.5 h-6 bg-brand" data-v-4637165c></span> ${ssrInterpolate(__props.product.customFields.mts_video_title || "Video Showcase")}</h2><div class="relative overflow-hidden rounded-default border-0" data-v-4637165c><div class="aspect-video w-full rounded-default overflow-hidden shadow-2xl relative z-10 bg-zinc-900 border border-gray-100" data-v-4637165c>`);
        if (__props.product.customFields.mts_video_file) {
          _push(`<video controls class="w-full h-full object-cover" preload="metadata" data-v-4637165c><source${ssrRenderAttr("src", getMediaUrlFromId(__props.product.customFields.mts_video_file))} type="video/mp4" data-v-4637165c> Váš prehliadač nepodporuje video tag. </video>`);
        } else if (__props.product.customFields.mts_video_url) {
          _push(`<iframe${ssrRenderAttr("src", getEmbedUrl(__props.product.customFields.mts_video_url))} class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen data-v-4637165c></iframe>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.product.customFields?.mts_komp_title) {
        _push(`<section class="px-4 md:px-0" data-v-4637165c><h2 class="text-xl font-bold font-tech uppercase tracking-wide mb-6 flex items-center gap-3 text-black" data-v-4637165c><span class="w-1.5 h-6 bg-brand" data-v-4637165c></span> ${ssrInterpolate(__props.product.customFields.mts_komp_title)}</h2><div class="relative overflow-hidden rounded-default border-0" data-v-4637165c>`);
        if (__props.product.customFields?.mts_komp_editor) {
          _push(`<div class="prose prose-md max-w-none text-gray-700 font-sans columns-1 md:columns-2 gap-16 relative z-10" data-v-4637165c>${unref(sanitizeHtml)(__props.product.customFields.mts_komp_editor) ?? ""}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></section>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/tabs/DescriptionTab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DescriptionTab = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-4637165c"]]), { __name: "DescriptionTab" });

export { DescriptionTab as default };
