import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { u as useCmsElementConfig } from './useCmsElementConfig-DY8wkVjg.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsElementVimeoVideo",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { getConfigValue } = useCmsElementConfig(props.content);
    const vimeoConfigMapping = {
      byLine: "byline",
      color: "color",
      doNotTrack: "dnt",
      loop: "loop",
      mute: "mute",
      title: "title",
      portrait: "portrait",
      controls: "controls",
      videoID: "videoID",
      autoplay: "autoplay",
      previewMedia: "previewMedia",
      needsConfirmation: "needsConfirmation"
    };
    const videoUrl = ref(
      `https://player.vimeo.com/video/${getConfigValue("videoID")}?`
    );
    const convertAttr = (value, configKey) => {
      if (configKey === "color")
        return value ? `${vimeoConfigMapping[configKey]}=${value}&`.replace("#", "") : "";
      return value ? `${vimeoConfigMapping[configKey]}=${value}&` : "";
    };
    for (const key in props.content.config) {
      if (Object.prototype.hasOwnProperty.call(vimeoConfigMapping, key)) {
        videoUrl.value += convertAttr(
          props.content.config[key].value,
          key
        );
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "cms-element-vimeo-video" }, _attrs))}><iframe class="w-full inset-0 aspect-video"${ssrRenderAttr("src", videoUrl.value.replace(/ /g, ""))}></iframe></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementVimeoVideo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsElementVimeoVideo = Object.assign(_sfc_main, { __name: "CmsElementVimeoVideo" });

export { CmsElementVimeoVideo as default };
