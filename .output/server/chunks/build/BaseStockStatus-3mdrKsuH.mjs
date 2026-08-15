import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, m as useI18n } from './server.mjs';
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
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseStockStatus",
  __ssrInlineRender: true,
  props: {
    stock: {},
    availableStock: {},
    isCloseout: { type: Boolean },
    restockTime: {}
  },
  setup(__props) {
    const props = __props;
    const { t } = useI18n();
    const effectiveStock = computed(() => props.availableStock ?? props.stock ?? 0);
    const isAvailable = computed(() => effectiveStock.value > 0);
    const status = computed(() => {
      if (isAvailable.value) {
        return {
          dotClass: "bg-success shadow-[0_0_8px_rgba(82,166,63,0.5)]",
          text: `${t("availability_inStock")} ${effectiveStock.value >= 3 ? "> 3ks" : `${effectiveStock.value}ks`}`
        };
      }
      if (!props.isCloseout) {
        return {
          dotClass: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]",
          text: t("availability_restockTime", { days: props.restockTime || 4 })
        };
      }
      return {
        dotClass: "bg-brand shadow-[0_0_8px_rgba(182,0,5,0.4)]",
        text: t("availability_soldOut")
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "flex items-center gap-2 animate-fade-in",
        "aria-live": "polite"
      }, _attrs))} data-v-f911bc97><div class="relative flex items-center justify-center w-2 h-2" data-v-f911bc97><div class="${ssrRenderClass([status.value.dotClass.split(" ")[0], "absolute inset-0 rounded-full animate-breathe opacity-40"])}" data-v-f911bc97></div><div class="${ssrRenderClass([status.value.dotClass, "relative w-2 h-2 rounded-full shrink-0"])}" aria-hidden="true" data-v-f911bc97></div></div><span class="text-[10px] md:text-[11px] font-bold uppercase tracking-tight font-sans whitespace-nowrap text-black" data-v-f911bc97>${ssrInterpolate(status.value.text)}</span></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/BaseStockStatus.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BaseStockStatus = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-f911bc97"]]), { __name: "BaseStockStatus" });

export { BaseStockStatus as default };
