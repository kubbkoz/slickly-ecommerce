import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, computed, withAsyncContext, mergeProps, withCtx, unref, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { ArrowLeft, User, BookOpen, Calendar, ArrowRight } from 'lucide-vue-next';
import { p as proxyMediaUrl } from './media-BNPyNy3v.mjs';
import { d as useRoute, h as useAsyncData, C as useSeoMeta } from './server.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BlogCard",
  __ssrInlineRender: true,
  props: {
    post: {},
    featured: { type: Boolean },
    compact: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const blogPath = (slug) => `/blog/${slug}`;
    const formatDate = (d) => d ? new Date(d).toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" }) : "";
    const badgeText = computed(() => props.post.featuredBadgeText || "Featured");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_2;
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: ["group bg-white border border-gray-100 hover:border-gray-700 transition-colors duration-200 flex flex-col", __props.featured ? "lg:flex-row" : ""]
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: blogPath(__props.post.slug),
        class: ["block overflow-hidden relative bg-gray-100 flex-shrink-0", __props.featured ? "lg:w-3/5 aspect-[4/3]" : __props.compact ? "aspect-[16/7]" : "aspect-[16/9]"]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.post.coverUrl) {
              _push2(ssrRenderComponent(_component_NuxtImg, {
                src: unref(proxyMediaUrl)(__props.post.coverUrl),
                alt: __props.post.title,
                class: "w-full h-full object-cover",
                format: "webp",
                loading: __props.featured ? "eager" : "lazy",
                sizes: "sm:100vw md:50vw lg:40vw"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<div class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(BookOpen), {
                class: "w-10 h-10 text-white/20",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            }
            _push2(`<div class="absolute top-3 left-3 flex gap-1.5 flex-wrap"${_scopeId}>`);
            if (__props.featured || __props.post.featured) {
              _push2(`<div class="bg-brand px-3 py-1 transform -skew-x-12"${_scopeId}><span class="block transform skew-x-12 text-white text-[10px] font-bold uppercase tracking-widest font-tech leading-none"${_scopeId}>${ssrInterpolate(unref(badgeText))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.post.category) {
              _push2(`<div class="bg-black px-3 py-1 transform -skew-x-12"${_scopeId}><span class="block transform skew-x-12 text-white text-[10px] font-bold uppercase tracking-widest font-tech leading-none"${_scopeId}>${ssrInterpolate(__props.post.category)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              __props.post.coverUrl ? (openBlock(), createBlock(_component_NuxtImg, {
                key: 0,
                src: unref(proxyMediaUrl)(__props.post.coverUrl),
                alt: __props.post.title,
                class: "w-full h-full object-cover",
                format: "webp",
                loading: __props.featured ? "eager" : "lazy",
                sizes: "sm:100vw md:50vw lg:40vw"
              }, null, 8, ["src", "alt", "loading"])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
              }, [
                createVNode(unref(BookOpen), {
                  class: "w-10 h-10 text-white/20",
                  "aria-hidden": "true"
                })
              ])),
              createVNode("div", { class: "absolute top-3 left-3 flex gap-1.5 flex-wrap" }, [
                __props.featured || __props.post.featured ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-brand px-3 py-1 transform -skew-x-12"
                }, [
                  createVNode("span", { class: "block transform skew-x-12 text-white text-[10px] font-bold uppercase tracking-widest font-tech leading-none" }, toDisplayString(unref(badgeText)), 1)
                ])) : createCommentVNode("", true),
                __props.post.category ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "bg-black px-3 py-1 transform -skew-x-12"
                }, [
                  createVNode("span", { class: "block transform skew-x-12 text-white text-[10px] font-bold uppercase tracking-widest font-tech leading-none" }, toDisplayString(__props.post.category), 1)
                ])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="${ssrRenderClass([__props.featured ? "lg:p-8" : "", "p-5 flex flex-col flex-1"])}"><div class="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 font-sans gap-2">`);
      _push(ssrRenderComponent(unref(Calendar), {
        class: "w-3.5 h-3.5 text-brand",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(formatDate(__props.post.publishedAt))}</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: blogPath(__props.post.slug)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h2 class="${ssrRenderClass([__props.featured ? "text-2xl lg:text-3xl" : __props.compact ? "text-base" : "text-xl", "font-tech font-black uppercase italic leading-tight mb-3 group-hover:text-brand transition-colors line-clamp-2"])}"${_scopeId}>${ssrInterpolate(__props.post.title)}</h2>`);
          } else {
            return [
              createVNode("h2", {
                class: ["font-tech font-black uppercase italic leading-tight mb-3 group-hover:text-brand transition-colors line-clamp-2", __props.featured ? "text-2xl lg:text-3xl" : __props.compact ? "text-base" : "text-xl"]
              }, toDisplayString(__props.post.title), 3)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.post.teaser && !__props.compact) {
        _push(`<p class="text-sm text-gray-600 font-sans leading-relaxed line-clamp-3 mb-5 flex-1">${ssrInterpolate(__props.post.teaser)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: blogPath(__props.post.slug),
        class: "flex items-center text-brand font-bold text-xs uppercase tracking-widest group/link mt-auto"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.featured ? "Čítať článok" : "Čítať viac")} `);
            _push2(ssrRenderComponent(unref(ArrowRight), {
              class: "ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(toDisplayString(__props.featured ? "Čítať článok" : "Čítať viac") + " ", 1),
              createVNode(unref(ArrowRight), {
                class: "ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform",
                "aria-hidden": "true"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></article>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../features/blog/components/blog/BlogCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "BlogCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[author]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const author = computed(() => route.params.author);
    const { data: posts, pending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `blog-author-${author.value}`,
      () => $fetch(`/api/blog/author/${author.value}`),
      { watch: [author] }
    )), __temp = await __temp, __restore(), __temp);
    useSeoMeta({
      title: () => `Články od: ${author.value} — SLICKLY Blog`,
      description: () => `Všetky blogové články od autora ${author.value}.`
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_BlogCard = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white" }, _attrs))}><div class="bg-black text-white py-14 relative overflow-hidden"><div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-70"></div><div class="container mx-auto px-4 lg:px-8 relative z-10">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/blog",
        class: "inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors font-sans"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` SLICKLY Blog `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "w-4 h-4" }),
              createTextVNode(" SLICKLY Blog ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center gap-3 mb-3">`);
      _push(ssrRenderComponent(unref(User), { class: "w-5 h-5 text-brand" }, null, _parent));
      _push(`<span class="text-brand text-xs font-bold uppercase tracking-widest font-sans">Autor</span></div><h1 class="text-4xl md:text-5xl font-tech font-black uppercase italic text-white leading-none">${ssrInterpolate(unref(author))}</h1><div class="section-decorator mt-4"></div>`);
      if (unref(posts) && unref(posts).length) {
        _push(`<p class="mt-4 text-gray-400 font-sans text-sm">${ssrInterpolate(unref(posts).length)} ${ssrInterpolate(unref(posts).length === 1 ? "článok" : "článkov")}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="container mx-auto px-4 lg:px-8 py-16">`);
      if (unref(pending)) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="bg-gray-50 border border-gray-100 animate-pulse"><div class="aspect-[16/9] bg-gray-200"></div><div class="p-6 space-y-3"><div class="h-3 bg-gray-200 w-1/3"></div><div class="h-5 bg-gray-200 w-4/5"></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(posts)?.length) {
        _push(`<div class="text-center py-24">`);
        _push(ssrRenderComponent(unref(User), { class: "w-12 h-12 text-gray-300 mx-auto mb-4" }, null, _parent));
        _push(`<p class="text-gray-400 font-sans">Žiadne články od tohto autora.</p></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(unref(posts), (post) => {
          _push(ssrRenderComponent(_component_BlogCard, {
            key: post.id,
            post
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../features/blog/pages/blog/autor/[author].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
