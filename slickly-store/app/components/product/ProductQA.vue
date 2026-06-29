<script setup lang="ts">
import { Sparkles, Send, Loader2, MessageSquare } from 'lucide-vue-next';
import { sanitizeHtml } from '~/utils/sanitize';

const props = defineProps<{
  product: {
    name: string;
    description?: string;
    price?: number;
    brand?: string;
    category?: string;
    properties?: any[];
  };
}>();

const { t } = useI18n();

interface QAMessage {
  role: 'user' | 'assistant';
  text: string;
}

const question = ref('');
const messages = ref<QAMessage[]>([]);
const isLoading = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const QUICK_QUESTIONS = [
  'Aký je rozdiel oproti iným modelom?',
  'Je vhodný pre začiatočníkov?',
  'Aká veľkosť je pre mňa správna?',
  'Aká je záruka?',
];

const productContext = computed(() => ({
  name: props.product.name,
  description: props.product.description,
  price: props.product.price,
  brand: props.product.brand,
  category: props.product.category,
  properties: (props.product.properties || []).slice(0, 20).map((p: any) => ({
    name: p.group?.translated?.name || p.group?.name || '',
    value: p.translated?.name || p.name || '',
  })),
}));

const ask = async (q: string) => {
  const text = q.trim();
  if (!text || isLoading.value) return;

  question.value = '';
  messages.value.push({ role: 'user', text });
  isLoading.value = true;

  try {
    const res = await $fetch<{ answer: string }>('/api/claude/product-qa', {
      method: 'POST',
      body: { question: text, productContext: productContext.value },
    });
    messages.value.push({ role: 'assistant', text: res.answer });
  } catch {
    messages.value.push({ role: 'assistant', text: 'Prepáčte, momentálne neviem odpovedať. Skúste to prosím neskôr.' });
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = () => ask(question.value);

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
};
</script>

<template>
  <section class="bg-zinc-950 border-t border-zinc-800 py-14">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-10">
        <div class="flex items-center gap-3 mb-4">
          <Sparkles class="w-5 h-5 text-brand" />
          <span class="text-brand font-tech font-bold uppercase tracking-widest text-xs">AI Asistent</span>
        </div>
        <h2 class="text-5xl md:text-6xl font-black uppercase italic font-tech tracking-wide leading-none text-white mb-4">
          Opýtaj sa na <span class="text-brand">produkt</span>
        </h2>
        <div class="w-24 h-1.5 bg-brand -skew-x-[20deg]" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- Chat area -->
        <div class="flex flex-col gap-4">
          <!-- Messages -->
          <div v-if="messages.length" class="space-y-3 mb-2">
            <div
              v-for="(msg, i) in messages"
              :key="i"
              :class="[
                'p-4 font-sans text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-brand text-white ml-8'
                  : 'bg-zinc-800 text-gray-200 mr-8 border-l-2 border-brand',
              ]"
            >
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="sanitizeHtml(msg.text)" />
            </div>
          </div>

          <!-- Empty state -->
          <div v-else class="flex items-center gap-3 p-5 bg-zinc-900 border border-zinc-700 text-gray-400 font-sans text-sm">
            <MessageSquare class="w-5 h-5 text-brand flex-shrink-0" />
            <span>Máš otázku k <strong class="text-white">{{ product.name }}</strong>? Pýtaj sa.</span>
          </div>

          <!-- Input -->
          <div class="flex gap-2 items-stretch">
            <input
              ref="inputRef"
              v-model="question"
              type="text"
              placeholder="Napíš svoju otázku..."
              maxlength="500"
              class="flex-1 bg-zinc-900 border border-zinc-700 text-white font-sans text-sm px-4 py-3 focus:outline-none focus:border-brand transition-colors placeholder:text-gray-500"
              :disabled="isLoading"
              @keypress="handleKeyPress"
            />
            <button
              class="bg-brand hover:bg-brand-dark text-white px-5 py-3 font-tech font-bold uppercase text-xs tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isLoading || !question.trim()"
              @click="handleSubmit"
            >
              <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
              <Send v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Quick questions -->
        <div>
          <p class="text-gray-400 font-sans text-xs uppercase tracking-widest mb-4">Časté otázky</p>
          <div class="grid grid-cols-1 gap-2">
            <button
              v-for="q in QUICK_QUESTIONS"
              :key="q"
              class="text-left px-4 py-3 bg-zinc-900 border border-zinc-700 hover:border-brand text-gray-300 hover:text-white font-sans text-sm transition-colors group"
              :disabled="isLoading"
              @click="ask(q)"
            >
              <span class="text-brand mr-2 group-hover:mr-3 transition-all">›</span>{{ q }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
