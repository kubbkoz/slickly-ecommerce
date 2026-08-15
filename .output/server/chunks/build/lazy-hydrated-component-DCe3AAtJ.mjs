import { defineComponent, defineAsyncComponent, h, mergeProps, hydrateOnVisible } from 'vue';
import { j as useNuxtApp } from './server.mjs';

function defineLazyComponent(props, defineStrategy) {
  return (id, loader) => defineComponent({
    inheritAttrs: false,
    props,
    emits: ["hydrated"],
    setup(props2, ctx) {
      {
        const nuxtApp = useNuxtApp();
        nuxtApp.hook("app:rendered", ({ ssrContext }) => {
          ssrContext.modules.delete(id);
        });
      }
      const child = defineAsyncComponent({ loader });
      const comp = defineAsyncComponent({
        hydrate: defineStrategy(props2),
        loader: () => Promise.resolve(child)
      });
      const onVnodeMounted = () => {
        ctx.emit("hydrated");
      };
      return () => h(comp, mergeProps(ctx.attrs, { onVnodeMounted }), ctx.slots);
    }
  });
}
const createLazyVisibleComponent = defineLazyComponent(
  {
    hydrateOnVisible: {
      type: [Object, Boolean],
      required: false,
      default: true
    }
  },
  (props) => hydrateOnVisible(props.hydrateOnVisible === true ? void 0 : props.hydrateOnVisible)
);

export { createLazyVisibleComponent as c };
