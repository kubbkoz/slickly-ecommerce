import { defineComponent, ref, computed, watch, nextTick, unref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderVNode, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _imports_0 } from './MTShape-DBVD8rjd.mjs';
import { HelpCircle, Search, Wrench, ShieldAlert, RotateCcw, Phone, X, MessageSquareMore, Sparkles, ArrowLeft, Send, Loader2, Package } from 'lucide-vue-next';
import { s as sanitizeHtml } from './sanitize-DKvwg8Vq.mjs';
import ChatProductCard from './ChatProductCard-CtgfhJIO.mjs';
import ReturnFormModal from './ReturnFormModal-DM7PpMMO.mjs';
import { _ as _export_sfc, m as useI18n, D as useAppConfig, c as useRouter, b as useLocalePath, f as useUser, g as useState, p as useCookie, o as useDebounceFn } from './server.mjs';
import './nuxt-link-B7B0pxEe.mjs';
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
import './useReturnForm-BPYvUkOC.mjs';
import './ReturnFormStep1-J6OeDrR0.mjs';
import './ReturnFormStep2-DMCLLvW8.mjs';
import './ReturnFormStep3-BmRowXns.mjs';
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
import './ReturnFormSuccess-CYofRI6H.mjs';

function useChatHistory(messages, currentTopicId) {
  const chatSid = useCookie("mtsport-chat-sid", {
    maxAge: 30 * 24 * 60 * 60,
    sameSite: "lax",
    path: "/"
  });
  if (!chatSid.value) {
    chatSid.value = Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  const saveHistory = useDebounceFn(async () => {
    if (!chatSid.value || !messages.value.length) return;
    await $fetch("/api/chat/history", {
      method: "POST",
      body: {
        sid: chatSid.value,
        messages: messages.value.map((m) => ({ role: m.role, text: m.text })),
        topicId: currentTopicId.value
      }
    }).catch(() => null);
  }, 800);
  const loadHistory = async () => {
    if (!chatSid.value) return null;
    return $fetch(`/api/chat/history?sid=${chatSid.value}`).catch(() => null);
  };
  const clearHistory = () => {
    if (!chatSid.value) return;
    $fetch("/api/chat/history", {
      method: "POST",
      body: { sid: chatSid.value, messages: [], topicId: null }
    }).catch(() => null);
  };
  return { chatSid, saveHistory, loadHistory, clearHistory };
}
function useOrderLookup() {
  const form = ref({ orderNumber: "", email: "", firstName: "", lastName: "" });
  const noNumber = ref(false);
  const result = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const reset = () => {
    form.value = { orderNumber: "", email: "", firstName: "", lastName: "" };
    noNumber.value = false;
    result.value = null;
    error.value = null;
  };
  const performLookup = async () => {
    const { orderNumber, email, firstName, lastName } = form.value;
    if (!noNumber.value && !orderNumber.trim()) {
      error.value = "Zadajte číslo objednávky.";
      return;
    }
    if (noNumber.value && (!email.trim() || !lastName.trim())) {
      error.value = "Email a priezvisko sú povinné.";
      return;
    }
    loading.value = true;
    error.value = null;
    result.value = null;
    try {
      const res = await $fetch("/api/orders/status", {
        method: "POST",
        body: {
          orderNumber: !noNumber.value ? orderNumber.trim() : void 0,
          email: email.trim() || void 0,
          firstName: firstName.trim() || void 0,
          lastName: lastName.trim() || void 0
        }
      });
      result.value = res;
      if (!res.found) error.value = res.message;
    } catch {
      error.value = "Chyba pri vyhľadávaní. Skúste neskôr.";
    } finally {
      loading.value = false;
    }
  };
  const handleLookup = useDebounceFn(performLookup, 300);
  return { form, noNumber, result, error, loading, reset, handleLookup };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ChatBot",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useAppConfig().contact;
    useRouter();
    useLocalePath();
    const { user } = useUser();
    const heightInputValue = ref("");
    const isOpen = ref(false);
    const activeView = ref("home");
    const currentTopicId = ref(null);
    const isReturnModalOpen = ref(false);
    const returnFormType = ref("vratenie");
    const userEmail = computed(() => user.value?.email || "");
    const userFirstName = computed(() => user.value?.firstName || "");
    const userLastName = computed(() => user.value?.lastName || "");
    const userPhone = computed(() => {
      const u = user.value;
      return u?.defaultBillingAddress?.phoneNumber || u?.defaultShippingAddress?.phoneNumber || "";
    });
    const userAddress = computed(() => {
      const u = user.value;
      const addr = u?.defaultBillingAddress || u?.defaultShippingAddress;
      if (!addr) return "";
      const parts = [];
      if (addr.street) parts.push(String(addr.street));
      const cityLine = [addr.zipcode, addr.city].filter(Boolean).join(" ");
      if (cityLine) parts.push(cityLine);
      if (addr.country?.translated?.name || addr.country?.name) {
        parts.push(addr.country?.translated?.name || addr.country?.name);
      }
      return parts.join("\n");
    });
    const messages = ref([]);
    const inputValue = ref("");
    const isLoading = ref(false);
    const messagesEndRef = ref(null);
    const isBottomNavVisible = useState("mobileBottomNavVisible", () => false);
    const { saveHistory } = useChatHistory(messages, currentTopicId);
    const {
      form: orderLookupForm,
      noNumber: orderLookupNoNumber,
      result: orderLookupResult,
      error: orderLookupError,
      loading: orderLookupLoading
    } = useOrderLookup();
    watch(messages, saveHistory, { deep: true });
    const topics = computed(() => [
      { id: "product", label: t("chat.topics.product.label"), description: t("chat.topics.product.description"), icon: HelpCircle },
      { id: "order-status", label: t("chat.topics.order_status.label"), description: t("chat.topics.order_status.description"), icon: Search },
      { id: "service", label: t("chat.topics.service.label"), description: t("chat.topics.service.description"), icon: Wrench },
      { id: "claim", label: t("chat.topics.claim.label"), description: t("chat.topics.claim.description"), icon: ShieldAlert },
      { id: "return", label: t("chat.topics.return.label"), description: t("chat.topics.return.description"), icon: RotateCcw },
      { id: "call", label: t("chat.topics.call.label"), description: t("chat.topics.call.description"), icon: Phone }
    ]);
    watch([messages, isOpen, activeView], async () => {
      await nextTick();
      if (messagesEndRef.value && activeView.value === "chat") {
        messagesEndRef.value.scrollIntoView({ behavior: "smooth" });
      }
    }, { deep: true });
    useState("loginModalOpen", () => false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-41372310><button${ssrRenderAttr("aria-label", isOpen.value ? unref(t)("chat.toggle_close") : unref(t)("chat.toggle_open"))} class="${ssrRenderClass([[
        isOpen.value ? "w-12 h-12 bg-zinc-900" : "w-12 h-12 xl:w-36 xl:h-12 bg-brand animate-bounce hover:scale-105",
        unref(isBottomNavVisible) ? "bottom-[80px] lg:bottom-8" : "bottom-8"
      ], "fixed left-4 lg:left-8 z-[60] flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_10px_30px_rgba(0,0,0,0.15)] overflow-hidden group rounded-default"])}" data-v-41372310><div class="relative w-full h-full flex items-center justify-center" data-v-41372310>`);
      _push(ssrRenderComponent(unref(X), {
        class: ["absolute text-white w-5 h-5 transition-all duration-300", isOpen.value ? "opacity-100 scale-100 rotate-0 delay-200" : "opacity-0 scale-0 -rotate-90 pointer-events-none"]
      }, null, _parent));
      _push(`<div class="${ssrRenderClass([isOpen.value ? "opacity-0 scale-50 translate-x-6 pointer-events-none" : "opacity-100 scale-100 translate-x-0 pr-0.5 delay-200", "flex items-center gap-0 xl:gap-2.5 whitespace-nowrap transition-all duration-300"])}" data-v-41372310><span class="text-white font-bold font-tech uppercase text-[11px] tracking-widest pl-1 hidden xl:block" data-v-41372310>${ssrInterpolate(unref(t)("chat.start_chat"))}</span>`);
      _push(ssrRenderComponent(unref(MessageSquareMore), { class: "text-white w-5 h-5" }, null, _parent));
      _push(`</div></div></button><aside role="complementary"${ssrRenderAttr("aria-label", isOpen.value ? "Chat asistent SLICKLY" : "Chat asistent je skrytý")} class="${ssrRenderClass([[
        isOpen.value ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none",
        unref(isBottomNavVisible) ? "bottom-[136px] lg:bottom-24" : "bottom-24"
      ], "fixed left-4 md:left-8 z-[60] w-[90vw] md:w-[380px] h-[550px] max-h-[85vh] bg-white shadow-2xl border border-gray-100 flex flex-col transition-all duration-300 transform origin-bottom-left overflow-hidden"])}" data-v-41372310><div class="relative w-full h-full flex flex-col" data-v-41372310>`);
      if (activeView.value === "home") {
        _push(`<div class="absolute inset-0 w-full h-full bg-[#f4f5f6] flex flex-col pt-0 z-10 view-container" data-v-41372310><div class="bg-black text-white p-6 pb-12 pt-8 relative overflow-hidden flex-shrink-0" data-v-41372310><img${ssrRenderAttr("src", _imports_0)} alt="" class="absolute -right-12 -top-12 w-40 h-40 object-cover opacity-10 pointer-events-none" aria-hidden="true" data-v-41372310><div class="absolute right-0 bottom-0 w-full h-full bg-gradient-to-t from-black to-transparent pointer-events-none z-0" data-v-41372310></div><div class="relative z-10" data-v-41372310><h3 class="font-bold font-tech uppercase text-xl leading-none flex items-center gap-2 mb-2" data-v-41372310>`);
        _push(ssrRenderComponent(unref(Sparkles), { class: "w-5 h-5 text-brand" }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("chat.header"))}</h3><p class="text-[13px] text-gray-400 font-sans mt-2 leading-relaxed" data-v-41372310>${ssrInterpolate(unref(t)("chat.subtext"))}</p><div class="flex items-center gap-1.5 mt-2.5" data-v-41372310><span class="flex h-2 w-2 relative" data-v-41372310><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" data-v-41372310></span><span class="relative inline-flex rounded-full h-2 w-2 bg-green-500" data-v-41372310></span></span><span class="text-[10px] uppercase font-bold tracking-[0.2em] text-green-500 font-tech" data-v-41372310>${ssrInterpolate(unref(t)("chat.online_badge"))}</span></div></div></div><div class="flex-1 overflow-y-auto px-4 -mt-6 pb-6 relative z-20 custom-scrollbar" data-v-41372310><div class="grid grid-cols-1 gap-2" data-v-41372310><!--[-->`);
        ssrRenderList(topics.value, (topic) => {
          _push(`<button class="bg-white py-2.5 px-3 flex items-center gap-4 text-left transition-all duration-200 border border-transparent shadow-[0_5px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:border-brand/20 group focus:outline-none" data-v-41372310><div class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-50 text-gray-900 transition-colors group-hover:bg-brand group-hover:text-white rounded-default" data-v-41372310>`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(topic.icon), { class: "w-5 h-5 stroke-[2]" }, null), _parent);
          _push(`</div><div class="flex-1 min-w-0 pr-2" data-v-41372310><h4 class="font-bold text-gray-900 text-[13px] uppercase tracking-wide font-tech truncate group-hover:text-brand transition-colors" data-v-41372310>${ssrInterpolate(topic.label)}</h4><p class="text-xs text-gray-500 font-sans mt-0.5 truncate" data-v-41372310>${ssrInterpolate(topic.description)}</p></div><div class="w-6 h-6 flex items-center justify-center bg-transparent text-gray-300 group-hover:text-brand transition-all flex-shrink-0" data-v-41372310>`);
          _push(ssrRenderComponent(unref(ArrowLeft), { class: "w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" }, null, _parent));
          _push(`</div></button>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else if (activeView.value === "chat") {
        _push(`<div class="absolute inset-0 w-full h-full bg-white flex flex-col z-10 view-container" data-v-41372310><div class="bg-black text-white p-3 md:p-4 flex items-center justify-between flex-shrink-0 border-b-2 border-brand z-20" data-v-41372310><div class="flex items-center gap-3" data-v-41372310><button class="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white rounded-sm"${ssrRenderAttr("title", unref(t)("chat.back_to_selection"))} data-v-41372310>`);
        _push(ssrRenderComponent(unref(ArrowLeft), { class: "w-4 h-4" }, null, _parent));
        _push(`</button><div data-v-41372310><h3 class="font-bold font-tech uppercase text-[15px] leading-none mb-1" data-v-41372310>SLICKLY BOT</h3><span class="text-[10px] text-gray-300 flex items-center tracking-widest uppercase font-bold" data-v-41372310><span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" data-v-41372310></span> ${ssrInterpolate(unref(t)("chat.online_status"))}</span></div></div><button class="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-white flex items-center gap-2 transition-colors border border-gray-700 px-2 py-1"${ssrRenderAttr("title", unref(t)("chat.reset_history_title"))} data-v-41372310>${ssrInterpolate(unref(t)("chat.new_chat"))}</button></div><div class="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa] custom-scrollbar" data-v-41372310><!--[-->`);
        ssrRenderList(messages.value, (msg, idx) => {
          _push(`<div class="${ssrRenderClass(`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`)}" data-v-41372310><div class="${ssrRenderClass(`max-w-[85%] px-4 py-3 text-[13px] md:text-sm leading-relaxed shadow-sm whitespace-pre-line ${msg.role === "user" ? "bg-[#111827] text-white rounded-default border border-gray-900 font-medium" : "bg-white text-gray-800 rounded-default border border-gray-100 font-sans"}`)}" data-v-41372310>${unref(sanitizeHtml)(msg.text) ?? ""}</div>`);
          if (msg.recommendedProducts && msg.recommendedProducts.length > 0) {
            _push(`<div class="mt-3 flex flex-col gap-2 w-full max-w-[90%]" data-v-41372310><!--[-->`);
            ssrRenderList(msg.recommendedProducts, (product) => {
              _push(ssrRenderComponent(ChatProductCard, {
                key: product.id,
                product
              }, null, _parent));
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          if (msg.role === "model" && msg.chips?.length && !msg.answered && !isLoading.value) {
            _push(`<div class="mt-2 flex flex-wrap gap-1.5 max-w-[90%]" data-v-41372310><!--[-->`);
            ssrRenderList(msg.chips, (chip) => {
              _push(`<button class="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border border-brand/40 text-brand bg-white hover:bg-brand hover:text-white transition-all duration-150 rounded-sm font-tech" data-v-41372310>${ssrInterpolate(chip)}</button>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          if (msg.role === "model" && msg.hasHeightInput && !msg.answered && !isLoading.value) {
            _push(`<div class="mt-2 flex gap-2 max-w-[90%]" data-v-41372310><input${ssrRenderAttr("value", heightInputValue.value)} type="number" min="140" max="220" placeholder="napr. 185" class="w-24 px-3 py-1.5 text-[13px] border border-gray-300 focus:border-brand focus:outline-none rounded-default font-medium" data-v-41372310><span class="self-center text-[12px] text-gray-500" data-v-41372310>cm</span><button class="px-3 py-1.5 text-[11px] font-bold uppercase bg-brand text-white hover:bg-brand/90 transition-colors rounded-sm font-tech" data-v-41372310> OK </button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]-->`);
        if (isLoading.value) {
          _push(`<div class="flex items-start" data-v-41372310><div class="bg-white px-4 py-3 rounded-default border border-gray-100 shadow-sm flex items-center gap-2" data-v-41372310><span class="flex gap-1.5 px-2" data-v-41372310><span class="w-1.5 h-1.5 bg-brand rounded-full animate-bounce [animation-delay:-0.3s]" data-v-41372310></span><span class="w-1.5 h-1.5 bg-brand rounded-full animate-bounce [animation-delay:-0.15s]" data-v-41372310></span><span class="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" data-v-41372310></span></span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="h-1" data-v-41372310></div></div><div class="p-3 md:p-4 bg-white border-t border-gray-100 flex-shrink-0" data-v-41372310><div class="relative flex items-center" data-v-41372310><input type="text"${ssrRenderAttr("value", inputValue.value)}${ssrRenderAttr("placeholder", unref(t)("chat.input_placeholder"))} class="w-full bg-[#f4f5f6] text-[13px] p-3.5 pr-12 focus:outline-none focus:ring-1 focus:ring-brand font-medium text-black placeholder-gray-400 border border-transparent focus:border-brand/30 transition-all rounded-default" data-v-41372310><button${ssrIncludeBooleanAttr(!inputValue.value.trim() || isLoading.value) ? " disabled" : ""}${ssrRenderAttr("aria-label", unref(t)("chat.send_aria"))} class="absolute right-1 text-black hover:text-brand hover:scale-110 disabled:opacity-30 disabled:hover:text-black disabled:hover:scale-100 transition-all w-10 h-10 flex items-center justify-center bg-transparent" data-v-41372310>`);
        _push(ssrRenderComponent(unref(Send), {
          class: "w-5 h-5",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button></div></div></div>`);
      } else if (activeView.value === "order-lookup") {
        _push(`<div class="absolute inset-0 w-full h-full bg-white flex flex-col z-10 view-container" data-v-41372310><div class="bg-black text-white p-3 md:p-4 flex items-center justify-between flex-shrink-0 border-b-2 border-brand z-20" data-v-41372310><div class="flex items-center gap-3" data-v-41372310><button class="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white rounded-sm"${ssrRenderAttr("title", unref(t)("chat.back_to_selection"))} data-v-41372310>`);
        _push(ssrRenderComponent(unref(ArrowLeft), { class: "w-4 h-4" }, null, _parent));
        _push(`</button><div data-v-41372310><h3 class="font-bold font-tech uppercase text-[15px] leading-none mb-1" data-v-41372310>STAV OBJEDNÁVKY</h3><span class="text-[10px] text-gray-300 flex items-center tracking-widest uppercase font-bold" data-v-41372310><span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" data-v-41372310></span> ${ssrInterpolate(unref(t)("chat.online_status"))}</span></div></div></div><div class="flex-1 overflow-y-auto p-4 bg-[#f8f9fa] custom-scrollbar space-y-4" data-v-41372310><div class="space-y-3" data-v-41372310>`);
        if (!unref(orderLookupNoNumber)) {
          _push(`<!--[--><div data-v-41372310><label class="text-[11px] font-bold text-gray-700 uppercase tracking-widest block mb-2" data-v-41372310>Číslo objednávky *</label><input${ssrRenderAttr("value", unref(orderLookupForm).orderNumber)} type="text" placeholder="Napr. 10001234" class="w-full px-3 py-2.5 bg-white border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand rounded-default font-medium" data-v-41372310></div><button class="text-[11px] text-brand underline font-bold tracking-wide" data-v-41372310> Nemám číslo objednávky </button><!--]-->`);
        } else {
          _push(`<!--[--><div class="flex items-center gap-2 mb-1" data-v-41372310><button class="text-[11px] text-gray-500 underline" data-v-41372310>← Zadať číslo objednávky</button></div><div data-v-41372310><label class="text-[11px] font-bold text-gray-700 uppercase tracking-widest block mb-2" data-v-41372310>Email *</label><input${ssrRenderAttr("value", unref(orderLookupForm).email)} type="email" placeholder="vas@email.com" class="w-full px-3 py-2.5 bg-white border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand rounded-default font-medium" data-v-41372310></div><div class="grid grid-cols-2 gap-2" data-v-41372310><div data-v-41372310><label class="text-[11px] font-bold text-gray-700 uppercase tracking-widest block mb-2" data-v-41372310>Meno</label><input${ssrRenderAttr("value", unref(orderLookupForm).firstName)} type="text" placeholder="Ján" class="w-full px-3 py-2.5 bg-white border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand rounded-default font-medium" data-v-41372310></div><div data-v-41372310><label class="text-[11px] font-bold text-gray-700 uppercase tracking-widest block mb-2" data-v-41372310>Priezvisko *</label><input${ssrRenderAttr("value", unref(orderLookupForm).lastName)} type="text" placeholder="Novák" class="w-full px-3 py-2.5 bg-white border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand rounded-default font-medium" data-v-41372310></div></div><!--]-->`);
        }
        _push(`<button${ssrIncludeBooleanAttr(unref(orderLookupLoading)) ? " disabled" : ""} class="w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 text-white font-bold uppercase text-[11px] tracking-widest px-4 py-3 transition-all rounded-default flex items-center justify-center gap-2 mt-2" data-v-41372310>`);
        if (!unref(orderLookupLoading)) {
          _push(ssrRenderComponent(unref(Search), { class: "w-4 h-4" }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent));
        }
        _push(` ${ssrInterpolate(unref(orderLookupLoading) ? "Hľadám..." : "Vyhľadať")}</button></div>`);
        if (unref(orderLookupError)) {
          _push(`<div class="bg-red-50 border border-red-200 rounded-default p-3" data-v-41372310><p class="text-[13px] text-red-700 font-sans" data-v-41372310>${ssrInterpolate(unref(orderLookupError))}</p>`);
          if (unref(orderLookupResult)?.support) {
            _push(`<p class="text-[12px] text-red-600 font-bold mt-2" data-v-41372310> 📞 Kontaktujte podporu: <a${ssrRenderAttr("href", `tel:${unref(orderLookupResult).support}`)} class="underline" data-v-41372310>${ssrInterpolate(unref(orderLookupResult).support)}</a></p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(orderLookupResult)?.found) {
          _push(`<div class="space-y-3" data-v-41372310>`);
          if (unref(orderLookupResult).multiple) {
            _push(`<!--[--><p class="text-[12px] font-bold text-gray-700 uppercase tracking-widest" data-v-41372310>${ssrInterpolate(unref(orderLookupResult).message)}</p><!--[-->`);
            ssrRenderList(unref(orderLookupResult).orders, (ord) => {
              _push(`<div class="bg-green-50 border border-green-200 p-3 space-y-2" data-v-41372310><div class="flex items-center gap-2" data-v-41372310>`);
              _push(ssrRenderComponent(unref(Package), { class: "w-4 h-4 text-green-700 flex-shrink-0" }, null, _parent));
              _push(`<span class="font-tech font-black text-[15px] text-green-900" data-v-41372310>${ssrInterpolate(ord.orderNumber)}</span><span class="text-[11px] text-gray-500 ml-auto" data-v-41372310>${ssrInterpolate(new Date(ord.createdAt).toLocaleDateString("sk-SK"))}</span></div><p class="text-[12px] font-medium text-green-900 leading-relaxed" data-v-41372310>${ssrInterpolate(ord.message)}</p><div class="flex gap-3 text-[11px] text-gray-600" data-v-41372310>`);
              if (ord.states?.order) {
                _push(`<span data-v-41372310>📋 ${ssrInterpolate(ord.states.order.name)}</span>`);
              } else {
                _push(`<!---->`);
              }
              if (ord.states?.delivery) {
                _push(`<span data-v-41372310>🚚 ${ssrInterpolate(ord.states.delivery.name)}</span>`);
              } else {
                _push(`<!---->`);
              }
              if (ord.states?.payment) {
                _push(`<span data-v-41372310>💳 ${ssrInterpolate(ord.states.payment.name)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></div>`);
            });
            _push(`<!--]--><!--]-->`);
          } else {
            _push(`<div class="bg-green-50 border border-green-200 rounded-default p-4 space-y-3" data-v-41372310><div class="flex items-center gap-3" data-v-41372310><div class="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-green-100" data-v-41372310>`);
            _push(ssrRenderComponent(unref(Package), { class: "w-4 h-4 text-green-700" }, null, _parent));
            _push(`</div><div data-v-41372310><p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest" data-v-41372310>Číslo objednávky</p><p class="text-[15px] font-black text-green-900 font-tech" data-v-41372310>${ssrInterpolate(unref(orderLookupResult).orderNumber)}</p></div><span class="ml-auto text-[11px] text-gray-500" data-v-41372310>${ssrInterpolate(new Date(unref(orderLookupResult).createdAt).toLocaleDateString("sk-SK"))}</span></div><div class="border-t border-green-200 pt-2" data-v-41372310><p class="text-[13px] font-bold text-green-900 leading-relaxed" data-v-41372310>${ssrInterpolate(unref(orderLookupResult).message)}</p></div>`);
            if (unref(orderLookupResult)?.states?.order) {
              _push(`<details class="cursor-pointer border-t border-green-200 pt-2" data-v-41372310><summary class="text-[11px] font-bold text-gray-500 uppercase tracking-widest" data-v-41372310>Detaily stavov</summary><div class="mt-2 space-y-1.5 text-[12px]" data-v-41372310>`);
              if (unref(orderLookupResult).states.order) {
                _push(`<div class="bg-white p-2 border border-green-100" data-v-41372310><span class="font-bold" data-v-41372310>📋 Objednávka:</span> ${ssrInterpolate(unref(orderLookupResult).states.order.name)}</div>`);
              } else {
                _push(`<!---->`);
              }
              if (unref(orderLookupResult).states.delivery) {
                _push(`<div class="bg-white p-2 border border-green-100" data-v-41372310><span class="font-bold" data-v-41372310>🚚 Doručenie:</span> ${ssrInterpolate(unref(orderLookupResult).states.delivery.name)}</div>`);
              } else {
                _push(`<!---->`);
              }
              if (unref(orderLookupResult).states.payment) {
                _push(`<div class="bg-white p-2 border border-green-100" data-v-41372310><span class="font-bold" data-v-41372310>💳 Platba:</span> ${ssrInterpolate(unref(orderLookupResult).states.payment.name)}</div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></details>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          }
          _push(`<p class="text-[11px] text-gray-400 text-center font-sans" data-v-41372310> Staršia história objednávok je dostupná po prihlásení do <button class="text-brand underline font-bold" data-v-41372310>vášho účtu</button>. </p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="h-1" data-v-41372310></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></aside>`);
      _push(ssrRenderComponent(ReturnFormModal, {
        "is-open": isReturnModalOpen.value,
        "initial-form-type": returnFormType.value,
        "initial-email": userEmail.value,
        "initial-first-name": userFirstName.value,
        "initial-last-name": userLastName.value,
        "initial-customer-phone": userPhone.value,
        "initial-customer-address": userAddress.value,
        onClose: ($event) => isReturnModalOpen.value = false
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/ChatBot.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ChatBot = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-41372310"]]), { __name: "ChatBot" });

export { ChatBot as default };
