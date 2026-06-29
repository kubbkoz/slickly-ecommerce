<script setup lang="ts">
import RegisterForm from '~/components/auth/RegisterForm.vue';

useHead({
  title: 'Registrácia — SLICKLY',
  meta: [
    { name: 'description', content: 'Vytvorte si zákaznícky účet v SLICKLY e-shope a nakupujte rýchlejšie.' },
  ],
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-16 md:py-24 px-4 relative overflow-hidden">
    <!-- Decorative blurs -->
    <div class="absolute -top-32 -right-32 w-96 h-96 bg-brand/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
    <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-brand/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

    <div class="container mx-auto">
      <!-- Back link -->
      <div class="max-w-2xl mx-auto mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Späť na hlavnú stránku
        </NuxtLink>
      </div>

      <!-- Card wrapping the form -->
      <div class="max-w-2xl mx-auto bg-white p-8 md:p-12 shadow-lg border border-gray-100">
        <RegisterForm />
      </div>

      <div class="max-w-2xl mx-auto mt-8 text-center">
        <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Máte účet?
          <button
            type="button"
            class="text-brand hover:underline ml-1"
            onclick="window.history.back()"
          >
            Prihláste sa
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
