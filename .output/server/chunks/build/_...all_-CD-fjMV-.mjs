import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import __nuxt_component_1 from './CmsPage-FwkThjWd.mjs';
import { defineComponent, withAsyncContext, computed, resolveComponent, h, unref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderVNode } from 'vue/server-renderer';
import { ax as pascalCase } from '../nitro/nitro.mjs';
import { s as sanitizeHtml } from './sanitize-DKvwg8Vq.mjs';
import { p as proxyMediaUrl } from './media-BNPyNy3v.mjs';
import { e as useShopwareContext, d as useRoute, m as useI18n, O as getLanguageIdFromPath, P as getLocaleFromPath, h as useAsyncData, C as useSeoMeta, Q as createError, i as useRuntimeConfig, F as slugify } from './server.mjs';
import { u as useNavigationContext } from './useNavigationContext-KcJT19yU.mjs';
import './composables-x8_ENpEe.mjs';
import '@shopware/helpers';
import './useListing-D9PeCG7-.mjs';
import './useCategory-DZrTDjvY.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';
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
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "PageResolver"
  },
  __name: "[...all]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { apiClient } = useShopwareContext();
    const route = useRoute();
    const { locale, locales } = useI18n();
    const config = useRuntimeConfig();
    const salesChannelId = config.public.shopware.ids.salesChannel;
    const routePath = route.path;
    const currentLangId = getLanguageIdFromPath(routePath);
    getLocaleFromPath(routePath);
    async function resolvePathParallel(cleanSlug, langId) {
      const slugParts = cleanSlug.split("/");
      const lastSegment = slugParts[slugParts.length - 1];
      const norm = (s) => (s || "").replace(/^\/+|\/+$/g, "").toLowerCase();
      try {
        if (slugParts.length === 2 && lastSegment.length >= 3) {
          const productResult = await apiClient.invoke("readProduct post /product", {
            headers: { "sw-language-id": langId },
            body: {
              limit: 1,
              filter: [{ type: "equals", field: "productNumber", value: lastSegment }],
              includes: { product: ["id"] }
            }
          }).catch(() => null);
          const product = productResult?.data?.elements?.[0];
          if (product) {
            return {
              routeName: "frontend.detail.page",
              foreignKey: product.id,
              pathInfo: `/detail/${product.id}`,
              seoPathInfo: cleanSlug,
              isCanonical: true
            };
          }
        }
        if (slugParts.length >= 2) {
          const exactRes = await apiClient.invoke("readSeoUrl post /seo-url", {
            headers: { "sw-language-id": langId },
            body: {
              filter: [
                { type: "equalsAny", field: "seoPathInfo", value: [cleanSlug, cleanSlug + "/"] },
                { type: "equals", field: "isDeleted", value: false },
                { type: "equals", field: "isCanonical", value: true },
                { type: "equals", field: "salesChannelId", value: salesChannelId },
                { type: "equals", field: "routeName", value: "frontend.navigation.page" }
              ],
              limit: 1
            }
          });
          const exactHit = exactRes?.data?.elements?.[0];
          if (exactHit?.foreignKey) {
            return {
              routeName: "frontend.navigation.page",
              foreignKey: exactHit.foreignKey,
              pathInfo: `/navigation/${exactHit.foreignKey}`,
              seoPathInfo: cleanSlug,
              isCanonical: true
            };
          }
        }
        let parentCategoryId;
        if (slugParts.length >= 2) {
          const parentSlug = slugParts[slugParts.length - 2];
          const parentPath = slugParts.slice(0, -1).join("/");
          const parentSeoRes = await apiClient.invoke("readSeoUrl post /seo-url", {
            headers: { "sw-language-id": langId },
            body: {
              filter: [
                { type: "equalsAny", field: "seoPathInfo", value: [parentSlug, parentSlug + "/", parentPath, parentPath + "/"] },
                { type: "equals", field: "isDeleted", value: false },
                { type: "equals", field: "isCanonical", value: true },
                { type: "equals", field: "salesChannelId", value: salesChannelId },
                { type: "equals", field: "routeName", value: "frontend.navigation.page" }
              ],
              limit: 5
            }
          });
          const parentEls = parentSeoRes?.data?.elements || [];
          parentCategoryId = (parentEls.find((e) => norm(e.seoPathInfo) === norm(parentPath)) || parentEls.find((e) => norm(e.seoPathInfo) === norm(parentSlug)) || parentEls[0])?.foreignKey;
          if (parentCategoryId) {
            const childCatRes = await apiClient.invoke("readCategoryList post /category", {
              headers: { "sw-language-id": langId },
              body: {
                filter: [
                  { type: "equals", field: "parentId", value: parentCategoryId },
                  { type: "equals", field: "active", value: true }
                ],
                associations: { seoUrls: {} },
                limit: 100
              }
            });
            const children = childCatRes?.data?.elements || [];
            const matched = children.find(
              (c) => (c.seoUrls || []).some(
                (s) => !s.isDeleted && s.isCanonical && (norm(s.seoPathInfo) === norm(lastSegment) || norm(s.seoPathInfo) === norm(cleanSlug) || typeof s.seoPathInfo === "string" && norm(s.seoPathInfo).endsWith("/" + norm(lastSegment)))
              )
            ) || children.find((c) => {
              const nm = c.translated?.name || c.name || "";
              return nm && slugify(nm) === lastSegment;
            });
            if (matched) {
              return {
                routeName: "frontend.navigation.page",
                foreignKey: matched.id,
                pathInfo: `/navigation/${matched.id}`,
                seoPathInfo: cleanSlug,
                isCanonical: true
              };
            }
          }
        }
        const seoResult2 = await apiClient.invoke("readSeoUrl post /seo-url", {
          headers: { "sw-language-id": langId },
          body: {
            filter: [
              { type: "equalsAny", field: "seoPathInfo", value: [cleanSlug, cleanSlug + "/", lastSegment, lastSegment + "/"] },
              { type: "equals", field: "isDeleted", value: false },
              { type: "equals", field: "isCanonical", value: true },
              { type: "equals", field: "salesChannelId", value: salesChannelId },
              { type: "equals", field: "languageId", value: langId }
            ],
            limit: 10
          }
        });
        const elements = seoResult2?.data?.elements || [];
        let seoData = elements.find((e) => norm(e.seoPathInfo) === norm(cleanSlug));
        if (!seoData) {
          const lastMatches = elements.filter((e) => norm(e.seoPathInfo) === norm(lastSegment));
          if (lastMatches.length === 1) {
            seoData = lastMatches[0];
          } else if (lastMatches.length > 1 && slugParts.length >= 2) {
            const candidateIds = lastMatches.map((e) => e.foreignKey).filter(Boolean);
            try {
              const catRes = await apiClient.invoke("readCategoryList post /category", {
                headers: { "sw-language-id": langId },
                body: {
                  filter: [{ type: "equalsAny", field: "id", value: candidateIds }],
                  includes: { category: ["id", "parentId", "path"] },
                  limit: candidateIds.length
                }
              });
              const cats = catRes?.data?.elements || [];
              const byId = new Map(cats.map((c) => [c.id, c]));
              const pick = parentCategoryId ? lastMatches.find((e) => {
                const c = byId.get(e.foreignKey);
                if (!c) return false;
                return c.parentId === parentCategoryId || typeof c.path === "string" && c.path.includes(parentCategoryId);
              }) : void 0;
              seoData = pick || lastMatches[0];
            } catch {
              seoData = lastMatches[0];
            }
          }
        }
        if (!seoData && lastSegment) {
          const categoryRes = await apiClient.invoke("readCategoryList post /category", {
            headers: { "sw-language-id": langId },
            body: {
              filter: [
                { type: "equals", field: "name", value: lastSegment }
              ],
              limit: 1,
              associations: { seoUrls: {} }
            }
          });
          const category = categoryRes?.data?.elements?.[0];
          if (category) {
            seoData = {
              routeName: "frontend.navigation.page",
              foreignKey: category.id,
              pathInfo: `/navigation/${category.id}`,
              seoPathInfo: cleanSlug,
              isCanonical: true
            };
          }
        }
        if (seoData) return seoData;
        if (lastSegment && lastSegment.length > 3) {
          const productResult = await apiClient.invoke("readProduct post /product", {
            headers: { "sw-language-id": langId },
            body: {
              limit: 1,
              filter: [{ type: "equals", field: "productNumber", value: lastSegment }],
              associations: { seoUrls: {} }
            }
          });
          const product = productResult?.data?.elements?.[0];
          if (product) {
            return {
              routeName: "frontend.detail.page",
              foreignKey: product.id,
              pathInfo: `/detail/${product.id}`,
              seoPathInfo: cleanSlug,
              isCanonical: true
            };
          }
        }
      } catch (e) {
      }
      return null;
    }
    const { data: seoResult, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      `cmsResponse:${routePath}:${currentLangId}`,
      async () => {
        if (!routePath || routePath === "/undefined" || routePath === "/null" || routePath === "/1x" || routePath.includes("undefined") || routePath.includes("null") || /\.(png|jpg|jpeg|gif|svg|webp|avif|ico|js|css|map|json|woff|woff2|ttf|otf)$/i.test(routePath)) {
          return null;
        }
        if (routePath.startsWith("/porovnanie/") || routePath.startsWith("/znacka/") || routePath.startsWith("/znacky")) {
          return null;
        }
        if (routePath.startsWith("/navigation/")) {
          const parts = routePath.split("/");
          const navigationId = parts[2];
          if (!navigationId || navigationId === "undefined" || navigationId === "null") return null;
          return {
            routeName: "frontend.navigation.page",
            foreignKey: navigationId,
            pathInfo: routePath,
            seoPathInfo: routePath
          };
        }
        if (routePath.startsWith("/detail/") || routePath.startsWith("/product/")) {
          const productId = routePath.split("/")[2];
          return {
            routeName: "frontend.detail.page",
            foreignKey: productId,
            pathInfo: routePath,
            seoPathInfo: routePath
          };
        }
        let cleanSlug = routePath.replace(/^\/+|\/+$/g, "");
        locales.value.forEach((l) => {
          const prefix = typeof l === "string" ? l : l.code;
          if (cleanSlug.startsWith(`${prefix}/`)) {
            cleanSlug = cleanSlug.substring(prefix.length + 1);
          } else if (cleanSlug === prefix) {
            cleanSlug = "";
          }
        });
        if (!cleanSlug) {
          return {
            routeName: "frontend.navigation.page",
            foreignKey: "home"
          };
        }
        return await resolvePathParallel(cleanSlug, currentLangId);
      }
    )), __temp = await __temp, __restore(), __temp);
    const cleanSlugForPage = routePath.replace(/^\/+|\/+$/g, "");
    const localeStrippedSlug = (() => {
      let s = cleanSlugForPage;
      locales.value.forEach((l) => {
        const prefix = typeof l === "string" ? l : l.code;
        if (s.startsWith(`${prefix}/`)) s = s.substring(prefix.length + 1);
        else if (s === prefix) s = "";
      });
      return s;
    })();
    const { data: staticPage } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      `static-page:${localeStrippedSlug}`,
      async () => {
        if (!localeStrippedSlug) return null;
        if (localeStrippedSlug.includes("/")) return null;
        try {
          return await $fetch(`/api/page/${localeStrippedSlug}`) ?? null;
        } catch {
          return null;
        }
      }
    )), __temp = await __temp, __restore(), __temp);
    if (staticPage.value) {
      const sp = staticPage.value;
      useSeoMeta({
        title: sp.metaTitle || sp.title,
        description: sp.metaDescription || sp.teaser || "",
        ogTitle: sp.title,
        ogDescription: sp.teaser || ""
      });
    }
    if (!staticPage.value && (error.value || !seoResult.value?.foreignKey)) {
      throw createError({
        statusCode: 404,
        message: `Page not found: ${routePath}`,
        fatal: true
      });
    }
    const { routeName, foreignKey } = useNavigationContext(
      seoResult
    );
    const safeNavigationId = computed(() => {
      const raw = foreignKey.value;
      if (!raw) return "";
      const str = typeof raw === "string" ? raw : String(raw);
      if (!str || str.startsWith("[object")) {
        return "";
      }
      return str;
    });
    const resolvedComponent = computed(() => {
      const componentName = routeName.value;
      const navId = safeNavigationId.value;
      if (!componentName || !navId) return null;
      const componentNameToResolve = pascalCase(componentName);
      const cmsPageView = resolveComponent(componentNameToResolve);
      if (!cmsPageView || typeof cmsPageView === "string") {
        return h("div", "Chýbajúci komponent šablóny.");
      }
      return h(cmsPageView, {
        navigationId: navId,
        key: navId
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      const _component_CmsPage = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (unref(staticPage)) {
        _push(`<article class="min-h-screen bg-white"><div class="relative bg-black overflow-hidden py-20">`);
        if (unref(staticPage).heroCoverUrl || unref(staticPage).coverUrl) {
          _push(`<div class="absolute inset-0">`);
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: unref(proxyMediaUrl)(unref(staticPage).heroCoverUrl || unref(staticPage).coverUrl),
            alt: unref(staticPage).title,
            width: "1600",
            height: "400",
            class: "w-full h-full object-cover opacity-30",
            format: "webp",
            loading: "eager",
            sizes: "100vw"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-70"></div><div class="container mx-auto px-4 lg:px-8 relative z-10"><h1 class="text-3xl md:text-5xl font-tech font-black uppercase italic text-white leading-none max-w-4xl">${ssrInterpolate(unref(staticPage).title)}</h1><div class="section-decorator mt-6"></div>`);
        if (unref(staticPage).teaser) {
          _push(`<p class="mt-6 text-gray-300 font-sans text-lg leading-relaxed max-w-2xl">${ssrInterpolate(unref(staticPage).teaser)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="container mx-auto px-4 lg:px-8 py-16"><div class="mtsport-blog-content">`);
        if (unref(staticPage).cmsPage?.sections?.length) {
          _push(ssrRenderComponent(_component_CmsPage, {
            content: unref(staticPage).cmsPage
          }, null, _parent));
        } else if (unref(staticPage).content) {
          _push(`<div>${unref(sanitizeHtml)(unref(staticPage).content) ?? ""}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></article>`);
      } else if (resolvedComponent.value) {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(resolvedComponent.value), null, null), _parent);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[...all].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
