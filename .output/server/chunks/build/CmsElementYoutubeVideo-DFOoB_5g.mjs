import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { u as useCmsElementConfig } from './useCmsElementConfig-DY8wkVjg.mjs';

const YOUTUBE_URL = "https://www.youtube.com/embed/";
const YOUTUBE_NOCOOKIE_URL = "https://www.youtube-nocookie.com/embed/";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CmsElementYoutubeVideo",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const { getConfigValue } = useCmsElementConfig(props.content);
    const config = computed(() => ({
      videoID: getConfigValue("videoID"),
      relatedVideos: "rel=0&",
      loop: getConfigValue("loop") ? `loop=1&playlist=${getConfigValue("videoID")}&` : "",
      showControls: getConfigValue("showControls") ? "controls=1&" : "controls=0&",
      start: Number.parseInt(getConfigValue("start")) !== 0 ? `start=${getConfigValue("start")}&` : "",
      end: Number.parseInt(getConfigValue("end")) !== 0 ? `end=${getConfigValue("end")}&` : "",
      disableKeyboard: "disablekb=1"
    }));
    const videoDomain = getConfigValue("advancedPrivacyMode") ? YOUTUBE_NOCOOKIE_URL : YOUTUBE_URL;
    const videoUrl = `${videoDomain}            ${config.value.videoID}?            ${config.value.relatedVideos}            ${config.value.loop}            ${config.value.showControls}            ${config.value.start}            ${config.value.end}            ${config.value.disableKeyboard}`.replace(/ /g, "");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "cms-element-youtube-video" }, _attrs))}><iframe class="w-full inset-0 aspect-video"${ssrRenderAttr("src", unref(videoUrl))}></iframe></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementYoutubeVideo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsElementYoutubeVideo = Object.assign(_sfc_main, { __name: "CmsElementYoutubeVideo" });

export { CmsElementYoutubeVideo as default };
