<script setup lang="ts">
const email = ref('')
const isSubmitting = ref(false)
const submitted = ref(false)

async function subscribe() {
  if (!email.value) return
  isSubmitting.value = true
  await new Promise((resolve) => setTimeout(resolve, 600))
  submitted.value = true
  isSubmitting.value = false
  email.value = ''
}
</script>

<template>
  <section class="w-full relative bg-primary text-on-primary py-stack-lg md:py-section-padding-lg overflow-hidden">
    <div class="absolute inset-0 pointer-events-none opacity-10 bg-blueprint"></div>
    <div class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin relative z-10 flex flex-col items-center text-center gap-stack-md md:gap-6">
      <span class="font-technical-data text-technical-data uppercase text-secondary-container tracking-widest">Newsletter</span>
      <h2 class="font-headline-lg text-headline-lg md:text-headline-xl uppercase max-w-2xl">Získajte 10% zľavu na prvú objednávku</h2>
      <p class="font-body-md md:text-body-lg text-white/70 max-w-xl">
        Prihláste sa na odber a buďte prví, ktorí sa dozvedia o nových značkách, recenziách produktov a exkluzívnych akciách.
      </p>

      <form v-if="!submitted" class="w-full max-w-md flex flex-col sm:flex-row gap-stack-sm mt-stack-sm" @submit.prevent="subscribe">
        <label for="newsletter-email" class="sr-only">E-mailová adresa</label>
        <input
          id="newsletter-email"
          v-model="email"
          type="email"
          required
          aria-required="true"
          inputmode="email"
          autocomplete="email"
          placeholder="vas@email.sk"
          class="flex-grow h-12 px-4 bg-surface-container-lowest text-on-background font-body-md text-body-md outline-none rounded-default focus:ring-2 focus:ring-secondary-container"
        />
        <button
          type="submit"
          :disabled="isSubmitting"
          class="h-12 px-8 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform,opacity] duration-200 active:scale-[0.99] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span class="material-symbols-outlined" :class="isSubmitting ? 'animate-spin' : ''" aria-hidden="true">{{ isSubmitting ? 'progress_activity' : 'arrow_forward' }}</span>
          {{ isSubmitting ? 'Spracúva sa...' : 'Získať zľavu' }}
        </button>
      </form>

      <div v-else role="status" aria-live="polite" aria-atomic="true" class="flex items-center gap-2 mt-stack-sm text-secondary-container">
        <span class="material-symbols-outlined" aria-hidden="true">check_circle</span>
        <span class="font-label-sm text-label-sm uppercase tracking-widest">Ďakujeme! Zľavový kód sme odoslali na váš e-mail.</span>
      </div>
    </div>
  </section>
</template>
