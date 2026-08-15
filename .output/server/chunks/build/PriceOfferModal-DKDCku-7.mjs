import { defineComponent, ref, computed, watch, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, Fragment, createTextVNode, toDisplayString, withDirectives, isRef, vModelText, renderList, vModelSelect, createCommentVNode, vModelCheckbox, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
import { Check, Loader2, Zap } from 'lucide-vue-next';
import __nuxt_component_2 from './AppModal-CMHCLJuP.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PriceOfferModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    product: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const name = ref("");
    const email = ref("");
    const phone = ref("");
    const selectedVariant = ref("");
    const competitorUrl = ref("");
    const gdprConsent = ref(false);
    const honeypot = ref("");
    const state = ref("idle");
    const errorMsg = ref("");
    const variants = computed(
      () => props.product?.variants?.map((v) => ({ value: v.id, label: v.size })) || []
    );
    const isValid = computed(
      () => name.value.trim() && email.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) && gdprConsent.value
    );
    watch(() => props.isOpen, (open) => {
      if (open) {
        state.value = "idle";
        errorMsg.value = "";
      }
    });
    const handleSubmit = async () => {
      if (!isValid.value || state.value === "loading") return;
      state.value = "loading";
      try {
        const res = await $fetch("/api/price-offer/submit", {
          method: "POST",
          body: {
            name: name.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim() || void 0,
            productId: props.product?.id,
            productName: props.product?.name,
            variantLabel: selectedVariant.value || void 0,
            competitorUrl: competitorUrl.value.trim() || void 0,
            gdprConsent: gdprConsent.value,
            website: honeypot.value
          }
        });
        if (res.success) {
          state.value = "success";
        } else {
          state.value = "error";
          errorMsg.value = res.error || "Nastala chyba.";
        }
      } catch {
        state.value = "error";
        errorMsg.value = "Nastala chyba pri odosielaní.";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(__nuxt_component_2, mergeProps({
        "is-open": __props.isOpen,
        title: "Dopyt na cenovú ponuku",
        onClose: ($event) => emit("close")
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="px-2 py-4"${_scopeId}>`);
            if (unref(state) === "success") {
              _push2(`<div class="text-center py-8 animate-fade-in"${_scopeId}><div class="w-16 h-16 bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Check), { class: "w-8 h-8 text-green-600" }, null, _parent2, _scopeId));
              _push2(`</div><h3 class="font-tech font-bold uppercase text-lg mb-2"${_scopeId}>Dopyt odoslaný</h3><p class="text-gray-500 text-sm font-sans mb-6"${_scopeId}>Ďakujeme za Váš záujem. Ozveme sa Vám čo najskôr s cenovou ponukou.</p><button class="px-8 py-3 bg-black text-white font-tech font-bold uppercase tracking-widest text-sm hover:bg-brand transition-colors"${_scopeId}>Zavrieť</button></div>`);
            } else {
              _push2(`<!--[--><p class="text-sm text-gray-500 font-sans mb-6"${_scopeId}>Zanechajte nám kontakt a pripravíme Vám cenovú ponuku pre <strong class="text-black"${_scopeId}>${ssrInterpolate(__props.product?.name)}</strong>.</p><div class="space-y-4"${_scopeId}><div${_scopeId}><label class="form-label"${_scopeId}>Meno *</label><input${ssrRenderAttr("value", unref(name))} type="text" class="form-input w-full" placeholder="Vaše meno"${_scopeId}></div><div${_scopeId}><label class="form-label"${_scopeId}>Email *</label><input${ssrRenderAttr("value", unref(email))} type="email" class="form-input w-full" placeholder="vas@email.sk"${_scopeId}></div><div${_scopeId}><label class="form-label"${_scopeId}>Telefón</label><input${ssrRenderAttr("value", unref(phone))} type="tel" class="form-input w-full" placeholder="+421 ..."${_scopeId}></div>`);
              if (unref(variants).length > 1) {
                _push2(`<div${_scopeId}><label class="form-label"${_scopeId}>Variant</label><select class="form-input w-full"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedVariant)) ? ssrLooseContain(unref(selectedVariant), "") : ssrLooseEqual(unref(selectedVariant), "")) ? " selected" : ""}${_scopeId}>Neurčený</option><!--[-->`);
                ssrRenderList(unref(variants), (v) => {
                  _push2(`<option${ssrRenderAttr("value", v.label)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedVariant)) ? ssrLooseContain(unref(selectedVariant), v.label) : ssrLooseEqual(unref(selectedVariant), v.label)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(v.label)}</option>`);
                });
                _push2(`<!--]--></select></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div${_scopeId}><label class="form-label"${_scopeId}>Našli ste lepšiu cenu? (voliteľné)</label><input${ssrRenderAttr("value", unref(competitorUrl))} type="url" class="form-input w-full" placeholder="https://..."${_scopeId}></div><div class="absolute -left-[9999px]" aria-hidden="true"${_scopeId}><input${ssrRenderAttr("value", unref(honeypot))} type="text" name="website" tabindex="-1" autocomplete="off"${_scopeId}></div><label class="flex items-start gap-2 cursor-pointer"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(gdprConsent)) ? ssrLooseContain(unref(gdprConsent), null) : unref(gdprConsent)) ? " checked" : ""} type="checkbox" class="mt-1 w-4 h-4 accent-brand flex-shrink-0"${_scopeId}><span class="text-xs text-gray-500 font-sans"${_scopeId}>Súhlasím so spracovaním osobných údajov za účelom spracovania cenovej ponuky. *</span></label></div>`);
              if (unref(errorMsg)) {
                _push2(`<p class="text-sm text-red-500 mt-3"${_scopeId}>${ssrInterpolate(unref(errorMsg))}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<button${ssrIncludeBooleanAttr(!unref(isValid) || unref(state) === "loading") ? " disabled" : ""} class="w-full mt-6 py-4 bg-brand text-white font-tech font-bold uppercase tracking-widest text-sm hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"${_scopeId}>`);
              if (unref(state) === "loading") {
                _push2(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(unref(Zap), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              }
              _push2(` ${ssrInterpolate(unref(state) === "loading" ? "Odosielam..." : "Odoslať dopyt")}</button><!--]-->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "px-2 py-4" }, [
                unref(state) === "success" ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center py-8 animate-fade-in"
                }, [
                  createVNode("div", { class: "w-16 h-16 bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6" }, [
                    createVNode(unref(Check), { class: "w-8 h-8 text-green-600" })
                  ]),
                  createVNode("h3", { class: "font-tech font-bold uppercase text-lg mb-2" }, "Dopyt odoslaný"),
                  createVNode("p", { class: "text-gray-500 text-sm font-sans mb-6" }, "Ďakujeme za Váš záujem. Ozveme sa Vám čo najskôr s cenovou ponukou."),
                  createVNode("button", {
                    onClick: ($event) => emit("close"),
                    class: "px-8 py-3 bg-black text-white font-tech font-bold uppercase tracking-widest text-sm hover:bg-brand transition-colors"
                  }, "Zavrieť", 8, ["onClick"])
                ])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                  createVNode("p", { class: "text-sm text-gray-500 font-sans mb-6" }, [
                    createTextVNode("Zanechajte nám kontakt a pripravíme Vám cenovú ponuku pre "),
                    createVNode("strong", { class: "text-black" }, toDisplayString(__props.product?.name), 1),
                    createTextVNode(".")
                  ]),
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "form-label" }, "Meno *"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => isRef(name) ? name.value = $event : null,
                        type: "text",
                        class: "form-input w-full",
                        placeholder: "Vaše meno"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(name)]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "form-label" }, "Email *"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
                        type: "email",
                        class: "form-input w-full",
                        placeholder: "vas@email.sk"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(email)]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "form-label" }, "Telefón"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => isRef(phone) ? phone.value = $event : null,
                        type: "tel",
                        class: "form-input w-full",
                        placeholder: "+421 ..."
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(phone)]
                      ])
                    ]),
                    unref(variants).length > 1 ? (openBlock(), createBlock("div", { key: 0 }, [
                      createVNode("label", { class: "form-label" }, "Variant"),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => isRef(selectedVariant) ? selectedVariant.value = $event : null,
                        class: "form-input w-full"
                      }, [
                        createVNode("option", { value: "" }, "Neurčený"),
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(variants), (v) => {
                          return openBlock(), createBlock("option", {
                            key: v.value,
                            value: v.label
                          }, toDisplayString(v.label), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, unref(selectedVariant)]
                      ])
                    ])) : createCommentVNode("", true),
                    createVNode("div", null, [
                      createVNode("label", { class: "form-label" }, "Našli ste lepšiu cenu? (voliteľné)"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => isRef(competitorUrl) ? competitorUrl.value = $event : null,
                        type: "url",
                        class: "form-input w-full",
                        placeholder: "https://..."
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(competitorUrl)]
                      ])
                    ]),
                    createVNode("div", {
                      class: "absolute -left-[9999px]",
                      "aria-hidden": "true"
                    }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => isRef(honeypot) ? honeypot.value = $event : null,
                        type: "text",
                        name: "website",
                        tabindex: "-1",
                        autocomplete: "off"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(honeypot)]
                      ])
                    ]),
                    createVNode("label", { class: "flex items-start gap-2 cursor-pointer" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => isRef(gdprConsent) ? gdprConsent.value = $event : null,
                        type: "checkbox",
                        class: "mt-1 w-4 h-4 accent-brand flex-shrink-0"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelCheckbox, unref(gdprConsent)]
                      ]),
                      createVNode("span", { class: "text-xs text-gray-500 font-sans" }, "Súhlasím so spracovaním osobných údajov za účelom spracovania cenovej ponuky. *")
                    ])
                  ]),
                  unref(errorMsg) ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-sm text-red-500 mt-3"
                  }, toDisplayString(unref(errorMsg)), 1)) : createCommentVNode("", true),
                  createVNode("button", {
                    onClick: handleSubmit,
                    disabled: !unref(isValid) || unref(state) === "loading",
                    class: "w-full mt-6 py-4 bg-brand text-white font-tech font-bold uppercase tracking-widest text-sm hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  }, [
                    unref(state) === "loading" ? (openBlock(), createBlock(unref(Loader2), {
                      key: 0,
                      class: "w-4 h-4 animate-spin"
                    })) : (openBlock(), createBlock(unref(Zap), {
                      key: 1,
                      class: "w-4 h-4"
                    })),
                    createTextVNode(" " + toDisplayString(unref(state) === "loading" ? "Odosielam..." : "Odoslať dopyt"), 1)
                  ], 8, ["disabled"])
                ], 64))
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/PriceOfferModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PriceOfferModal = Object.assign(_sfc_main, { __name: "PriceOfferModal" });

export { PriceOfferModal as default };
