import __nuxt_component_2 from './AppModal-CMHCLJuP.mjs';
import { defineComponent, ref, computed, mergeProps, unref, createVNode, resolveDynamicComponent, withCtx, openBlock, createBlock, toDisplayString, createTextVNode, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderComponent, ssrRenderVNode, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Gift, ShoppingBag, UserPlus, Star, MessageSquare, Loader2, Check, Copy, Percent, Truck, Tag } from 'lucide-vue-next';
import { _ as _export_sfc } from './server.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

function useLoyalty() {
  const summary = ref(null);
  const transactions = ref([]);
  const rewards = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const fetchSummary = async () => {
    try {
      const res = await $fetch("/api/loyalty/summary");
      if ("error" in res) {
        summary.value = null;
        return;
      }
      summary.value = res;
    } catch {
      summary.value = null;
    }
  };
  const fetchTransactions = async (page = 1) => {
    try {
      const res = await $fetch("/api/loyalty/transactions", {
        params: { page, limit: 20 }
      });
      transactions.value = res.transactions || [];
    } catch {
      transactions.value = [];
    }
  };
  const fetchRewards = async () => {
    try {
      const res = await $fetch("/api/loyalty/rewards");
      rewards.value = res.rewards || [];
    } catch {
      rewards.value = [];
    }
  };
  const fetchAll = async () => {
    isLoading.value = true;
    error.value = null;
    await Promise.all([fetchSummary(), fetchTransactions(), fetchRewards()]);
    isLoading.value = false;
  };
  const redeemReward = async (rewardId) => {
    try {
      const res = await $fetch("/api/loyalty/redeem", {
        method: "POST",
        body: { rewardId }
      });
      if (res.success) {
        await Promise.all([fetchSummary(), fetchTransactions(), fetchRewards()]);
      }
      return res;
    } catch (e) {
      return { success: false, error: e?.data?.error || "Nepodarilo sa uplatniť odmenu." };
    }
  };
  return { summary, transactions, rewards, isLoading, error, fetchSummary, fetchTransactions, fetchRewards, fetchAll, redeemReward };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AccountTabVernostne",
  __ssrInlineRender: true,
  setup(__props) {
    const { summary, transactions, rewards } = useLoyalty();
    const isLoading = ref(true);
    const redeemModalOpen = ref(false);
    const redeemingId = ref(null);
    const redeemedCode = ref(null);
    const redeemError = ref("");
    const copied = ref(false);
    const copyCode = () => {
      if (!redeemedCode.value) return;
      (void 0).clipboard.writeText(redeemedCode.value.code).catch(() => {
      });
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 3e3);
    };
    const formatPoints = (n) => new Intl.NumberFormat("sk-SK").format(n);
    const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString("sk-SK", { day: "numeric", month: "numeric", year: "numeric" }) : "";
    const formatExpiry = (iso) => iso ? new Date(iso).toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" }) : "";
    const txIcon = (type) => {
      switch (type) {
        case "purchase":
          return ShoppingBag;
        case "registration":
          return UserPlus;
        case "review":
          return Star;
        case "redemption":
          return Tag;
        default:
          return Gift;
      }
    };
    const rewardIcon = (type) => {
      switch (type) {
        case "free_shipping":
          return Truck;
        case "gift":
          return Gift;
        default:
          return Percent;
      }
    };
    const isFoil = computed(() => summary.value?.colorType === "gradient" || summary.value?.levelColor === "foil");
    const levelStyle = computed(() => {
      if (isFoil.value) return {};
      return { backgroundColor: summary.value?.levelColor || "#94A3B8" };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppModal = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white shadow-sm p-8 animate-fade-in" }, _attrs))} data-v-51c575fd>`);
      if (unref(isLoading)) {
        _push(`<div class="space-y-6" data-v-51c575fd><div class="h-40 bg-gray-100 animate-pulse" data-v-51c575fd></div><div class="grid grid-cols-2 md:grid-cols-4 gap-4" data-v-51c575fd><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="h-24 bg-gray-100 animate-pulse" data-v-51c575fd></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else if (unref(summary)) {
        _push(`<!--[--><div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8" data-v-51c575fd><div data-v-51c575fd><h2 class="text-xl font-black uppercase tracking-wide font-tech" data-v-51c575fd>Vernostný program</h2><p class="text-sm text-gray-500 font-sans mt-1" data-v-51c575fd>Zbierajte body a vymeňte ich za zľavy.</p></div><div class="text-right" data-v-51c575fd><span class="block text-[10px] uppercase tracking-widest text-gray-400 font-sans" data-v-51c575fd>Aktuálny stav</span><span class="text-3xl font-black font-tech text-brand" data-v-51c575fd>${ssrInterpolate(formatPoints(unref(summary).availablePoints))} b</span></div></div><div class="${ssrRenderClass([unref(isFoil) ? "foil-gradient" : "bg-black", "relative p-6 md:p-8 text-white overflow-hidden mb-10"])}" style="${ssrRenderStyle(unref(levelStyle))}" data-v-51c575fd>`);
        _push(ssrRenderComponent(unref(Gift), { class: "absolute top-5 right-5 w-24 h-24 opacity-[0.07] pointer-events-none" }, null, _parent));
        _push(`<div class="relative z-10" data-v-51c575fd><span class="text-[10px] uppercase tracking-[0.2em] opacity-70 font-sans" data-v-51c575fd>Úroveň</span><h3 class="text-2xl font-black font-tech uppercase mb-4" data-v-51c575fd>${ssrInterpolate(unref(summary).levelName)}</h3>`);
        if (unref(summary).nextLevel) {
          _push(`<!--[--><div class="flex items-center justify-between text-xs font-tech mb-2" data-v-51c575fd><span data-v-51c575fd>${ssrInterpolate(formatPoints(unref(summary).availablePoints))} b</span><span class="opacity-70" data-v-51c575fd>${ssrInterpolate(formatPoints(unref(summary).nextLevelMinPoints || 0))} b</span></div><div class="h-2 w-full bg-white/20 overflow-hidden" data-v-51c575fd><div class="h-full bg-white transition-all duration-700" style="${ssrRenderStyle({ width: unref(summary).progressPercent + "%" })}" data-v-51c575fd></div></div><p class="text-sm font-sans mt-3 opacity-90" data-v-51c575fd> Chýba vám <strong data-v-51c575fd>${ssrInterpolate(formatPoints(unref(summary).pointsToNextLevel || 0))} b</strong> do úrovne <strong data-v-51c575fd>${ssrInterpolate(unref(summary).nextLevelName)}</strong></p><!--]-->`);
        } else {
          _push(`<p class="text-sm font-sans opacity-90" data-v-51c575fd>Dosiahli ste najvyššiu úroveň.</p>`);
        }
        _push(`</div></div><h3 class="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 font-sans" data-v-51c575fd>Ako zbierať body</h3><div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10" data-v-51c575fd><div class="border border-gray-100 p-4 text-center" data-v-51c575fd>`);
        _push(ssrRenderComponent(unref(ShoppingBag), { class: "w-5 h-5 mx-auto mb-2 text-brand" }, null, _parent));
        _push(`<p class="text-[11px] font-bold uppercase font-tech" data-v-51c575fd>Nákup</p><p class="text-[10px] text-gray-500 font-sans mt-0.5" data-v-51c575fd>hodnota / 10</p></div><div class="border border-gray-100 p-4 text-center" data-v-51c575fd>`);
        _push(ssrRenderComponent(unref(UserPlus), { class: "w-5 h-5 mx-auto mb-2 text-brand" }, null, _parent));
        _push(`<p class="text-[11px] font-bold uppercase font-tech" data-v-51c575fd>Registrácia</p><p class="text-[10px] text-gray-500 font-sans mt-0.5" data-v-51c575fd>+10 b</p></div><div class="border border-gray-100 p-4 text-center" data-v-51c575fd>`);
        _push(ssrRenderComponent(unref(Star), { class: "w-5 h-5 mx-auto mb-2 text-brand" }, null, _parent));
        _push(`<p class="text-[11px] font-bold uppercase font-tech" data-v-51c575fd>Prvá recenzia</p><p class="text-[10px] text-gray-500 font-sans mt-0.5" data-v-51c575fd>+50 b</p></div><div class="border border-gray-100 p-4 text-center" data-v-51c575fd>`);
        _push(ssrRenderComponent(unref(MessageSquare), { class: "w-5 h-5 mx-auto mb-2 text-brand" }, null, _parent));
        _push(`<p class="text-[11px] font-bold uppercase font-tech" data-v-51c575fd>Ďalšie recenzie</p><p class="text-[10px] text-gray-500 font-sans mt-0.5" data-v-51c575fd>+20 b</p></div></div>`);
        if (unref(rewards).length) {
          _push(`<!--[--><h3 class="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 font-sans" data-v-51c575fd>Dostupné odmeny</h3><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10" data-v-51c575fd><!--[-->`);
          ssrRenderList(unref(rewards), (reward) => {
            _push(`<div class="border border-gray-200 p-5 flex flex-col" data-v-51c575fd>`);
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(rewardIcon(reward.type)), { class: "w-6 h-6 text-brand mb-3" }, null), _parent);
            _push(`<p class="font-bold text-sm uppercase font-tech leading-tight mb-1" data-v-51c575fd>${ssrInterpolate(reward.name)}</p>`);
            if (reward.description) {
              _push(`<p class="text-xs text-gray-500 font-sans mb-3 flex-1" data-v-51c575fd>${ssrInterpolate(reward.description)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<p class="text-[10px] text-gray-400 font-sans mb-3" data-v-51c575fd>Platnosť: ${ssrInterpolate(reward.validDays)} dní</p><div class="mt-auto" data-v-51c575fd><p class="font-black font-tech text-lg mb-2" data-v-51c575fd>${ssrInterpolate(formatPoints(reward.pointsRequired))} b</p><button${ssrIncludeBooleanAttr(!reward.canRedeem || unref(redeemingId) === reward.id) ? " disabled" : ""} class="${ssrRenderClass([reward.canRedeem ? "bg-brand text-white hover:bg-brand-dark" : "bg-gray-100 text-gray-400 cursor-not-allowed", "w-full py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"])}" data-v-51c575fd>`);
            if (unref(redeemingId) === reward.id) {
              _push(ssrRenderComponent(unref(Loader2), { class: "w-3.5 h-3.5 animate-spin" }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(` ${ssrInterpolate(reward.canRedeem ? "Generovať kód" : "Málo bodov")}</button></div></div>`);
          });
          _push(`<!--]--></div>`);
          if (unref(redeemError)) {
            _push(`<p class="text-sm text-red-500 mb-6" data-v-51c575fd>${ssrInterpolate(unref(redeemError))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`<h3 class="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 font-sans" data-v-51c575fd>História bodov</h3>`);
        if (unref(transactions).length) {
          _push(`<div class="space-y-3 mb-10" data-v-51c575fd><!--[-->`);
          ssrRenderList(unref(transactions), (tx) => {
            _push(`<div class="flex items-center justify-between pb-3 border-b border-gray-100" data-v-51c575fd><div class="flex items-center gap-3" data-v-51c575fd>`);
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(txIcon(tx.type)), { class: "w-4 h-4 text-gray-400" }, null), _parent);
            _push(`<div data-v-51c575fd><span class="text-sm font-medium text-gray-700 font-sans block" data-v-51c575fd>${ssrInterpolate(tx.description)}</span><span class="text-[10px] text-gray-400 font-sans" data-v-51c575fd>${ssrInterpolate(formatDate(tx.createdAt))}</span></div></div><span class="${ssrRenderClass([tx.points >= 0 ? "text-green-600" : "text-brand", "font-bold font-tech text-sm"])}" data-v-51c575fd>${ssrInterpolate(tx.points >= 0 ? "+" : "")}${ssrInterpolate(formatPoints(tx.points))} b </span></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<p class="text-sm text-gray-400 font-sans mb-10" data-v-51c575fd>Zatiaľ žiadna aktivita.</p>`);
        }
        _push(`<h3 class="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 font-sans" data-v-51c575fd>Prehľad úrovní</h3><div class="space-y-2" data-v-51c575fd><!--[-->`);
        ssrRenderList(unref(summary).levels, (lvl) => {
          _push(`<div class="${ssrRenderClass([lvl.level === unref(summary).level ? "border-brand bg-brand/5" : "border-gray-100", "flex items-center justify-between p-3 border transition-colors"])}" data-v-51c575fd><div class="flex items-center gap-3" data-v-51c575fd><span class="${ssrRenderClass([lvl.colorType === "gradient" ? "foil-gradient" : "", "w-3 h-3 rounded-full flex-shrink-0"])}" style="${ssrRenderStyle(lvl.colorType !== "gradient" ? { backgroundColor: lvl.color } : {})}" data-v-51c575fd></span><span class="${ssrRenderClass([lvl.level === unref(summary).level ? "text-brand" : "text-gray-700", "text-sm font-bold uppercase font-tech"])}" data-v-51c575fd>${ssrInterpolate(lvl.name)}</span></div><span class="text-xs text-gray-500 font-sans" data-v-51c575fd>od ${ssrInterpolate(formatPoints(lvl.minPoints))} b</span></div>`);
        });
        _push(`<!--]--></div><!--]-->`);
      } else {
        _push(`<div class="text-center py-12" data-v-51c575fd>`);
        _push(ssrRenderComponent(unref(Gift), { class: "w-12 h-12 text-gray-200 mx-auto mb-4" }, null, _parent));
        _push(`<p class="text-gray-400 font-sans text-sm" data-v-51c575fd>Vernostný program nie je momentálne dostupný.</p></div>`);
      }
      _push(ssrRenderComponent(_component_AppModal, {
        "is-open": unref(redeemModalOpen),
        title: "Kód vygenerovaný",
        onClose: ($event) => redeemModalOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(redeemedCode)) {
              _push2(`<div class="text-center py-4" data-v-51c575fd${_scopeId}><div class="w-16 h-16 bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6" data-v-51c575fd${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Check), { class: "w-8 h-8 text-green-600" }, null, _parent2, _scopeId));
              _push2(`</div><p class="text-sm text-gray-500 font-sans mb-4" data-v-51c575fd${_scopeId}>Váš zľavový kód je pripravený. Použite ho pri pokladni.</p><div class="flex items-center justify-center gap-2 mb-4" data-v-51c575fd${_scopeId}><span class="text-2xl font-black font-tech tracking-wider bg-gray-100 px-6 py-3" data-v-51c575fd${_scopeId}>${ssrInterpolate(unref(redeemedCode).code)}</span><button class="w-12 h-12 flex items-center justify-center bg-black text-white hover:bg-brand transition-colors" data-v-51c575fd${_scopeId}>`);
              if (unref(copied)) {
                _push2(ssrRenderComponent(unref(Check), { class: "w-5 h-5" }, null, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(unref(Copy), { class: "w-5 h-5" }, null, _parent2, _scopeId));
              }
              _push2(`</button></div><p class="text-xs text-gray-500 font-sans" data-v-51c575fd${_scopeId}>Platnosť do: <strong data-v-51c575fd${_scopeId}>${ssrInterpolate(formatExpiry(unref(redeemedCode).expiresAt))}</strong></p><p class="text-xs text-gray-500 font-sans" data-v-51c575fd${_scopeId}>Odčítané: <strong class="text-brand" data-v-51c575fd${_scopeId}>−${ssrInterpolate(formatPoints(unref(redeemedCode).pointsSpent))} b</strong></p><button class="mt-6 px-8 py-3 bg-black text-white font-tech font-bold uppercase tracking-widest text-sm hover:bg-brand transition-colors" data-v-51c575fd${_scopeId}>Zavrieť</button></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(redeemedCode) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "text-center py-4"
              }, [
                createVNode("div", { class: "w-16 h-16 bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6" }, [
                  createVNode(unref(Check), { class: "w-8 h-8 text-green-600" })
                ]),
                createVNode("p", { class: "text-sm text-gray-500 font-sans mb-4" }, "Váš zľavový kód je pripravený. Použite ho pri pokladni."),
                createVNode("div", { class: "flex items-center justify-center gap-2 mb-4" }, [
                  createVNode("span", { class: "text-2xl font-black font-tech tracking-wider bg-gray-100 px-6 py-3" }, toDisplayString(unref(redeemedCode).code), 1),
                  createVNode("button", {
                    onClick: copyCode,
                    class: "w-12 h-12 flex items-center justify-center bg-black text-white hover:bg-brand transition-colors"
                  }, [
                    unref(copied) ? (openBlock(), createBlock(unref(Check), {
                      key: 0,
                      class: "w-5 h-5"
                    })) : (openBlock(), createBlock(unref(Copy), {
                      key: 1,
                      class: "w-5 h-5"
                    }))
                  ])
                ]),
                createVNode("p", { class: "text-xs text-gray-500 font-sans" }, [
                  createTextVNode("Platnosť do: "),
                  createVNode("strong", null, toDisplayString(formatExpiry(unref(redeemedCode).expiresAt)), 1)
                ]),
                createVNode("p", { class: "text-xs text-gray-500 font-sans" }, [
                  createTextVNode("Odčítané: "),
                  createVNode("strong", { class: "text-brand" }, "−" + toDisplayString(formatPoints(unref(redeemedCode).pointsSpent)) + " b", 1)
                ]),
                createVNode("button", {
                  onClick: ($event) => redeemModalOpen.value = false,
                  class: "mt-6 px-8 py-3 bg-black text-white font-tech font-bold uppercase tracking-widest text-sm hover:bg-brand transition-colors"
                }, "Zavrieť", 8, ["onClick"])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/account/AccountTabVernostne.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_6 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-51c575fd"]]), { __name: "AccountTabVernostne" });
const AccountTabVernostne = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_6
}, Symbol.toStringTag, { value: "Module" }));

export { AccountTabVernostne as A, __nuxt_component_6 as _, useLoyalty as u };
