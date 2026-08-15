import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, ref, withAsyncContext, computed, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { BookOpen, Calendar } from 'lucide-vue-next';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const activeCategory = ref("");
    const { data: posts, pending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `blog-listing-${route.query.category || "all"}`,
      () => $fetch("/api/blog/listing")
    )), __temp = await __temp, __restore(), __temp);
    const uniqueCategories = computed(
      () => [...new Set((posts.value ?? []).map((p) => p.category).filter(Boolean))]
    );
    const filteredPosts = computed(
      () => !activeCategory.value ? posts.value ?? [] : (posts.value ?? []).filter((p) => p.category === activeCategory.value)
    );
    const featuredPost = computed(
      () => filteredPosts.value.find((p) => p.featured) ?? filteredPosts.value[0] ?? null
    );
    const regularPosts = computed(() => {
      const fp = featuredPost.value;
      return fp ? filteredPosts.value.filter((p) => p.id !== fp.id) : filteredPosts.value.slice(1);
    });
    const formatDate = (d) => d ? new Date(d).toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" }) : "";
    useSeoMeta({
      title: "SLICKLY Blog",
      description: "Novinky, recenzie, tipy zo sveta starostlivosti o auto.",
      ogTitle: "SLICKLY Blog",
      ogDescription: "Novinky a tipy zo sveta autokozmetiky a detailingu.",
      ogType: "website",
      ogLocale: "sk_SK"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white" }, _attrs))}><div class="bg-black text-white py-16 relative overflow-hidden"><div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-70"></div><div class="absolute top-6 right-8 text-[150px] font-black text-white/[0.04] font-tech italic uppercase leading-none select-none pointer-events-none">BLOG</div><div class="container mx-auto px-4 lg:px-8 relative z-10"><div class="flex items-center gap-3 mb-4">`);
      _push(ssrRenderComponent(unref(BookOpen), {
        class: "w-5 h-5 text-brand",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="text-brand text-xs font-bold uppercase tracking-widest font-sans">SLICKLY Blog</span></div><h1 class="text-4xl md:text-5xl font-tech font-black uppercase italic text-white leading-none"> Zo sveta <span class="text-amber">SLICKLY</span></h1><div class="section-decorator mt-4"></div></div></div><div class="container mx-auto px-4 lg:px-8 py-12">`);
      if (!unref(pending) && unref(uniqueCategories).length) {
        _push(`<div class="flex flex-wrap gap-2 mb-10"><button class="${ssrRenderClass([!unref(activeCategory) ? "bg-brand border-brand text-white" : "bg-white border-gray-200 text-gray-600 hover:border-brand hover:text-brand", "transform -skew-x-12 border transition-colors"])}"><span class="block transform skew-x-12 px-4 py-2 text-[10px] font-bold uppercase tracking-widest font-tech leading-none"> Všetky </span></button><!--[-->`);
        ssrRenderList(unref(uniqueCategories), (cat) => {
          _push(`<button class="${ssrRenderClass([unref(activeCategory) === cat ? "bg-brand border-brand text-white" : "bg-white border-gray-200 text-gray-600 hover:border-brand hover:text-brand", "transform -skew-x-12 border transition-colors"])}"><span class="block transform skew-x-12 px-4 py-2 text-[10px] font-bold uppercase tracking-widest font-tech leading-none">${ssrInterpolate(cat)}</span></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(pending)) {
        _push(`<div class="space-y-8"><div class="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-gray-50 overflow-hidden"><div class="aspect-[4/3] bg-gray-200 animate-pulse"></div><div class="p-10 space-y-4"><div class="h-3 bg-gray-200 animate-pulse w-24"></div><div class="h-8 bg-gray-200 animate-pulse w-3/4"></div><div class="h-4 bg-gray-100 animate-pulse w-full"></div></div></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="bg-gray-50"><div class="aspect-[4/3] bg-gray-200 animate-pulse"></div><div class="p-5 space-y-3"><div class="h-2 bg-gray-100 animate-pulse w-16"></div><div class="h-4 bg-gray-200 animate-pulse w-full"></div><div class="h-3 bg-gray-100 animate-pulse w-4/5"></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else if (unref(filteredPosts).length === 0) {
        _push(`<div class="text-center py-24">`);
        _push(ssrRenderComponent(unref(BookOpen), { class: "w-12 h-12 text-gray-300 mx-auto mb-4" }, null, _parent));
        _push(`<p class="text-gray-400 font-sans">Žiadne články neboli nájdené.</p></div>`);
      } else {
        _push(`<!--[-->`);
        if (unref(featuredPost)) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/blog/${unref(featuredPost).slug}`,
            class: "group grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-gray-100 hover:border-gray-300 transition-colors duration-200 overflow-hidden mb-10"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="aspect-[4/3] lg:aspect-auto relative bg-gray-100 max-h-[420px] overflow-hidden"${_scopeId}>`);
                if (unref(featuredPost).coverUrl) {
                  _push2(ssrRenderComponent(_component_NuxtImg, {
                    src: unref(proxyMediaUrl)(unref(featuredPost).coverUrl),
                    alt: unref(featuredPost).title,
                    class: "w-full h-full object-cover",
                    format: "webp",
                    loading: "eager",
                    sizes: "sm:100vw lg:50vw"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<div class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(BookOpen), { class: "w-12 h-12 text-white/20" }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                }
                _push2(`</div><div class="flex flex-col justify-center p-8 lg:p-12"${_scopeId}><div class="flex items-center gap-2 mb-4"${_scopeId}>`);
                if (unref(featuredPost).featured) {
                  _push2(`<div class="bg-brand px-3 py-1 transform -skew-x-12"${_scopeId}><span class="block transform skew-x-12 text-white text-[10px] font-bold uppercase tracking-widest font-tech"${_scopeId}>${ssrInterpolate(unref(featuredPost).featuredBadgeText || "Featured")}</span></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (unref(featuredPost).category) {
                  _push2(`<div class="bg-black px-3 py-1 transform -skew-x-12"${_scopeId}><span class="block transform skew-x-12 text-white text-[10px] font-bold uppercase tracking-widest font-tech"${_scopeId}>${ssrInterpolate(unref(featuredPost).category)}</span></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><h2 class="font-tech font-black uppercase italic text-2xl lg:text-3xl leading-tight mb-4 group-hover:text-brand transition-colors line-clamp-3"${_scopeId}>${ssrInterpolate(unref(featuredPost).title)}</h2>`);
                if (unref(featuredPost).teaser) {
                  _push2(`<p class="text-sm text-gray-500 font-sans leading-relaxed line-clamp-3 mb-6"${_scopeId}>${ssrInterpolate(unref(featuredPost).teaser)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="text-[11px] text-gray-400 font-sans"${_scopeId}>${ssrInterpolate(unref(featuredPost).author ? `${unref(featuredPost).author} · ` : "")}${ssrInterpolate(formatDate(unref(featuredPost).publishedAt))}</div><span class="text-sm text-black font-sans font-medium underline hover:text-brand transition-colors mt-4 self-end"${_scopeId}> Zobraziť článok </span></div>`);
              } else {
                return [
                  createVNode("div", { class: "aspect-[4/3] lg:aspect-auto relative bg-gray-100 max-h-[420px] overflow-hidden" }, [
                    unref(featuredPost).coverUrl ? (openBlock(), createBlock(_component_NuxtImg, {
                      key: 0,
                      src: unref(proxyMediaUrl)(unref(featuredPost).coverUrl),
                      alt: unref(featuredPost).title,
                      class: "w-full h-full object-cover",
                      format: "webp",
                      loading: "eager",
                      sizes: "sm:100vw lg:50vw"
                    }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
                    }, [
                      createVNode(unref(BookOpen), { class: "w-12 h-12 text-white/20" })
                    ]))
                  ]),
                  createVNode("div", { class: "flex flex-col justify-center p-8 lg:p-12" }, [
                    createVNode("div", { class: "flex items-center gap-2 mb-4" }, [
                      unref(featuredPost).featured ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "bg-brand px-3 py-1 transform -skew-x-12"
                      }, [
                        createVNode("span", { class: "block transform skew-x-12 text-white text-[10px] font-bold uppercase tracking-widest font-tech" }, toDisplayString(unref(featuredPost).featuredBadgeText || "Featured"), 1)
                      ])) : createCommentVNode("", true),
                      unref(featuredPost).category ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "bg-black px-3 py-1 transform -skew-x-12"
                      }, [
                        createVNode("span", { class: "block transform skew-x-12 text-white text-[10px] font-bold uppercase tracking-widest font-tech" }, toDisplayString(unref(featuredPost).category), 1)
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("h2", { class: "font-tech font-black uppercase italic text-2xl lg:text-3xl leading-tight mb-4 group-hover:text-brand transition-colors line-clamp-3" }, toDisplayString(unref(featuredPost).title), 1),
                    unref(featuredPost).teaser ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm text-gray-500 font-sans leading-relaxed line-clamp-3 mb-6"
                    }, toDisplayString(unref(featuredPost).teaser), 1)) : createCommentVNode("", true),
                    createVNode("div", { class: "text-[11px] text-gray-400 font-sans" }, toDisplayString(unref(featuredPost).author ? `${unref(featuredPost).author} · ` : "") + toDisplayString(formatDate(unref(featuredPost).publishedAt)), 1),
                    createVNode("span", { class: "text-sm text-black font-sans font-medium underline hover:text-brand transition-colors mt-4 self-end" }, " Zobraziť článok ")
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(regularPosts).length) {
          _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><!--[-->`);
          ssrRenderList(unref(regularPosts), (post) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: post.id,
              to: `/blog/${post.slug}`,
              class: "group bg-white border border-gray-100 hover:border-gray-300 transition-colors duration-200 flex flex-col overflow-hidden"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="aspect-[4/3] relative bg-gray-100 overflow-hidden flex-shrink-0"${_scopeId}>`);
                  if (post.coverUrl) {
                    _push2(ssrRenderComponent(_component_NuxtImg, {
                      src: unref(proxyMediaUrl)(post.coverUrl),
                      alt: post.title,
                      class: "w-full h-full object-cover",
                      format: "webp",
                      loading: "lazy",
                      sizes: "sm:100vw md:50vw lg:25vw"
                    }, null, _parent2, _scopeId));
                  } else {
                    _push2(`<div class="w-full h-full bg-gray-200 flex items-center justify-center"${_scopeId}>`);
                    _push2(ssrRenderComponent(unref(BookOpen), { class: "w-8 h-8 text-gray-400" }, null, _parent2, _scopeId));
                    _push2(`</div>`);
                  }
                  if (post.category) {
                    _push2(`<div class="absolute top-3 left-3 bg-black px-3 py-1 transform -skew-x-12"${_scopeId}><span class="block transform skew-x-12 text-white text-[9px] font-bold uppercase tracking-widest font-tech leading-none"${_scopeId}>${ssrInterpolate(post.category)}</span></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div><div class="p-5 flex flex-col flex-1"${_scopeId}><div class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 font-sans flex items-center gap-1.5"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(Calendar), { class: "w-3 h-3 text-brand" }, null, _parent2, _scopeId));
                  _push2(` ${ssrInterpolate(formatDate(post.publishedAt))}</div><h3 class="font-tech font-bold text-base uppercase leading-snug mb-3 group-hover:text-brand transition-colors line-clamp-2"${_scopeId}>${ssrInterpolate(post.title)}</h3>`);
                  if (post.excerpt || post.teaser) {
                    _push2(`<p class="text-sm text-gray-500 font-sans leading-relaxed line-clamp-3 mb-4 flex-1"${_scopeId}>${ssrInterpolate(post.excerpt || post.teaser)}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<span class="text-sm text-black font-sans font-medium underline hover:text-brand transition-colors mt-auto self-end"${_scopeId}> Zobraziť článok </span></div>`);
                } else {
                  return [
                    createVNode("div", { class: "aspect-[4/3] relative bg-gray-100 overflow-hidden flex-shrink-0" }, [
                      post.coverUrl ? (openBlock(), createBlock(_component_NuxtImg, {
                        key: 0,
                        src: unref(proxyMediaUrl)(post.coverUrl),
                        alt: post.title,
                        class: "w-full h-full object-cover",
                        format: "webp",
                        loading: "lazy",
                        sizes: "sm:100vw md:50vw lg:25vw"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "w-full h-full bg-gray-200 flex items-center justify-center"
                      }, [
                        createVNode(unref(BookOpen), { class: "w-8 h-8 text-gray-400" })
                      ])),
                      post.category ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "absolute top-3 left-3 bg-black px-3 py-1 transform -skew-x-12"
                      }, [
                        createVNode("span", { class: "block transform skew-x-12 text-white text-[9px] font-bold uppercase tracking-widest font-tech leading-none" }, toDisplayString(post.category), 1)
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "p-5 flex flex-col flex-1" }, [
                      createVNode("div", { class: "text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 font-sans flex items-center gap-1.5" }, [
                        createVNode(unref(Calendar), { class: "w-3 h-3 text-brand" }),
                        createTextVNode(" " + toDisplayString(formatDate(post.publishedAt)), 1)
                      ]),
                      createVNode("h3", { class: "font-tech font-bold text-base uppercase leading-snug mb-3 group-hover:text-brand transition-colors line-clamp-2" }, toDisplayString(post.title), 1),
                      post.excerpt || post.teaser ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-gray-500 font-sans leading-relaxed line-clamp-3 mb-4 flex-1"
                      }, toDisplayString(post.excerpt || post.teaser), 1)) : createCommentVNode("", true),
                      createVNode("span", { class: "text-sm text-black font-sans font-medium underline hover:text-brand transition-colors mt-auto self-end" }, " Zobraziť článok ")
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../features/blog/pages/blog/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
