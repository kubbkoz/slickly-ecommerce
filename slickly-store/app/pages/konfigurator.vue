<script setup lang="ts">
import { Sparkles, Send, Loader2, RotateCcw, ChevronRight } from 'lucide-vue-next';
import { sanitizeHtml } from '~/utils/sanitize';

definePageMeta({ layout: 'default' });

useSeoMeta({
  title: 'Konfigurátor bicykla | SLICKLY',
  description: 'Nájdi ideálny bicykel s pomocou AI. Odpov na niekoľko otázok a my ti odporučíme ten správny model.',
});

interface Message {
  role: 'user' | 'assistant';
  text: string;
  recommendations?: string[];
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  text: 'Ahoj! Pomôžem ti nájsť ideálny bicykel. Povedz mi — na čo ho primárne plánuješ využívať? (Terén, mesto, cestovanie, šport...)',
};

const BIKE_TYPE_IMAGES: Record<string, string> = {
  'horský MTB hardtail': '/images/bikes/mtb-hardtail.jpg',
  'horský MTB full-suspension': '/images/bikes/mtb-full.jpg',
  'silničný bicykel': '/images/bikes/road.jpg',
  'gravel': '/images/bikes/gravel.jpg',
  'trekking': '/images/bikes/trekking.jpg',
  'e-bike MTB': '/images/bikes/emtb.jpg',
  'e-bike trekking': '/images/bikes/etrekking.jpg',
  'e-bike road': '/images/bikes/eroad.jpg',
  'detský bicykel': '/images/bikes/kids.jpg',
};

const BIKE_SEARCH_QUERIES: Record<string, string> = {
  'horský MTB hardtail': 'MTB hardtail',
  'horský MTB full-suspension': 'MTB full suspension',
  'silničný bicykel': 'silničný bicykel',
  'gravel': 'gravel bicykel',
  'trekking': 'trekking bicykel',
  'e-bike MTB': 'e-bike horský',
  'e-bike trekking': 'e-bike trekking',
  'e-bike road': 'e-bike silničný',
  'detský bicykel': 'detský bicykel',
};

const messages = ref<Message[]>([WELCOME_MESSAGE]);
const input = ref('');
const isLoading = ref(false);
const chatEndRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const history = computed(() =>
  messages.value
    .filter((m) => m.role !== 'assistant' || !m.recommendations)
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.text }))
);

const scrollToBottom = async () => {
  await nextTick();
  chatEndRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const send = async (text: string) => {
  const msg = text.trim();
  if (!msg || isLoading.value) return;

  input.value = '';
  messages.value.push({ role: 'user', text: msg });
  isLoading.value = true;
  await scrollToBottom();

  try {
    const res = await $fetch<{ text: string; recommendations: string[] | null }>('/api/claude/configurator', {
      method: 'POST',
      body: { message: msg, history: history.value.slice(0, -1) },
    });

    messages.value.push({
      role: 'assistant',
      text: res.text,
      recommendations: res.recommendations ?? undefined,
    });
  } catch {
    messages.value.push({ role: 'assistant', text: 'Prepáčte, nastala chyba. Skúste to prosím znova.' });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
    inputRef.value?.focus();
  }
};

const reset = () => {
  messages.value = [WELCOME_MESSAGE];
  input.value = '';
};

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    send(input.value);
  }
};

const localePath = useLocalePath();
</script>

<template>
  <div class="min-h-screen bg-zinc-950">
    <!-- Hero -->
    <div class="bg-black border-b border-zinc-800 py-14">
      <div class="container mx-auto px-4">
        <div class="flex items-center gap-3 mb-4">
          <Sparkles class="w-5 h-5 text-brand" />
          <span class="text-brand font-tech font-bold uppercase tracking-widest text-xs">AI Sprievodca</span>
        </div>
        <h1 class="text-2xl md:text-4xl font-black text-white leading-[0.95] font-tech uppercase tracking-wide mb-4">
          Konfigurátor <span class="text-brand">bicykla</span>
        </h1>
        <div class="w-24 h-1.5 bg-brand -skew-x-[20deg] mb-6" />
        <p class="text-gray-400 font-sans text-base max-w-lg">
          Odpov na niekoľko otázok a náš AI asistent ti odporučí ideálny typ bicykla.
        </p>
      </div>
    </div>

    <!-- Chat -->
    <div class="container mx-auto px-4 py-10">
      <div class="max-w-2xl mx-auto">
        <!-- Messages -->
        <div class="space-y-4 mb-6 min-h-[300px]">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="flex"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[85%]"
              :class="msg.role === 'user' ? 'bg-brand text-white px-5 py-3' : 'bg-zinc-900 border border-zinc-700 text-gray-200 px-5 py-4'"
            >
              <!-- AI icon for assistant -->
              <div v-if="msg.role === 'assistant'" class="flex items-center gap-2 mb-2">
                <Sparkles class="w-3 h-3 text-brand" />
                <span class="text-brand font-tech text-[10px] uppercase tracking-widest">MT AI</span>
              </div>

              <p
                class="font-sans text-sm leading-relaxed"
                v-html="sanitizeHtml(msg.text)"
              />

              <!-- Recommendations -->
              <div v-if="msg.recommendations?.length" class="mt-5 pt-4 border-t border-zinc-700">
                <p class="text-brand font-tech text-xs uppercase tracking-widest mb-3">Odporúčané typy bicyklov</p>
                <div class="space-y-2">
                  <NuxtLink
                    v-for="rec in msg.recommendations"
                    :key="rec"
                    :to="localePath(`/search?q=${encodeURIComponent(BIKE_SEARCH_QUERIES[rec] || rec)}`)"
                    class="flex items-center justify-between px-4 py-3 bg-zinc-800 hover:bg-brand hover:text-white text-gray-200 transition-colors group"
                  >
                    <span class="font-sans text-sm font-medium capitalize">{{ rec }}</span>
                    <ChevronRight class="w-4 h-4 text-brand group-hover:text-white transition-colors" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading bubble -->
          <div v-if="isLoading" class="flex justify-start">
            <div class="bg-zinc-900 border border-zinc-700 px-5 py-4 flex items-center gap-2">
              <Loader2 class="w-4 h-4 text-brand animate-spin" />
              <span class="text-gray-400 font-sans text-sm">MT AI premýšľa...</span>
            </div>
          </div>

          <div ref="chatEndRef" />
        </div>

        <!-- Input -->
        <div class="flex gap-2 items-stretch mb-4">
          <input
            ref="inputRef"
            v-model="input"
            type="text"
            placeholder="Odpovedz tu..."
            maxlength="500"
            class="flex-1 bg-zinc-900 border border-zinc-700 text-white font-sans text-sm px-4 py-3 focus:outline-none focus:border-brand transition-colors placeholder:text-gray-500"
            :disabled="isLoading"
            @keypress="handleKeyPress"
          />
          <button
            class="bg-brand hover:bg-red-700 text-white px-5 py-3 font-tech font-bold uppercase text-xs tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading || !input.trim()"
            @click="send(input)"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
            <Send v-else class="w-4 h-4" />
          </button>
        </div>

        <!-- Reset -->
        <button
          class="flex items-center gap-2 text-gray-500 hover:text-white font-sans text-xs uppercase tracking-widest transition-colors"
          @click="reset"
        >
          <RotateCcw class="w-3 h-3" />
          Začať odznova
        </button>
      </div>
    </div>
  </div>
</template>
