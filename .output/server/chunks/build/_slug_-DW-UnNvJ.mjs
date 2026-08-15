import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import __nuxt_component_1 from './CmsPage-FwkThjWd.mjs';
import { defineComponent, withAsyncContext, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { s as sanitizeHtml } from './sanitize-DKvwg8Vq.mjs';
import { p as proxyMediaUrl } from './media-BNPyNy3v.mjs';
import { d as useRoute, h as useAsyncData, Q as createError, C as useSeoMeta } from './server.mjs';
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
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const { data: page } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      `page-${route.params.slug}`,
      // `?? null` — page API môže vrátiť null (prázdne telo) → $fetch undefined;
      // useAsyncData handler nesmie vrátiť undefined.
      async () => await $fetch(`/api/page/${route.params.slug}`).catch(() => null) ?? null
    )), __temp = await __temp, __restore(), __temp);
    if (!page.value) {
      throw createError({ statusCode: 404, message: "Stránka nebola nájdená" });
    }
    useSeoMeta({
      title: () => page.value?.metaTitle || page.value?.title || "SLICKLY",
      description: () => page.value?.metaDescription || page.value?.teaser || ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      const _component_CmsPage = __nuxt_component_1;
      if (unref(page)) {
        _push(`<article${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white" }, _attrs))}><div class="relative bg-black overflow-hidden py-20">`);
        if (unref(page).heroCoverUrl || unref(page).coverUrl) {
          _push(`<div class="absolute inset-0">`);
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: unref(proxyMediaUrl)(unref(page).heroCoverUrl || unref(page).coverUrl),
            alt: unref(page).title,
            class: "w-full h-full object-cover opacity-30",
            format: "webp",
            loading: "eager",
            sizes: "100vw"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-70"></div><div class="container mx-auto px-4 lg:px-8 relative z-10"><h1 class="text-3xl md:text-5xl font-tech font-black uppercase italic text-white leading-none max-w-4xl">${ssrInterpolate(unref(page).title)}</h1><div class="section-decorator mt-6"></div>`);
        if (unref(page).teaser) {
          _push(`<p class="mt-6 text-gray-300 font-sans text-lg leading-relaxed max-w-2xl">${ssrInterpolate(unref(page).teaser)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="container mx-auto px-4 lg:px-8 py-16"><div class="max-w-5xl mx-auto"><div class="mtsport-blog-content">`);
        if (unref(page).cmsPage?.sections?.length) {
          _push(ssrRenderComponent(_component_CmsPage, {
            content: unref(page).cmsPage
          }, null, _parent));
        } else if (unref(page).content) {
          _push(`<div>${unref(sanitizeHtml)(unref(page).content) ?? ""}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></article>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../features/blog/pages/p/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
