<script setup lang="ts">
import { ref, watch, nextTick, computed, onMounted } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import {
  MessageSquareMore, X, Send, Sparkles, Loader2,
  Package, ShieldAlert, RotateCcw, HelpCircle, ArrowLeft, MessageSquarePlus, Wrench, Phone, Search
} from 'lucide-vue-next';
import { sanitizeHtml } from '~/utils/sanitize';
import ChatProductCard from '~/components/chat/ChatProductCard.vue';
import ReturnFormModal from '~/components/returns/ReturnFormModal.vue';
import type { FormType } from '~/composables/useReturnForm';

const { t } = useI18n();
const contact = useAppConfig().contact;
const router = useRouter();
const localePath = useLocalePath();
const { isLoggedIn, user } = useUser();

interface Message {
  role: 'user' | 'model';
  text: string;
  recommendedProducts?: any[];
  chips?: string[];
  hasHeightInput?: boolean;
  answered?: boolean;
}

function parseModelMessage(raw: string): Pick<Message, 'text' | 'chips' | 'hasHeightInput'> {
  const chips: string[] = [];
  let hasHeightInput = false;

  const chipsMatch = raw.match(/\[CHIPS:\s*([^\]]+)\]/);
  if (chipsMatch) {
    chips.push(...chipsMatch[1].split('|').map(s => s.trim()).filter(Boolean));
  }
  if (raw.includes('[HEIGHT_INPUT]')) hasHeightInput = true;

  const text = raw
    .replace(/\[CHIPS:[^\]]+\]/g, '')
    .replace(/\[HEIGHT_INPUT\]/g, '')
    .trim();

  return { text, chips: chips.length ? chips : undefined, hasHeightInput: hasHeightInput || undefined };
}

const heightInputValue = ref('');

const isOpen = ref(false);
const activeView = ref<'home' | 'chat' | 'order-lookup'>('home');
const currentTopicId = ref<string | null>(null);

// Reklamácia / Vrátenie modal
const isReturnModalOpen = ref(false);
const returnFormType = ref<FormType>('vratenie');
const userEmail = computed(() => (user.value as any)?.email || '');
const userFirstName = computed(() => (user.value as any)?.firstName || '');
const userLastName = computed(() => (user.value as any)?.lastName || '');
const userPhone = computed(() => {
  const u: any = user.value;
  return u?.defaultBillingAddress?.phoneNumber
      || u?.defaultShippingAddress?.phoneNumber
      || '';
});
const userAddress = computed(() => {
  const u: any = user.value;
  const addr = u?.defaultBillingAddress || u?.defaultShippingAddress;
  if (!addr) return '';
  const parts: string[] = [];
  if (addr.street) parts.push(String(addr.street));
  const cityLine = [addr.zipcode, addr.city].filter(Boolean).join(' ');
  if (cityLine) parts.push(cityLine);
  if (addr.country?.translated?.name || addr.country?.name) {
    parts.push(addr.country?.translated?.name || addr.country?.name);
  }
  return parts.join('\n');
});

const messages = ref<Message[]>([]);
const inputValue = ref('');
const isLoading = ref(false);
const messagesEndRef = ref<HTMLElement | null>(null);
const isBottomNavVisible = useState('mobileBottomNavVisible', () => false);

// Composables
const { saveHistory, loadHistory, clearHistory } = useChatHistory(messages, currentTopicId);
const {
  form: orderLookupForm,
  noNumber: orderLookupNoNumber,
  result: orderLookupResult,
  error: orderLookupError,
  loading: orderLookupLoading,
  reset: resetOrderLookup,
  handleLookup: handleOrderLookup
} = useOrderLookup();

onMounted(async () => {
  const data = await loadHistory();
  if (data?.messages?.length) {
    messages.value = data.messages;
    currentTopicId.value = data.topicId ?? null;
    activeView.value = 'chat';
  }
});

watch(messages, saveHistory, { deep: true });

const topics = computed(() => [
  { id: 'product', label: t('chat.topics.product.label'), description: t('chat.topics.product.description'), icon: HelpCircle },
  { id: 'order-status', label: t('chat.topics.order_status.label'), description: t('chat.topics.order_status.description'), icon: Search },
  { id: 'service', label: t('chat.topics.service.label'), description: t('chat.topics.service.description'), icon: Wrench },
  { id: 'claim', label: t('chat.topics.claim.label'), description: t('chat.topics.claim.description'), icon: ShieldAlert },
  { id: 'return', label: t('chat.topics.return.label'), description: t('chat.topics.return.description'), icon: RotateCcw },
  { id: 'call', label: t('chat.topics.call.label'), description: t('chat.topics.call.description'), icon: Phone }
]);

// Auto-scroll to bottom
watch([messages, isOpen, activeView], async () => {
    await nextTick();
    if (messagesEndRef.value && activeView.value === 'chat') {
        messagesEndRef.value.scrollIntoView({ behavior: 'smooth' });
    }
}, { deep: true });

// Produktový kontext je na serveri (server/utils/productCatalog.ts → Redis)
// Frontend neposiela mock dáta — server má reálny katalóg zo Shopware

const startChat = (topicId: string) => {
    currentTopicId.value = topicId;

    // Order status lookup - special view
    if (topicId === 'order-status') {
        activeView.value = 'order-lookup';
        resetOrderLookup();
        return;
    }

    // Reklamácia / Vrátenie → otvor štruktúrovaný formulár (modal), nie AI chat
    if (topicId === 'claim') {
        returnFormType.value = 'reklamacia';
        isReturnModalOpen.value = true;
        return;
    }
    if (topicId === 'return') {
        returnFormType.value = 'vratenie';
        isReturnModalOpen.value = true;
        return;
    }

    activeView.value = 'chat';

    // Ak existuje história → obnov bez čistenia (história sa maže len cez "Nový chat")
    if (messages.value.length > 0) return;

    // Nová konverzácia — pridaj uvítaciu správu
    let initialText = '';
    if (topicId === 'service') initialText = t('chat.initial_messages.service');
    else if (topicId === 'call') {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            window.location.href = contact.phone.mainHref;
            return;
        }
        // Build HTML here to avoid i18n compiler restrictions
        initialText = `
            ${t('chat.initial_messages.call')}
            <div class="mt-4 space-y-3">
                <div class="flex flex-col">
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">📞 Infolinka eshop</span>
                    <a href="${contact.phone.mainHref}" class="text-brand font-bold underline hover:text-black transition-colors">${contact.phone.mainDisplay}</a>
                </div>
                <div class="flex flex-col">
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">🛠 Reklamácie</span>
                    <a href="tel:${contact.phone.complaints}" class="text-brand font-bold underline hover:text-black transition-colors">${contact.phone.complaintsDisplay}</a>
                </div>
                <div class="flex flex-col">
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">🚲 Predajňa SLICKLY Lokca</span>
                    <a href="tel:${contact.phone.store}" class="text-brand font-bold underline hover:text-black transition-colors">${contact.phone.storeDisplay}</a>
                </div>
            </div>
        `;
    }
    else {
        const name = (user.value as any)?.firstName;
        initialText = name && isLoggedIn.value
          ? `Dobrý deň, ${name}! Som Váš AI asistent SLICKLY.\nPomôžem Vám nájsť vhodný bicykel, e-bike alebo komponenty. Čo hľadáte?`
          : t('chat.initial_messages.fallback');
    }

    messages.value.push({ role: 'model', text: initialText });
};

const resetChat = () => {
    messages.value = [];
    activeView.value = 'home';
    currentTopicId.value = null;
    inputValue.value = '';
    clearHistory();
};

const handleSend = async () => {
  if (!inputValue.value.trim()) return;

  const userMessage = inputValue.value;
  inputValue.value = '';
  messages.value.push({ role: 'user', text: userMessage });
  isLoading.value = true;

  try {
    const history = messages.value.slice(0, -1).map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const result = await $fetch<{ text: string; productIds?: string[] }>('/api/gemini/chat', {
      method: 'POST',
      body: { message: userMessage, history },
    });

    // tool_use vracia text + productIds priamo (žiadne text parsing)
    const parsed = parseModelMessage(result.text ?? '');
    const productIds = (result.productIds ?? []).filter(Boolean);

    const msgIndex = messages.value.push({
      role: 'model',
      text: parsed.text,
      recommendedProducts: productIds.length ? [] : undefined,
      chips: parsed.chips,
      hasHeightInput: parsed.hasHeightInput,
      answered: false
    }) - 1;

    if (productIds.length) {
      $fetch<any[]>('/api/chat/product-cards', { method: 'POST', body: { ids: productIds } })
        .then((cards) => { if (messages.value[msgIndex]) messages.value[msgIndex].recommendedProducts = cards; })
        .catch(() => null);
    }

  } catch (error) {
    console.error("Chat Error:", error);
    messages.value.push({ role: 'model', text: t('chat.error_technical') });
  } finally {
    isLoading.value = false;
  }
};

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};

const sendQuickReply = (msgIndex: number, value: string) => {
  if (messages.value[msgIndex]) messages.value[msgIndex].answered = true;
  inputValue.value = value;
  handleSend();
};

const isLoginModalOpen = useState('loginModalOpen', () => false);

const handleAccountLink = () => {
  if (isLoggedIn.value) {
    router.push(localePath('/account'));
  } else {
    isLoginModalOpen.value = true;
  }
};

const submitHeight = (msgIndex: number) => {
  const raw = String(heightInputValue.value).trim();
  const num = parseInt(raw, 10);
  if (!raw || isNaN(num) || num < 100 || num > 250) return;
  heightInputValue.value = '';
  sendQuickReply(msgIndex, `${num} cm`);
};

// handleOrderLookup je z useOrderLookup composable


</script>

<template>
  <div>
    <!-- Toggle Button -->
    <button
      @click="isOpen = !isOpen"
      :aria-label="isOpen ? t('chat.toggle_close') : t('chat.toggle_open')"
      class="fixed left-4 lg:left-8 z-[60] flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_10px_30px_rgba(0,0,0,0.15)] overflow-hidden group rounded-none"
      :class="[
        isOpen ? 'w-12 h-12 bg-zinc-900' : 'w-12 h-12 xl:w-36 xl:h-12 bg-brand animate-bounce hover:scale-105',
        isBottomNavVisible ? 'bottom-[80px] lg:bottom-8' : 'bottom-8'
      ]"
    >
      <div class="relative w-full h-full flex items-center justify-center">
        <!-- Close Icon -->
        <X 
          class="absolute text-white w-5 h-5 transition-all duration-300"
          :class="isOpen ? 'opacity-100 scale-100 rotate-0 delay-200' : 'opacity-0 scale-0 -rotate-90 pointer-events-none'"
        />
        
        <!-- Open Content -->
        <div 
          class="flex items-center gap-0 xl:gap-2.5 whitespace-nowrap transition-all duration-300"
          :class="isOpen ? 'opacity-0 scale-50 translate-x-6 pointer-events-none' : 'opacity-100 scale-100 translate-x-0 pr-0.5 delay-200'"
        >
          <span class="text-white font-bold font-tech uppercase text-[11px] tracking-widest pl-1 hidden xl:block">{{ t('chat.start_chat') }}</span>
          <MessageSquareMore class="text-white w-5 h-5" />
        </div>
      </div>
    </button>

    <!-- Chat Window Base -->
    <aside 
      role="complementary"
      :aria-label="isOpen ? 'Chat asistent SLICKLY' : 'Chat asistent je skrytý'"
      class="fixed left-4 md:left-8 z-[60] w-[90vw] md:w-[380px] h-[550px] max-h-[85vh] bg-white shadow-2xl border border-gray-100 flex flex-col transition-all duration-300 transform origin-bottom-left overflow-hidden"
      :class="[
        isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none',
        isBottomNavVisible ? 'bottom-[136px] lg:bottom-24' : 'bottom-24'
      ]"
    >
      
      <!-- TRANSITION WRAPPER PRE VIEWS -->
      <div class="relative w-full h-full flex flex-col">
          <Transition name="view">
              
              <!-- ────────────────────────────────────────────── -->
              <!-- 1. HOME VIEW (Quick Actions)                 -->
              <!-- ────────────────────────────────────────────── -->
              <div v-if="activeView === 'home'" class="absolute inset-0 w-full h-full bg-[#f4f5f6] flex flex-col pt-0 z-10 view-container">
                  
                  <!-- Hero Hlavička -->
                  <div class="bg-black text-white p-6 pb-12 pt-8 relative overflow-hidden flex-shrink-0">
                      <!-- Brand Accent dekorácia -->
                      <img src="~/assets/MTShape.svg" alt="" class="absolute -right-12 -top-12 w-40 h-40 object-cover opacity-10 pointer-events-none" aria-hidden="true" />
                      <div class="absolute right-0 bottom-0 w-full h-full bg-gradient-to-t from-black to-transparent pointer-events-none z-0"></div>
                      
                      <div class="relative z-10">
                          <h3 class="font-bold font-tech uppercase text-xl leading-none flex items-center gap-2 mb-2">
                             <Sparkles class="w-5 h-5 text-brand" />
                             {{ t('chat.header') }}
                          </h3>
                          <p class="text-[13px] text-gray-400 font-sans mt-2 leading-relaxed">{{ t('chat.subtext') }}</p>
                          <div class="flex items-center gap-1.5 mt-2.5">
                             <span class="flex h-2 w-2 relative">
                               <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                               <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                             </span>
                             <span class="text-[10px] uppercase font-bold tracking-[0.2em] text-green-500 font-tech">{{ t('chat.online_badge') }}</span>
                          </div>
                      </div>
                  </div>

                  <!-- Taby / Karty (presahujú hlavičku vďaka -mt-6) -->
                  <div class="flex-1 overflow-y-auto px-4 -mt-6 pb-6 relative z-20 custom-scrollbar">
                      <div class="grid grid-cols-1 gap-2">
                          <button 
                              v-for="topic in topics" :key="topic.id"
                              @click="startChat(topic.id)"
                              class="bg-white py-2.5 px-3 flex items-center gap-4 text-left transition-all duration-200 border border-transparent shadow-[0_5px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:border-brand/20 group focus:outline-none"
                          >
                              <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-50 text-gray-900 transition-colors group-hover:bg-brand group-hover:text-white rounded-none">
                                  <component :is="topic.icon" class="w-5 h-5 stroke-[2]" />
                              </div>
                              <div class="flex-1 min-w-0 pr-2">
                                  <h4 class="font-bold text-gray-900 text-[13px] uppercase tracking-wide font-tech truncate group-hover:text-brand transition-colors">{{ topic.label }}</h4>
                                  <p class="text-xs text-gray-500 font-sans mt-0.5 truncate">{{ topic.description }}</p>
                              </div>
                              <div class="w-6 h-6 flex items-center justify-center bg-transparent text-gray-300 group-hover:text-brand transition-all flex-shrink-0">
                                  <ArrowLeft class="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
                              </div>
                          </button>
                      </div>
                  </div>
              </div>

              <!-- ────────────────────────────────────────────── -->
              <!-- 2. CHAT VIEW (Samotná konverzácia)           -->
              <!-- ────────────────────────────────────────────── -->
              <div v-else-if="activeView === 'chat'" class="absolute inset-0 w-full h-full bg-white flex flex-col z-10 view-container">
                  
                  <!-- Chat hlavička -->
                  <div class="bg-black text-white p-3 md:p-4 flex items-center justify-between flex-shrink-0 border-b-2 border-brand z-20">
                      <div class="flex items-center gap-3">
                         <button @click="resetChat" class="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white rounded-none" :title="t('chat.back_to_selection')">
                             <ArrowLeft class="w-4 h-4" />
                         </button>
                         <div>
                           <h3 class="font-bold font-tech uppercase text-[15px] leading-none mb-1">SLICKLY BOT</h3>
                           <span class="text-[10px] text-gray-300 flex items-center tracking-widest uppercase font-bold">
                             <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                             {{ t('chat.online_status') }}
                           </span>
                         </div>
                      </div>
                      
                      <button @click="resetChat" class="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-white flex items-center gap-2 transition-colors border border-gray-700 px-2 py-1" :title="t('chat.reset_history_title')">
                          {{ t('chat.new_chat') }}
                      </button>
                  </div>

                  <!-- Správy -->
                  <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa] custom-scrollbar">
                    <div v-for="(msg, idx) in messages" :key="idx" :class="`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`">
                      
                      <!-- Bublina -->
                      <div 
                        :class="`max-w-[85%] px-4 py-3 text-[13px] md:text-sm leading-relaxed shadow-sm whitespace-pre-line ${
                          msg.role === 'user' 
                            ? 'bg-[#111827] text-white rounded-none border border-gray-900 font-medium' 
                            : 'bg-white text-gray-800 rounded-none border border-gray-100 font-sans'
                        }`"
                        v-html="sanitizeHtml(msg.text)"
                      >
                      </div>

                      <!-- Produkty v rámci chatu -->
                      <div v-if="msg.recommendedProducts && msg.recommendedProducts.length > 0" class="mt-3 flex flex-col gap-2 w-full max-w-[90%]">
                        <ChatProductCard
                          v-for="product in msg.recommendedProducts"
                          :key="product.id"
                          :product="product"
                        />
                      </div>

                      <!-- Chips — klikateľné odpovede -->
                      <div
                        v-if="msg.role === 'model' && msg.chips?.length && !msg.answered && !isLoading"
                        class="mt-2 flex flex-wrap gap-1.5 max-w-[90%]"
                      >
                        <button
                          v-for="chip in msg.chips"
                          :key="chip"
                          @click="sendQuickReply(idx, chip)"
                          class="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border border-brand/40 text-brand bg-white hover:bg-brand hover:text-white transition-all duration-150 rounded-none font-tech"
                        >
                          {{ chip }}
                        </button>
                      </div>

                      <!-- Height input -->
                      <div
                        v-if="msg.role === 'model' && msg.hasHeightInput && !msg.answered && !isLoading"
                        class="mt-2 flex gap-2 max-w-[90%]"
                      >
                        <input
                          v-model="heightInputValue"
                          type="number"
                          min="140"
                          max="220"
                          placeholder="napr. 185"
                          @keydown.enter="submitHeight(idx)"
                          class="w-24 px-3 py-1.5 text-[13px] border border-gray-300 focus:border-brand focus:outline-none rounded-none font-medium"
                        />
                        <span class="self-center text-[12px] text-gray-500">cm</span>
                        <button
                          @click="submitHeight(idx)"
                          class="px-3 py-1.5 text-[11px] font-bold uppercase bg-brand text-white hover:bg-brand/90 transition-colors rounded-none font-tech"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                    
                    <!-- Loading indikátor -->
                    <div v-if="isLoading" class="flex items-start">
                      <div class="bg-white px-4 py-3 rounded-none border border-gray-100 shadow-sm flex items-center gap-2">
                         <span class="flex gap-1.5 px-2">
                           <span class="w-1.5 h-1.5 bg-brand rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                           <span class="w-1.5 h-1.5 bg-brand rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                           <span class="w-1.5 h-1.5 bg-brand rounded-full animate-bounce"></span>
                         </span>
                      </div>
                    </div>
                    
                    <div ref="messagesEndRef" class="h-1" />
                  </div>

                  <!-- Input zóna -->
                  <div class="p-3 md:p-4 bg-white border-t border-gray-100 flex-shrink-0">
                     <div class="relative flex items-center">
                       <input
                         type="text"
                         v-model="inputValue"
                         @keydown="handleKeyPress"
                         :placeholder="t('chat.input_placeholder')"
                         class="w-full bg-[#f4f5f6] text-[13px] p-3.5 pr-12 focus:outline-none focus:ring-1 focus:ring-brand font-medium text-black placeholder-gray-400 border border-transparent focus:border-brand/30 transition-all rounded-none"
                       />
                        <button 
                          @click="handleSend"
                          :disabled="!inputValue.trim() || isLoading"
                          :aria-label="t('chat.send_aria')"
                          class="absolute right-1 text-black hover:text-brand hover:scale-110 disabled:opacity-30 disabled:hover:text-black disabled:hover:scale-100 transition-all w-10 h-10 flex items-center justify-center bg-transparent"
                        >
                          <Send class="w-5 h-5" aria-hidden="true" />
                        </button>
                     </div>
                  </div>
              </div>

              <!-- ────────────────────────────────────────────── -->
              <!-- 3. ORDER LOOKUP VIEW (Vyhľadávanie stavu)     -->
              <!-- ────────────────────────────────────────────── -->
              <div v-else-if="activeView === 'order-lookup'" class="absolute inset-0 w-full h-full bg-white flex flex-col z-10 view-container">

                  <!-- Hlavička -->
                  <div class="bg-black text-white p-3 md:p-4 flex items-center justify-between flex-shrink-0 border-b-2 border-brand z-20">
                      <div class="flex items-center gap-3">
                         <button @click="resetChat" class="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white rounded-none" :title="t('chat.back_to_selection')">
                             <ArrowLeft class="w-4 h-4" />
                         </button>
                         <div>
                           <h3 class="font-bold font-tech uppercase text-[15px] leading-none mb-1">STAV OBJEDNÁVKY</h3>
                           <span class="text-[10px] text-gray-300 flex items-center tracking-widest uppercase font-bold">
                             <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                             {{ t('chat.online_status') }}
                           </span>
                         </div>
                      </div>
                  </div>

                  <!-- Obsah -->
                  <div class="flex-1 overflow-y-auto p-4 bg-[#f8f9fa] custom-scrollbar space-y-4">
                      <!-- Formulár -->
                      <div class="space-y-3">

                          <!-- Číslo objednávky (vždy prvé) -->
                          <template v-if="!orderLookupNoNumber">
                              <div>
                                  <label class="text-[11px] font-bold text-gray-700 uppercase tracking-widest block mb-2">Číslo objednávky *</label>
                                  <input
                                      v-model="orderLookupForm.orderNumber"
                                      type="text"
                                      placeholder="Napr. 10001234"
                                      @keydown.enter="handleOrderLookup"
                                      class="w-full px-3 py-2.5 bg-white border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand rounded-none font-medium"
                                  />
                              </div>
                              <button
                                  @click="orderLookupNoNumber = true; orderLookupError = null"
                                  class="text-[11px] text-brand underline font-bold tracking-wide"
                              >
                                  Nemám číslo objednávky
                              </button>
                          </template>

                          <!-- Fallback: email + meno + priezvisko -->
                          <template v-else>
                              <div class="flex items-center gap-2 mb-1">
                                  <button @click="orderLookupNoNumber = false; orderLookupError = null" class="text-[11px] text-gray-500 underline">← Zadať číslo objednávky</button>
                              </div>
                              <div>
                                  <label class="text-[11px] font-bold text-gray-700 uppercase tracking-widest block mb-2">Email *</label>
                                  <input
                                      v-model="orderLookupForm.email"
                                      type="email"
                                      placeholder="vas@email.com"
                                      class="w-full px-3 py-2.5 bg-white border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand rounded-none font-medium"
                                  />
                              </div>
                              <div class="grid grid-cols-2 gap-2">
                                  <div>
                                      <label class="text-[11px] font-bold text-gray-700 uppercase tracking-widest block mb-2">Meno</label>
                                      <input
                                          v-model="orderLookupForm.firstName"
                                          type="text"
                                          placeholder="Ján"
                                          class="w-full px-3 py-2.5 bg-white border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand rounded-none font-medium"
                                      />
                                  </div>
                                  <div>
                                      <label class="text-[11px] font-bold text-gray-700 uppercase tracking-widest block mb-2">Priezvisko *</label>
                                      <input
                                          v-model="orderLookupForm.lastName"
                                          type="text"
                                          placeholder="Novák"
                                          @keydown.enter="handleOrderLookup"
                                          class="w-full px-3 py-2.5 bg-white border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand rounded-none font-medium"
                                      />
                                  </div>
                              </div>
                          </template>

                          <button
                              @click="handleOrderLookup"
                              :disabled="orderLookupLoading"
                              class="w-full bg-brand hover:bg-brand/90 disabled:bg-gray-300 text-white font-bold uppercase text-[11px] tracking-widest px-4 py-3 transition-all rounded-none flex items-center justify-center gap-2 mt-2"
                          >
                              <Search v-if="!orderLookupLoading" class="w-4 h-4" />
                              <Loader2 v-else class="w-4 h-4 animate-spin" />
                              {{ orderLookupLoading ? 'Hľadám...' : 'Vyhľadať' }}
                          </button>
                      </div>

                      <!-- Chyba -->
                      <div v-if="orderLookupError" class="bg-red-50 border border-red-200 rounded-none p-3">
                          <p class="text-[13px] text-red-700 font-sans">{{ orderLookupError }}</p>
                          <p v-if="orderLookupResult?.support" class="text-[12px] text-red-600 font-bold mt-2">
                              📞 Kontaktujte podporu: <a :href="`tel:${orderLookupResult.support}`" class="underline">{{ orderLookupResult.support }}</a>
                          </p>
                      </div>

                      <!-- Výsledok: jedna alebo viacero objednávok -->
                      <div v-if="orderLookupResult?.found" class="space-y-3">

                          <!-- Viacero objednávok -->
                          <template v-if="orderLookupResult.multiple">
                              <p class="text-[12px] font-bold text-gray-700 uppercase tracking-widest">{{ orderLookupResult.message }}</p>
                              <div v-for="ord in orderLookupResult.orders" :key="ord.orderNumber" class="bg-green-50 border border-green-200 p-3 space-y-2">
                                  <div class="flex items-center gap-2">
                                      <Package class="w-4 h-4 text-green-700 flex-shrink-0" />
                                      <span class="font-tech font-black text-[15px] text-green-900">{{ ord.orderNumber }}</span>
                                      <span class="text-[11px] text-gray-500 ml-auto">{{ new Date(ord.createdAt).toLocaleDateString('sk-SK') }}</span>
                                  </div>
                                  <p class="text-[12px] font-medium text-green-900 leading-relaxed">{{ ord.message }}</p>
                                  <div class="flex gap-3 text-[11px] text-gray-600">
                                      <span v-if="ord.states?.order">📋 {{ ord.states.order.name }}</span>
                                      <span v-if="ord.states?.delivery">🚚 {{ ord.states.delivery.name }}</span>
                                      <span v-if="ord.states?.payment">💳 {{ ord.states.payment.name }}</span>
                                  </div>
                              </div>
                          </template>

                          <!-- Jedna objednávka -->
                          <template v-else>
                              <div class="bg-green-50 border border-green-200 rounded-none p-4 space-y-3">
                                  <div class="flex items-center gap-3">
                                      <div class="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-green-100">
                                          <Package class="w-4 h-4 text-green-700" />
                                      </div>
                                      <div>
                                          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Číslo objednávky</p>
                                          <p class="text-[15px] font-black text-green-900 font-tech">{{ orderLookupResult.orderNumber }}</p>
                                      </div>
                                      <span class="ml-auto text-[11px] text-gray-500">{{ new Date(orderLookupResult.createdAt).toLocaleDateString('sk-SK') }}</span>
                                  </div>

                                  <div class="border-t border-green-200 pt-2">
                                      <p class="text-[13px] font-semibold text-green-900 leading-relaxed">{{ orderLookupResult.message }}</p>
                                  </div>

                                  <details v-if="orderLookupResult?.states?.order" class="cursor-pointer border-t border-green-200 pt-2">
                                      <summary class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Detaily stavov</summary>
                                      <div class="mt-2 space-y-1.5 text-[12px]">
                                          <div v-if="orderLookupResult.states.order" class="bg-white p-2 border border-green-100">
                                              <span class="font-bold">📋 Objednávka:</span> {{ orderLookupResult.states.order.name }}
                                          </div>
                                          <div v-if="orderLookupResult.states.delivery" class="bg-white p-2 border border-green-100">
                                              <span class="font-bold">🚚 Doručenie:</span> {{ orderLookupResult.states.delivery.name }}
                                          </div>
                                          <div v-if="orderLookupResult.states.payment" class="bg-white p-2 border border-green-100">
                                              <span class="font-bold">💳 Platba:</span> {{ orderLookupResult.states.payment.name }}
                                          </div>
                                      </div>
                                  </details>
                              </div>
                          </template>

                          <!-- História po prihlásení -->
                          <p class="text-[11px] text-gray-400 text-center font-sans">
                              Staršia história objednávok je dostupná po prihlásení do
                              <button @click="handleAccountLink" class="text-brand underline font-bold">vášho účtu</button>.
                          </p>
                      </div>

                      <div ref="messagesEndRef" class="h-1" />
                  </div>

              </div>

          </Transition>
      </div>
    </aside>

    <!-- Reklamácia / Vrátenie tovaru — inline modal formulár -->
    <ReturnFormModal
      :is-open="isReturnModalOpen"
      :initial-form-type="returnFormType"
      :initial-email="userEmail"
      :initial-first-name="userFirstName"
      :initial-last-name="userLastName"
      :initial-customer-phone="userPhone"
      :initial-customer-address="userAddress"
      @close="isReturnModalOpen = false"
    />
  </div>
</template>

<style scoped>
/* Scrollbar pre minimalizmus v chate */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #d1d5db;
}

/* Klávesový morphing transition medzi viewmi */
.view-enter-active,
.view-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.view-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.view-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.view-container {
  will-change: transform, opacity;
}
</style>
