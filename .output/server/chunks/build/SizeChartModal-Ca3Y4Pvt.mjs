import { defineComponent, ref, watch, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { Ruler, X } from 'lucide-vue-next';
import BaseButton from './BaseButton-BJMOoNbK.mjs';
import './nuxt-link-B7B0pxEe.mjs';
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
import './server.mjs';
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
  __name: "SizeChartModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    category: {},
    availableSizes: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const riderHeight = ref(178);
    const activeSize = ref("M");
    watch([riderHeight, () => props.availableSizes], ([newHeight, sizes]) => {
      let calculatedSize = "M";
      if (newHeight < 170) calculatedSize = "XS";
      else if (newHeight >= 170 && newHeight < 180) calculatedSize = "S";
      else if (newHeight >= 180 && newHeight < 185) calculatedSize = "M";
      else if (newHeight >= 185 && newHeight < 195) calculatedSize = "L";
      else calculatedSize = "XL";
      if (sizes && sizes.length > 0) {
        if (sizes.includes(calculatedSize)) {
          activeSize.value = calculatedSize;
        } else {
          if (!sizes.includes(activeSize.value)) {
            activeSize.value = sizes[0] || "M";
          }
        }
      } else {
        activeSize.value = calculatedSize;
      }
    }, { immediate: true });
    const geometryData = {
      "XS": { "Wheel Size": '27.5"', "Seat Tube": "440", "Top Tube": "550", "Head Tube": "100", "Reach": "390", "Stack": "590", "Wheelbase": "1140" },
      "S": { "Wheel Size": '29"', "Seat Tube": "480", "Top Tube": "580", "Head Tube": "110", "Reach": "420", "Stack": "605", "Wheelbase": "1170" },
      "M": { "Wheel Size": '29"', "Seat Tube": "503", "Top Tube": "605", "Head Tube": "120", "Reach": "450", "Stack": "615", "Wheelbase": "1200" },
      "L": { "Wheel Size": '29"', "Seat Tube": "520", "Top Tube": "630", "Head Tube": "130", "Reach": "475", "Stack": "630", "Wheelbase": "1230" },
      "XL": { "Wheel Size": '29"', "Seat Tube": "540", "Top Tube": "650", "Head Tube": "145", "Reach": "500", "Stack": "645", "Wheelbase": "1260" }
    };
    const allSizes = ["XS", "S", "M", "L", "XL"];
    const displaySizes = computed(() => props.availableSizes && props.availableSizes.length > 0 ? allSizes.filter((s) => props.availableSizes.includes(s)) : allSizes);
    const sizeLabels = {
      "XS": "XS 49 (155-170cm)",
      "S": "S 52 (170-180cm)",
      "M": "M 54 (175-185cm)",
      "L": "L 56 (180-190cm)",
      "XL": "XL 58 (185-200cm)"
    };
    const currentGeo = computed(() => geometryData[activeSize.value] || geometryData["M"]);
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.isOpen) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans" }, _attrs))}><div class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"></div><div class="relative w-full max-w-5xl bg-white shadow-2xl animate-slide-up rounded-default overflow-hidden flex flex-col max-h-[90vh]"><div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50"><div><h2 class="text-2xl font-black uppercase font-tech tracking-wide mb-1 flex items-center">`);
        _push(ssrRenderComponent(unref(Ruler), { class: "w-6 h-6 mr-2 text-brand" }, null, _parent));
        _push(` TABUĽKA VEĽKOSTÍ A GEOMETRIA RÁMU </h2></div><button class="p-2 hover:bg-gray-200 transition-colors rounded-sm">`);
        _push(ssrRenderComponent(unref(X), { class: "w-6 h-6" }, null, _parent));
        _push(`</button></div><div class="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-10"><div class="flex flex-col lg:flex-row gap-12"><div class="flex-1"><div class="bg-gray-50 p-6 mb-8 border border-gray-100 flex items-center justify-center"><img src="https://www.mt-sport.sk/wp-content/uploads/2025/07/image-58.png.webp" alt="Geometry Diagram" class="w-full h-auto max-h-[300px] object-contain mix-blend-multiply"></div><div class="bg-gray-50 p-6 border border-gray-100"><label class="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 text-center"> Nastavte výšku jazdca: <span class="text-brand text-lg">${ssrInterpolate(riderHeight.value)} cm</span></label><div class="relative px-2"><input type="range" min="155" max="205"${ssrRenderAttr("value", riderHeight.value)} class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"><div class="flex justify-between text-xs text-gray-400 mt-2 font-mono font-bold"><span>155cm</span><span>180cm</span><span>205cm</span></div></div><div class="mt-6 text-center"><span class="text-sm text-gray-600">Odporúčaná veľkosť:</span><div class="text-4xl font-black font-tech text-black mt-1">${ssrInterpolate(activeSize.value)} `);
        if (__props.availableSizes && __props.availableSizes.length > 0 && !__props.availableSizes.includes(activeSize.value)) {
          _push(`<span class="block text-xs text-red-500 font-sans mt-1"> (Momentálne nedostupné) </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div><div class="flex-1"><div class="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4"><!--[-->`);
        ssrRenderList(displaySizes.value, (size) => {
          _push(`<button class="${ssrRenderClass([activeSize.value === size ? "border-brand text-black bg-gray-50" : "border-transparent text-gray-400 hover:text-gray-600", "px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all border-b-4"])}">${ssrInterpolate(size)}</button>`);
        });
        _push(`<!--]--></div><h3 class="text-xl font-bold uppercase font-tech mb-6 text-center lg:text-left">${ssrInterpolate(sizeLabels[activeSize.value] || activeSize.value)}</h3><div class="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4"><!--[-->`);
        ssrRenderList(currentGeo.value, (value, key) => {
          _push(`<div class="text-center"><span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">${ssrInterpolate(key)}</span><span class="block text-xl font-black font-tech text-gray-900">${ssrInterpolate(value)} ${ssrInterpolate(key === "Wheel Size" ? "" : "mm")}</span></div>`);
        });
        _push(`<!--]--><div class="text-center"><span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">BB Drop</span><span class="block text-xl font-black font-tech text-gray-900">70 mm</span></div><div class="text-center"><span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Seat Angle</span><span class="block text-xl font-black font-tech text-gray-900">74°</span></div><div class="text-center"><span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Head Angle</span><span class="block text-xl font-black font-tech text-gray-900">68°</span></div><div class="text-center"><span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Chainstay</span><span class="block text-xl font-black font-tech text-gray-900">435 mm</span></div></div><div class="mt-12 p-4 bg-blue-50 border border-blue-100 text-sm text-blue-800 rounded-default"><p><strong>Tip experta:</strong> Ak sa nachádzate na rozmedzí dvoch veľkostí, pre športovejšiu jazdu zvoľte menší rám, pre komfortnejšiu jazdu zvoľte väčší rám.</p></div></div></div></div><div class="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">`);
        _push(ssrRenderComponent(BaseButton, {
          variant: "ghost",
          onClick: ($event) => emit("close"),
          class: "uppercase text-xs font-bold tracking-widest"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Zatvoriť`);
            } else {
              return [
                createTextVNode("Zatvoriť")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/SizeChartModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SizeChartModal = Object.assign(_sfc_main, { __name: "SizeChartModal" });

export { SizeChartModal as default };
