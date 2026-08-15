import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, withAsyncContext, unref, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { ArrowLeft, Calendar, User } from 'lucide-vue-next';
import { p as proxyMediaUrl } from './media-BNPyNy3v.mjs';
import __nuxt_component_1 from './CmsPage-FwkThjWd.mjs';
import { s as sanitizeHtml } from './sanitize-DKvwg8Vq.mjs';
import { d as useRoute, h as useAsyncData, Q as createError, C as useSeoMeta, W as useRequestURL, u as useHead } from './server.mjs';
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
import './useListing-D9PeCG7-.mjs';
import './useCategory-DZrTDjvY.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';
import './useNavigationContext-KcJT19yU.mjs';
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
  __name: "BlogHero",
  __ssrInlineRender: true,
  props: {
    post: {}
  },
  setup(__props) {
    const formatDate = (d) => d ? new Date(d).toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" }) : "";
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative bg-black overflow-hidden" }, _attrs))}>`);
      if (__props.post.heroCoverUrl || __props.post.coverUrl) {
        _push(`<div class="absolute inset-0">`);
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: unref(proxyMediaUrl)(__props.post.heroCoverUrl || __props.post.coverUrl),
          alt: __props.post.title,
          class: "w-full h-full object-cover opacity-40",
          format: "webp",
          loading: "eager",
          sizes: "100vw"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-70"></div><div class="container mx-auto px-4 lg:px-8 py-20 relative z-10">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/blog",
        class: "inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest mb-8 transition-colors font-sans"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), {
              class: "w-4 h-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` SLICKLY Blog `);
          } else {
            return [
              createVNode(unref(ArrowLeft), {
                class: "w-4 h-4",
                "aria-hidden": "true"
              }),
              createTextVNode(" SLICKLY Blog ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-widest text-white/50 font-sans mb-6"><span class="flex items-center gap-1.5">`);
      _push(ssrRenderComponent(unref(Calendar), {
        class: "w-3.5 h-3.5 text-brand",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(formatDate(__props.post.publishedAt))}</span>`);
      if (__props.post.author) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/blog/autor/${encodeURIComponent(__props.post.author)}`,
          class: "flex items-center gap-1.5 hover:text-brand transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(User), {
                class: "w-3.5 h-3.5 text-brand",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(__props.post.author)}`);
            } else {
              return [
                createVNode(unref(User), {
                  class: "w-3.5 h-3.5 text-brand",
                  "aria-hidden": "true"
                }),
                createTextVNode(" " + toDisplayString(__props.post.author), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (__props.post.category) {
        _push(`<span class="bg-brand/20 text-brand px-2 py-0.5 font-bold">${ssrInterpolate(__props.post.category)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><h1 class="text-3xl md:text-5xl lg:text-6xl font-tech font-black uppercase italic text-white leading-none max-w-4xl">${ssrInterpolate(__props.post.title)}</h1><div class="section-decorator mt-6"></div>`);
      if (__props.post.teaser) {
        _push(`<p class="mt-6 text-gray-300 font-sans text-lg leading-relaxed max-w-2xl">${ssrInterpolate(__props.post.teaser)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../features/blog/components/blog/BlogHero.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "BlogHero" });
function useBlogPostingJsonLD(post) {
  const { origin: baseUrl } = useRequestURL();
  const imageUrl = post.heroCoverUrl || post.coverUrl;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    url: `${baseUrl}/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`
    },
    publisher: {
      "@type": "Organization",
      name: "SLICKLY",
      url: baseUrl,
      logo: { "@type": "ImageObject", url: `${baseUrl}/favicon.svg` }
    },
    author: post.author ? { "@type": "Person", name: post.author } : { "@type": "Organization", name: "SLICKLY" },
    inLanguage: "sk-SK"
  };
  const description = post.metaDescription || post.teaser;
  if (description) schema.description = description;
  if (imageUrl) schema.image = imageUrl;
  if (post.publishedAt) {
    schema.datePublished = post.publishedAt;
    schema.dateModified = post.publishedAt;
  }
  if (post.category) schema.articleSection = post.category;
  useHead({
    script: [{ type: "application/ld+json", children: JSON.stringify(schema) }]
  });
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const { data: post } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `blog-post-${route.params.slug}`,
      () => $fetch(`/api/blog/${route.params.slug}`).catch(() => null)
    )), __temp = await __temp, __restore(), __temp);
    if (!post.value) {
      throw createError({ statusCode: 404, message: "Článok nebol nájdený" });
    }
    useSeoMeta({
      title: () => post.value?.metaTitle || post.value?.title || "SLICKLY Blog",
      description: () => post.value?.metaDescription || post.value?.teaser || "",
      ogTitle: () => post.value?.title || "",
      ogDescription: () => post.value?.teaser || "",
      ogImage: () => post.value?.coverUrl ? proxyMediaUrl(post.value.coverUrl) : void 0,
      ogType: "article",
      ogLocale: "sk_SK",
      articlePublishedTime: () => post.value?.publishedAt || void 0,
      articleModifiedTime: () => post.value?.publishedAt || void 0,
      articleSection: () => post.value?.category || void 0
    });
    useBlogPostingJsonLD(post.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BlogHero = __nuxt_component_0;
      const _component_CmsPage = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0$1;
      if (unref(post)) {
        _push(`<article${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_BlogHero, { post: unref(post) }, null, _parent));
        _push(`<div class="container mx-auto px-4 lg:px-8 py-16"><div class="mtsport-blog-content">`);
        if (unref(post).cmsPage?.sections?.length) {
          _push(ssrRenderComponent(_component_CmsPage, {
            content: unref(post).cmsPage
          }, null, _parent));
        } else if (unref(post).content) {
          _push(`<div>${unref(sanitizeHtml)(unref(post).content) ?? ""}</div>`);
        } else if (!unref(post).cmsPage && !unref(post).content) {
          _push(`<div class="py-8 text-gray-400 text-sm italic"> Tento článok nemá obsah. Pridajte text do poľa Obsah článku alebo priraďte CMS rozloženie. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="mt-16 pt-8 border-t border-gray-100">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/blog",
          class: "inline-flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-widest hover:text-black transition-colors font-sans border-b border-brand pb-0.5"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ArrowLeft), {
                class: "w-3.5 h-3.5",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(` Všetky články `);
            } else {
              return [
                createVNode(unref(ArrowLeft), {
                  class: "w-3.5 h-3.5",
                  "aria-hidden": "true"
                }),
                createTextVNode(" Všetky články ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></article>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../features/blog/pages/blog/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
