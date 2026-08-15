import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, ref, computed, watch, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { X, ArrowRight, Sparkles, Copy, Loader2, Check, Share2, Trash2 } from 'lucide-vue-next';
import { u as useProductComparison } from './useProductComparison-BXlqQWLK.mjs';
import { _ as _export_sfc, b as useLocalePath, f as useUser, e as useShopwareContext, g as useState, E as getProductUrl } from './server.mjs';
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
  __name: "ComparisonModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const localePath = useLocalePath();
    const discountPercent = (item) => {
      if (!item.oldPrice || item.oldPrice <= item.price) return 0;
      return Math.round((1 - item.price / item.oldPrice) * 100);
    };
    const itemUrl = (item) => localePath(getProductUrl({
      productNumber: item.productNumber,
      name: item.name,
      id: item.id
    }));
    const props = __props;
    const emit = __emit;
    const { comparisonItems, comparisonCount } = useProductComparison();
    useUser();
    const { apiClient } = useShopwareContext();
    useState("loginModalOpen", () => false);
    const propertiesLoading = ref(false);
    const fetchMissingProperties = async () => {
      const missing = comparisonItems.value.filter((item) => !item.properties?.length);
      if (!missing.length) return;
      propertiesLoading.value = true;
      try {
        const res = await apiClient.invoke("readProduct post /product", {
          body: {
            filter: [{ type: "equalsAny", field: "id", value: missing.map((m) => m.id) }],
            associations: { properties: { associations: { group: {} } } },
            includes: {
              product: ["id", "properties"],
              property_group_option: ["id", "name", "translated", "group"],
              property_group: ["id", "name", "translated"]
            }
          }
        });
        const products = (res?.data || res)?.elements || [];
        for (const p of products) {
          const item = comparisonItems.value.find((i) => i.id === p.id);
          if (item && p.properties?.length) {
            item.properties = p.properties.map((pr) => ({
              group: pr.group?.translated?.name || pr.group?.name || "",
              value: pr.translated?.name || pr.name || ""
            }));
          }
        }
      } catch (e) {
      }
      propertiesLoading.value = false;
    };
    const aiRecommendation = ref("");
    const aiLoading = ref(false);
    const shareHash = ref("");
    const shareLoading = ref(false);
    const copied = ref(false);
    const allPropertyGroups = computed(() => {
      const groups = /* @__PURE__ */ new Set();
      comparisonItems.value.forEach((item) => {
        (item.properties || []).forEach((p) => groups.add(p.group));
      });
      return Array.from(groups).sort();
    });
    const getPropertyValue = (item, group) => {
      const prop = (item.properties || []).find((p) => p.group === group);
      return prop?.value || "—";
    };
    const isDifferent = (group) => {
      const values = comparisonItems.value.map((item) => getPropertyValue(item, group));
      return new Set(values.filter((v) => v !== "—")).size > 1;
    };
    const shareUrl = computed(
      () => shareHash.value ? `${""}/porovnanie/${shareHash.value}` : ""
    );
    watch(() => props.isOpen, (open) => {
      (void 0).body.style.overflow = open ? "hidden" : "";
      if (open) {
        aiRecommendation.value = "";
        shareHash.value = "";
        if (comparisonItems.value.some((i) => !i.properties?.length)) {
          fetchMissingProperties();
        }
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.isOpen) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4 md:pt-12" data-v-45180191><div class="absolute inset-0" data-v-45180191></div><div class="comparison-modal relative w-full h-full md:h-auto md:max-h-[85vh] max-w-4xl bg-white shadow-2xl overflow-y-auto md:overflow-hidden scrollbar-hide flex flex-col" data-v-45180191><div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0" data-v-45180191><h2 class="text-lg font-tech font-bold uppercase tracking-wide" data-v-45180191>Porovnanie produktov</h2><button class="text-gray-400 hover:text-black transition-colors" aria-label="Zavrieť" data-v-45180191>`);
          _push2(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
          _push2(`</button></div><div class="flex-1 overflow-y-auto comparison-scroll px-6 py-6" data-v-45180191>`);
          if (unref(comparisonCount) < 2) {
            _push2(`<div class="text-center py-12" data-v-45180191><p class="text-gray-500 font-sans text-sm mb-4" data-v-45180191>${ssrInterpolate(unref(comparisonCount) === 0 ? "Zatiaľ ste nepridali žiadne produkty." : "Pridajte aspoň 2 produkty na porovnanie.")}</p>`);
            if (unref(comparisonItems).length) {
              _push2(`<div class="space-y-3 text-left max-w-sm mx-auto" data-v-45180191><!--[-->`);
              ssrRenderList(unref(comparisonItems), (item) => {
                _push2(`<div class="flex items-center gap-3 p-3 border border-gray-100" data-v-45180191><img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.name)} width="48" height="48" loading="lazy" class="w-12 h-12 object-contain flex-shrink-0" data-v-45180191><span class="text-xs font-bold uppercase truncate flex-1" data-v-45180191>${ssrInterpolate(item.name)}</span><button class="text-gray-400 hover:text-brand" data-v-45180191>`);
                _push2(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent));
                _push2(`</button></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="text-xs text-gray-400 mt-6" data-v-45180191>Navštívte produkty a kliknite &quot;Porovnať&quot;</p></div>`);
          } else {
            _push2(`<!--[--><div class="overflow-x-auto" data-v-45180191><table class="w-full text-sm" data-v-45180191><thead data-v-45180191><tr data-v-45180191><th class="text-left p-3 w-40 text-[10px] font-bold uppercase tracking-widest text-gray-400 align-top sticky left-0 bg-white z-10" data-v-45180191></th><!--[-->`);
            ssrRenderList(unref(comparisonItems), (item) => {
              _push2(`<th class="p-3 text-center align-top min-w-[180px]" data-v-45180191><div class="relative flex flex-col items-center" data-v-45180191><button class="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center text-gray-300 hover:text-brand transition-colors z-10" data-v-45180191>`);
              _push2(ssrRenderComponent(unref(X), { class: "w-3.5 h-3.5" }, null, _parent));
              _push2(`</button><div class="relative" data-v-45180191><img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.name)} width="96" height="96" loading="lazy" class="w-24 h-24 object-contain mx-auto mb-3" data-v-45180191>`);
              if (discountPercent(item) > 0) {
                _push2(`<span class="absolute top-0 left-0 px-1.5 py-0.5 text-[10px] font-bold text-black bg-amber leading-none" data-v-45180191>-${ssrInterpolate(discountPercent(item))}%</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><p class="text-[11px] font-bold uppercase leading-tight line-clamp-2 mb-2 min-h-[2.5em]" data-v-45180191>${ssrInterpolate(item.name)}</p><p class="font-tech font-black text-lg" data-v-45180191>${ssrInterpolate(item.price)} €</p>`);
              if (item.oldPrice) {
                _push2(`<p class="text-xs text-gray-400 line-through mb-2" data-v-45180191>${ssrInterpolate(item.oldPrice)} €</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: itemUrl(item),
                onClick: ($event) => emit("close"),
                class: "inline-flex items-center gap-1 mt-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black text-[10px] font-bold uppercase tracking-widest transition-colors"
              }, {
                default: withCtx((_, _push3, _parent2, _scopeId) => {
                  if (_push3) {
                    _push3(` Zobraziť `);
                    _push3(ssrRenderComponent(unref(ArrowRight), { class: "w-3 h-3" }, null, _parent2, _scopeId));
                  } else {
                    return [
                      createTextVNode(" Zobraziť "),
                      createVNode(unref(ArrowRight), { class: "w-3 h-3" })
                    ];
                  }
                }),
                _: 2
              }, _parent));
              _push2(`</div></th>`);
            });
            _push2(`<!--]--></tr></thead><tbody data-v-45180191><tr class="border-t border-gray-100" data-v-45180191><td class="p-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 sticky left-0 bg-white" data-v-45180191>Kategória</td><!--[-->`);
            ssrRenderList(unref(comparisonItems), (item) => {
              _push2(`<td class="p-3 text-center text-xs font-medium" data-v-45180191>${ssrInterpolate(item.categoryName || "—")}</td>`);
            });
            _push2(`<!--]--></tr><tr class="border-t border-gray-100 bg-gray-50/50" data-v-45180191><td class="p-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 sticky left-0 bg-gray-50/50" data-v-45180191>Výrobca</td><!--[-->`);
            ssrRenderList(unref(comparisonItems), (item) => {
              _push2(`<td class="p-3 text-center text-xs font-medium" data-v-45180191>${ssrInterpolate(item.manufacturer || "—")}</td>`);
            });
            _push2(`<!--]--></tr><!--[-->`);
            ssrRenderList(unref(allPropertyGroups), (group, idx) => {
              _push2(`<tr class="${ssrRenderClass([idx % 2 !== 0 ? "bg-gray-50/50" : "", "border-t border-gray-100"])}" data-v-45180191><td class="${ssrRenderClass([idx % 2 !== 0 ? "bg-gray-50/50" : "bg-white", "p-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 sticky left-0"])}" data-v-45180191>${ssrInterpolate(group)}</td><!--[-->`);
              ssrRenderList(unref(comparisonItems), (item) => {
                _push2(`<td class="${ssrRenderClass([isDifferent(group) ? "bg-amber-50/80 font-bold text-black" : "", "p-3 text-center text-xs"])}" data-v-45180191>${ssrInterpolate(getPropertyValue(item, group))}</td>`);
              });
              _push2(`<!--]--></tr>`);
            });
            _push2(`<!--]--></tbody></table></div>`);
            if (unref(aiRecommendation)) {
              _push2(`<div class="mt-6 p-5 bg-blue-50 border-l-2 border-blue-400 text-sm text-blue-900 font-sans leading-relaxed animate-fade-in" data-v-45180191><p class="font-tech font-bold uppercase text-xs mb-2 flex items-center gap-1.5" data-v-45180191>`);
              _push2(ssrRenderComponent(unref(Sparkles), { class: "w-3.5 h-3.5" }, null, _parent));
              _push2(` AI odporúčanie</p> ${ssrInterpolate(unref(aiRecommendation))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(shareUrl)) {
              _push2(`<div class="mt-4 flex items-center gap-2 p-3 bg-gray-50 border border-gray-100" data-v-45180191><input${ssrRenderAttr("value", unref(shareUrl))} readonly class="flex-1 text-xs text-gray-600 bg-transparent focus:outline-none font-mono truncate" data-v-45180191><button class="text-gray-400 hover:text-brand flex-shrink-0" data-v-45180191>`);
              _push2(ssrRenderComponent(unref(Copy), { class: "w-4 h-4" }, null, _parent));
              _push2(`</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--]-->`);
          }
          _push2(`</div>`);
          if (unref(comparisonCount) >= 2) {
            _push2(`<div class="flex flex-wrap items-center gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0 bg-white" data-v-45180191><button${ssrIncludeBooleanAttr(unref(aiLoading)) ? " disabled" : ""} class="flex items-center gap-2 px-5 py-2.5 bg-brand text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand-dark transition-colors disabled:opacity-50" data-v-45180191>`);
            if (unref(aiLoading)) {
              _push2(ssrRenderComponent(unref(Loader2), { class: "w-3.5 h-3.5 animate-spin" }, null, _parent));
            } else {
              _push2(ssrRenderComponent(unref(Sparkles), { class: "w-3.5 h-3.5" }, null, _parent));
            }
            _push2(` AI odporúčanie </button><button${ssrIncludeBooleanAttr(unref(shareLoading)) ? " disabled" : ""} class="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-[11px] font-bold uppercase tracking-widest hover:border-black transition-colors disabled:opacity-50" data-v-45180191>`);
            if (unref(shareLoading)) {
              _push2(ssrRenderComponent(unref(Loader2), { class: "w-3.5 h-3.5 animate-spin" }, null, _parent));
            } else if (unref(copied)) {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(unref(Check), { class: "w-3.5 h-3.5 text-green-600" }, null, _parent));
              _push2(` Skopírované<!--]-->`);
            } else {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(unref(Share2), { class: "w-3.5 h-3.5" }, null, _parent));
              _push2(` Uložiť a zdieľať<!--]-->`);
            }
            _push2(`</button><button class="flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors ml-auto" data-v-45180191>`);
            _push2(ssrRenderComponent(unref(Trash2), { class: "w-3.5 h-3.5" }, null, _parent));
            _push2(` Vymazať </button></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ComparisonModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ComparisonModal = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-45180191"]]), { __name: "ComparisonModal" });

export { ComparisonModal as default };
