import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderComponent } from 'vue/server-renderer';
import { FileText, X, Loader2, Upload } from 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ReturnFormStep2",
  __ssrInlineRender: true,
  props: {
    formData: {},
    attachments: {},
    warrantyFiles: {},
    reasons: {},
    labels: {},
    errors: {}
  },
  emits: ["add-files", "remove-file"],
  setup(__props, { emit: __emit }) {
    ref(null);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-5" }, _attrs))}><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1"> Meno <span class="text-brand">*</span></label><input${ssrRenderAttr("value", __props.formData.firstName)} type="text" autocomplete="given-name" class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans"></div><div><label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1"> Priezvisko <span class="text-brand">*</span></label><input${ssrRenderAttr("value", __props.formData.lastName)} type="text" autocomplete="family-name" class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans"></div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1"> Telefón <span class="text-brand">*</span></label><input${ssrRenderAttr("value", __props.formData.customerPhone)} type="tel" autocomplete="tel" placeholder="+421 9XX XXX XXX" class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans"></div><div><label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1"> IBAN `);
      if (__props.labels.ibanRequired) {
        _push(`<span class="text-brand">*</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><input${ssrRenderAttr("value", __props.formData.bankAccount)} type="text" placeholder="SK00 0000 0000 0000 0000 0000" class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans">`);
      if (!__props.labels.ibanRequired) {
        _push(`<p class="text-[10px] text-gray-400 mt-1">Voliteľné pre reklamáciu</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div><label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1"> Adresa (ulica, PSČ, mesto) <span class="text-brand">*</span></label><textarea rows="2" autocomplete="street-address" class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans resize-y">${ssrInterpolate(__props.formData.customerAddress)}</textarea></div><div><label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">${ssrInterpolate(__props.labels.items)} <span class="text-brand">*</span></label><textarea rows="3" placeholder="Uveďte názov produktu, množstvo…" class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans resize-y">${ssrInterpolate(__props.formData.itemsDescription)}</textarea></div><div><label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">${ssrInterpolate(__props.labels.reasonCat)}</label><select class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans bg-white"><!--[-->`);
      ssrRenderList(__props.reasons, (r) => {
        _push(`<option${ssrRenderAttr("value", r.value)}${ssrIncludeBooleanAttr(Array.isArray(__props.formData.reasonCategory) ? ssrLooseContain(__props.formData.reasonCategory, r.value) : ssrLooseEqual(__props.formData.reasonCategory, r.value)) ? " selected" : ""}>${ssrInterpolate(r.label)}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">${ssrInterpolate(__props.labels.reasonDetail)} <span class="text-brand">*</span></label><textarea rows="4"${ssrRenderAttr("placeholder", __props.labels.reasonPh)} class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans resize-y">${ssrInterpolate(__props.formData.reasonDetail)}</textarea></div>`);
      if (__props.labels.warranty) {
        _push(`<div><label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1"> Záručný list <span class="text-brand">*</span></label><div class="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer hover:border-brand transition-colors">`);
        _push(ssrRenderComponent(unref(FileText), { class: "w-8 h-8 mx-auto text-gray-300 mb-2" }, null, _parent));
        _push(`<p class="text-xs"><strong>Nahrať záručný list</strong> – presuňte alebo kliknite</p><p class="text-[10px] text-gray-400">JPG, PNG, PDF · max 10 MB/súbor</p></div><input type="file" multiple accept="image/*,application/pdf" class="hidden">`);
        if (__props.warrantyFiles.length) {
          _push(`<div class="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2"><!--[-->`);
          ssrRenderList(__props.warrantyFiles, (f, i) => {
            _push(`<div class="relative border border-gray-200 p-2 text-xs"><button type="button" class="absolute -top-2 -right-2 w-5 h-5 bg-brand text-white rounded-full flex items-center justify-center">`);
            _push(ssrRenderComponent(unref(X), { class: "w-3 h-3" }, null, _parent));
            _push(`</button>`);
            if (f.previewUrl) {
              _push(`<img${ssrRenderAttr("src", f.previewUrl)} class="w-full h-16 object-cover mb-1">`);
            } else {
              _push(ssrRenderComponent(unref(FileText), { class: "w-8 h-8 mx-auto text-gray-400 mb-1" }, null, _parent));
            }
            _push(`<p class="truncate font-bold">${ssrInterpolate(f.file.name)}</p>`);
            if (f.uploading) {
              _push(`<p class="text-gray-400 text-[10px] flex items-center">`);
              _push(ssrRenderComponent(unref(Loader2), { class: "w-3 h-3 animate-spin mr-1" }, null, _parent));
              _push(` Nahrávam… </p>`);
            } else if (f.error) {
              _push(`<p class="text-brand text-[10px]">${ssrInterpolate(f.error)}</p>`);
            } else {
              _push(`<p class="text-green-600 text-[10px]">✓ Nahraté</p>`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div><label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1"> Fotografie / videá </label><div class="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer hover:border-brand transition-colors">`);
      _push(ssrRenderComponent(unref(Upload), { class: "w-8 h-8 mx-auto text-gray-300 mb-2" }, null, _parent));
      _push(`<p class="text-xs"><strong>Presuňte súbory sem</strong> alebo kliknite</p><p class="text-[10px] text-gray-400">Max 5 súborov · 10 MB/súbor · JPG, PNG, MP4</p></div><input type="file" multiple accept="image/*,video/mp4,video/quicktime" class="hidden">`);
      if (__props.attachments.length) {
        _push(`<div class="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2"><!--[-->`);
        ssrRenderList(__props.attachments, (f, i) => {
          _push(`<div class="relative border border-gray-200 p-2 text-xs"><button type="button" class="absolute -top-2 -right-2 w-5 h-5 bg-brand text-white rounded-full flex items-center justify-center">`);
          _push(ssrRenderComponent(unref(X), { class: "w-3 h-3" }, null, _parent));
          _push(`</button>`);
          if (f.previewUrl) {
            _push(`<img${ssrRenderAttr("src", f.previewUrl)} class="w-full h-16 object-cover mb-1">`);
          } else {
            _push(ssrRenderComponent(unref(FileText), { class: "w-8 h-8 mx-auto text-gray-400 mb-1" }, null, _parent));
          }
          _push(`<p class="truncate font-bold">${ssrInterpolate(f.file.name)}</p>`);
          if (f.uploading) {
            _push(`<p class="text-gray-400 text-[10px] flex items-center">`);
            _push(ssrRenderComponent(unref(Loader2), { class: "w-3 h-3 animate-spin mr-1" }, null, _parent));
            _push(` Nahrávam… </p>`);
          } else if (f.error) {
            _push(`<p class="text-brand text-[10px]">${ssrInterpolate(f.error)}</p>`);
          } else {
            _push(`<p class="text-green-600 text-[10px]">✓ Nahraté</p>`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.errors.length) {
        _push(`<div class="border border-brand bg-brand/5 p-3 text-xs text-brand"><ul class="list-disc list-inside space-y-1"><!--[-->`);
        ssrRenderList(__props.errors, (err) => {
          _push(`<li>${ssrInterpolate(err)}</li>`);
        });
        _push(`<!--]--></ul></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/returns/ReturnFormStep2.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ReturnFormStep2 = Object.assign(_sfc_main, { __name: "ReturnFormStep2" });

export { ReturnFormStep2 as default };
