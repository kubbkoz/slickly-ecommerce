import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Notification",
  __ssrInlineRender: true,
  props: {
    notification: {}
  },
  emits: ["click:close"],
  setup(__props) {
    const props = __props;
    const colorCssMap = {
      info: "blue",
      success: "green",
      warning: "orange",
      danger: "red"
    };
    const iconsMap = {
      info: "information",
      success: "checkmark",
      warning: "warning-alt",
      danger: "close-outline"
    };
    const themeTypeColor = computed(
      () => colorCssMap[props.notification.type] || "blue"
    );
    const icon = computed(() => iconsMap[props.notification.type] || "information");
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.notification.message.length > 0) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          id: `toast-${__props.notification.id}`,
          "data-testid": `notification-element-${__props.notification.type}`,
          class: "flex items-center w-full max-w-xs p-4 mb-4 bg-white rounded-lg shadow",
          role: "alert"
        }, _attrs))}><div class="${ssrRenderClass([`text-${unref(themeTypeColor)}-500 bg-${unref(themeTypeColor)}-100`, "inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"])}"><div class="${ssrRenderClass(`w-5 h-5 i-carbon-${unref(icon)}`)}"></div></div><div data-testid="notification-element-message" class="ml-3 text-sm font-normal">${ssrInterpolate(__props.notification.message)}</div><button data-testid="notification-element-button" type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8"${ssrRenderAttr("data-dismiss-target", `toast-${__props.notification.id}`)}${ssrRenderAttr("aria-label", _ctx.$t("layout.ariaLabels.closeNotification"))}><span class="sr-only">${ssrInterpolate(_ctx.$t("close"))}</span><div class="w-5 h-5 i-carbon-close"></div></button></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/Notification.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "LayoutNotification" });

export { __nuxt_component_0 as default };
