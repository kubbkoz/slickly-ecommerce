import __nuxt_component_0 from './Notification-aCZKxyOH.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { K as useNotifications } from './server.mjs';
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
  __name: "Notifications",
  __ssrInlineRender: true,
  setup(__props) {
    const { notifications, removeOne } = useNotifications();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LayoutNotification = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-testid": "notification-container",
        class: "fixed right-5 bottom-10 sm:top-20 z-50 max-h-fit"
      }, _attrs))}><!--[-->`);
      ssrRenderList(unref(notifications), (notification) => {
        _push(ssrRenderComponent(_component_LayoutNotification, {
          key: notification.id,
          notification,
          "onClick:close": ($event) => unref(removeOne)(notification.id)
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/Notifications.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Notifications = Object.assign(_sfc_main, { __name: "LayoutNotifications" });

export { Notifications as default };
