import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, withAsyncContext, computed, unref, mergeProps, withCtx, createTextVNode, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { ArrowRight, BookOpen } from 'lucide-vue-next';
import { p as proxyMediaUrl } from './media-BNPyNy3v.mjs';
import { h as useAsyncData } from './server.mjs';
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
import './composables-x8_ENpEe.mjs';
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
  __name: "HomeBlogSection",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: posts, pending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "home-blog-posts",
      () => $fetch("/api/blog/listing", { query: { limit: 3 } }).catch(() => [])
    )), __temp = await __temp, __restore(), __temp);
    const gridPosts = computed(() => (posts.value ?? []).slice(0, 3));
    const formatDate = (d) => d ? new Date(d).toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" }) : "";
    const { target, isVisible } = useScrollReveal();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_2;
      if (unref(pending) || unref(posts) && unref(posts).length) {
        _push(`<section${ssrRenderAttrs(mergeProps({
          ref_key: "target",
          ref: target,
          class: "py-24 bg-gray-50 border-t border-gray-100"
        }, _attrs))}><div class="container mx-auto px-4 lg:px-8"><div class="${ssrRenderClass([unref(isVisible) ? "reveal-visible" : "reveal", "reveal-base flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10"])}"><span class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase font-tech tracking-tight leading-[0.95]"> SLICKLY <span class="text-brand">Blog</span></span>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/blog",
          class: "hidden lg:inline-flex btn-cta-motion"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Pozrieť všetky články `);
              _push2(ssrRenderComponent(unref(ArrowRight), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Pozrieť všetky články "),
                createVNode(unref(ArrowRight), { class: "w-5 h-5" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (unref(pending)) {
          _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
          ssrRenderList(3, (i) => {
            _push(`<div class="space-y-3"><div class="aspect-[4/3] bg-gray-200 animate-pulse rounded-default"></div><div class="h-3 bg-gray-200 animate-pulse w-1/3"></div><div class="h-4 bg-gray-200 animate-pulse w-full"></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
          ssrRenderList(unref(gridPosts), (post) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: post.id,
              to: `/blog/${post.slug}`,
              class: "group card-surface overflow-hidden flex flex-col"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="relative aspect-[4/3] bg-gray-900 overflow-hidden"${_scopeId}>`);
                  if (post.coverUrl) {
                    _push2(ssrRenderComponent(_component_NuxtImg, {
                      src: unref(proxyMediaUrl)(post.coverUrl),
                      alt: post.title,
                      class: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
                      format: "webp",
                      loading: "lazy",
                      sizes: "sm:100vw lg:33vw"
                    }, null, _parent2, _scopeId));
                  } else {
                    _push2(`<div class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"${_scopeId}>`);
                    _push2(ssrRenderComponent(unref(BookOpen), { class: "w-12 h-12 text-white/20" }, null, _parent2, _scopeId));
                    _push2(`</div>`);
                  }
                  _push2(`<div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"${_scopeId}></div>`);
                  if (post.category) {
                    _push2(`<div class="absolute top-4 left-4 bg-amber rounded-sm px-3 py-1"${_scopeId}><span class="block text-black text-[10px] font-bold uppercase tracking-widest font-tech"${_scopeId}>${ssrInterpolate(post.category)}</span></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<h3 class="absolute bottom-4 left-4 right-4 font-tech font-black uppercase text-xl md:text-2xl leading-[0.95] text-white drop-shadow-lg line-clamp-3"${_scopeId}>${ssrInterpolate(post.title)}</h3></div><div class="p-4 flex items-center justify-between gap-3"${_scopeId}><span class="text-[11px] text-gray-400 font-sans"${_scopeId}>${ssrInterpolate(formatDate(post.publishedAt))}</span><span class="text-[11px] text-black font-sans font-bold uppercase tracking-wider group-hover:text-brand transition-colors"${_scopeId}> Čítať viac → </span></div>`);
                } else {
                  return [
                    createVNode("div", { class: "relative aspect-[4/3] bg-gray-900 overflow-hidden" }, [
                      post.coverUrl ? (openBlock(), createBlock(_component_NuxtImg, {
                        key: 0,
                        src: unref(proxyMediaUrl)(post.coverUrl),
                        alt: post.title,
                        class: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
                        format: "webp",
                        loading: "lazy",
                        sizes: "sm:100vw lg:33vw"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
                      }, [
                        createVNode(unref(BookOpen), { class: "w-12 h-12 text-white/20" })
                      ])),
                      createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" }),
                      post.category ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "absolute top-4 left-4 bg-amber rounded-sm px-3 py-1"
                      }, [
                        createVNode("span", { class: "block text-black text-[10px] font-bold uppercase tracking-widest font-tech" }, toDisplayString(post.category), 1)
                      ])) : createCommentVNode("", true),
                      createVNode("h3", { class: "absolute bottom-4 left-4 right-4 font-tech font-black uppercase text-xl md:text-2xl leading-[0.95] text-white drop-shadow-lg line-clamp-3" }, toDisplayString(post.title), 1)
                    ]),
                    createVNode("div", { class: "p-4 flex items-center justify-between gap-3" }, [
                      createVNode("span", { class: "text-[11px] text-gray-400 font-sans" }, toDisplayString(formatDate(post.publishedAt)), 1),
                      createVNode("span", { class: "text-[11px] text-black font-sans font-bold uppercase tracking-wider group-hover:text-brand transition-colors" }, " Čítať viac → ")
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        }
        _push(`<div class="flex justify-center mt-10 lg:hidden">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/blog",
          class: "btn-cta-motion"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Pozrieť všetky články `);
              _push2(ssrRenderComponent(unref(ArrowRight), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Pozrieť všetky články "),
                createVNode(unref(ArrowRight), { class: "w-5 h-5" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomeBlogSection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const HomeBlogSection = Object.assign(_sfc_main, { __name: "HomeBlogSection" });

export { HomeBlogSection as default };
