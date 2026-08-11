<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';

const config = useRuntimeConfig();
const { apiClient } = useShopwareContext();

const FAQ_CAT_ID = config.public.shopware.ids.categories.faq as string | undefined;

interface FaqItem { q: string; a: string; }

const { data: faqData, pending } = useAsyncData<FaqItem[]>('homepage-faq', async () => {
  if (!FAQ_CAT_ID) return [];
  try {
    const res = await apiClient.invoke('readCategory post /category/{categoryId}' as any, {
      pathParams: { categoryId: FAQ_CAT_ID },
    });
    const cat = (res as any)?.data ?? res;
    const cf: Record<string, string> = {
      ...(cat?.customFields ?? {}),
      ...(cat?.translated?.customFields ?? {}),
    };
    return Array.from({ length: 10 }, (_, i) => ({
      q: cf[`mts_faq_q${i + 1}`] || '',
      a: cf[`mts_faq_a${i + 1}`] || '',
    })).filter((item) => item.q && item.a);
  } catch {
    return [];
  }
});

const openIndex = ref<number | null>(null);
const toggle = (i: number) => {
  openIndex.value = openIndex.value === i ? null : i;
};

// FAQPage JSON-LD
watchEffect(() => {
  if (!faqData.value?.length) return;
  useHead({
    script: [{
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqData.value.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }),
    }],
  });
});

const { target, isVisible } = useScrollReveal();
</script>

<template>
  <section v-if="pending || (faqData && faqData.length > 0)" ref="target" class="py-24 bg-gray-50 border-t border-gray-100">
    <div class="container mx-auto px-4 lg:px-8">

      <div class="reveal-base flex flex-col md:flex-row justify-between items-end mb-12 gap-6" :class="isVisible ? 'reveal-visible' : 'reveal'">
        <div>
          <h2 class="section-h2 mb-4">
            Často kladené <span class="text-brand">otázky</span>
          </h2>
          <div class="section-decorator mb-6"></div>
        </div>
        <p class="hidden md:block text-gray-500 font-medium font-sans max-w-sm text-right">
          Odpovede na otázky, ktoré dostávame najčastejšie od zákazníkov.
        </p>
      </div>

      <!-- Skeleton -->
      <div v-if="pending" class="max-w-3xl mx-auto space-y-3">
        <div v-for="i in 5" :key="`faq-skeleton-${i}`" class="card-surface px-5 md:px-6 py-5 flex justify-between items-center gap-4">
          <div class="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
          <div class="w-5 h-5 bg-gray-200 animate-pulse rounded flex-shrink-0" />
        </div>
      </div>

      <div v-else class="max-w-3xl mx-auto space-y-3">
        <div
          v-for="(item, idx) in faqData"
          :key="idx"
          class="card-surface px-5 md:px-6"
        >
          <button
            type="button"
            class="w-full flex items-center justify-between py-5 text-left gap-4 group"
            @click="toggle(idx)"
            :aria-expanded="openIndex === idx"
          >
            <span class="font-tech font-bold uppercase text-base md:text-lg tracking-wide text-black group-hover:text-brand transition-colors leading-snug">
              {{ item.q }}
            </span>
            <ChevronDown
              class="w-5 h-5 text-brand flex-shrink-0 transition-transform duration-300"
              :class="openIndex === idx ? 'rotate-180' : ''"
              aria-hidden="true"
            />
          </button>

          <div
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :style="openIndex === idx ? 'max-height: 500px; opacity: 1;' : 'max-height: 0; opacity: 0;'"
          >
            <p class="pb-5 text-sm text-gray-600 font-sans leading-relaxed">
              {{ item.a }}
            </p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
