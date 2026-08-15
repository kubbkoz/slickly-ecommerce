import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwFilterChips",
  __ssrInlineRender: true,
  props: {
    filters: {},
    availableFilters: {}
  },
  emits: ["remove"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const getTranslatedName = (item) => {
      if (!item) return null;
      if ("translated" in item) {
        return item.translated?.name || ("name" in item ? item.name : null) || null;
      }
      return null;
    };
    const activeChips = computed(() => {
      const chips = [];
      const properties = Array.from(props.filters.properties);
      for (const propertyId of properties) {
        for (const filter of props.availableFilters) {
          if ("options" in filter && filter.options) {
            const option = filter.options.find((o) => o.id === propertyId);
            const name = getTranslatedName(option);
            if (name) {
              chips.push({
                label: name,
                code: "properties",
                value: propertyId
              });
              break;
            }
          }
        }
      }
      const manufacturers = Array.from(props.filters.manufacturer);
      for (const manufacturerId of manufacturers) {
        const filter = props.availableFilters.find(
          (f) => f.code === "manufacturer"
        );
        if (filter && "entities" in filter && filter.entities) {
          const entity = filter.entities.find((e) => e.id === manufacturerId);
          const name = getTranslatedName(entity);
          if (name) {
            chips.push({
              label: name,
              code: "manufacturer",
              value: manufacturerId
            });
          }
        }
      }
      if (props.filters["min-price"] || props.filters["max-price"]) {
        const min = props.filters["min-price"] || 0;
        const max = props.filters["max-price"] || "∞";
        chips.push({
          label: `Price: ${min} - ${max}`,
          code: "price",
          value: "price-range"
        });
      }
      if (props.filters.rating) {
        chips.push({
          label: `Rating: ${props.filters.rating}★`,
          code: "rating",
          value: props.filters.rating
        });
      }
      if (props.filters["shipping-free"]) {
        chips.push({
          label: "Free Shipping",
          code: "shipping-free",
          value: "true"
        });
      }
      return chips;
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (activeChips.value.length > 0) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "self-stretch inline-flex justify-start items-center gap-4 flex-wrap content-center mb-6" }, _attrs))}><!--[-->`);
        ssrRenderList(activeChips.value, (chip, index) => {
          _push(`<button class="px-4 py-1.5 bg-brand-tertiary rounded-full inline-flex justify-center items-center gap-1 hover:bg-brand-tertiary-hover transition-colors"><span class="text-brand-on-tertiary text-base font-normal leading-normal">${ssrInterpolate(chip.label)}</span><span class="i-carbon-close w-5 h-5 text-brand-on-tertiary"></span></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwFilterChips.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "SwFilterChips" });

export { __nuxt_component_0 as default };
