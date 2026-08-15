import { defineComponent, computed, mergeProps, unref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { Info, Box, CircleDot, Disc, Settings, Layers, Zap, AlertTriangle } from 'lucide-vue-next';
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
  __name: "SpecsTab",
  __ssrInlineRender: true,
  props: {
    product: {},
    availableSizes: {},
    singleColumn: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const realSpecs = computed(() => {
      const propsArray = props.product?.properties || props.product?._raw?.properties || [];
      const map = /* @__PURE__ */ new Map();
      propsArray.forEach((p) => {
        let gName = p.group?.translated?.name || p.group?.name;
        const pName = p.translated?.name || p.name;
        if (gName?.toLowerCase() === "riadidla" || gName?.toUpperCase() === "RIADIDLA") {
          gName = "Riadidlá";
        }
        if (gName && pName) {
          if (!map.has(gName)) map.set(gName, []);
          if (!map.get(gName).includes(pName)) {
            map.get(gName).push(pName);
          }
        }
      });
      const specs = [];
      map.forEach((values, key) => {
        specs.push({ key, value: values.join(", ") });
      });
      if (props.product.brand) {
        specs.push({ key: "Značka", value: props.product.brand });
      }
      return specs;
    });
    const groups = computed(() => {
      const g = {
        ebike: { id: "ebike", title: "E-Bike Systém", icon: Zap, iconClass: "text-yellow-500", items: [] },
        frame: { id: "frame", title: "Rám a Odpruženie", icon: Layers, iconClass: "text-brand", items: [] },
        drivetrain: { id: "drivetrain", title: "Pohon a Radenie", icon: Settings, iconClass: "text-gray-500", items: [] },
        brakes: { id: "brakes", title: "Brzdy", icon: Disc, iconClass: "text-red-500", items: [] },
        wheels: { id: "wheels", title: "Kolesá a Plášte", icon: CircleDot, iconClass: "text-blue-500", items: [] },
        components: { id: "components", title: "Komponenty", icon: Box, iconClass: "text-purple-500", items: [] },
        other: { id: "other", title: "Ostatné", icon: Info, iconClass: "text-gray-400", items: [] }
      };
      realSpecs.value.forEach((spec) => {
        const k = spec.key.toLowerCase();
        if (k.includes("motor") || k.includes("batér") || k.includes("kapacit") || k.includes("displej") || k.includes("nabíjačka")) {
          g.ebike.items.push(spec);
        } else if (k.includes("rám") || k.includes("vidlica") || k.includes("vidlic") || k.includes("tlmič") || k.includes("hlavové")) {
          g.frame.items.push(spec);
        } else if (k.includes("prehadzovač") || k.includes("prešmykač") || k.includes("přesmyk") || k.includes("radenie") || k.includes("kľuky") || k.includes("kazeta") || k.includes("reťaz") || k.includes("pedále") || k.includes("rýchlosti") || k.includes("stredov") || k.includes("séri")) {
          g.drivetrain.items.push(spec);
        } else if (k.includes("brzdy") || k.includes("bŕzd") || k.includes("kotúč") || k.includes("brzdov")) {
          g.brakes.items.push(spec);
        } else if (k.includes("ráfiky") || k.includes("plášte") || k.includes("náboj") || k.includes("výplet") || k.includes("kolies") || k.includes("kolesá")) {
          g.wheels.items.push(spec);
        } else if (k.includes("riadidlá") || k.includes("riadidla") || k.includes("predstavec") || k.includes("sedlovka") || k.includes("sedlo") || k.includes("madlá")) {
          g.components.items.push(spec);
        } else {
          g.other.items.push(spec);
        }
      });
      const SORT_ORDER = {
        ebike: ["Motor", "Batéria", "Kapacita batérie", "Displej", "Nabíjačka"],
        frame: ["Rám", "Vidlica", "Typ vidlice"],
        brakes: ["Brzdy", "Typ bŕzd"],
        drivetrain: ["Kľuky", "Pedále", "Reťaz", "Rýchlosti"]
      };
      Object.keys(g).forEach((key) => {
        const groupKey = key;
        const order = SORT_ORDER[groupKey];
        if (order) {
          g[groupKey].items.sort((a, b) => {
            const ai = order.indexOf(a.key);
            const bi = order.indexOf(b.key);
            if (ai !== -1 && bi !== -1) return ai - bi;
            if (ai !== -1) return -1;
            if (bi !== -1) return 1;
            return 0;
          });
        }
      });
      return g;
    });
    const leftColumnKeys = ["ebike", "frame", "drivetrain"];
    const rightColumnKeys = ["brakes", "wheels", "components", "other"];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in font-sans" }, _attrs))} data-v-90741562><div class="${ssrRenderClass(["grid gap-8 mb-16 items-start text-sm", __props.singleColumn ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"])}" data-v-90741562><div class="flex flex-col gap-8" data-v-90741562><!--[-->`);
      ssrRenderList(leftColumnKeys, (key) => {
        _push(`<!--[-->`);
        if (unref(groups)[key].items.length > 0) {
          _push(`<div class="bg-white border border-gray-100 transition-all duration-300 rounded-default overflow-hidden h-fit" data-v-90741562><div class="px-6 py-4 border-b bg-gray-50 border-gray-100 text-gray-900 flex items-center justify-between" data-v-90741562><h4 class="text-lg font-black font-tech uppercase tracking-wide flex items-center" data-v-90741562><span class="mr-3" data-v-90741562>`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(groups)[key].icon), {
            class: ["w-5 h-5", unref(groups)[key].iconClass]
          }, null), _parent);
          _push(`</span> ${ssrInterpolate(unref(groups)[key].title)}</h4></div><div class="divide-y divide-gray-50" data-v-90741562><!--[-->`);
          ssrRenderList(unref(groups)[key].items, (spec, idx) => {
            _push(`<div class="${ssrRenderClass([idx % 2 !== 0 ? "bg-gray-50" : "", "flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-3 hover:bg-gray-100/60 transition-colors gap-1 sm:gap-4"])}" data-v-90741562><span class="text-xs font-bold text-gray-400 uppercase tracking-[0.1em] font-chakra flex-shrink-0" data-v-90741562>${ssrInterpolate(spec.key)}</span><span class="text-[13px] font-bold text-gray-800 text-left sm:text-right font-sans leading-snug max-w-[70%]" data-v-90741562>${ssrInterpolate(spec.value)}</span></div>`);
          });
          _push(`<!--]--></div>`);
          if (key === "drivetrain" && !unref(groups).drivetrain.items.some((i) => i.key.toLowerCase().includes("pedále"))) {
            _push(`<div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex gap-3 items-start" data-v-90741562>`);
            _push(ssrRenderComponent(unref(Info), { class: "w-4 h-4 text-brand shrink-0 mt-0.5" }, null, _parent));
            _push(`<p class="text-[12px] text-gray-600 leading-normal italic" data-v-90741562> Ak produkt nemá uvedené pedále je dodávaný bez nich. </p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div><div class="flex flex-col gap-8" data-v-90741562><!--[-->`);
      ssrRenderList(rightColumnKeys, (key) => {
        _push(`<!--[-->`);
        if (unref(groups)[key].items.length > 0) {
          _push(`<div class="bg-white border border-gray-100 transition-all duration-300 rounded-default overflow-hidden h-fit" data-v-90741562><div class="px-6 py-4 border-b bg-gray-50 border-gray-100 text-gray-900 flex items-center justify-between" data-v-90741562><h4 class="text-lg font-black font-tech uppercase tracking-wide flex items-center" data-v-90741562><span class="mr-3" data-v-90741562>`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(groups)[key].icon), {
            class: ["w-5 h-5", unref(groups)[key].iconClass]
          }, null), _parent);
          _push(`</span> ${ssrInterpolate(unref(groups)[key].title)}</h4></div><div class="divide-y divide-gray-50" data-v-90741562><!--[-->`);
          ssrRenderList(unref(groups)[key].items, (spec, idx) => {
            _push(`<div class="${ssrRenderClass([idx % 2 !== 0 ? "bg-gray-50" : "", "flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-3 hover:bg-gray-100/60 transition-colors gap-1 sm:gap-4"])}" data-v-90741562><span class="text-xs font-bold text-gray-400 uppercase tracking-[0.1em] font-chakra flex-shrink-0" data-v-90741562>${ssrInterpolate(spec.key)}</span><span class="text-[13px] font-bold text-gray-800 text-left sm:text-right font-sans leading-snug max-w-[70%]" data-v-90741562>${ssrInterpolate(spec.value)}</span></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div></div><div class="mt-12 p-6 bg-orange-50 text-[13px] text-orange-900 rounded-default shadow-sm leading-relaxed overflow-hidden relative flex gap-4 items-start border-none" data-v-90741562><div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-400" data-v-90741562></div>`);
      _push(ssrRenderComponent(unref(AlertTriangle), { class: "w-5 h-5 text-orange-500 shrink-0 mt-0.5" }, null, _parent));
      _push(`<div data-v-90741562><strong class="font-chakra uppercase tracking-wider text-xs block mb-1 text-orange-700" data-v-90741562>Dôležité upozornenie</strong><p class="leading-relaxed text-[13px]" data-v-90741562> Výrobca si vyhradzuje právo meniť špecifikácie, farby a parametre bez predchádzajúceho upozornenia. Hmotnosti bicyklov nie sú štandardne udávané, pretože neexistuje jednotná norma váženia. </p></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/tabs/SpecsTab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SpecsTab = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-90741562"]]), { __name: "SpecsTab" });

export { SpecsTab as default };
