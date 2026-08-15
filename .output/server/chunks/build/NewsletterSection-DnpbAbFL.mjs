import __nuxt_component_0 from './Checkbox-DT7ZMZZl.mjs';
import { defineComponent, useModel, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "NewsletterSection",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    disabled: { type: Boolean, default: false },
    confirmationNeeded: { type: Boolean, default: false }
  }, {
    "modelValue": { type: Boolean, ...{
      required: true
    } },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormCheckbox = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_FormCheckbox, {
        modelValue: model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        label: _ctx.$t("account.overview.newsletter.subscriptionLabel"),
        disabled: __props.disabled
      }, null, _parent));
      if (__props.confirmationNeeded) {
        _push(`<p class="text-sm text-states-error mb-2">${ssrInterpolate(_ctx.$t("account.overview.newsletter.confirmationNeeded"))}</p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/NewsletterSection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main, { __name: "AccountNewsletterSection" });

export { __nuxt_component_4 as default };
