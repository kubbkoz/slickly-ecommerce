import { defineComponent, computed, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { FileText, Download } from 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DownloadsTab",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  setup(__props) {
    const props = __props;
    const manufacturerName = computed(
      () => props.product?.manufacturer?.translated?.name || props.product?.manufacturer?.name || props.product?.brand || ""
    );
    const files = ref([]);
    const pending = ref(true);
    const fetchFiles = async () => {
      if (!manufacturerName.value) {
        pending.value = false;
        return;
      }
      try {
        files.value = await $fetch(`/api/downloads/${encodeURIComponent(manufacturerName.value)}`);
      } catch {
        files.value = [];
      }
      pending.value = false;
    };
    watch(manufacturerName, fetchFiles);
    const formatSize = (bytes) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };
    const formatType = (mime) => {
      if (mime.includes("pdf")) return "PDF";
      if (mime.includes("zip") || mime.includes("compressed")) return "ZIP";
      if (mime.includes("image")) return "IMG";
      return mime.split("/").pop()?.toUpperCase() || "FILE";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in font-sans" }, _attrs))}>`);
      if (unref(pending)) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
        ssrRenderList(2, (i) => {
          _push(`<div class="flex items-center gap-4 p-4 border border-gray-100"><div class="w-10 h-10 bg-gray-100 rounded-full animate-pulse flex-shrink-0"></div><div class="flex-1 space-y-2"><div class="h-3 bg-gray-100 animate-pulse w-3/4"></div><div class="h-2 bg-gray-50 animate-pulse w-1/3"></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(files).length) {
        _push(`<div class="py-6 text-gray-400 text-sm italic"> Pre tohto výrobcu nie sú dostupné žiadne dokumenty na stiahnutie. </div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
        ssrRenderList(unref(files), (file) => {
          _push(`<a${ssrRenderAttr("href", file.url)} target="_blank" rel="noopener noreferrer"${ssrRenderAttr("download", file.fileName)} class="flex items-center justify-between p-4 border border-gray-200 hover:border-brand hover:shadow-md transition-all cursor-pointer group"><div class="flex items-center"><div class="w-10 h-10 bg-gray-100 group-hover:bg-brand/10 rounded-full flex items-center justify-center mr-4 text-gray-500 group-hover:text-brand flex-shrink-0">`);
          _push(ssrRenderComponent(unref(FileText), { class: "w-5 h-5" }, null, _parent));
          _push(`</div><div><h5 class="font-bold text-gray-900 uppercase text-sm">${ssrInterpolate(file.title)}</h5><p class="text-xs text-gray-500">${ssrInterpolate(formatType(file.mimeType))}, ${ssrInterpolate(formatSize(file.fileSize))}</p></div></div>`);
          _push(ssrRenderComponent(unref(Download), { class: "w-5 h-5 text-gray-400 group-hover:text-brand flex-shrink-0" }, null, _parent));
          _push(`</a>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/tabs/DownloadsTab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DownloadsTab = Object.assign(_sfc_main, { __name: "DownloadsTab" });

export { DownloadsTab as default };
