<script setup lang="ts">
const badges = [
  { icon: 'local_shipping', label: 'Doprava zdarma' },
  { icon: 'verified', label: 'Overené produkty' },
  { icon: 'workspace_premium', label: 'Garancia kvality' },
  { icon: 'support_agent', label: '24/7 podpora' },
]
</script>

<template>
  <section class="w-full bg-secondary-container">
    <!-- Mobile marquee -->
    <div class="md:hidden py-3 overflow-hidden">
      <div class="flex animate-marquee motion-reduce:animate-none whitespace-nowrap gap-stack-lg items-center px-gutter w-max">
        <template v-for="n in 3" :key="n">
          <div v-for="badge in badges" :key="`${n}-${badge.label}`" class="flex items-center gap-2 text-on-secondary-container">
            <span class="material-symbols-outlined" aria-hidden="true">{{ badge.icon }}</span>
            <span class="font-badge-label text-badge-label uppercase">{{ badge.label }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- Desktop grid -->
    <div class="hidden md:block py-6 border-y border-on-secondary-container/10">
      <div class="max-w-[1536px] mx-auto px-grid-margin grid grid-cols-4 gap-6">
        <div v-for="badge in badges" :key="badge.label" class="flex items-center justify-center gap-3 text-on-secondary-container">
          <span class="material-symbols-outlined text-[24px]" aria-hidden="true">{{ badge.icon }}</span>
          <span class="font-label-sm text-label-sm uppercase tracking-wider font-bold">{{ badge.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
