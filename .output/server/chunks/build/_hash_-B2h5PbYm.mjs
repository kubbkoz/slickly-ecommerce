import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, withAsyncContext, computed, ref, mergeProps, withCtx, unref, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-vue-next';
import { d as useRoute, h as useAsyncData, Q as createError, C as useSeoMeta } from './server.mjs';
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
  __name: "[hash]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const { data, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `comparison-${route.params.hash}`,
      () => $fetch(`/api/comparison/load/${route.params.hash}`).catch(() => null)
    )), __temp = await __temp, __restore(), __temp);
    if (!data.value) {
      throw createError({ statusCode: 404, message: "Porovnanie nenájdené alebo vypršalo" });
    }
    const items = computed(() => data.value?.items || []);
    const allPropertyGroups = computed(() => {
      const groups = /* @__PURE__ */ new Set();
      items.value.forEach((item) => {
        (item.properties || []).forEach((p) => groups.add(p.group));
      });
      return Array.from(groups).sort();
    });
    const getPropertyValue = (item, group) => {
      const prop = (item.properties || []).find((p) => p.group === group);
      return prop?.value || "—";
    };
    const isDifferent = (group) => {
      const values = items.value.map((item) => getPropertyValue(item, group));
      return new Set(values.filter((v) => v !== "—")).size > 1;
    };
    const aiRecommendation = ref("");
    const aiLoading = ref(false);
    useSeoMeta({
      title: "Porovnanie produktov | SLICKLY",
      robots: "noindex"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white" }, _attrs))}><div class="max-w-[1536px] mx-auto px-4 lg:px-8 py-12">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-widest hover:text-black transition-colors mb-8"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
            _push2(` Späť do obchodu `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "w-3.5 h-3.5" }),
              createTextVNode(" Späť do obchodu ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="font-tech font-black uppercase text-2xl tracking-wide text-black mb-4">Porovnanie produktov</h1><div class="section-decorator mb-8"></div><div class="overflow-x-auto"><table class="w-full text-sm min-w-[600px]"><thead><tr><th class="text-left p-3 w-40 text-[10px] font-bold uppercase tracking-widest text-gray-400"></th><!--[-->`);
      ssrRenderList(unref(items), (item) => {
        _push(`<th class="p-3 text-center align-top min-w-[160px]"><img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.name)} class="w-24 h-24 object-contain mx-auto mb-3"><p class="text-xs font-bold uppercase leading-tight line-clamp-2 mb-1">${ssrInterpolate(item.name)}</p><p class="font-tech font-black text-lg">${ssrInterpolate(item.price)} €</p>`);
        if (item.oldPrice) {
          _push(`<p class="text-xs text-gray-400 line-through">${ssrInterpolate(item.oldPrice)} €</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</th>`);
      });
      _push(`<!--]--></tr></thead><tbody><tr class="border-t border-gray-100"><td class="p-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Kategória</td><!--[-->`);
      ssrRenderList(unref(items), (item) => {
        _push(`<td class="p-3 text-center text-xs">${ssrInterpolate(item.categoryName || "—")}</td>`);
      });
      _push(`<!--]--></tr><tr class="border-t border-gray-100 bg-gray-50"><td class="p-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Výrobca</td><!--[-->`);
      ssrRenderList(unref(items), (item) => {
        _push(`<td class="p-3 text-center text-xs font-medium">${ssrInterpolate(item.manufacturer || "—")}</td>`);
      });
      _push(`<!--]--></tr><!--[-->`);
      ssrRenderList(unref(allPropertyGroups), (group, idx) => {
        _push(`<tr class="${ssrRenderClass([idx % 2 === 0 ? "" : "bg-gray-50", "border-t border-gray-100"])}"><td class="p-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">${ssrInterpolate(group)}</td><!--[-->`);
        ssrRenderList(unref(items), (item) => {
          _push(`<td class="${ssrRenderClass([isDifferent(group) ? "bg-amber-50 font-medium" : "", "p-3 text-center text-xs"])}">${ssrInterpolate(getPropertyValue(item, group))}</td>`);
        });
        _push(`<!--]--></tr>`);
      });
      _push(`<!--]--></tbody></table></div><div class="mt-8"><button${ssrIncludeBooleanAttr(unref(aiLoading)) ? " disabled" : ""} class="flex items-center gap-2 px-6 py-3 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand transition-colors disabled:opacity-50">`);
      if (unref(aiLoading)) {
        _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Sparkles), { class: "w-4 h-4" }, null, _parent));
      }
      _push(` AI odporúčanie </button></div>`);
      if (unref(aiRecommendation)) {
        _push(`<div class="mt-4 p-5 bg-blue-50 border-l-2 border-blue-400 text-sm text-blue-900 font-sans leading-relaxed animate-fade-in"><p class="font-tech font-bold uppercase text-xs mb-2 flex items-center gap-1.5">`);
        _push(ssrRenderComponent(unref(Sparkles), { class: "w-3.5 h-3.5" }, null, _parent));
        _push(` AI odporúčanie</p> ${ssrInterpolate(unref(aiRecommendation))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="text-xs text-gray-400 mt-8">Porovnanie platné 7 dní od vytvorenia.</p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/porovnanie/[hash].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
