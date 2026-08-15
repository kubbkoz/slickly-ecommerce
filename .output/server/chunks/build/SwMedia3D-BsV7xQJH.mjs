import { defineComponent, withAsyncContext, computed, resolveComponent, unref, mergeProps, withCtx, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { useGLTF, OrbitControls } from '@tresjs/cientos';
import { TresCanvas } from '@tresjs/core';
import { NoToneMapping, SRGBColorSpace, BasicShadowMap } from 'three';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwMedia3D",
  __ssrInlineRender: true,
  props: {
    src: {}
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const gl = {
      clearColor: "#FFF",
      shadows: true,
      alpha: false,
      shadowMapType: BasicShadowMap,
      outputColorSpace: SRGBColorSpace,
      toneMapping: NoToneMapping,
      windowSize: false
    };
    const { state } = ([__temp, __restore] = withAsyncContext(() => useGLTF(props.src)), __temp = await __temp, __restore(), __temp);
    const model = computed(() => state.value?.scene);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TresPerspectiveCamera = resolveComponent("TresPerspectiveCamera");
      const _component_primitive = resolveComponent("primitive");
      const _component_TresDirectionalLight = resolveComponent("TresDirectionalLight");
      const _component_TresAmbientLight = resolveComponent("TresAmbientLight");
      _push(ssrRenderComponent(unref(TresCanvas), mergeProps(gl, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_TresPerspectiveCamera, {
              args: [75, 1, 0.1, 2e3],
              position: [0, 0, 500],
              "look-at": [0, 0, 0]
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(OrbitControls), null, null, _parent2, _scopeId));
            if (model.value) {
              _push2(ssrRenderComponent(_component_primitive, { object: model.value }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_TresDirectionalLight, {
              position: [3, 3, 3],
              intensity: 1
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_TresAmbientLight, { intensity: 2 }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_TresPerspectiveCamera, {
                args: [75, 1, 0.1, 2e3],
                position: [0, 0, 500],
                "look-at": [0, 0, 0]
              }),
              createVNode(unref(OrbitControls)),
              model.value ? (openBlock(), createBlock(_component_primitive, {
                key: 0,
                object: model.value
              }, null, 8, ["object"])) : createCommentVNode("", true),
              createVNode(_component_TresDirectionalLight, {
                position: [3, 3, 3],
                intensity: 1
              }),
              createVNode(_component_TresAmbientLight, { intensity: 2 })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwMedia3D.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
